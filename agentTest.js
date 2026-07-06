import { agentSpecificationNode } from "./src/ai/nodes/agentSpecification.node.js";


// Truncated to exactly 3 tasks with re-wired edges for a valid test pass
const mockState = {
    blueprint: {
        "metadata": {
            "id": "japan_trip_planner",
            "version": "1.0.0",
            "generatedFrom": "Intent Object",
            "complexity": "HIGH"
        },
        "execution": {
            "entryTask": "initialize_trip_planner",
            "allowParallel": false,
            "allowLoops": false,
            "maxRetries": 3,
            "maxTasks": 7
        },
        "tasks": [
            {
                "id": "initialize_trip_planner",
                "name": "Initialize Trip Planner",
                "objective": "Define the scope and constraints of the trip planning task",
                "rationale": "Establish the foundation for the trip planning process",
                "requiredTools": [
                    "web_search_tool"
                ],
                "dependencies": [],
                "expectedInput": [
                    "intent",
                    "clarification",
                    "available_system_tools"
                ],
                "expectedOutput": [
                    "trip_parameters"
                ],
                "successCriteria": [
                    "trip_parameters defined"
                ]
            },
            {
                "id": "research_destination_options",
                "name": "Research Destination Options",
                "objective": "Gather information on potential destinations in Japan",
                "rationale": "Inform the trip planning process with relevant destination information",
                "requiredTools": [
                    "web_search_tool"
                ],
                "dependencies": [
                    "initialize_trip_planner"
                ],
                "expectedInput": [
                    "trip_parameters"
                ],
                "expectedOutput": [
                    "destination_options"
                ],
                "successCriteria": [
                    "at least 5 destination options identified"
                ]
            },
            {
                "id": "optimize_transportation",
                "name": "Optimize Transportation",
                "objective": "Determine the most efficient transportation options between destinations",
                "rationale": "Minimize travel time and costs",
                "requiredTools": [
                    "web_search_tool"
                ],
                "dependencies": [
                    "research_destination_options"
                ],
                "expectedInput": [
                    "destination_options"
                ],
                "expectedOutput": [
                    "transportation_plan"
                ],
                "successCriteria": [
                    "transportation plan defined"
                ]
            },
            {
                "id": "plan_accommodations",
                "name": "Plan Accommodations",
                "objective": "Book accommodations that meet the trip parameters and budget",
                "rationale": "Ensure comfortable and affordable accommodations",
                "requiredTools": [
                    "web_search_tool"
                ],
                "dependencies": [
                    "optimize_transportation"
                ],
                "expectedInput": [
                    "transportation_plan"
                ],
                "expectedOutput": [
                    "accommodation_plan"
                ],
                "successCriteria": [
                    "accommodation plan defined"
                ]
            },
            {
                "id": "plan_sightseeing",
                "name": "Plan Sightseeing",
                "objective": "Create a sightseeing itinerary that meets the trip parameters and budget",
                "rationale": "Maximize the trip's cultural and entertainment value",
                "requiredTools": [
                    "web_search_tool"
                ],
                "dependencies": [
                    "plan_accommodations"
                ],
                "expectedInput": [
                    "accommodation_plan"
                ],
                "expectedOutput": [
                    "sightseeing_itinerary"
                ],
                "successCriteria": [
                    "sightseeing itinerary defined"
                ]
            },
            {
                "id": "plan_food_and_activities",
                "name": "Plan Food and Activities",
                "objective": "Create a plan for food and activities that meets the trip parameters and budget",
                "rationale": "Enhance the trip's overall experience",
                "requiredTools": [
                    "web_search_tool"
                ],
                "dependencies": [
                    "plan_sightseeing"
                ],
                "expectedInput": [
                    "sightseeing_itinerary"
                ],
                "expectedOutput": [
                    "food_and_activities_plan"
                ],
                "successCriteria": [
                    "food and activities plan defined"
                ]
            },
            {
                "id": "generate_day_by_day_itinerary",
                "name": "Generate Day-by-Day Itinerary",
                "objective": "Combine all plans into a comprehensive day-by-day itinerary",
                "rationale": "Provide a clear and actionable trip plan",
                "requiredTools": [
                    "web_search_tool"
                ],
                "dependencies": [
                    "plan_food_and_activities"
                ],
                "expectedInput": [
                    "food_and_activities_plan"
                ],
                "expectedOutput": [
                    "day_by_day_itinerary"
                ],
                "successCriteria": [
                    "day-by-day itinerary defined"
                ]
            }
        ],
        "edges": [
            {
                "from": "START",
                "to": "initialize_trip_planner",
                "condition": "ALWAYS"
            },
            {
                "from": "initialize_trip_planner",
                "to": "research_destination_options",
                "condition": "SUCCESS"
            },
            {
                "from": "research_destination_options",
                "to": "optimize_transportation",
                "condition": "SUCCESS"
            },
            {
                "from": "optimize_transportation",
                "to": "plan_accommodations",
                "condition": "SUCCESS"
            },
            {
                "from": "plan_accommodations",
                "to": "plan_sightseeing",
                "condition": "SUCCESS"
            },
            {
                "from": "plan_sightseeing",
                "to": "plan_food_and_activities",
                "condition": "SUCCESS"
            },
            {
                "from": "plan_food_and_activities",
                "to": "generate_day_by_day_itinerary",
                "condition": "SUCCESS"
            },
            {
                "from": "generate_day_by_day_itinerary",
                "to": "END",
                "condition": "SUCCESS"
            }
        ],
        "constraints": {
            "requiresVerification": false,
            "allowParallel": false,
            "requiresHumanApproval": false
        },
        "successCriteria": [
            "Itinerary spans exactly 14 days",
            "Total estimated cost does not exceed $2500",
            "All planning tasks completed with SUCCESS condition",
            "Final itinerary includes optimized transportation, accommodation, sightseeing, and food plans"
        ],
        "finalOutput": {
            "artifact": "Comprehensive 14‑day Japan itinerary covering transportation, accommodations, sightseeing, food, and budget details",
            "format": "Day‑by‑Day Itinerary Document (JSON)"
        }
    }
};

const runTest = async () => {
    console.log(`[🚀] Firing up concurrent Agent Specification Generation...\n`);

    const startTime = performance.now();

    // Invoke the node directly with the mock state
    const result = await agentSpecificationNode(mockState);

    const endTime = performance.now();

    if (result.error) {
        console.error(`\n[❌] Execution Failed in ${(endTime - startTime).toFixed(2)}ms`);
        console.error(`Reason: ${result.error}\n\n${result.specifications}`);
        return;
    }

    console.log(`\n[✅] Generated ${result.specifications.length} Agent Specifications in ${(endTime - startTime).toFixed(2)}ms`);
    console.log("\n--- Compiled Agent Specifications ---");
    console.log(JSON.stringify(result.specifications, null, 2));
};

runTest();