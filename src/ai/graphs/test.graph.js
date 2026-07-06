import {
    StateGraph,
    START,
    END,
} from "@langchain/langgraph";
import { intentNode } from "../nodes/intent.node";
import { clarificationNode } from "../nodes/clarification.node";
import { architectNode } from "../nodes/architect.node";

const workflow =
    new StateGraph(ChatState);

workflow.addNode(
    "intent",
    intentNode
);

workflow.addNode(
    "clarification",
    clarificationNode
)

workflow.addNode(
    "architect",
    architectNode
)

workflow.addEdge(
    START,
    "intent"
);

workflow.addEdge(
    "architect",
    END
);

export const chatGraph =
    workflow.compile();
