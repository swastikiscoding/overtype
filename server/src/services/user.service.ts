import { prisma } from "../db/prisma.js";
import { ApiError } from "../utils/ApiError.js";

export const userService = {
    /**
     * Fetch a user by ID, excluding the hashed password.
     * Throws ApiError(404) if the user is not found.
     */
    async getUserById(id: string) {
        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                username: true,
                email: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!user) {
            throw new ApiError(404, "User not found");
        }

        return user;
    },
};
