import { SocketEvents } from '../../constants/index.js';
import { gameManager } from '../../game/gameManager.js';
import { roomManager } from '../../game/roomManager.js';
import { ApiError } from '../../utils/ApiError.js';
import type { TypedServer, TypedSocket } from '../../types/socket.js';

/**
 * Registers socket event handlers for game lifecycle operations.
 */
export function registerGameHandlers(io: TypedServer, socket: TypedSocket): void {

    // ─── START GAME ──────────────────────────────────────────────
    socket.on(SocketEvents.START_GAME, async (ack) => {
        const user = socket.data.user;
        const roomCode = socket.data.roomCode;

        if (!roomCode) {
            return ack({ success: false, message: 'Not in a room' });
        }

        try {
            const room = roomManager.getRoom(roomCode);
            if (!room) {
                return ack({ success: false, message: 'Room not found' });
            }

            if (room.hostId !== user.id) {
                return ack({ success: false, message: 'Only the host can start the game' });
            }

            await gameManager.startGame(io, roomCode);

            return ack({ success: true, message: 'Game starting' });
        } catch (error: any) {
            const message = error instanceof ApiError
                ? error.message
                : 'Failed to start game';
            return ack({ success: false, message });
        }
    });

    // ─── SUBMIT PROGRESS (Race / Elimination) ───────────────────
    socket.on(SocketEvents.SUBMIT_PROGRESS, (data) => {
        const roomCode = socket.data.roomCode;
        if (!roomCode) return;

        gameManager.handleProgress(roomCode, socket.data.user.id, data);
    });

    // ─── SUBMIT WORD (Bubble) ────────────────────────────────────
    socket.on(SocketEvents.SUBMIT_WORD, (data) => {
        const roomCode = socket.data.roomCode;
        if (!roomCode) return;

        gameManager.handleWord(roomCode, socket.data.user.id, data);
    });
}
