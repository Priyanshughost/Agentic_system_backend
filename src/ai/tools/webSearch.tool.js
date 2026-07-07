import { TavilySearch } from "@langchain/tavily";
import { env } from "../../config/env.js"

export const webSearchTool =
    new TavilySearch({
        maxResults: 2,
        topic: "general",
        searchDepth: "advanced",
        includeAnswer: true,
        includeRawContent: false,
        tavilyApiKey: env.TAVILY_API_KEY
    });

webSearchTool.name = "web_search_tool";