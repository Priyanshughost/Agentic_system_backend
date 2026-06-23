import {
    generateResponse,
} from "./chat.service.js";

export const sendMessage = async (
    req,
    res
) => {

    const {
        message,
        threadId,
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

        const response =
            await generateResponse(
                message,
                req.user.userId
            );

        for await (const [chunks, metadata] of response) {
            if (!chunks?.content) continue;
            res.write(
                `data: ${JSON.stringify({
                    role: "assistant",
                    content: chunks.content,
                })}\n\n`
            );
        }
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