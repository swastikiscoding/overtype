import dotenv from "dotenv";
dotenv.config();

import http from "http";
import { app } from "./app.js";
import { connectDB } from "./db/prisma.js";
import { initializeSocketServer } from "./sockets/index.js";
import { config } from "./config/index.js";

async function startServer() {
    try {
        // Connect to PostgreSQL
        await connectDB();

        // Create HTTP server from Express app
        const httpServer = http.createServer(app);

        // Initialize Socket.IO on the HTTP server
        const io = initializeSocketServer(httpServer);

        // Start listening
        httpServer.listen(config.PORT, () => {
            console.log(`🚀 Server running on port ${config.PORT}`);
            console.log(`📡 Socket.IO ready`);
            console.log(`🌐 CORS origin: ${config.CORS_ORIGIN}`);
        });
    } catch (error) {
        console.error("❌ Failed to start server");
        console.error(error);
        process.exit(1);
    }
}

startServer();