import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { ApiError } from "../utils/ApiError.js";

/**
 * Returns Express middleware that validates `req.body` against the given Zod schema.
 * On validation failure, throws an ApiError(400) with formatted Zod issue messages.
 */
export const validate = (schema: z.ZodType) => {
    return (req: Request, _res: Response, next: NextFunction): void => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            const errorMessages = result.error.issues.map(
                (issue) => `${issue.path.join(".")}: ${issue.message}`
            );
            throw new ApiError(400, "Validation failed", errorMessages);
        }

        req.body = result.data;
        next();
    };
};
