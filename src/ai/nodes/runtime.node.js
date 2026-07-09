import e from "express";
import { runtimeExecutor } from "../runtime/runtimeExecutor.js";

export const runtimeNode = async (state) => {
    console.log("\n[Runtime Node] Initiating dynamic graph execution...\n");
    console.dir(state, { depth: null })
    console.log("\n\n")

    // 1. Extract the generated artifacts from your parent graph's state
    const { blueprint, specifications, intent, userQuery } = state;

    // 2. Define the initial state that your generated graph expects.
    // Usually, this is the original intent so the dynamic agents know what to do.
    const initialRuntimeState = {
        variables: {
            intent: intent,
            raw_query: userQuery // Passing the raw string is highly recommended
        }
    };

    // 3. Fire the executor
    const finalRuntimeState = await runtimeExecutor({
        blueprint,
        specifications,
        initialState: initialRuntimeState
    });

    // 4. Return the results to append to the parent globalState
    return {
        // Ensure your globalState definition has a key for this (e.g., 'finalOutput' or 'dynamicState')
        finalOutput: finalRuntimeState
    };
};