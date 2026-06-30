// ========================
// Enums
// ========================

export enum GameMode {
    TYPING_RACE = "TYPING_RACE",
    ELIMINATION = "ELIMINATION",
    TYPING_BUBBLE = "TYPING_BUBBLE",
}

export enum GameStatus {
    WAITING = "WAITING",
    COUNTDOWN = "COUNTDOWN",
    IN_PROGRESS = "IN_PROGRESS",
    FINISHED = "FINISHED",
}

export enum RoomStatus {
    LOBBY = "LOBBY",
    IN_GAME = "IN_GAME",
    FINISHED = "FINISHED",
}

export enum PlayerStatus {
    CONNECTED = "CONNECTED",
    DISCONNECTED = "DISCONNECTED",
    ELIMINATED = "ELIMINATED",
}

// ========================
// Socket Event Names
// ========================

export const SocketEvents = {
    // Client → Server
    JOIN_ROOM: "joinRoom",
    LEAVE_ROOM: "leaveRoom",
    START_GAME: "startGame",
    SUBMIT_PROGRESS: "submitProgress",
    SUBMIT_WORD: "submitWord",

    // Server → Client
    LOBBY_UPDATE: "lobbyUpdate",
    COUNTDOWN: "countdown",
    GAME_STARTED: "gameStarted",
    PROGRESS_UPDATE: "progressUpdate",
    SCORE_UPDATE: "scoreUpdate",
    PLAYER_ELIMINATED: "playerEliminated",
    GAME_FINISHED: "gameFinished",
    ERROR: "error",
} as const;

// ========================
// Game Constants
// ========================

export const MIN_PLAYERS = 1;
export const MAX_PLAYERS = 10;
export const ELIMINATION_INTERVAL_MS = 10_000;
export const COUNTDOWN_SECONDS = 5;
export const VALID_DURATIONS = [60, 120] as const;
export const RECONNECT_GRACE_MS = 30_000;
export const PROGRESS_BROADCAST_INTERVAL_MS = 500;
export const ROOM_CODE_LENGTH = 6;
export const BUBBLE_WORD_INTERVAL_MS = 2_000;
export const BUBBLE_WORD_TTL_MS = 5_000;
export const PARAGRAPH_WORD_COUNT = 200;
