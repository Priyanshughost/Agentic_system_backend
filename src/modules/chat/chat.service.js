import { chatGraph } from "../../ai/graphs/chat.graph.js";

export const generateResponse = async (
        message,
        userId,
        conversationId
    ) => {
    const formattedMessage = typeof message === "string"
        ? { role: "user", content: message }
        : message;
    // const currentState = await chatGraph.getState({ configurable: { thread_id: "1" } });
    // console.log("--- CHECKPOINTER MEMORY ---");
    // console.dir(currentState, { depth: null });
    // console.log("---------------------------");


    return chatGraph.stream(
        {
            messages: [formattedMessage],
        },
        {
            configurable: {
            thread_id: `${userId}:${conversationId.toString()}`,
            },
            
            streamMode: ["messages", "updates"]
        }
    );
};