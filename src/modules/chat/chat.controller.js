import { generateResponse } from "./chat.service.js";
import { createConversationIfNeeded } from "../conversation/conversation.service.js";
import { saveMessage } from "../message/message.service.js";
import { generateConversationTitle } from "../conversation/title.service.js";

export const sendMessage = async (req, res) => {
    const { message, conversationId } = req.body;

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    try {
        const { conversation, isNew } = await createConversationIfNeeded(
            conversationId,
            req.user.userId,
            message
        );

        const actualConversationId = conversation._id;

        await saveMessage({
            conversationId: actualConversationId,
            role: "user",
            content: message,
        });

        let assistantResponse = "";

        const response = await generateResponse(
            message,
            req.user.userId,
            actualConversationId
        );

        // NEW: LangGraph now yields [mode, payload] because we requested multiple modes
        for await (const [mode, payload] of response) {

            // 1. Handle actual token generation
            if (mode === "messages") {
                const [chunk, metadata] = payload;
                if (!chunk?.content) continue;

                assistantResponse += chunk.content;

                res.write(
                    `data: ${JSON.stringify({
                        type: "content", // Flag as content
                        role: "assistant",
                        content: chunk.content,
                    })}\n\n`
                );
            }
            // 2. Handle graph node transitions / tools
            else if (mode === "updates") {
                // payload is an object where the key is the active node name
                const activeNode = Object.keys(payload)[0];
                console.log(activeNode)
                // Ignore the generic end node
                if (activeNode && activeNode !== "__end__") {
                    res.write(
                        `data: ${JSON.stringify({
                            type: "status", // Flag as status
                            status: `Processing ${activeNode}...`,
                        })}\n\n`
                    );
                }
            }
        }

        await saveMessage({
            conversationId: actualConversationId,
            role: "assistant",
            content: assistantResponse,
        });

        if (isNew) {
            try {
                // FIX 1: Map the variables to the correct keys expected by the service
                const title = await generateConversationTitle({
                    conversationId: actualConversationId,
                    userMessage: message,
                });

                if (title) {

                    res.write(
                        `data: ${JSON.stringify({
                            conversation: {
                                _id: conversation._id,
                                title,
                                createdAt: conversation.createdAt,
                            },
                        })}\n\n`
                    );
                }
            }
            catch (error) {
                // FIX 2: Change 'err' to 'error'
                console.error("Title generation failed", error);
            }
        }

        res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
        res.end();

    } catch (error) {
        console.error(error);
        res.write(
            `data: ${JSON.stringify({
                role: "assistant",
                error: error.message,
            })}\n\n`
        );
        res.end();
    }
};