import { Annotation } from "@langchain/langgraph";

export const globalState = Annotation.Root({

    userQuery: Annotation({
        reducer: (_, value) => value,
        default: () => ""
    }),

    intent: Annotation({
        reducer: (_, value) => value,
        default: () => null
    }),

    clarification: Annotation({
        reducer: (_, value) => value,
        default: () => null
    }),

    blueprint: Annotation({
        reducer: (_, value) => value,
        default: () => null
    }),

    specifications: Annotation({
        reducer: (_, value) => value,
        default: () => []
    }),

    finalOutput: Annotation({
        reducer: (_, value) => value,
        default: () => []
    })

});