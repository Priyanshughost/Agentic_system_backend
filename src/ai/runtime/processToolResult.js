import { ToolMessage } from "@langchain/core/messages";

export const processToolResult = ({
    toolCall,
    toolMessage
}) => {

    switch (toolCall.name) {

        case "web_search_tool":
            return processWebSearchResult({
                toolCall,
                toolMessage
            });

        default:
            return toolMessage;

    }

};

const processWebSearchResult = ({
    toolCall,
    toolMessage
}) => {

    let parsed;

    try {

        parsed = JSON.parse(toolMessage.content);

    }

    catch {

        // If parsing fails, don't interrupt execution.
        return toolMessage;

    }

    const compact = {

        answer: parsed.answer ?? "",

        sources: Array.isArray(parsed.results)
            ? parsed.results
                .slice(0, 3)
                .map(result => ({
                    title: result.title,
                    url: result.url
                }))
            : []

    };

    return new ToolMessage({

        tool_call_id: toolCall.id,

        name: toolMessage.name,

        content: JSON.stringify(compact)

    });

};