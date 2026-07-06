import { ChatPromptTemplate } from "@langchain/core/prompts";

import { HumanMessage } from "@langchain/core/messages";

import { gpt120b } from "../models/gpt-120b.js";
import { gpt20b } from "../models/gpt-20b.js";

const MODEL_REGISTRY = {
    gpt120b,
    gpt20b,
};

export const createRuntimeAgent = ({
    task,
    specification,
}) => {

    const baseModel =
        MODEL_REGISTRY[
        specification.model
        ];

    if (!baseModel) {

        throw new Error(
            `Unknown runtime model: ${specification.model}`
        );

    }

    // Tool binding will happen here later
    const model = baseModel.bindTools( runtimeTools );

    const prompt =
        ChatPromptTemplate.fromMessages([
            [
                "system",
                specification.systemPrompt,
            ],
            [
                "human",
                "{input}",
            ],
        ]);

    const node = async (state) => {

        //----------------------------------------------------
        // Build runtime input from expectedInput
        //----------------------------------------------------

        const runtimeInput = {

            task: {

                id: task.id,

                objective: task.objective,

                successCriteria:
                    task.successCriteria,

            },

            input: {}

        };

        for (const key of task.expectedInput) {

            runtimeInput.input[key] =
                state.variables?.[key];

        }

        //----------------------------------------------------
        // Prompt -> Model
        //----------------------------------------------------

        const chain =
            prompt.pipe(model);

        const aiMessage =
            await chain.invoke({

                input: JSON.stringify(
                    runtimeInput,
                    null,
                    2
                ),

            });

        //----------------------------------------------------
        // Merge expected outputs
        //----------------------------------------------------

        let parsedOutput = {};

        try {

            parsedOutput =
                JSON.parse(
                    aiMessage.content
                );

        } catch {

            throw new Error(
                `${task.id} returned invalid JSON`
            );

        }

        //----------------------------------------------------
        // Validate expected outputs
        //----------------------------------------------------

        for (const key of task.expectedOutput) {

            if (!(key in parsedOutput)) {

                throw new Error(
                    `${task.id} did not return '${key}'`
                );

            }

        }

        //----------------------------------------------------
        // Return LangGraph state update
        //----------------------------------------------------

        return {

            variables: parsedOutput,

            currentTask: task.id,

            completedTasks: [
                task.id,
            ],

            lastResponse: aiMessage,

        };

    };

    return {

        id: task.id,

        task,

        specification,

        tools:
            task.requiredTools,

        toolStrategy:
            specification.toolStrategy,

        node,

    };

};