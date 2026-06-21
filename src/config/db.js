import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const connection = await mongoose.connect(
            'mongodb+srv://10priyanshughosh_db_user:16042005@agentic-auth.6r20n5h.mongodb.net/?appName=agentic-auth'
        );

        console.log(
            `MongoDB Connected: ${connection.connection.host}`
        );
    }
    catch (error) {
        console.error(
            "MongoDB Connection Failed:",
            error
        );

        process.exit(1);
    }
};