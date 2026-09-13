import app from "./app.js";
import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";
import "./config/groqRotation.js"; // Initialize dynamic API key rotation patch
import { logger } from "./utils/logger.js";

const startServer = async () => {
    await connectDB();

    app.listen(
        env.PORT,
        () => {
            logger.info(
                `Server running on port ${env.PORT}`
            );
        }
    );
};

startServer();