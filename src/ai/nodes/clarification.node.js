import { gpt120b } from "../models/gpt-120b.js";
import { clarificationPrompt } from "../prompts/clarification.prompt.js";
import { z } from "zod";

const ClarificationSchema = z.object({
    requiresClarification: z.boolean(),
    questions: z.array(
        z.object({
            id: z.string().describe("A unique snake_case identifier for this question."),
            targetField: z.string().describe("Dot-notated property path inside the Intent Object that should receive the user's answer."),
            question: z.string().describe("The human-readable question."),
            required: z.boolean(),
            options: z.array(z.string()).describe("Provide 3-5 highly probable options for the user to choose from. Leave empty if a free-text answer is strictly required.")
        })
    )
});

const structuredModel =
    gpt120b.withStructuredOutput(
        ClarificationSchema
    );

export const clarificationNode =
    async (state) => {

        const clarification =
            await structuredModel.invoke([
                {
                    role: "system",
                    content: clarificationPrompt
                },
                {
                    role: "user",
                    content: JSON.stringify(
                        state.intent,
                        null,
                        2
                    )
                }
            ]);

        return {
            clarification
        };

    };