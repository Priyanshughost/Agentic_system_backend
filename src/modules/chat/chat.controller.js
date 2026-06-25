import {
    generateResponse,
} from "./chat.service.js";
import {
    createConversationIfNeeded,
} from "../conversation/conversation.service.js";

import {
    saveMessage,
} from "../message/message.service.js";

export const sendMessage = async (
    req,
    res
) => {

    const {
        message,
        threadId,
        conversationId
    } = req.body;

    res.setHeader(
        "Content-Type",
        "text/event-stream"
    );

    res.setHeader(
        "Cache-Control",
        "no-cache"
    );

    res.setHeader(
        "Connection",
        "keep-alive"
    );

    try {
        const {
            conversation,
            isNew,
        } =
            await createConversationIfNeeded(
                conversationId,
                req.user.userId,
                message
            );

        const actualConversationId =
            conversation._id;

        await saveMessage({
            conversationId:
                actualConversationId,
            role: "user",
            content: message,
        });

        let assistantResponse = "";

        if (isNew) {

            res.write(
                `data: ${JSON.stringify({
                    conversation: {
                        _id: conversation._id,
                        title: conversation.title,
                        createdAt:
                            conversation.createdAt,
                    },
                })}\n\n`
            );

        }

        const response =
            await generateResponse(
                message,
                req.user.userId
            );

        for await (const [chunks, metadata] of response) {
            if (!chunks?.content) continue;

            assistantResponse += chunks.content;

            res.write(
                `data: ${JSON.stringify({
                    role: "assistant",
                    content: chunks.content,
                })}\n\n`
            );
        }

        await saveMessage({
            conversationId:
                actualConversationId,
            role: "assistant",
            content:
                assistantResponse,
        });

        res.write(
            `data: ${JSON.stringify({
                done: true,
            })}\n\n`
        );
        res.end();
    }
    catch (error) {
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