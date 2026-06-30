import dotenv from "dotenv";

dotenv.config();

function getEnvVar(key: string, defaultValue?: string): string {
    const value = process.env[key] ?? defaultValue;
    if (value === undefined) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
}

export const config = {
    PORT: parseInt(getEnvVar("PORT", "3000"), 10),
    CORS_ORIGIN: getEnvVar("CORS_ORIGIN", "http://localhost:5173"),
    JWT_SECRET: getEnvVar("JWT_SECRET"),
    JWT_EXPIRES_IN: getEnvVar("JWT_EXPIRES_IN", "7d"),
    DATABASE_URL: getEnvVar("DATABASE_URL"),
} as const;
