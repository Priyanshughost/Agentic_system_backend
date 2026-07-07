import 'dotenv/config'; // Loads your TAVILY_API_KEY and LLM keys
import { runtimeExecutor } from './src/ai/runtime/runtimeExecutor.js';

const testBlueprint = {
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

// 2. AGENT SPECIFICATIONS FOR BOTH NODES
const testSpecifications = [
    {
        "taskId": "init_trip_planning",
        "persona": "Travel Planner",
        "role": "Define trip parameters and constraints",
        "systemPrompt": "Your objective is to define trip parameters and constraints. You have access to the web search tool. You must output trip parameters. Stay focused on your objective and avoid unrelated tasks.",
        "model": "gpt20b",
        "temperature": 0.2,
        "toolStrategy": "AUTO",
        "maxIterations": 10
    },
    {
        "taskId": "define_starting_location",
        "persona": "Travel Planner",
        "role": "Determine the starting location for the trip",
        "systemPrompt": "Objective: Determine the starting location for the trip. Inputs: trip_parameters. Outputs: starting_location. Remain within responsibility and prevent solving unrelated tasks. Avoid assumptions and produce deterministic outputs whenever possible.",
        "model": "gpt20b",
        "temperature": 0.3,
        "toolStrategy": "REQUIRED",
        "maxIterations": 10
    },
    {
        "taskId": "plan_transportation",
        "persona": "Transportation Planner",
        "role": "Optimize transportation across Japan",
        "systemPrompt": "Objective: Optimize transportation across Japan. Inputs: starting_location, trip_parameters. Outputs: transportation_plan. Rules: Remain focused on optimizing transportation, avoid unrelated tasks, and produce deterministic outputs.",
        "model": "gpt20b",
        "temperature": 0.2,
        "toolStrategy": "REQUIRED",
        "maxIterations": 500
    },
    {
        "taskId": "plan_accommodations",
        "persona": "Senior Travel Planner",
        "role": "Responsible for optimizing accommodations within budget",
        "systemPrompt": "Objective: Plan accommodations within budget. Inputs: transportation_plan, trip_parameters. Outputs: accommodation_plan. Remain within responsibility and prevent solving unrelated tasks. Avoid assumptions and produce deterministic outputs whenever possible.",
        "model": "gpt20b",
        "temperature": 0.2,
        "toolStrategy": "REQUIRED",
        "maxIterations": 100
    },
    {
        "taskId": "plan_sightseeing",
        "persona": "Travel Planner",
        "role": "Plan sightseeing activities within budget and time",
        "systemPrompt": "Objective: Plan sightseeing activities within budget and time. Inputs: accommodation_plan, trip_parameters. Outputs: sightseeing_plan. Remain within responsibility, prevent solving unrelated tasks, and produce deterministic outputs whenever possible.",
        "model": "gpt20b",
        "temperature": 0.2,
        "toolStrategy": "REQUIRED",
        "maxIterations": 500
    },
    {
        "taskId": "plan_food",
        "persona": "Food Budget Planner",
        "role": "Plan food budget and options",
        "systemPrompt": "Objective: Plan food budget and options based on sightseeing plan and trip parameters. Inputs: sightseeing_plan, trip_parameters. Outputs: food_plan. Rules: Stay within budget, satisfy culinary needs, and finalize food plan.",
        "model": "gpt20b",
        "temperature": 0.2,
        "toolStrategy": "REQUIRED",
        "maxIterations": 5
    },
    {
        "taskId": "finalize_itinerary",
        "persona": "Travel Planner",
        "role": "Compile all plans into a day-by-day itinerary",
        "systemPrompt": "Objective: Compile all plans into a day-by-day itinerary. Inputs: food_plan, trip_parameters. Outputs: day_by_day_itinerary. Rules: Remain within responsibility, prevent solving unrelated tasks, avoid assumptions, produce deterministic outputs whenever possible.",
        "model": "gpt20b",
        "temperature": 0.3,
        "toolStrategy": "REQUIRED",
        "maxIterations": 1000
    }
];

// 3. INITIAL STATE
const testInitialState = {
    variables: {
        intent: "I want to plan a 14-day cultural and culinary trip to Japan for 2 people with a total budget of $2500.",
        clarification: "Prefer mid-range boutique hotels or traditional Ryokans. Focus on Tokyo and Kyoto.",
        available_system_tools: ["web_search_tool"]
    },
    // Flat mapping fallback compatibility
    intent: "I want to plan a 14-day cultural and culinary trip to Japan for 2 people with a total budget of $2500.",
    clarification: "Prefer mid-range boutique hotels or traditional Ryokans. Focus on Tokyo and Kyoto.",
    available_system_tools: ["web_search_tool"]
};

// 4. RUNNER
async function runMultiAgentTest() {
    try {
        console.log("🚀 Launching Multi-Agent 2-Task Flow Test...");

        const finalState = await runtimeExecutor({
            blueprint: testBlueprint,
            specifications: testSpecifications,
            initialState: testInitialState
        });

        console.log("\n========================================");
        console.log("🎉 Multi-Stage Pipeline Test Successful!");
        console.log("========================================");
        console.log("Final Consolidated Graph State Variables:");
        console.log(JSON.stringify(finalState.variables || finalState, null, 2));

    } catch (error) {
        console.error("\n❌ Pipeline Flow Broken:");
        console.error(error.message);
        if (error.stack) console.error(error.stack);
    }
}

runMultiAgentTest();