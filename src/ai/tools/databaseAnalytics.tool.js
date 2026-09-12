import { tool } from "@langchain/core/tools";
import { z } from "zod";
import Conversation from "../../modules/conversation/conversation.model.js";
import { logger } from "../../utils/logger.js";
import mongoose from "mongoose";

export const databaseAnalyticsTool = tool(
    async (args) => {
        try {
            logger.info(`📊 Running Database Analytics: ${args.query_type}`);
            
            // Ensure DB is connected
            if (mongoose.connection.readyState !== 1) {
                return "Database is not currently connected.";
            }

            if (args.query_type === "total_conversations") {
                const count = await Conversation.countDocuments();
                return `There are currently ${count} conversations stored in the database.`;
            } 
            else if (args.query_type === "recent_conversations") {
                const limit = args.limit || 5;
                const recent = await Conversation.find()
                    .sort({ updatedAt: -1 })
                    .limit(limit)
                    .select('title createdAt')
                    .lean();
                
                if (recent.length === 0) return "No recent conversations found.";
                
                const formatted = recent.map((c, i) => `${i+1}. "${c.title}" (Created: ${new Date(c.createdAt).toLocaleDateString()})`).join('\n');
                return `Here are the ${recent.length} most recent conversations:\n${formatted}`;
            }
            
            return `Unknown query_type: ${args.query_type}. Supported types are "total_conversations" and "recent_conversations".`;

        } catch (error) {
            logger.error(`❌ Database Analytics Error: ${error.message}`);
            return `Failed to execute database query: ${error.message}`;
        }
    },
    {
        name: "database_analytics_tool",
        description: "Executes read-only analytical queries against the local application MongoDB database to get statistics about conversations.",
        schema: z.object({
            query_type: z.enum(["total_conversations", "recent_conversations"]).describe("The type of statistic to retrieve."),
            limit: z.number().optional().describe("Optional limit for 'recent_conversations' (default 5).")
        })
    }
);
