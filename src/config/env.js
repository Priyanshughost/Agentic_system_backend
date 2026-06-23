import dotenv from "dotenv";

dotenv.config();

export const env = {
    PORT: process.env.PORT || 5000,
    GROQ_API_KEY: process.env.GROQ_API_KEY,
    MONGO_URI:process.env.MONGO_URI,
    CLIENT_URL:process.env.CLIENT_URL
};
