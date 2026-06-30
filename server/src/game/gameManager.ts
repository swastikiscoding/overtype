import { GameMode, GameStatus, RoomStatus, MIN_PLAYERS, COUNTDOWN_SECONDS, PARAGRAPH_WORD_COUNT } from "../constants/index.js";
import type { ProgressPayload, WordPayload } from "../types/game.js";
import type { TypedServer } from "../types/socket.js";
import { ApiError } from "../utils/ApiError.js";
import { roomManager } from "./roomManager.js";
import { generateParagraph } from "./wordGenerator.js";
import { TimerManager } from "./timers.js";
import { BaseGame } from "./modes/baseGame.js";
import { TypingRaceGame } from "./modes/typingRace.js";
import { EliminationGame } from "./modes/elimination.js";
import { TypingBubbleGame } from "./modes/typingBubble.js";
import { broadcastCountdown, broadcastGameStarted } from "../sockets/emitters/game.emitter.js";

// ========================
// Game Manager
// ========================

/**
 * Orchestrates game lifecycle: start, progress, end.
 * Stores active game instances keyed by room code.
 */
class GameManager {
    private activeGames: Map<string, BaseGame> = new Map();
    private countdownTimers: Map<string, TimerManager> = new Map();

    /**
     * Starts a game in the given room.
     * Validates room state, begins countdown, then initializes the appropriate game mode.
     */
    startGame(io: TypedServer, roomCode: string): void {
        const room = roomManager.getRoom(roomCode);
        if (!room) {
            throw new ApiError(404, "Room not found");
        }

        if (room.status !== RoomStatus.LOBBY) {
            throw new ApiError(400, "Game already in progress");
        }

        if (room.players.size < MIN_PLAYERS) {
            throw new ApiError(400, `Need at least ${MIN_PLAYERS} player(s) to start`);
        }

        // Prevent double-start
        if (this.activeGames.has(roomCode) || this.countdownTimers.has(roomCode)) {
            throw new ApiError(400, "Game is already starting or in progress");
        }

        // Update room state
        roomManager.setRoomStatus(roomCode, RoomStatus.IN_GAME);
        roomManager.setGameStatus(roomCode, GameStatus.COUNTDOWN);

        // Generate text for modes that need it
        const { mode, duration } = room.settings;
        let text: string | undefined;
        if (mode === GameMode.TYPING_RACE || mode === GameMode.ELIMINATION) {
            text = generateParagraph(PARAGRAPH_WORD_COUNT);
        }

        // Create game instance
        let game: BaseGame;
        switch (mode) {
            case GameMode.TYPING_RACE:
                game = new TypingRaceGame(io, roomCode, room.players, duration!, text!);
                break;
            case GameMode.ELIMINATION:
                game = new EliminationGame(io, roomCode, room.players, text!);
                break;
            case GameMode.TYPING_BUBBLE:
                game = new TypingBubbleGame(io, roomCode, room.players, duration!);
                break;
            default:
                throw new ApiError(400, `Unknown game mode: ${mode}`);
        }

        // Store game immediately so disconnect handlers can find it
        this.activeGames.set(roomCode, game);

        // Start countdown
        const countdownTimer = new TimerManager();
        this.countdownTimers.set(roomCode, countdownTimer);

        countdownTimer.startCountdown(
            COUNTDOWN_SECONDS,
            (remaining: number) => {
                broadcastCountdown(io, roomCode, remaining);
            },
            () => {
                // Countdown complete — clean up countdown timer
                this.countdownTimers.delete(roomCode);

                // Update game status
                roomManager.setGameStatus(roomCode, GameStatus.IN_PROGRESS);

                // Broadcast game started with relevant data
                broadcastGameStarted(io, roomCode, {
                    mode,
                    text,
                    duration,
                    startTime: Date.now(),
                });

                // Start the game
                game.start();
            },
        );
    }

    /**
     * Routes a player's typing progress to the active game in their room.
     */
    handleProgress(roomCode: string, playerId: string, data: ProgressPayload): void {
        const game = this.activeGames.get(roomCode);
        if (!game) return;

        if (game.getStatus() !== GameStatus.IN_PROGRESS) return;

        game.handleProgress(playerId, data);

        // Check if game has finished after processing progress
        if (game.getStatus() === GameStatus.FINISHED) {
            this.cleanupGame(roomCode);
        }
    }

    /**
     * Routes a player's word submission to the active game (Bubble mode).
     */
    handleWord(roomCode: string, playerId: string, data: WordPayload): void {
        const game = this.activeGames.get(roomCode);
        if (!game) return;

        if (game.getStatus() !== GameStatus.IN_PROGRESS) return;

        game.handleWord(playerId, data);

        // Check if game has finished after processing word
        if (game.getStatus() === GameStatus.FINISHED) {
            this.cleanupGame(roomCode);
        }
    }

    /**
     * Forcefully ends an active game and resets the room.
     */
    endGame(roomCode: string): void {
        const game = this.activeGames.get(roomCode);
        if (!game) return;

        game.cleanup();
        this.cleanupGame(roomCode);
    }

    /**
     * Returns the active game for a room, if any.
     */
    getActiveGame(roomCode: string): BaseGame | undefined {
        return this.activeGames.get(roomCode);
    }

    /**
     * Marks a player as disconnected in the active game.
     */
    handlePlayerDisconnect(roomCode: string, playerId: string): void {
        const game = this.activeGames.get(roomCode);
        if (!game) return;

        game.markPlayerDisconnected(playerId);

        // If no active players remain during a game, end it
        if (game.getStatus() === GameStatus.IN_PROGRESS && game.getActivePlayerCount() === 0) {
            game.cleanup();
            this.cleanupGame(roomCode);
        }
    }

    /**
     * Marks a player as reconnected in the active game.
     */
    handlePlayerReconnect(roomCode: string, playerId: string): void {
        const game = this.activeGames.get(roomCode);
        if (!game) return;

        game.markPlayerReconnected(playerId);
    }

    /**
     * Internal cleanup: removes game from active map and resets room state.
     */
    private cleanupGame(roomCode: string): void {
        const game = this.activeGames.get(roomCode);
        if (game) {
            game.cleanup();
            this.activeGames.delete(roomCode);
        }

        // Clean up any lingering countdown timer
        const countdown = this.countdownTimers.get(roomCode);
        if (countdown) {
            countdown.clearAll();
            this.countdownTimers.delete(roomCode);
        }

        // Reset room state if room still exists
        const room = roomManager.getRoom(roomCode);
        if (room) {
            roomManager.setRoomStatus(roomCode, RoomStatus.LOBBY);
            roomManager.setGameStatus(roomCode, GameStatus.WAITING);
        }
    }
}

// ========================
// Singleton Export
// ========================

export const gameManager = new GameManager();
