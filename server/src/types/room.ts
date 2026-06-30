import { GameMode, GameStatus, PlayerStatus, RoomStatus } from "../constants/index.js";

// ========================
// Room Player
// ========================

export interface RoomPlayer {
    id: string;
    username: string;
    status: PlayerStatus;
    joinedAt: number;
    socketId?: string;
    disconnectedAt?: number;
}

// ========================
// Game Settings
// ========================

export interface GameSettings {
    mode: GameMode;
    duration?: number;      // in seconds, for Race / Bubble
}

// ========================
// Room
// ========================

export interface Room {
    code: string;
    hostId: string;
    players: Map<string, RoomPlayer>;
    settings: GameSettings;
    status: RoomStatus;
    createdAt: number;
    gameStatus: GameStatus;
}

// ========================
// Lobby State (serialized for clients)
// ========================

export interface LobbyState {
    roomCode: string;
    hostId: string;
    players: LobbyPlayer[];
    gameMode: GameMode;
    duration?: number;
    playerCount: number;
    maxPlayers: number;
    status: RoomStatus;
    gameStatus: GameStatus;
}

export interface LobbyPlayer {
    id: string;
    username: string;
    isHost: boolean;
    status: PlayerStatus;
}
