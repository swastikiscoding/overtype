import {
  ELIMINATION_INTERVAL_MS,
  GameMode,
  GameStatus,
  PlayerStatus,
  PROGRESS_BROADCAST_INTERVAL_MS,
} from "../../constants/index.js";
import type {
  EliminationData,
  GameRanking,
  GameResult,
  PlayerProgress,
  ProgressPayload,
  WordPayload,
} from "../../types/game.js";
import type { RoomPlayer } from "../../types/room.js";
import type { TypedServer } from "../../types/socket.js";
import {
  broadcastProgressUpdate,
  broadcastPlayerEliminated,
  broadcastGameFinished,
} from "../../sockets/emitters/game.emitter.js";
import { findSlowestPlayer } from "../leaderboard.js";
import { BaseGame } from "./baseGame.js";

// ========================
// Elimination Game Mode
// ========================

/**
 * Elimination mode: the slowest player is eliminated every interval.
 * Last player standing wins.
 */
export class EliminationGame extends BaseGame {
  readonly mode = GameMode.ELIMINATION;
  private text: string;
  private ended = false;

  constructor(
    io: TypedServer,
    roomCode: string,
    players: Map<string, RoomPlayer>,
    text: string,
  ) {
    super(io, roomCode, players);
    this.text = text;
  }

  /**
   * Starts the elimination game: progress broadcast + periodic elimination rounds.
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

    // Elimination interval: eliminate the slowest player every 10s
    this.timerManager.startInterval(ELIMINATION_INTERVAL_MS, () => {
      if (this.status !== GameStatus.IN_PROGRESS) return;
      this.eliminateSlowest();
    });
  }

  /**
   * Finds and eliminates the slowest active player.
   * If only 1 player remains (or fewer), ends the game.
   */
  private eliminateSlowest(): void {
    const activePlayers = [...this.players.values()].filter(
      (p) => p.status === PlayerStatus.CONNECTED,
    );

    // If 1 or fewer active, end game
    if (activePlayers.length <= 1) {
      this.endGame();
      return;
    }

    const slowest = findSlowestPlayer(activePlayers);
    if (!slowest) {
      this.endGame();
      return;
    }

    // Mark as eliminated
    slowest.status = PlayerStatus.ELIMINATED;
    slowest.eliminatedAt = Date.now();

    // Elimination rank = current active count + 1 (since we just eliminated this player)
    const remainingActive = [...this.players.values()].filter(
      (p) => p.status === PlayerStatus.CONNECTED,
    );
    slowest.eliminationRank = remainingActive.length + 1;

    const eliminationData: EliminationData = {
      playerId: slowest.playerId,
      username: slowest.username,
      rank: slowest.eliminationRank,
      remainingPlayers: remainingActive.length,
    };

    broadcastPlayerEliminated(this.io, this.roomCode, eliminationData);

    // If only 1 remains, end game
    if (remainingActive.length <= 1) {
      this.endGame();
    }
  }

  /**
   * Updates a player's typing progress. Only processes active players.
   */
  handleProgress(playerId: string, data: ProgressPayload): void {
    if (this.status !== GameStatus.IN_PROGRESS) return;
    if (!this.isPlayerActive(playerId)) return;

    const player = this.players.get(playerId);
    if (!player) return;

    player.currentIndex = data.currentIndex;
    player.correctChars = data.correctChars;
    player.totalChars = data.totalChars;
    player.lastProgressTime = Date.now();

    // Calculate WPM
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
  }

  /**
   * No-op: word submission is not used in elimination mode.
   */
  handleWord(_playerId: string, _data: WordPayload): void {
    // Not applicable for elimination mode
  }

  /**
   * Ends the game: the last remaining player is the winner.
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
   * Builds the GameResult. Winner is rank 1 (last standing).
   * Eliminated players are ranked by eliminationRank (last eliminated = rank 2).
   */
  getResults(): GameResult {
    const allPlayers = [...this.players.values()];

    // The winner is the last remaining CONNECTED player (or the last eliminated)
    const activePlayers = allPlayers.filter(
      (p) => p.status === PlayerStatus.CONNECTED,
    );
    const eliminatedPlayers = allPlayers
      .filter((p) => p.status === PlayerStatus.ELIMINATED)
      .sort((a, b) => (b.eliminationRank ?? 0) - (a.eliminationRank ?? 0));

    // Build rankings: winner first, then eliminated in reverse order
    const rankings: GameRanking[] = [];

    // Winner (last standing or last player)
    if (activePlayers.length > 0) {
      const winner = activePlayers[0];
      rankings.push({
        rank: 1,
        playerId: winner.playerId,
        username: winner.username,
        wpm: winner.wpm,
        accuracy: winner.accuracy,
        completionPercentage: winner.completionPercentage,
      });
    }

    // Eliminated players: sorted by eliminationRank ascending (rank 2, 3, 4...)
    const sortedEliminated = [...allPlayers]
      .filter((p) => p.status === PlayerStatus.ELIMINATED)
      .sort((a, b) => (a.eliminationRank ?? 0) - (b.eliminationRank ?? 0));

    for (const p of sortedEliminated) {
      rankings.push({
        rank: p.eliminationRank ?? rankings.length + 1,
        playerId: p.playerId,
        username: p.username,
        wpm: p.wpm,
        accuracy: p.accuracy,
        completionPercentage: p.completionPercentage,
        eliminatedAt: p.eliminatedAt,
      });
    }

    // Add disconnected players at the end
    const disconnectedPlayers = allPlayers.filter(
      (p) => p.status === PlayerStatus.DISCONNECTED,
    );
    for (const p of disconnectedPlayers) {
      rankings.push({
        rank: rankings.length + 1,
        playerId: p.playerId,
        username: p.username,
        wpm: p.wpm,
        accuracy: p.accuracy,
      });
    }

    const winner = rankings[0];
    const duration = Date.now() - this.startTime;

    return {
      mode: GameMode.ELIMINATION,
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
