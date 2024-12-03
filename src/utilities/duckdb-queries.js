import { createDashboardConfigTable } from '@/api/seed.js';
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



export const insertSeedData = async (data=[]) => {
    const insertQueries = data.map(item => {
        return `INSERT INTO my_table (id, name, color) VALUES (${item.id}, '${item.name}', '${item.color}');`; // Replace 'my_table' with your actual table name
    });

    try {
      await createDashboardConfigTable();
      await insertDummyData();
        for (const query of insertQueries) {
            await executeQuery(query);
        }

    } catch (error) {
        console.error("Error inserting seed data:", error);
        throw new Error("Seed data insertion failed");
    }
};
