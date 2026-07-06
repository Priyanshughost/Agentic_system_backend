import { ChatGroq } from "@langchain/groq"
import { env } from "../../config/env.js"

export const qwen32b = new ChatGroq({
    model: "qwen/qwen3-32b",
    temperature: 0,
    apiKey: env.GROQ_API_KEY
})