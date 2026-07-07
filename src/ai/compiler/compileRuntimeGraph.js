import {
    StateGraph,
    START,
    END,
    Annotation
} from "@langchain/langgraph";

import { createRuntimeAgent } from "../runtime/createRuntimeAgent.js";
import { RuntimeState } from "../runtime/runtime.state.js";
import { TOOL_REGISTRY } from "../tools/registry.js";

export const compileRuntimeGraph = ({
    blueprint,
    specifications
}) => {

    if (!blueprint) {
        throw new Error("Blueprint is required.");
    }

    if (!specifications) {
        throw new Error("Agent specifications are required.");
    }

    const workflow =
        new StateGraph(RuntimeState);

    // ----------------------------------------------------
    // Fast Specification Lookup
    // ----------------------------------------------------

    const specificationMap =
        new Map(
            specifications.map(spec => [
                spec.taskId,
                spec
            ])
        );

    // ----------------------------------------------------
    // Create Runtime Nodes
    // ----------------------------------------------------

    for (const task of blueprint.tasks) {

        const specification =
            specificationMap.get(task.id);

        const tools = task.requiredTools.map(name => {

            const tool = TOOL_REGISTRY[name];

            if (!tool) {

                throw new Error(
                    `Unknown runtime tool "${name}".`
                );

            }

            return tool;

        });

        if (!specification) {

            throw new Error(
                `Missing specification for task "${task.id}".`
            );

        }

        workflow.addNode(
            task.id,
            createRuntimeAgent({
                task,
                specification,
                tools
            })
        );

    }

    // ----------------------------------------------------
    // Create Runtime Edges
    // ----------------------------------------------------

    for (const edge of blueprint.edges) {

        const from =
            edge.from === "START"
                ? START
                : edge.from;

        const to =
            edge.to === "END"
                ? END
                : edge.to;

        // Conditional routing comes later.
        // For now we only support linear edges.

        workflow.addEdge(
            from,
            to
        );

    }

    return workflow.compile();

};