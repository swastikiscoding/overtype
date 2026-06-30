import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { authService } from "../services/auth.service.js";

/**
 * POST /auth/register
 * Registers a new user and returns the user object with a JWT.
 */
export const register = asyncHandler(async (req: Request, res: Response) => {
    const { username, email, password } = req.body;
    const result = await authService.register({ username, email, password });
    return res
        .status(201)
        .json(new ApiResponse(201, result, "User registered successfully"));
});

/**
 * POST /auth/login
 * Authenticates a user and returns the user object with a JWT.
 */
export const login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const result = await authService.login({ email, password });
    return res
        .status(200)
        .json(new ApiResponse(200, result, "Login successful"));
});
