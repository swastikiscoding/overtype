import { SocketEvents, PlayerStatus } from '../../constants/index.js';
import { roomManager } from '../../game/roomManager.js';
import { broadcastLobbyUpdate } from '../emitters/lobby.emitter.js';
import type { TypedServer, TypedSocket } from '../../types/socket.js';

/**
 * Registers socket event handlers for room join / leave operations.
 */
export function registerRoomHandlers(io: TypedServer, socket: TypedSocket): void {

    // ─── JOIN ROOM ───────────────────────────────────────────────
    socket.on(SocketEvents.JOIN_ROOM, async (data, ack) => {
        const { roomCode } = data;
        const user = socket.data.user;

        try {
            const room = roomManager.getRoom(roomCode);
            if (!room) {
                return ack({ success: false, message: 'Room not found' });
            }

            const existingPlayer = room.players.get(user.id);

            if (existingPlayer) {
                // Idempotent rejoin — update socket mapping and mark connected
                roomManager.setPlayerSocketId(roomCode, user.id, socket.id);
                roomManager.setPlayerStatus(roomCode, user.id, PlayerStatus.CONNECTED);
                socket.data.roomCode = roomCode;
                socket.join(`room:${roomCode}`);

                const lobby = roomManager.getLobbyState(roomCode);
                if (lobby) broadcastLobbyUpdate(io, roomCode, lobby);

                return ack({ success: true, message: 'Rejoined room' });
            }

            // Brand-new player
            roomManager.addPlayer(roomCode, user.id, user.username);
            roomManager.setPlayerSocketId(roomCode, user.id, socket.id);
            socket.data.roomCode = roomCode;
            socket.join(`room:${roomCode}`);

            const lobby = roomManager.getLobbyState(roomCode);
            if (lobby) broadcastLobbyUpdate(io, roomCode, lobby);

            return ack({ success: true, message: 'Joined room' });
        } catch (error: any) {
            return ack({ success: false, message: error.message ?? 'Failed to join room' });
        }
    });

    // ─── LEAVE ROOM ──────────────────────────────────────────────
    socket.on(SocketEvents.LEAVE_ROOM, async (ack) => {
        const user = socket.data.user;
        const roomCode = socket.data.roomCode;

        if (!roomCode) {
            return ack({ success: false, message: 'Not in a room' });
        }

        try {
            const result = roomManager.removePlayer(roomCode, user.id);

            socket.leave(`room:${roomCode}`);
            socket.data.roomCode = undefined;

            // If the room still exists after removal, broadcast updated lobby
            if (result.room) {
                const lobby = roomManager.getLobbyState(roomCode);
                if (lobby) broadcastLobbyUpdate(io, roomCode, lobby);
            }

            return ack({ success: true, message: 'Left room' });
        } catch (error: any) {
            return ack({ success: false, message: error.message ?? 'Failed to leave room' });
        }
    });
}
