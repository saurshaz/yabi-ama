import { executeQuery } from './duckdb-wasm.js';

export const uploadData = async (file) => {
  // const duckDB = getDuckDBInstance();

  // Read the file contents
  const fileContents = await readFile(file);

  const createTableQuery = `
    CREATE TABLE stocks AS SELECT * FROM read_csv_auto(${file.name});
  `;

  try {
    await executeQuery(createTableQuery);
    console.log("Table 'employees' created successfully.");
  } catch (error) {
    console.error("Error creating table:", error);
    throw new Error("Table creation failed");
  }
  // Assuming the file is in CSV format, implement the upload logic here
  const query = `COPY bi_charts FROM '${fileContents}' (FORMAT CSV);`;

  try {
    await executeQuery(query);
    console.log("Data uploaded successfully to bi_charts table.");
  } catch (error) {
    console.error("Error executing upload query:", error);
    throw new Error("Data upload failed");
  }
};

// Helper function to read the file contents
const readFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      resolve(event.target.result);
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsText(file);
  });
};
