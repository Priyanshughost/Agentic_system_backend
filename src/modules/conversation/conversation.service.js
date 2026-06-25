import Conversation from "./conversation.model.js";
import Message from "../message/message.model.js";

export const createConversationIfNeeded =
    async (
        conversationId,
        userId,
        firstMessage
    ) => {

        if (conversationId) {

            const conversation =
                await Conversation.findById(
                    conversationId
                );

            return {
                conversation,
                isNew: false,
            };
        }

        const conversation =
            await Conversation.create({
                userId,
                title:
                    firstMessage.slice(0, 50),
            });

        return {
            conversation,
            isNew: true,
        };
    };

export const getUserConversations =
    async (userId) => {

        return Conversation
            .find({
                userId,
            })
            .sort({
                updatedAt: -1,
            });
    };

export const getConversationMessages =
    async (
        conversationId,
        userId
    ) => {

        const conversation =
            await Conversation.findOne({
                _id: conversationId,
                userId,
            });

        if (!conversation) {
            throw new Error(
                "Conversation not found"
            );
        }

        return Message
            .find({
                conversationId,
            })
            .sort({
                createdAt: 1,
            });
    };