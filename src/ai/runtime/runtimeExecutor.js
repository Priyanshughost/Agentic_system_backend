import { compileRuntimeGraph } from "../compiler/compileRuntimeGraph.js";

export const runtimeExecutor = async ({
    blueprint,
    specifications,
    initialState
}) => {

    if (!blueprint) {
        throw new Error("Blueprint is required.");
    }

    if (!specifications) {
        throw new Error("Agent specifications are required.");
    }

    console.log("");
    console.log("========================================");
    console.log("🚀 Runtime Graph Compilation");
    console.log("========================================");

    const runtimeGraph =
        compileRuntimeGraph({
            blueprint,
            specifications
        });

    console.log("✅ Runtime graph compiled.");

    console.log("");
    console.log("========================================");
    console.log("🚀 Runtime Graph Execution");
    console.log("========================================");

    const finalState =
        await runtimeGraph.invoke(initialState);

    console.log("");

    console.log("========================================");
    console.log("✅ Runtime Execution Finished");
    console.log(`====================\n${finalState}\n====================`);

    return finalState;

};