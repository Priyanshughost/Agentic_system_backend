import { logger } from "./logger.js";

const sleep = (ms) =>
    new Promise(resolve => setTimeout(resolve, ms));

export const retryWithRateLimit = async (operation) => {
    let jsonRetries = 0;
    while (true) {
        try {
            return await operation();
        } catch (error) {
            const message = error?.message ?? "";
            const status = error?.status || error?.status_code || error?.error?.status_code || error?.error?.status;
            
            // Handle Groq structured output / tool calling JSON parse failures
            if (
                status === 400 && 
                (message.includes("json_validate_failed") || message.includes("Failed to parse tool call arguments") || message.includes("tool_use_failed")) &&
                jsonRetries < 3
            ) {
                jsonRetries++;
                logger.warn(`⚠️ JSON Validation/Parse Failed from API. Retrying (${jsonRetries}/3)...`);
                await sleep(1000); // Wait 1 second before retrying
                continue;
            }

            // Handle Groq 429 rate limits
            if (
                error?.status === 429 ||
                message.includes("Please try again in")
            ) {
                const match = message.match(/try again in ([\d.]+)s/i);

                const seconds = match
                    ? Number(match[1])
                    : 10;

                const waitTime = Math.ceil(seconds * 1000) + 1000;

                logger.warn(`⚠️ GROQ RATE LIMIT. Waiting ${seconds}s...`);

                await sleep(waitTime);

                logger.info("🔄 Retrying after rate limit...");

                continue;
            }

            throw error;
        }
    }
}