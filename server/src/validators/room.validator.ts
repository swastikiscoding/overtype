import { z } from "zod";
import { GameMode } from "../constants/index.js";

export const createRoomSchema = z.object({
    gameMode: z.nativeEnum(GameMode, {
        message: "Invalid game mode",
    }),
    duration: z
        .number({ message: "Duration must be a number" })
        .refine((val) => val === 60 || val === 120, {
            message: "Duration must be 60 or 120 seconds",
        })
        .optional(),
});

export const joinRoomSchema = z.object({
    roomCode: z
        .string()
        .length(6, "Room code must be exactly 6 characters")
        .transform((val) => val.toUpperCase()),
});
