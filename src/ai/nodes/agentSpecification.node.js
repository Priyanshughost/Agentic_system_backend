import { z } from "zod";
import { agentSpecificationPrompt } from "../prompts/agentSpecification.prompt.js";
import { gpt120b } from "../models/gpt-120b.js";
import { llama22m } from "../models/llama-22m.js";
import { llama86m } from "../models/llama-86m.js";
import { llama17b } from "../models/llama-17b.js";
import { qwen27b } from "../models/qwen27b.js";
import { retryWithRateLimit } from "../../utils/retryWithRateLimit.js";

const AgentSpecificationSchema = z.object({
    taskId: z.string().describe("Must exactly match the 'id' of the task from the blueprint."),

    persona: z.string().describe("Concise professional identity (2–4 words), e.g. 'Transportation Planner', 'Database Architect'."),

    role: z.string().describe("The specific technical or operational job title of this agent."),

    // UPDATE THIS DESCRIPTION
    systemPrompt: z.string().describe("A production-ready multi-line instruction containing exactly these sections: Objective, Inputs, Outputs, Rules, and CRITICAL OUTPUT CONTRACT. The contract must require returning ONLY valid JSON whose top-level keys exactly match every expected output field of the task."),

    model: z.string().describe("The specific LLM identifier best suited for this agent's complexity."),

    temperature: z.number().min(0).max(1).describe("The creativity threshold. Use 0 for strict determinism, higher for generative tasks."),

    toolStrategy: z.enum(["NONE", "AUTO", "REQUIRED"]).describe("Defines whether this agent is allowed, forced, or forbidden to trigger tools."),

    // UPDATE THIS DESCRIPTION
    maxIterations: z.number().int().positive().max(10).describe("Keep this very low (e.g., 3, 5, or 7) for safety. Never exceed 10.")
});

const structuredModel =
    llama17b.withStructuredOutput(
        AgentSpecificationSchema,
        { name: "generate_agent_specification" }
    );

export const agentSpecificationNode = async (state) => {
    console.log("\nInside the agent specification node\n printing state\n")
    console.dir(state, { depth: null })
    console.log("\n\n")

    console.log(
        "🧬 Agent Specification Generator is creating runtime agent specifications..."
    );

    const specifications = [];

    for (const task of state.blueprint.tasks) {

        console.log(
            `🧬 Generating specification for: ${task.name}`
        );

        const requiredJsonFormat = Object.fromEntries(
            task.expectedOutput.map(key => [key, "<value>"])
        );

        const specification = await retryWithRateLimit(() =>
            structuredModel.invoke([
                {
                    role: "system",
                    content: agentSpecificationPrompt
                },
                {
                    role: "user",
                    content: JSON.stringify({
                        task,
                        blueprintMetadata: state.blueprint.metadata,
                        execution: state.blueprint.execution,
                        constraints: state.constraints,
                        requiredJsonFormat
                    })
                }
            ])
        );
        // console.dir(specification, {depth: null})
        specifications.push(specification);

    }

    return {
        specifications
    };

};