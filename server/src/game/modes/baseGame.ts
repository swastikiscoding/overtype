import { GameMode, GameStatus, PlayerStatus } from "../../constants/index.js";
import type { GameResult, PlayerGameState, ProgressPayload, WordPayload } from "../../types/game.js";
import type { RoomPlayer } from "../../types/room.js";
import type { TypedServer } from "../../types/socket.js";
import { TimerManager } from "../timers.js";

// ========================
// Abstract Base Game
// ========================

/**
 * Base class for all game modes. Manages common player state,
 * timer lifecycle, and defines the interface for game mode implementations.
 */
export abstract class BaseGame {
  abstract readonly mode: GameMode;

  protected players: Map<string, PlayerGameState>;
  protected status: GameStatus;
  protected timerManager: TimerManager;
  protected io: TypedServer;
  protected roomCode: string;
  protected startTime: number = 0;

  constructor(
    io: TypedServer,
    roomCode: string,
    players: Map<string, RoomPlayer>,
  ) {
    this.io = io;
    this.roomCode = roomCode;
    this.status = GameStatus.WAITING;
    this.timerManager = new TimerManager();

    // Initialize PlayerGameState for each player with defaults
    this.players = new Map<string, PlayerGameState>();
    const now = Date.now();

    for (const [id, roomPlayer] of players) {
      const gameState: PlayerGameState = {
        playerId: id,
        username: roomPlayer.username,
        status: PlayerStatus.CONNECTED,
        // Race / Elimination fields
        currentIndex: 0,
        correctChars: 0,
        totalChars: 0,
        wpm: 0,
        accuracy: 100,
        completionPercentage: 0,
        isFinished: false,
        startTime: now,
        lastProgressTime: now,
        // Bubble fields
        score: 0,
        wordsTyped: 0,
        wordsMissed: 0,
        activeWords: [],
      };
      this.players.set(id, gameState);
    }
  }

  // ========================
  // Abstract Methods
  // ========================

  abstract start(): void;
  abstract handleProgress(playerId: string, data: ProgressPayload): void;
  abstract handleWord(playerId: string, data: WordPayload): void;
  abstract getResults(): GameResult;

  // ========================
  // Common Methods
  // ========================

  /**
   * Cleans up all timers associated with this game.
   */
  cleanup(): void {
    this.timerManager.clearAll();
  }

  /**
   * Returns the current game status.
   */
  getStatus(): GameStatus {
    return this.status;
  }

  /**
   * Returns true if the player exists and is CONNECTED.
   */
  isPlayerActive(playerId: string): boolean {
    const player = this.players.get(playerId);
    return player !== undefined && player.status === PlayerStatus.CONNECTED;
  }

  /**
   * Marks a player as disconnected.
   */
  markPlayerDisconnected(playerId: string): void {
    const player = this.players.get(playerId);
    if (player) {
      player.status = PlayerStatus.DISCONNECTED;
    }
  }

  /**
   * Marks a player as reconnected (CONNECTED).
   */
  markPlayerReconnected(playerId: string): void {
    const player = this.players.get(playerId);
    if (player && player.status === PlayerStatus.DISCONNECTED) {
      player.status = PlayerStatus.CONNECTED;
    }
  }

  /**
   * Returns the count of currently active (CONNECTED) players.
   */
  getActivePlayerCount(): number {
    let count = 0;
    for (const player of this.players.values()) {
      if (player.status === PlayerStatus.CONNECTED) {
        count++;
      }
    }
    return count;
  }
}
