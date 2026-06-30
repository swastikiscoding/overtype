import { GameMode, GameStatus, PlayerStatus } from "../constants/index.js";

// ========================
// Player Progress (Race / Elimination)
// ========================

export interface ProgressPayload {
    currentIndex: number;
    correctChars: number;
    totalChars: number;
}

export interface PlayerProgress {
    playerId: string;
    username: string;
    wpm: number;
    accuracy: number;
    completionPercentage: number;
    isFinished: boolean;
}

// ========================
// Player Score (Bubble)
// ========================

export interface WordPayload {
    word: string;
}

export interface PlayerScore {
    playerId: string;
    username: string;
    score: number;
    wordsTyped: number;
    wordsMissed: number;
}

// ========================
// Game State
// ========================

export interface PlayerGameState {
    playerId: string;
    username: string;
    status: PlayerStatus;
    // Race / Elimination fields
    currentIndex: number;
    correctChars: number;
    totalChars: number;
    wpm: number;
    accuracy: number;
    completionPercentage: number;
    isFinished: boolean;
    startTime: number;
    lastProgressTime: number;
    // Bubble fields
    score: number;
    wordsTyped: number;
    wordsMissed: number;
    activeWords: BubbleWord[];
    // Elimination
    eliminatedAt?: number;
    eliminationRank?: number;
}

export interface BubbleWord {
    id: string;
    word: string;
    createdAt: number;
    ttl: number;
}

// ========================
// Game Start Data
// ========================

export interface GameStartData {
    mode: GameMode;
    text?: string;           // for Race / Elimination
    duration?: number;       // in seconds, for Race / Bubble
    startTime: number;       // timestamp
}

// ========================
// Elimination Data
// ========================

export interface EliminationData {
    playerId: string;
    username: string;
    rank: number;
    remainingPlayers: number;
}

// ========================
// Game Result
// ========================

export interface GameResult {
    mode: GameMode;
    winner: {
        playerId: string;
        username: string;
    };
    rankings: GameRanking[];
    duration: number;       // actual game duration in ms
}

export interface GameRanking {
    rank: number;
    playerId: string;
    username: string;
    wpm?: number;
    accuracy?: number;
    score?: number;
    completionPercentage?: number;
    eliminatedAt?: number;
}
