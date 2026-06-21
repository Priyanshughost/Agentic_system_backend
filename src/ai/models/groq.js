import { ChatGroq } from "@langchain/groq"
import { env } from "../../config/env.js"

export const groqModel = new ChatGroq({
    model: "groq/compound",
    apiKey: env.GROQ_API_KEY,
    temperature: 0,
})
