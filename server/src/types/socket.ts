import { Server, Socket } from "socket.io";
import { LobbyState } from "./room.js";
import {
    EliminationData,
    GameResult,
    GameStartData,
    PlayerProgress,
    PlayerScore,
    ProgressPayload,
    WordPayload,
} from "./game.js";

// ========================
// Server → Client Events
// ========================

export interface ServerToClientEvents {
    lobbyUpdate: (lobby: LobbyState) => void;
    countdown: (data: { seconds: number }) => void;
    gameStarted: (data: GameStartData) => void;
    progressUpdate: (data: PlayerProgress[]) => void;
    scoreUpdate: (data: PlayerScore[]) => void;
    playerEliminated: (data: EliminationData) => void;
    gameFinished: (data: GameResult) => void;
    error: (data: { message: string }) => void;
}

// ========================
// Client → Server Events
// ========================

export interface ClientToServerEvents {
    joinRoom: (
        data: { roomCode: string },
        ack: (response: { success: boolean; message: string }) => void,
    ) => void;
    leaveRoom: (
        ack: (response: { success: boolean; message: string }) => void,
    ) => void;
    startGame: (
        ack: (response: { success: boolean; message: string }) => void,
    ) => void;
    submitProgress: (data: ProgressPayload) => void;
    submitWord: (data: WordPayload) => void;
}

// ========================
// Inter-Server Events (for potential scaling)
// ========================

export interface InterServerEvents {
    ping: () => void;
}

// ========================
// Socket Data (attached to each socket)
// ========================

export interface SocketData {
    user: {
        id: string;
        username: string;
        email: string;
    };
    roomCode?: string;
}

// ========================
// Typed Server & Socket
// ========================

export type TypedServer = Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
>;

export type TypedSocket = Socket<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
>;
