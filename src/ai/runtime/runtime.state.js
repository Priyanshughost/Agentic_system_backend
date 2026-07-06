import { Annotation } from "@langchain/langgraph";

export const RuntimeState = Annotation.Root({
    outputs: Annotation({
        reducer: (current, update) => ({
            ...current,
            ...update,
        }),
        default: () => ({}),
    }),
});