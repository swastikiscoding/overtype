import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { roomService } from "../services/room.service.js";

/**
 * POST /rooms
 * Creates a new game room.
 */
export const createRoom = asyncHandler(async (req: Request, res: Response) => {
    const { gameMode, duration } = req.body;
    const { id: userId, username } = req.user!;
    const lobby = await roomService.createRoom(
        userId,
        username,
        gameMode,
        duration
    );
    return res
        .status(201)
        .json(new ApiResponse(201, lobby, "Room created successfully"));
});

/**
 * POST /rooms/join
 * Joins an existing room by room code.
 */
export const joinRoom = asyncHandler(async (req: Request, res: Response) => {
    const { roomCode } = req.body;
    const { id: userId, username } = req.user!;
    const lobby = await roomService.joinRoom(userId, username, roomCode);
    return res
        .status(200)
        .json(new ApiResponse(200, lobby, "Joined room successfully"));
});

/**
 * POST /rooms/leave
 * Leaves the current room.
 */
export const leaveRoom = asyncHandler(async (req: Request, res: Response) => {
    const result = await roomService.leaveRoom(req.user!.id);
    return res
        .status(200)
        .json(new ApiResponse(200, result, "Left room successfully"));
});

/**
 * GET /rooms/:roomCode
 * Fetches room details by room code.
 */
export const getRoomDetails = asyncHandler(
    async (req: Request, res: Response) => {
        const roomCode = req.params.roomCode as string;
        const lobby = await roomService.getRoomDetails(roomCode);
        return res
            .status(200)
            .json(new ApiResponse(200, lobby, "Room details fetched"));
    }
);
