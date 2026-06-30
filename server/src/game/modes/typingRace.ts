import {
  GameMode,
  GameStatus,
  PROGRESS_BROADCAST_INTERVAL_MS,
} from "../../constants/index.js";
import type {
  GameResult,
  GameRanking,
  PlayerProgress,
  ProgressPayload,
  WordPayload,
} from "../../types/game.js";
import type { RoomPlayer } from "../../types/room.js";
import type { TypedServer } from "../../types/socket.js";
import {
  broadcastProgressUpdate,
  broadcastGameFinished,
} from "../../sockets/emitters/game.emitter.js";
import { rankByWpm } from "../leaderboard.js";
import { BaseGame } from "./baseGame.js";

// ========================
// Typing Race Game Mode
// ========================

/**
 * Standard typing race: players type a shared paragraph.
 * Ranked by WPM when the timer expires or all players finish.
 */
export class TypingRaceGame extends BaseGame {
  readonly mode = GameMode.TYPING_RACE;
  private duration: number; // in seconds
  private text: string;
  private ended = false;

  constructor(
    io: TypedServer,
    roomCode: string,
    players: Map<string, RoomPlayer>,
    duration: number,
    text: string,
  ) {
    super(io, roomCode, players);
    this.duration = duration;
    this.text = text;
  }

  /**
   * Starts the race: sets status, begins progress broadcasting, and starts game timer.
   */
  start(): void {
    this.status = GameStatus.IN_PROGRESS;
    this.startTime = Date.now();

    // Update each player's startTime
    for (const player of this.players.values()) {
      player.startTime = this.startTime;
      player.lastProgressTime = this.startTime;
    }

    // Broadcast progress every 500ms
    this.timerManager.startInterval(PROGRESS_BROADCAST_INTERVAL_MS, () => {
      if (this.status !== GameStatus.IN_PROGRESS) return;
      this.broadcastProgress();
    });

    // Game timer — end when duration expires
    this.timerManager.startTimeout(this.duration * 1000, () => {
      this.endGame();
    });
  }

  /**
   * Updates a player's typing progress and recalculates WPM/accuracy.
   */
  handleProgress(playerId: string, data: ProgressPayload): void {
    if (this.status !== GameStatus.IN_PROGRESS) return;
    if (!this.isPlayerActive(playerId)) return;

    const player = this.players.get(playerId);
    if (!player || player.isFinished) return;

    player.currentIndex = data.currentIndex;
    player.correctChars = data.correctChars;
    player.totalChars = data.totalChars;
    player.lastProgressTime = Date.now();

    // Calculate WPM: (correctChars / 5) / elapsedMinutes
    const elapsedMinutes = (Date.now() - this.startTime) / 60000;
    player.wpm = elapsedMinutes > 0
      ? Math.round((player.correctChars / 5) / elapsedMinutes)
      : 0;

    // Calculate accuracy
    player.accuracy = player.totalChars > 0
      ? Math.round((player.correctChars / player.totalChars) * 100 * 100) / 100
      : 100;

    // Calculate completion percentage
    player.completionPercentage = this.text.length > 0
      ? Math.round((player.currentIndex / this.text.length) * 100 * 100) / 100
      : 0;

    // Check if player finished the text
    if (player.currentIndex >= this.text.length) {
      player.isFinished = true;
      player.completionPercentage = 100;
    }

    // Check if ALL active players are finished → end game early
    const activePlayers = [...this.players.values()].filter(
      (p) => this.isPlayerActive(p.playerId),
    );
    if (activePlayers.length > 0 && activePlayers.every((p) => p.isFinished)) {
      this.endGame();
    }
  }

  /**
   * No-op: word submission is not used in typing race mode.
   */
  handleWord(_playerId: string, _data: WordPayload): void {
    // Not applicable for typing race
  }

  /**
   * Ends the game: stops timers, calculates final rankings, broadcasts results.
   */
  private endGame(): void {
    if (this.ended) return;
    this.ended = true;

    this.status = GameStatus.FINISHED;
    this.timerManager.clearAll();

    const result = this.getResults();
    broadcastGameFinished(this.io, this.roomCode, result);
  }

  /**
   * Builds the GameResult with rankings sorted by WPM descending.
   */
  getResults(): GameResult {
    const allPlayers = [...this.players.values()];
    const sorted = rankByWpm(allPlayers);

    const rankings: GameRanking[] = sorted.map((p, index) => ({
      rank: index + 1,
      playerId: p.playerId,
      username: p.username,
      wpm: p.wpm,
      accuracy: p.accuracy,
      completionPercentage: p.completionPercentage,
    }));

    const winner = sorted[0];
    const duration = Date.now() - this.startTime;

    return {
      mode: GameMode.TYPING_RACE,
      winner: {
        playerId: winner?.playerId ?? "",
        username: winner?.username ?? "",
      },
      rankings,
      duration,
    };
  }

  /**
   * Broadcasts current progress of all players to the room.
   */
  private broadcastProgress(): void {
    const progress: PlayerProgress[] = [...this.players.values()].map((p) => ({
      playerId: p.playerId,
      username: p.username,
      wpm: p.wpm,
      accuracy: p.accuracy,
      completionPercentage: p.completionPercentage,
      isFinished: p.isFinished,
    }));

    broadcastProgressUpdate(this.io, this.roomCode, progress);
  }
}
