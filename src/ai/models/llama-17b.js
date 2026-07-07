import { ChatGroq } from "@langchain/groq"
import { env } from "../../config/env.js"

export const llama17b = new ChatGroq({
    model: "meta-llama/llama-4-scout-17b-16e-instruct",
    apiKey: env.GROQ_API_KEY,
    temperature: 0,
})