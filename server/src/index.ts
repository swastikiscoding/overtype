import dotenv from "dotenv";

import { app } from "./app";
import { connectDB } from "./db/prisma";

dotenv.config();

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("❌ Failed to start server");
        console.error(error);
        process.exit(1);
    }
}

startServer();