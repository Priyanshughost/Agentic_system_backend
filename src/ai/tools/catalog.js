export const TOOL_CATALOG = [
    {
        name: "web_search_tool",
        description:
            "Executes live web searches to retrieve current information."
    }
];

export const AVAILABLE_TOOL_NAMES =
    TOOL_CATALOG.map(tool => tool.name);