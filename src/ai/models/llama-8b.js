import { ChatGroq } from "@langchain/groq"
import { env } from "../../config/env.js"

export const llama8b = new ChatGroq({
    model: "llama-3.1-8b-instant",
    apiKey: env.GROQ_API_KEY,
    temperature: 0,
})
