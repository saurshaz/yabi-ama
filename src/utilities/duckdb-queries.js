import { executeQuery } from './duckdb-wasm.js';

export const runSampleQuery = async () => {
  const query = "SELECT * FROM my_table"; // Replace with your actual table name
  try {
    const result = await executeQuery(query);
    return result;
  } catch (error) {
    console.error("Error running sample query:", error);
    throw new Error("Sample query execution failed");
  }
};
