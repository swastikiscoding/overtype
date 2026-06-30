import type { TypedServer } from '../../types/socket.js';
import type {
    PlayerProgress,
    PlayerScore,
    EliminationData,
    GameResult,
    GameStartData,
} from '../../types/game.js';
import { SocketEvents } from '../../constants/index.js';

/**
 * Broadcasts the countdown tick to all players in the room.
 */
export function broadcastCountdown(io: TypedServer, roomCode: string, seconds: number): void {
    io.to(`room:${roomCode}`).emit(SocketEvents.COUNTDOWN, { seconds });
}

/**
 * Broadcasts game-started data (mode, text, duration, startTime) to the room.
 */
export function broadcastGameStarted(io: TypedServer, roomCode: string, data: GameStartData): void {
    io.to(`room:${roomCode}`).emit(SocketEvents.GAME_STARTED, data);
}

/**
 * Broadcasts the latest player progress snapshot (Race / Elimination) to the room.
 */
export function broadcastProgressUpdate(io: TypedServer, roomCode: string, progress: PlayerProgress[]): void {
    io.to(`room:${roomCode}`).emit(SocketEvents.PROGRESS_UPDATE, progress);
}

/**
 * Broadcasts updated scores (Bubble mode) to the room.
 */
export function broadcastScoreUpdate(io: TypedServer, roomCode: string, scores: PlayerScore[]): void {
    io.to(`room:${roomCode}`).emit(SocketEvents.SCORE_UPDATE, scores);
}

/**
 * Broadcasts an elimination event to the room.
 */
export function broadcastPlayerEliminated(io: TypedServer, roomCode: string, data: EliminationData): void {
    io.to(`room:${roomCode}`).emit(SocketEvents.PLAYER_ELIMINATED, data);
}

/**
 * Broadcasts the final game result to the room.
 */
export function broadcastGameFinished(io: TypedServer, roomCode: string, result: GameResult): void {
    io.to(`room:${roomCode}`).emit(SocketEvents.GAME_FINISHED, result);
}
