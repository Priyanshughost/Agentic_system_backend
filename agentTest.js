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
            "maxTasks": 7
        },
        "tasks": [
            {
                "id": "init_trip_planning",
                "name": "Initialize Trip Planning",
                "objective": "Gather initial information about the trip, including budget and duration.",
                "rationale": "Sets the foundation for the trip planning process.",
                "requiredTools": [
                    "web_search_tool"
                ],
                "dependencies": [],
                "expectedInput": [],
                "expectedOutput": [
                    "starting_location",
                    "travel_dates",
                    "budget"
                ],
                "successCriteria": [
                    "Valid starting location",
                    "Valid travel dates",
                    "Budget confirmed"
                ]
            },
            {
                "id": "research_transportation",
                "name": "Research Transportation Options",
                "objective": "Explore transportation options across Japan, including costs and schedules.",
                "rationale": "Essential for optimizing transportation costs and planning.",
                "requiredTools": [
                    "web_search_tool"
                ],
                "dependencies": [
                    "init_trip_planning"
                ],
                "expectedInput": [
                    "starting_location",
                    "travel_dates"
                ],
                "expectedOutput": [
                    "transportation_costs",
                    "transportation_schedules"
                ],
                "successCriteria": [
                    "Comprehensive list of transportation options",
                    "Cost estimates"
                ]
            },
            {
                "id": "research_accommodations",
                "name": "Research Accommodation Options",
                "objective": "Find suitable accommodations within the budget, considering location and amenities.",
                "rationale": "Critical for staying within budget and ensuring comfort.",
                "requiredTools": [
                    "web_search_tool"
                ],
                "dependencies": [
                    "init_trip_planning"
                ],
                "expectedInput": [
                    "budget",
                    "travel_dates"
                ],
                "expectedOutput": [
                    "accommodation_options",
                    "accommodation_costs"
                ],
                "successCriteria": [
                    "List of potential accommodations",
                    "Cost estimates"
                ]
            },
            {
                "id": "plan_sightseeing",
                "name": "Plan Sightseeing Activities",
                "objective": "Identify key sightseeing spots and activities within Japan, optimizing for time and interest.",
                "rationale": "Enhances the travel experience and ensures time is used effectively.",
                "requiredTools": [
                    "web_search_tool"
                ],
                "dependencies": [
                    "init_trip_planning"
                ],
                "expectedInput": [
                    "travel_dates",
                    "interests"
                ],
                "expectedOutput": [
                    "sightseeing_itinerary"
                ],
                "successCriteria": [
                    "Comprehensive sightseeing plan"
                ]
            },
            {
                "id": "plan_food_and_dining",
                "name": "Plan Food and Dining",
                "objective": "Research and budget for food and dining experiences across the trip.",
                "rationale": "Essential for staying within budget and enjoying local cuisine.",
                "requiredTools": [
                    "web_search_tool"
                ],
                "dependencies": [
                    "init_trip_planning"
                ],
                "expectedInput": [
                    "budget",
                    "travel_dates"
                ],
                "expectedOutput": [
                    "food_budget_plan"
                ],
                "successCriteria": [
                    "Food budget plan"
                ]
            },
            {
                "id": "optimize_travel_time",
                "name": "Optimize Travel Time",
                "objective": "Ensure efficient travel time between locations, minimizing downtime.",
                "rationale": "Maximizes the use of time for sightseeing and experiences.",
                "requiredTools": [
                    "web_search_tool"
                ],
                "dependencies": [
                    "research_transportation"
                ],
                "expectedInput": [
                    "transportation_schedules",
                    "sightseeing_itinerary"
                ],
                "expectedOutput": [
                    "optimized_travel_time"
                ],
                "successCriteria": [
                    "Efficient travel time plan"
                ]
            },
            {
                "id": "finalize_itinerary",
                "name": "Finalize Day-by-Day Itinerary",
                "objective": "Compile all gathered information into a detailed day-by-day itinerary.",
                "rationale": "Provides a clear plan for the trip.",
                "requiredTools": [],
                "dependencies": [
                    "research_transportation",
                    "research_accommodations",
                    "plan_sightseeing",
                    "plan_food_and_dining",
                    "optimize_travel_time"
                ],
                "expectedInput": [
                    "transportation_costs",
                    "accommodation_options",
                    "sightseeing_itinerary",
                    "food_budget_plan",
                    "optimized_travel_time"
                ],
                "expectedOutput": [
                    "day_by_day_itinerary"
                ],
                "successCriteria": [
                    "Comprehensive and feasible itinerary"
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
                "to": "research_transportation",
                "condition": "SUCCESS"
            },
            {
                "from": "init_trip_planning",
                "to": "research_accommodations",
                "condition": "SUCCESS"
            },
            {
                "from": "init_trip_planning",
                "to": "plan_sightseeing",
                "condition": "SUCCESS"
            },
            {
                "from": "init_trip_planning",
                "to": "plan_food_and_dining",
                "condition": "SUCCESS"
            },
            {
                "from": "research_transportation",
                "to": "optimize_travel_time",
                "condition": "SUCCESS"
            },
            {
                "from": "research_transportation",
                "to": "finalize_itinerary",
                "condition": "SUCCESS"
            },
            {
                "from": "research_accommodations",
                "to": "finalize_itinerary",
                "condition": "SUCCESS"
            },
            {
                "from": "plan_sightseeing",
                "to": "finalize_itinerary",
                "condition": "SUCCESS"
            },
            {
                "from": "plan_food_and_dining",
                "to": "finalize_itinerary",
                "condition": "SUCCESS"
            },
            {
                "from": "optimize_travel_time",
                "to": "finalize_itinerary",
                "condition": "SUCCESS"
            },
            {
                "from": "finalize_itinerary",
                "to": "END",
                "condition": "SUCCESS"
            }
        ]
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