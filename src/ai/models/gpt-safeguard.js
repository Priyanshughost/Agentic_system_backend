import { ChatGroq } from "@langchain/groq"
import { env } from "../../config/env"

export const gptSafeguard = new ChatGroq({
    model: "openai/gpt-oss-safeguard-20b",
    temperature: 0,
    apiKey: env.GROQ_API_KEY
})