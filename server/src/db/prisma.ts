import "dotenv/config";

import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
});

export const prisma = new PrismaClient({
    adapter,
});

export async function connectDB() {
    try {
        await prisma.$connect();

        console.log("✅ Connected to PostgreSQL");
    } catch (error) {
        console.error("❌ Database connection failed");
        throw error;
    }
}