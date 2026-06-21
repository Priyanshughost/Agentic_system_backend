import { groqModel } from "../models/groq.js";
// 1. Import the LangChain message classes
import { HumanMessage, AIMessage, SystemMessage } from "@langchain/core/messages";

export const chatNode = async (state) => {
    // 2. Extract the raw object
    const messages = state.messages.map((msg) => {
        switch (msg.role) {
            case "user":
                return new HumanMessage(msg.content);

            case "assistant":
                return new AIMessage(msg.content);

            case "system":
                return new SystemMessage(msg.content);

            default:
                return new HumanMessage(msg.content);
        }
    });

    // console.log("\nmessages that are forwaded to the LLM\n", messages, "\n")

    const response = await groqModel.invoke(messages);

    // Return the correctly formatted object to state
    return {
        messages: [
            {
                role: "assistant",
                content: response.content
            }
        ],
    };
};