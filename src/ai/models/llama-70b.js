import { ChatGroq } from "@langchain/groq"
import { env } from "../../config/env.js"

export const llama70b = new ChatGroq({
    model: "llama-3.3-70b-versatile",
    apiKey: env.GROQ_API_KEY,
    temperature: 0,
})