import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/index.js";
import { prisma } from "../db/prisma.js";
import { ApiError } from "../utils/ApiError.js";

interface JwtPayload {
    id: string;
}

/**
 * Express middleware that authenticates requests via Bearer token.
 * Extracts the JWT from the Authorization header, verifies it,
 * looks up the user in the database, and attaches them to `req.user`.
 */
export const authMiddleware = async (
    req: Request,
    _res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new ApiError(401, "Unauthorized");
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            throw new ApiError(401, "Unauthorized");
        }

        const decoded = jwt.verify(token, config.JWT_SECRET) as JwtPayload;

        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: { id: true, username: true, email: true },
        });

        if (!user) {
            throw new ApiError(401, "Unauthorized");
        }

        req.user = user;
        next();
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(401, "Unauthorized");
    }
};
