import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { Prisma } from "../generated/prisma/client.js";
import { ApiError } from "../utils/ApiError.js";

/**
 * Global Express error-handling middleware.
 * Normalises various error types into a consistent JSON response shape.
 */
export const errorHandler = (
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
): void => {
    // --- ApiError (our custom application errors) ---
    if (err instanceof ApiError) {
        res.status(err.statusCode).json({
            success: false,
            status: err.statusCode,
            message: err.message,
            errors: err.errors,
            data: null,
        });
        return;
    }

    // --- Prisma known-request errors (e.g. unique constraint violations) ---
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
            const target = (err.meta?.target as string[]) ?? [];
            const field = target.length > 0 ? target[0] : "field";
            res.status(409).json({
                success: false,
                status: 409,
                message: `A record with that ${field} already exists`,
                errors: [`Unique constraint failed on: ${field}`],
                data: null,
            });
            return;
        }

        res.status(400).json({
            success: false,
            status: 400,
            message: "Database request error",
            errors: [err.message],
            data: null,
        });
        return;
    }

    // --- Zod validation errors ---
    if (err instanceof ZodError) {
        const formattedErrors = err.issues.map(
            (issue) => `${issue.path.join(".")}: ${issue.message}`
        );
        res.status(400).json({
            success: false,
            status: 400,
            message: "Validation failed",
            errors: formattedErrors,
            data: null,
        });
        return;
    }

    // --- JWT errors ---
    if (err instanceof TokenExpiredError) {
        res.status(401).json({
            success: false,
            status: 401,
            message: "Token has expired",
            errors: ["Token expired"],
            data: null,
        });
        return;
    }

    if (err instanceof JsonWebTokenError) {
        res.status(401).json({
            success: false,
            status: 401,
            message: "Invalid token",
            errors: ["Invalid or malformed token"],
            data: null,
        });
        return;
    }

    // --- Fallback: unknown / unexpected errors ---
    console.error("Unhandled error:", err);

    res.status(500).json({
        success: false,
        status: 500,
        message: "Internal Server Error",
        errors: [],
        data: null,
    });
};
