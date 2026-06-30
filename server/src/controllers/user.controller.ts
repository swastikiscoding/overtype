import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { userService } from "../services/user.service.js";

/**
 * GET /users/me
 * Returns the authenticated user's profile.
 */
export const getMe = asyncHandler(async (req: Request, res: Response) => {
    const user = await userService.getUserById(req.user!.id);
    return res
        .status(200)
        .json(new ApiResponse(200, user, "User profile fetched"));
});
