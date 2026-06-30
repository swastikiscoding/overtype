import {
  GameStatus,
  MAX_PLAYERS,
  PlayerStatus,
  ROOM_CODE_LENGTH,
  RoomStatus,
} from "../constants/index.js";
import type { GameSettings, LobbyPlayer, LobbyState, Room, RoomPlayer } from "../types/room.js";
import { ApiError } from "../utils/ApiError.js";

// ========================
// Room Code Generator
// ========================

const CODE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function generateRoomCode(): string {
  let code = "";
  for (let i = 0; i < ROOM_CODE_LENGTH; i++) {
    code += CODE_CHARS.charAt(Math.floor(Math.random() * CODE_CHARS.length));
  }
  return code;
}

// ========================
// Room Manager
// ========================

class RoomManager {
  private rooms: Map<string, Room> = new Map();

  /**
   * Creates a new room with a unique code. The host is added as the first player.
   */
  createRoom(hostId: string, hostUsername: string, settings: GameSettings): Room {
    // Generate unique room code
    let code: string;
    do {
      code = generateRoomCode();
    } while (this.rooms.has(code));

    const now = Date.now();

    const hostPlayer: RoomPlayer = {
      id: hostId,
      username: hostUsername,
      status: PlayerStatus.CONNECTED,
      joinedAt: now,
    };

    const room: Room = {
      code,
      hostId,
      players: new Map<string, RoomPlayer>([[hostId, hostPlayer]]),
      settings,
      status: RoomStatus.LOBBY,
      createdAt: now,
      gameStatus: GameStatus.WAITING,
    };

    this.rooms.set(code, room);
    return room;
  }

  /**
   * Returns the room with the given code, or undefined.
   */
  getRoom(roomCode: string): Room | undefined {
    return this.rooms.get(roomCode);
  }

  /**
   * Adds a player to an existing room. Validates room state.
   */
  addPlayer(roomCode: string, playerId: string, username: string): Room {
    const room = this.rooms.get(roomCode);
    if (!room) {
      throw new ApiError(404, "Room not found");
    }

    if (room.players.size >= MAX_PLAYERS) {
      throw new ApiError(400, "Room is full");
    }

    if (room.status === RoomStatus.IN_GAME || room.gameStatus === GameStatus.IN_PROGRESS) {
      throw new ApiError(400, "Game already in progress");
    }

    if (room.players.has(playerId)) {
      throw new ApiError(400, "Already in this room");
    }

    // Check if player is in another room
    for (const [code, otherRoom] of this.rooms) {
      if (code !== roomCode && otherRoom.players.has(playerId)) {
        throw new ApiError(400, "Already in another room");
      }
    }

    const player: RoomPlayer = {
      id: playerId,
      username,
      status: PlayerStatus.CONNECTED,
      joinedAt: Date.now(),
    };

    room.players.set(playerId, player);
    return room;
  }

  /**
   * Removes a player from a room. Handles host transfer and room cleanup.
   */
  removePlayer(
    roomCode: string,
    playerId: string,
  ): { room: Room | null; hostTransferred: boolean; newHostId?: string } {
    const room = this.rooms.get(roomCode);
    if (!room) {
      return { room: null, hostTransferred: false };
    }

    room.players.delete(playerId);

    // If room is now empty, delete it
    if (room.players.size === 0) {
      this.rooms.delete(roomCode);
      return { room: null, hostTransferred: false };
    }

    // If the removed player was the host, transfer to the next player (earliest joinedAt)
    if (room.hostId === playerId) {
      const sortedPlayers = [...room.players.values()].sort(
        (a, b) => a.joinedAt - b.joinedAt,
      );
      const newHost = sortedPlayers[0];
      room.hostId = newHost.id;
      return { room, hostTransferred: true, newHostId: newHost.id };
    }

    return { room, hostTransferred: false };
  }

  /**
   * Finds the room containing a specific player.
   */
  getRoomByPlayerId(playerId: string): Room | undefined {
    for (const room of this.rooms.values()) {
      if (room.players.has(playerId)) {
        return room;
      }
    }
    return undefined;
  }

  /**
   * Serializes room state to a LobbyState for client consumption.
   */
  getLobbyState(roomCode: string): LobbyState | null {
    const room = this.rooms.get(roomCode);
    if (!room) return null;

    const players: LobbyPlayer[] = [...room.players.values()].map((p) => ({
      id: p.id,
      username: p.username,
      isHost: p.id === room.hostId,
      status: p.status,
    }));

    return {
      roomCode: room.code,
      hostId: room.hostId,
      players,
      gameMode: room.settings.mode,
      duration: room.settings.duration,
      playerCount: room.players.size,
      maxPlayers: MAX_PLAYERS,
      status: room.status,
      gameStatus: room.gameStatus,
    };
  }

  /**
   * Updates the room status.
   */
  setRoomStatus(roomCode: string, status: RoomStatus): void {
    const room = this.rooms.get(roomCode);
    if (room) {
      room.status = status;
    }
  }

  /**
   * Updates the game status for a room.
   */
  setGameStatus(roomCode: string, status: GameStatus): void {
    const room = this.rooms.get(roomCode);
    if (room) {
      room.gameStatus = status;
    }
  }

  /**
   * Deletes a room entirely.
   */
  deleteRoom(roomCode: string): void {
    this.rooms.delete(roomCode);
  }

  /**
   * Gets the socket ID for a player in a room.
   */
  getPlayerSocketId(roomCode: string, playerId: string): string | undefined {
    const room = this.rooms.get(roomCode);
    if (!room) return undefined;
    const player = room.players.get(playerId);
    return player?.socketId;
  }

  /**
   * Sets the socket ID for a player in a room.
   */
  setPlayerSocketId(roomCode: string, playerId: string, socketId: string): void {
    const room = this.rooms.get(roomCode);
    if (!room) return;
    const player = room.players.get(playerId);
    if (player) {
      player.socketId = socketId;
    }
  }

  /**
   * Sets the connection status for a player in a room.
   */
  setPlayerStatus(roomCode: string, playerId: string, status: PlayerStatus): void {
    const room = this.rooms.get(roomCode);
    if (!room) return;
    const player = room.players.get(playerId);
    if (player) {
      player.status = status;
    }
  }

  /**
   * Sets the disconnection timestamp for a player.
   */
  setPlayerDisconnectedAt(roomCode: string, playerId: string, time: number): void {
    const room = this.rooms.get(roomCode);
    if (!room) return;
    const player = room.players.get(playerId);
    if (player) {
      player.disconnectedAt = time;
    }
  }
}

// ========================
// Singleton Export
// ========================

export const roomManager = new RoomManager();
