import {
    StateGraph,
    START,
    END,
} from "@langchain/langgraph";
import { intentNode } from "../nodes/intent.node.js";
import { architectNode } from "../nodes/architect.node.js";
import { agentSpecificationNode } from "../nodes/agentSpecification.node.js";
import { globalState } from "../state/globalState.js";
import { runtimeNode } from "../nodes/runtime.node.js";
import { responseGeneratorNode } from "../nodes/responseGenerator.node.js";

const workflow =
    new StateGraph(globalState);

workflow.addNode(
    "intentAnalyzer",
    intentNode
);

workflow.addNode(
    "metaArchitect",
    architectNode
);

workflow.addNode(
    "runtimeExecution",
    runtimeNode
);

workflow.addNode(
    "agentSpecificationGenerator",
    agentSpecificationNode
);

workflow.addNode(
    "responseGenerator",
    responseGeneratorNode
);

workflow.addEdge(
    START,
    "intentAnalyzer"
);

workflow.addEdge(
    "intentAnalyzer",
    "metaArchitect"
);

workflow.addEdge(
    "metaArchitect",
    "agentSpecificationGenerator"
);

workflow.addEdge(
    "agentSpecificationGenerator",
    "runtimeExecution"
);

workflow.addEdge(
    "runtimeExecution",
    "responseGenerator"
);

workflow.addEdge(
    "responseGenerator",
    END
);

export const testGraph =
    workflow.compile();
