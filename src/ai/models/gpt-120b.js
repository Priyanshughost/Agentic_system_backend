import { ChatGroq } from "@langchain/groq"
import { env } from "../../config/env.js"

export const gpt120b = new ChatGroq({
    model: "openai/gpt-oss-120b",
    temperature: 0,
    apiKey: env.GROQ_API_KEY
})