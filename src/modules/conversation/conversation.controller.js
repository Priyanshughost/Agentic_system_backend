import {
    getUserConversations,
    getConversationMessages,
} from "./conversation.service.js";


export const getUserConversationsController =
    async (
        req,
        res
    ) => {

        try {

            const conversations =
                await getUserConversations(
                    req.user.userId
                );

            res.status(200).json({
                success: true,
                data: conversations,
            });

        }
        catch (error) {

            res.status(500).json({
                success: false,
                message: error.message,
            });

        }
    };

export const getConversationMessagesController =
    async (
        req,
        res
    ) => {

        try {

            const messages =
                await getConversationMessages(
                    req.params.id,
                    req.user.userId
                );

            res.status(200).json({
                success: true,
                data: messages,
            });

        }
        catch (error) {

            res.status(500).json({
                success: false,
                message: error.message,
            });

        }
    };