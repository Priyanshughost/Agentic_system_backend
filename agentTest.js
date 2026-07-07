import { agentSpecificationNode } from "./src/ai/nodes/agentSpecification.node.js";


// Truncated to exactly 3 tasks with re-wired edges for a valid test pass
const mockState = {
    blueprint: {
        "metadata": {
            "id": "japan_trip_planning",
            "version": "1.0.0",
            "generatedFrom": "Intent Object",
            "complexity": "HIGH"
        },
        "execution": {
            "entryTask": "init_trip_planning",
            "allowParallel": true,
            "allowLoops": false,
            "maxRetries": 3,
            "maxTasks": 14
        },
        "tasks": [
            {
                "id": "init_trip_planning",
                "name": "Initialize Trip Planning",
                "objective": "Define trip parameters and constraints",
                "rationale": "Establishes the foundation for the trip planning process",
                "requiredTools": [
                    "web_search_tool"
                ],
                "dependencies": [],
                "expectedInput": [],
                "expectedOutput": [
                    "trip_parameters"
                ],
                "successCriteria": [
                    "Trip parameters defined"
                ]
            },
            {
                "id": "define_starting_location",
                "name": "Define Starting Location",
                "objective": "Determine the starting location for the trip",
                "rationale": "Critical for planning transportation and accommodations",
                "requiredTools": [
                    "web_search_tool"
                ],
                "dependencies": [
                    "init_trip_planning"
                ],
                "expectedInput": [
                    "trip_parameters"
                ],
                "expectedOutput": [
                    "starting_location"
                ],
                "successCriteria": [
                    "Starting location identified"
                ]
            },
            {
                "id": "plan_transportation",
                "name": "Plan Transportation",
                "objective": "Optimize transportation across Japan",
                "rationale": "Essential for minimizing travel time and costs",
                "requiredTools": [
                    "web_search_tool"
                ],
                "dependencies": [
                    "define_starting_location"
                ],
                "expectedInput": [
                    "starting_location",
                    "trip_parameters"
                ],
                "expectedOutput": [
                    "transportation_plan"
                ],
                "successCriteria": [
                    "Transportation plan optimized"
                ]
            },
            {
                "id": "plan_accommodations",
                "name": "Plan Accommodations",
                "objective": "Optimize accommodations within budget",
                "rationale": "Critical for ensuring comfortable stay within budget",
                "requiredTools": [
                    "web_search_tool"
                ],
                "dependencies": [
                    "plan_transportation"
                ],
                "expectedInput": [
                    "transportation_plan",
                    "trip_parameters"
                ],
                "expectedOutput": [
                    "accommodation_plan"
                ],
                "successCriteria": [
                    "Accommodation plan finalized"
                ]
            },
            {
                "id": "plan_sightseeing",
                "name": "Plan Sightseeing",
                "objective": "Plan sightseeing activities within budget and time",
                "rationale": "Essential for maximizing travel experience",
                "requiredTools": [
                    "web_search_tool"
                ],
                "dependencies": [
                    "plan_accommodations"
                ],
                "expectedInput": [
                    "accommodation_plan",
                    "trip_parameters"
                ],
                "expectedOutput": [
                    "sightseeing_plan"
                ],
                "successCriteria": [
                    "Sightseeing plan finalized"
                ]
            },
            {
                "id": "plan_food",
                "name": "Plan Food",
                "objective": "Plan food budget and options",
                "rationale": "Critical for staying within budget and satisfying culinary needs",
                "requiredTools": [
                    "web_search_tool"
                ],
                "dependencies": [
                    "plan_sightseeing"
                ],
                "expectedInput": [
                    "sightseeing_plan",
                    "trip_parameters"
                ],
                "expectedOutput": [
                    "food_plan"
                ],
                "successCriteria": [
                    "Food plan finalized"
                ]
            },
            {
                "id": "finalize_itinerary",
                "name": "Finalize Day-by-Day Itinerary",
                "objective": "Compile all plans into a day-by-day itinerary",
                "rationale": "Essential for providing a clear travel plan",
                "requiredTools": [
                    "web_search_tool"
                ],
                "dependencies": [
                    "plan_food"
                ],
                "expectedInput": [
                    "food_plan",
                    "trip_parameters"
                ],
                "expectedOutput": [
                    "day_by_day_itinerary"
                ],
                "successCriteria": [
                    "Itinerary finalized"
                ]
            }
        ],
        "edges": [
            {
                "from": "START",
                "to": "init_trip_planning",
                "condition": "ALWAYS"
            },
            {
                "from": "init_trip_planning",
                "to": "define_starting_location",
                "condition": "SUCCESS"
            },
            {
                "from": "define_starting_location",
                "to": "plan_transportation",
                "condition": "SUCCESS"
            },
            {
                "from": "plan_transportation",
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
                "to": "plan_food",
                "condition": "SUCCESS"
            },
            {
                "from": "plan_food",
                "to": "finalize_itinerary",
                "condition": "SUCCESS"
            },
            {
                "from": "finalize_itinerary",
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
            "Day-by-day itinerary delivered in the specified JSON format",
            "Total estimated cost of the itinerary does not exceed $2500",
            "All major transportation segments are optimized for minimal travel time",
            "Accommodation selections stay within the allocated budget portion",
            "Sightseeing and food plans respect the overall budget and time constraints"
        ],
        "finalOutput": {
            "artifact": "14-day Japan trip itinerary with detailed daily transportation, accommodation, sightseeing, and food budgeting",
            "format": "JSON document where each day includes fields: date, location, transport, accommodation, activities, food_budget, estimated_cost"
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