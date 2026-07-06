import "dotenv/config"; // Or your dotenvx setup
import { architectNode } from "./src/ai/nodes/architect.node.js";

async function testArchitect() {
    console.log("📐 Initializing Meta-Architect Node...");
    console.log("🧠 Architect is designing the workflow (this may take a few seconds)...");

    // 1. Mock the state using the exact Intent payload
    const mockState = {
        intent: {
            goal: 'Plan a 14-day trip across Japan with a maximum budget of $2500, optimizing transportation, accommodations, sightseeing, food, and travel time, and produce a day-by-day itinerary.',
            problemDomain: ['Travel', 'Tourism'],
            technologies: [],
            features: [
                'transportation optimization',
                'accommodation optimization',
                'sightseeing planning',
                'food budgeting',
                'travel time optimization'
            ],
            intentCategory: 'CREATE',
            taskType: 'PLANNING',
            constraints: ['Maximum budget of $2500'],
            inputs: [],
            expectedOutput: 'Day-by-day itinerary',
            ambiguities: [
                'Starting location not specified',
                'Personal preferences (e.g., food, activities) not specified'
            ],
            requiresClarification: false,
            complexity: { reasoning: 'HIGH', execution: 'HIGH', overall: 'HIGH' },
            confidence: {
                goal: 0.95,
                technologies: 0.95,
                constraints: 0.95,
                expectedOutput: 0.95,
                taskType: 0.95,
                overall: 0.95
            }
        },
        
    };

    try {
        // 2. Execute the node
        const result = await architectNode(mockState);

        // 3. Output the structured JSON Blueprint
        console.log("\n========== BLUEPRINT OUTPUT ==========\n");
        console.log(JSON.stringify(result.blueprint, null, 2));
        console.log("\n======================================\n");

        if (result.error) {
            console.error("⚠️ Node reported a graceful error state:", result.error);
        }

    } catch (error) {
        console.error("❌ Architect Node threw a fatal error:", error);
    }
}

testArchitect();