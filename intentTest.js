import { intentNode } from "./src/ai/nodes/intent.node.js";
const state = {
    userQuery: `
Plan a 14-day trip across Japan with a maximum budget of $2500.

Optimize transportation, accommodations, sightseeing, food, and travel time.

Produce a day-by-day itinerary.
`
};

try {
    const result = await intentNode(state);

    console.log("\n========== INTENT ==========\n");
    console.dir(result.intent, {
        depth: null,
        colors: true
    });
} catch (error) {
    console.error(error);
}