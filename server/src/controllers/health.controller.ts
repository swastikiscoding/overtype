import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

/**
 * GET /health
 * Returns server health information.
 */
export const healthCheck = asyncHandler(async (_req: Request, res: Response) => {
    return res.status(200).json(
        new ApiResponse(
            200,
            {
                status: "ok",
                uptime: process.uptime(),
                timestamp: new Date().toISOString(),
            },
            "Server is healthy"
        )
    );
});
