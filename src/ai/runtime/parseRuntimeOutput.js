export const parseRuntimeOutput = ({ task, response }) => {
    let parsed;

    // 1. Ensure we have a string to parse (LangChain sometimes passes complex message objects)
    const rawContent = typeof response === 'string' ? response : (response?.content || "");

    // --------------------------------------------------
    // Phase 1: Bulletproof Extraction
    // --------------------------------------------------
    try {
        // Strip out any markdown formatting or stray backticks
        const cleanText = rawContent
            .replace(/```json/gi, '')
            .replace(/```/gi, '')
            .trim();

        // Extract strictly what is between the first '{' and the last '}'
        const jsonMatch = cleanText.match(/\{[\s\S]*\}/);

        if (!jsonMatch) {
            throw new Error("No JSON object found in the response string.");
        }

        parsed = JSON.parse(jsonMatch[0]);

    } catch (error) {
        console.error(`\n❌ Failed to parse raw output for "${task.id}":`, error.message);
        throw new Error(`Task "${task.id}" returned invalid JSON.`);
    }

    // --------------------------------------------------
    // Phase 2: The "Unwrapper" (Handling LLM Nesting)
    // --------------------------------------------------
    let dataToValidate = parsed;
    const topLevelKeys = Object.keys(parsed);

    // If the task expects specific outputs, check if they are nested inside a wrapper key
    if (task.expectedOutput && task.expectedOutput.length > 0) {
        const hasRootKeys = task.expectedOutput.every(key => key in parsed);

        // If the expected keys aren't at the root, AND there's exactly one wrapper key...
        if (!hasRootKeys && topLevelKeys.length === 1) {
            const wrapperKey = topLevelKeys[0];

            // Unpack the wrapper if it contains an object
            if (typeof parsed[wrapperKey] === 'object' && parsed[wrapperKey] !== null) {
                console.log(`    -> 📦 Unwrapping nested payload from key: "${wrapperKey}"`);
                dataToValidate = parsed[wrapperKey];
            }
        }
    }

    // --------------------------------------------------
    // Phase 3: Validation
    // --------------------------------------------------
    for (const key of task.expectedOutput) {
        if (!(key in dataToValidate)) {
            throw new Error(
                `Task "${task.id}" is missing required output "${key}". Found keys: ${Object.keys(dataToValidate).join(", ")}`
            );
        }
    }

    // Return the clean, flat object so mergeOutputs can map it directly to state.variables
    return dataToValidate;
};