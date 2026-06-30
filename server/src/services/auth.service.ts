import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../db/prisma.js";
import { config } from "../config/index.js";
import { ApiError } from "../utils/ApiError.js";

export const authService = {
    /**
     * Register a new user.
     * Checks for duplicate username/email, hashes the password, creates the user,
     * and returns the user object (without password) along with a signed JWT.
     */
    async register(data: { username: string; email: string; password: string }) {
        // Check for existing username
        const existingUsername = await prisma.user.findUnique({
            where: { username: data.username },
        });
        if (existingUsername) {
            throw new ApiError(409, "Username is already taken");
        }

        // Check for existing email
        const existingEmail = await prisma.user.findUnique({
            where: { email: data.email },
        });
        if (existingEmail) {
            throw new ApiError(409, "Email is already registered");
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(data.password, 10);

        // Create user
        const user = await prisma.user.create({
            data: {
                username: data.username,
                email: data.email,
                hashedPassword,
            },
            select: {
                id: true,
                username: true,
                email: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        // Generate JWT
        const token = authService.generateToken(user.id);

        return { user, token };
    },

    /**
     * Authenticate a user by email and password.
     * Returns the user object (without password) and a signed JWT.
     */
    async login(data: { email: string; password: string }) {
        const user = await prisma.user.findUnique({
            where: { email: data.email },
        });

        if (!user) {
            throw new ApiError(401, "Invalid email or password");
        }

        const isPasswordValid = await bcrypt.compare(
            data.password,
            user.hashedPassword
        );

        if (!isPasswordValid) {
            throw new ApiError(401, "Invalid email or password");
        }

        const token = authService.generateToken(user.id);

        return {
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
            token,
        };
    },

    /**
     * Generate a signed JWT for the given user ID.
     */
    generateToken(userId: string): string {
        return jwt.sign({ id: userId }, config.JWT_SECRET, {
            expiresIn: config.JWT_EXPIRES_IN,
        } as jwt.SignOptions);
    },
};
