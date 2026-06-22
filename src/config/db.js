import mongoose from "mongoose";

export async function connectDB(){
    try {
        const uri =
            process.env.MONGO_URI;

        if (!uri) {
            throw new Error(
                "MONGODB_URI is not defined",
            );
        }

        await mongoose.connect(uri);

    } catch (error) {
        console.error(
            "MongoDB connection failed",
            error,
        );

        process.exit(1);
    }
}