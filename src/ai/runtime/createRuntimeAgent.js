import { MODEL_REGISTRY } from "../models/registry.js";
import { resolveInputs } from "./inputResolver.js";
import { createAgentPrompt } from "./createAgentPrompt.js";
import { mergeOutputs } from "./outputMerger.js";
import { parseRuntimeOutput } from "./parseRuntimeOutput.js";
import { ToolMessage } from "@langchain/core/messages";
import { processToolResult } from "./processToolResult.js";
import { retryWithRateLimit } from "../../utils/retryWithRateLimit.js";
import { extractHallucinatedJsonTool } from "../../utils/extractHallucinatedJsonTool.js";

export const createRuntimeAgent = ({
    task,
    specification,
    tools
}) => {

    return async (state) => {
        // console.log("\nInside the runtime agent node\n printing state\n")
        // console.dir(state, { depth: null })
        // console.log("\n\n")
        console.log("====================================");
        console.log(`🤖 ${task.name}`);
        console.log("====================================");

        // ---------------------------------
        // Resolve Inputs
        // ---------------------------------
        const inputs = resolveInputs({
            task,
            state
        });

        // ---------------------------------
        // Build Prompt
        // ---------------------------------
        const messages = createAgentPrompt({
            task,
            specification,
            inputs
        });

        const toolMap = new Map(
            tools.map(tool => [tool.name, tool])
        );

        // ---------------------------------
        // Resolve Model
        // ---------------------------------
        const model = MODEL_REGISTRY[specification.model];

        if (!model) {
            throw new Error(`Unknown model "${specification.model}".`);
        }

        // ---------------------------------
        // Invoke LLM Configuration
        // ---------------------------------
        let llm;

        if (
            specification.toolStrategy === "NONE"
        ) {

            llm = model;

        } else {

            llm = model.bindTools(tools);

        }
        let conversation = [...messages];
        let toolCalls = 0;
        const toolCache = new Map();

        let iteration = 1; // Used just for logging now

        // Removed the maxIterations bound. It will loop until it decides it is finished.
        while (true) {
            console.log(`\n  [Iteration ${iteration}] 🧠 Invoking LLM... (Context length: ${conversation.length} messages)`);
            let response
            try {

                response = await retryWithRateLimit(() =>
                    llm.invoke(conversation)
                );

            }
            catch (error) {

                const recovered = extractHallucinatedJsonTool(error);

                if (!recovered) {
                    throw error;
                }

                console.log("⚠️ Recovered hallucinated JSON tool.");

                response = JSON.stringify(recovered)
            }

            conversation.push(response);

            // ---------------------------------
            // EXIT CONDITION: No valid tools requested

            if (!response.tool_calls?.length) {
                console.log(`  [Iteration ${iteration}] 🏁 LLM finished thinking. Parsing final output...`);

                console.log(`\n===================\n${JSON.stringify(response, null, 2)}\n===================\n`);

                const output = parseRuntimeOutput({
                    task,
                    response
                });

                return mergeOutputs({
                    task,
                    state,
                    output
                });
            }

            // ---------------------------------
            // TOOL EXECUTION
            // ---------------------------------
            for (const toolCall of response.tool_calls) {
                console.log(`    -> 🔍 Executing: ${toolCall.name}`);
                console.log(`    -> 📝 Arguments: ${JSON.stringify(toolCall.args)}`);
                const cacheKey = `${toolCall.name}:${JSON.stringify(toolCall.args)}`;

                // ---------------------------------
                // Duplicate Tool Detection
                // ---------------------------------
                if (toolCache.has(cacheKey)) {
                    console.log("    -> ♻️ Using cached tool result.");
                    conversation.push(toolCache.get(cacheKey));
                    continue;
                }

                const tool = toolMap.get(toolCall.name);

                if (!tool) {
                    throw new Error(`Unknown tool "${toolCall.name}".`);
                }

                const rawToolMessage = await tool.invoke(toolCall);

                const toolMessage = processToolResult({
                    toolCall,
                    toolMessage: rawToolMessage
                });

                toolCache.set(cacheKey, toolMessage);
                toolCalls++;

                console.log("\ntool message\n");
                console.dir(toolMessage, { depth: null });
                console.log("\n");

                const dataLength = typeof toolMessage.content === "string"
                    ? toolMessage.content.length
                    : JSON.stringify(toolMessage.content).length;

                console.log(`    -> ✅ Tool retrieved ${dataLength} characters of data.\n`);

                conversation.push(toolMessage);
            }

            iteration++;
        }
    };
};