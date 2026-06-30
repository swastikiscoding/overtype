import {
  BUBBLE_WORD_INTERVAL_MS,
  BUBBLE_WORD_TTL_MS,
  GameMode,
  GameStatus,
  PlayerStatus,
  PROGRESS_BROADCAST_INTERVAL_MS,
} from "../../constants/index.js";
import type {
  GameRanking,
  GameResult,
  PlayerScore,
  ProgressPayload,
  WordPayload,
} from "../../types/game.js";
import type { RoomPlayer } from "../../types/room.js";
import type { TypedServer } from "../../types/socket.js";
import {
  broadcastScoreUpdate,
  broadcastGameFinished,
} from "../../sockets/emitters/game.emitter.js";
import { generateWord } from "../wordGenerator.js";
import { rankByScore } from "../leaderboard.js";
import { BaseGame } from "./baseGame.js";

// ========================
// Typing Bubble Game Mode
// ========================

/**
 * Bubble mode: words appear and must be typed before they expire.
 * Correct words add to score; missed words subtract from score.
 * Ranked by score at the end of the time limit.
 */
export class TypingBubbleGame extends BaseGame {
  readonly mode = GameMode.TYPING_BUBBLE;
  private duration: number; // in seconds
  private ended = false;
  private wordIdCounter = 0;

  constructor(
    io: TypedServer,
    roomCode: string,
    players: Map<string, RoomPlayer>,
    duration: number,
  ) {
    super(io, roomCode, players);
    this.duration = duration;
  }

  /**
   * Generates a unique word ID using a simple counter.
   */
  private nextWordId(): string {
    this.wordIdCounter++;
    return `bubble-${this.wordIdCounter}`;
  }

  /**
   * Starts the bubble game: word generation, score broadcasting,
   * expired word cleanup, and game timer.
   */
  start(): void {
    this.status = GameStatus.IN_PROGRESS;
    this.startTime = Date.now();

    // Update each player's startTime
    for (const player of this.players.values()) {
      player.startTime = this.startTime;
      player.lastProgressTime = this.startTime;
    }

    // Generate words for all active players every BUBBLE_WORD_INTERVAL_MS
    this.timerManager.startInterval(BUBBLE_WORD_INTERVAL_MS, () => {
      if (this.status !== GameStatus.IN_PROGRESS) return;
      this.generateWordsForPlayers();
    });

    // Broadcast scores every 500ms
    this.timerManager.startInterval(PROGRESS_BROADCAST_INTERVAL_MS, () => {
      if (this.status !== GameStatus.IN_PROGRESS) return;
      this.broadcastScores();
    });

    // Check for fallen (expired) words every 1s
    this.timerManager.startInterval(1000, () => {
      if (this.status !== GameStatus.IN_PROGRESS) return;
      this.checkFallenWords();
    });

    // Game timer — end when duration expires
    this.timerManager.startTimeout(this.duration * 1000, () => {
      this.endGame();
    });
  }

  /**
   * Generates a new word for each active player and adds it to their activeWords.
   */
  private generateWordsForPlayers(): void {
    const now = Date.now();

    for (const player of this.players.values()) {
      if (player.status !== PlayerStatus.CONNECTED) continue;

      const word = generateWord();
      player.activeWords.push({
        id: this.nextWordId(),
        word,
        createdAt: now,
        ttl: BUBBLE_WORD_TTL_MS,
      });
    }
  }

  /**
   * Checks all players' active words for expired TTL.
   * Expired words subtract from score and increment wordsMissed.
   */
  private checkFallenWords(): void {
    const now = Date.now();

    for (const player of this.players.values()) {
      if (player.status !== PlayerStatus.CONNECTED) continue;

      const expired = player.activeWords.filter(
        (w) => now - w.createdAt >= w.ttl,
      );

      for (const word of expired) {
        player.score -= word.word.length;
        player.wordsMissed++;
      }

      // Remove expired words
      player.activeWords = player.activeWords.filter(
        (w) => now - w.createdAt < w.ttl,
      );
    }
  }

  /**
   * No-op: progress tracking is not used in bubble mode.
   */
  handleProgress(_playerId: string, _data: ProgressPayload): void {
    // Not applicable for bubble mode
  }

  /**
   * Handles a correctly typed word. Adds to score if word is found in activeWords.
   */
  handleWord(playerId: string, data: WordPayload): void {
    if (this.status !== GameStatus.IN_PROGRESS) return;
    if (!this.isPlayerActive(playerId)) return;

    const player = this.players.get(playerId);
    if (!player) return;

    // Find the word in active words
    const wordIndex = player.activeWords.findIndex(
      (w) => w.word === data.word,
    );

    if (wordIndex !== -1) {
      const matched = player.activeWords[wordIndex];
      player.score += matched.word.length;
      player.wordsTyped++;
      player.activeWords.splice(wordIndex, 1);
    }
    // If not found, ignore (no penalty for mistyped)
  }

  /**
   * Ends the game: stops timers, calculates final rankings by score.
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
   * Builds the GameResult with score-based rankings.
   */
  getResults(): GameResult {
    const allPlayers = [...this.players.values()];
    const sorted = rankByScore(allPlayers);

    const rankings: GameRanking[] = sorted.map((p, index) => ({
      rank: index + 1,
      playerId: p.playerId,
      username: p.username,
      score: p.score,
    }));

    const winner = sorted[0];
    const duration = Date.now() - this.startTime;

    return {
      mode: GameMode.TYPING_BUBBLE,
      winner: {
        playerId: winner?.playerId ?? "",
        username: winner?.username ?? "",
      },
      rankings,
      duration,
    };
  }

  /**
   * Broadcasts current scores of all players to the room.
   */
  private broadcastScores(): void {
    const scores: PlayerScore[] = [...this.players.values()].map((p) => ({
      playerId: p.playerId,
      username: p.username,
      score: p.score,
      wordsTyped: p.wordsTyped,
      wordsMissed: p.wordsMissed,
    }));

    broadcastScoreUpdate(this.io, this.roomCode, scores);
  }
}
