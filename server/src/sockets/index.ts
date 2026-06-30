import { Server } from 'socket.io';
import http from 'http';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { prisma } from '../db/prisma.js';
import { registerRoomHandlers } from './handlers/room.handler.js';
import { registerGameHandlers } from './handlers/game.handler.js';
import { roomManager } from '../game/roomManager.js';
import { gameManager } from '../game/gameManager.js';
import { broadcastLobbyUpdate } from './emitters/lobby.emitter.js';
import { RECONNECT_GRACE_MS, PlayerStatus } from '../constants/index.js';
import type { TypedServer, TypedSocket } from '../types/socket.js';
import type { ServerToClientEvents, ClientToServerEvents, InterServerEvents, SocketData } from '../types/socket.js';

/**
 * Creates and configures the Socket.IO server with authentication middleware,
 * event handler registration, and disconnect / reconnect logic.
 */
export function initializeSocketServer(httpServer: http.Server): TypedServer {
    const io: TypedServer = new Server<
        ClientToServerEvents,
        ServerToClientEvents,
        InterServerEvents,
        SocketData
    >(httpServer, {
        cors: {
            origin: config.CORS_ORIGIN,
            methods: ['GET', 'POST'],
            credentials: true,
        },
    });

    // ─── AUTH MIDDLEWARE ──────────────────────────────────────────
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token as string | undefined;

            if (!token) {
                return next(new Error('Authentication required'));
            }

            const decoded = jwt.verify(token, config.JWT_SECRET) as { id: string };

            const user = await prisma.user.findUnique({
                where: { id: decoded.id },
                select: { id: true, username: true, email: true },
            });

            if (!user) {
                return next(new Error('User not found'));
            }

            socket.data.user = {
                id: user.id,
                username: user.username,
                email: user.email,
            };

            next();
        } catch {
            next(new Error('Invalid or expired token'));
        }
    });

    // ─── CONNECTION HANDLER ──────────────────────────────────────
    io.on('connection', (socket: TypedSocket) => {
        console.log(`Socket connected: ${socket.data.user.username} (${socket.id})`);

        // Register all event handlers
        registerRoomHandlers(io, socket);
        registerGameHandlers(io, socket);

        // ─── DISCONNECT ──────────────────────────────────────────
        socket.on('disconnect', () => {
            const roomCode = socket.data.roomCode;
            const user = socket.data.user;

            if (!roomCode) return;

            console.log(`Socket disconnected: ${user.username} from room ${roomCode}`);

            // Mark player as disconnected
            roomManager.setPlayerStatus(roomCode, user.id, PlayerStatus.DISCONNECTED);
            roomManager.setPlayerDisconnectedAt(roomCode, user.id, Date.now());

            // Notify game manager of the disconnection
            gameManager.handlePlayerDisconnect(roomCode, user.id);

            // Broadcast updated lobby state
            const lobby = roomManager.getLobbyState(roomCode);
            if (lobby) broadcastLobbyUpdate(io, roomCode, lobby);

            // Reconnection grace period
            setTimeout(() => {
                const room = roomManager.getRoom(roomCode);
                if (!room) return;

                const player = room.players.get(user.id);
                if (!player) return;

                // Only remove if still disconnected
                if (player.status !== PlayerStatus.DISCONNECTED) return;

                const result = roomManager.removePlayer(roomCode, user.id);

                if (result.room) {
                    const updatedLobby = roomManager.getLobbyState(roomCode);
                    if (updatedLobby) broadcastLobbyUpdate(io, roomCode, updatedLobby);
                }

                console.log(`Removed disconnected player: ${user.username} from room ${roomCode}`);
            }, RECONNECT_GRACE_MS);
        });
    });

    return io;
}
