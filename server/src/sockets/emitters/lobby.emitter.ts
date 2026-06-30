import type { TypedServer } from '../../types/socket.js';
import type { LobbyState } from '../../types/room.js';
import { SocketEvents } from '../../constants/index.js';

/**
 * Broadcasts an updated lobby state to all sockets in the given room.
 */
export function broadcastLobbyUpdate(io: TypedServer, roomCode: string, lobby: LobbyState): void {
    io.to(`room:${roomCode}`).emit(SocketEvents.LOBBY_UPDATE, lobby);
}
