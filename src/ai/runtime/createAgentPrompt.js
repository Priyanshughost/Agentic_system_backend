export const createAgentPrompt = ({
    task,
    specification,
    inputs
}) => {

    if (!task) {
        throw new Error("Task is required.");
    }

    if (!specification) {
        throw new Error("Agent specification is required.");
    }

    if (!inputs) {
        throw new Error("Resolved inputs are required.");
    }

    return [
        {
            role: "system",
            content: specification.systemPrompt
        },
        {
            role: "user",
            content: JSON.stringify(
                {
                    task: {
                        id: task.id,
                        name: task.name,
                        objective: task.objective
                    },
                    inputs,
                    expectedOutput: task.expectedOutput
                },
                null,
                2
            )
        }
    ];

};