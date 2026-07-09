import { testGraph } from "./src/ai/graphs/test.graph.js";

const initialState = {
  userQuery: "Plan me a 7 day trip to Uttrakhand from jamshedpur dont ask for any clarifications you can assume by default and the budget will be 20k Rupees",
};

const result = await testGraph.invoke(initialState);

console.dir(result, { depth: null });