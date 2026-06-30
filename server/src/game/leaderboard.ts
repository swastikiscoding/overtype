import { PlayerStatus } from "../constants/index.js";
import type { PlayerGameState } from "../types/game.js";

// ========================
// Leaderboard Functions
// ========================

/**
 * Sort active players descending by WPM, then by accuracy as tie-breaker.
 * Returns a new sorted array.
 */
export function rankByWpm(players: PlayerGameState[]): PlayerGameState[] {
  return [...players].sort((a, b) => {
    if (b.wpm !== a.wpm) return b.wpm - a.wpm;
    return b.accuracy - a.accuracy;
  });
}

/**
 * Sort players descending by score, then by wordsTyped as tie-breaker.
 * Returns a new sorted array.
 */
export function rankByScore(players: PlayerGameState[]): PlayerGameState[] {
  return [...players].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return b.wordsTyped - a.wordsTyped;
  });
}

/**
 * Among active (CONNECTED) players, find the one with lowest WPM.
 * Tie-break: lowest accuracy, then earliest lastProgressTime (proxy for joinTime).
 * Returns null if no active players.
 */
export function findSlowestPlayer(
  players: PlayerGameState[],
): PlayerGameState | null {
  const activePlayers = players.filter(
    (p) => p.status === PlayerStatus.CONNECTED,
  );

  if (activePlayers.length === 0) return null;

  return activePlayers.reduce((slowest, current) => {
    // Lower WPM is "slower"
    if (current.wpm < slowest.wpm) return current;
    if (current.wpm > slowest.wpm) return slowest;

    // Tie-break: lower accuracy
    if (current.accuracy < slowest.accuracy) return current;
    if (current.accuracy > slowest.accuracy) return slowest;

    // Tie-break: earlier lastProgressTime (proxy for joinTime)
    if (current.lastProgressTime < slowest.lastProgressTime) return current;

    return slowest;
  });
}
