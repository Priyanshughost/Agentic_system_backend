export const parseRuntimeOutput = ({
    task,
    response
}) => {

    let parsed;

    try {

        parsed =
            JSON.parse(response.content);

    }

    catch {

        throw new Error(
            `Task "${task.id}" returned invalid JSON.`
        );

    }

    for (const key of task.expectedOutput) {

        if (!(key in parsed)) {

            throw new Error(
                `Task "${task.id}" is missing required output "${key}".`
            );

        }

    }

    return parsed;

};