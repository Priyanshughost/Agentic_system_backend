import { MODEL_REGISTRY } from "../models/registry.js";
import { resolveInputs } from "./inputResolver.js";
import { createAgentPrompt } from "./createAgentPrompt.js";
import { mergeOutputs } from "./outputMerger.js";
import { parseRuntimeOutput } from "./parseRuntimeOutput.js";
import { ToolMessage } from "@langchain/core/messages";
import { processToolResult } from "./processToolResult.js";

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const createRuntimeAgent = ({
    task,
    specification,
    tools
}) => {

    return async (state) => {

        console.log("");
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
        const llm = model.bindTools(tools);
        let conversation = [...messages];
        let toolCalls = 0;
        const toolCache = new Map();

        let iteration = 1; // Used just for logging now

        // Removed the maxIterations bound. It will loop until it decides it is finished.
        while (true) {
            console.log(`\n  [Iteration ${iteration}] 🧠 Invoking LLM... (Context length: ${conversation.length} messages)`);

            // ---------------------------------
            // Invoke LLM with Smart Rate Limit Catching
            // ---------------------------------
            let response;
            while (true) {
                try {
                    response = await llm.invoke(conversation);
                    break;
                } catch (error) {
                    if (error.message && error.message.includes("429") && error.message.includes("Please try again in")) {
                        const match = error.message.match(/try again in ([\d\.]+)s/);
                        const waitSeconds = match ? parseFloat(match[1]) : 15;
                        const waitMs = (waitSeconds * 1000) + 1000;

                        console.log(`\n  ⚠️ GROQ RATE LIMIT HIT!`);
                        console.log(`  ⏱️ Sleeping for ${waitSeconds} seconds before automatically retrying...`);
                        await sleep(waitMs);
                        console.log(`  🔄 Retrying LLM invocation...`);
                    } else {
                        throw error;
                    }
                }
            }

            conversation.push(response);

            // ---------------------------------
            // EXIT CONDITION: No tools requested
            // ---------------------------------
            if (!response.tool_calls?.length) {
                console.log(`  [Iteration ${iteration}] 🏁 LLM finished thinking. Parsing final output...`);
                let output;

                try {
                    output = parseRuntimeOutput({
                        task,
                        response
                    });
                } catch {
                    throw new Error(`Task "${task.id}" returned invalid JSON.`);
                }

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