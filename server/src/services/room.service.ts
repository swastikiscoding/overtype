import { GameMode, VALID_DURATIONS } from "../constants/index.js";
import type { GameSettings } from "../types/room.js";
import { roomManager } from "../game/roomManager.js";
import { ApiError } from "../utils/ApiError.js";

export const roomService = {
    /**
     * Create a new game room.
     * Validates duration constraints based on the game mode before delegating
     * to the room manager.
     */
    async createRoom(
        userId: string,
        username: string,
        gameMode: GameMode,
        duration?: number
    ) {
        // Elimination mode should NOT have a duration
        if (gameMode === GameMode.ELIMINATION) {
            if (duration !== undefined) {
                throw new ApiError(
                    400,
                    "Elimination mode does not support a duration setting"
                );
            }
        }

        // Typing Race and Typing Bubble require a valid duration
        if (
            gameMode === GameMode.TYPING_RACE ||
            gameMode === GameMode.TYPING_BUBBLE
        ) {
            if (duration === undefined) {
                throw new ApiError(
                    400,
                    "Duration is required for this game mode"
                );
            }
            if (
                !(VALID_DURATIONS as readonly number[]).includes(duration)
            ) {
                throw new ApiError(
                    400,
                    `Duration must be one of: ${VALID_DURATIONS.join(", ")} seconds`
                );
            }
        }

        const settings: GameSettings = { mode: gameMode, duration };
        const room = roomManager.createRoom(userId, username, settings);
        const lobbyState = roomManager.getLobbyState(room.code);

        return lobbyState;
    },

    /**
     * Join an existing room by room code.
     */
    async joinRoom(userId: string, username: string, roomCode: string) {
        roomManager.addPlayer(roomCode, userId, username);
        const lobbyState = roomManager.getLobbyState(roomCode);
        return lobbyState;
    },

    /**
     * Remove a player from their current room.
     */
    async leaveRoom(userId: string) {
        const room = roomManager.getRoomByPlayerId(userId);
        if (!room) {
            throw new ApiError(400, "Not currently in any room");
        }
        const result = roomManager.removePlayer(room.code, userId);
        return {
            roomDestroyed: result.room === null,
            hostTransferred: result.hostTransferred,
            newHostId: result.newHostId,
        };
    },

    /**
     * Get the lobby state for a room by its code.
     */
    async getRoomDetails(roomCode: string) {
        const lobbyState = roomManager.getLobbyState(roomCode);

        if (!lobbyState) {
            throw new ApiError(404, "Room not found");
        }

        return lobbyState;
    },
};
