export const resolveInputs = ({
    task,
    state
}) => {

    if (!task) {
        throw new Error("Task is required.");
    }

    if (!state) {
        throw new Error("Runtime state is required.");
    }

    const resolvedInputs = {};

    for (const input of task.expectedInput) {

        // Variables produced by previous runtime agents
        if (input in state.variables) {

            resolvedInputs[input] =
                state.variables[input];

            continue;

        }

        throw new Error(
            `Missing required runtime input "${input}" for task "${task.id}".`
        );

    }

    return resolvedInputs;

};