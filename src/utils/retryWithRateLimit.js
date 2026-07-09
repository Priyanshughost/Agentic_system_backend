const sleep = (ms) =>
    new Promise(resolve => setTimeout(resolve, ms));

export const retryWithRateLimit = async (operation) => {
    while (true) {
        try {
            return await operation();
        } catch (error) {
            const message = error?.message ?? "";

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

                console.log("\n====================================");
                console.log("⚠️  GROQ RATE LIMIT");
                console.log(`⏳ Waiting ${seconds}s...`);
                console.log("====================================\n");

                await sleep(waitTime);

                console.log("🔄 Retrying...\n");

                continue;
            }

            throw error;
        }
    }
};