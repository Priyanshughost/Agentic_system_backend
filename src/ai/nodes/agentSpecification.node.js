import { z } from "zod";
import { agentSpecificationPrompt } from "../prompts/agentSpecification.prompt.js";
import { gpt120b } from "../models/gpt-120b.js";

const AgentSpecificationSchema = z.object({

    taskId: z.string().describe("Must exactly match the 'id' of the task from the blueprint."),

    persona: z.string().describe(
        "Concise professional identity (2–4 words), e.g. 'Transportation Planner', 'Database Architect', 'Research Analyst'."
    ),

    role: z.string().describe("The specific technical or operational job title of this agent (e.g., 'Database Architect', 'API Integration Specialist')."),

    systemPrompt: z.string().describe(
        "Concise detailed runtime system instructions following this structure: Objective, Inputs, Outputs, Rules. Avoid repeating information already present in the Blueprint."
    ),

    model: z.string().describe("The specific LLM identifier best suited for this agent's complexity."),

    temperature: z.number().min(0).max(1).describe("The creativity threshold. Use 0 for strict determinism (code/math), higher for creative/generative tasks."),

    toolStrategy: z.enum([
        "NONE",
        "AUTO",
        "REQUIRED"
    ]).describe("Defines whether this agent is allowed, forced, or forbidden to trigger bound capabilities/tools."),

    maxIterations: z.number().int().positive().describe("The hard limit on reasoning loops this agent can perform before forcefully returning control to the graph."),

})

const structuredModel =
    gpt120b.withStructuredOutput(
        AgentSpecificationSchema,
        { name: "generate_agent_specification" }
    );

export const agentSpecificationNode = async (state) => {

    console.log(
        "🧬 Agent Specification Generator is creating runtime agent specifications..."
    );

    const specifications = [];

    for (const task of state.blueprint.tasks) {

        console.log(
            `🧬 Generating specification for: ${task.name}`
        );

        const specification =
            await structuredModel.invoke([
                {
                    role: "system",
                    content: agentSpecificationPrompt
                },
                {
                    role: "user",
                    content: JSON.stringify({
                        task,
                        blueprintMetadata:
                            state.blueprint.metadata,
                        execution:
                            state.blueprint.execution,
                        constraints:
                            state.blueprint.constraints
                    })
                }
            ]);

        specifications.push(specification);

    }

    return {
        specifications
    };

};