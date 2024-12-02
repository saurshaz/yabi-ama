import * as DuckDB from '@duckdb/duckdb-wasm';

let duckDBInstance;
let connection;

export const initDuckDB = async () => {
  // Load the WASM and ASMJS modules
  const JSDELIVR_BUNDLES = DuckDB.getJsDelivrBundles();
  const bundle = await DuckDB.selectBundle(JSDELIVR_BUNDLES);

  const workerScript = await fetch('https://cdn.jsdelivr.net/npm/@duckdb/duckdb-wasm@1.29.0/dist/duckdb-browser-eh.worker.js').then(res => res.text());
  const workerUrl = URL.createObjectURL(new Blob([workerScript], { type: 'application/javascript' }));
  const worker = new Worker(workerUrl);
  const logger = new DuckDB.ConsoleLogger();

  // Instantiate the AsyncDuckDB instance

  duckDBInstance = new DuckDB.AsyncDuckDB(logger, worker);
  await duckDBInstance.instantiate(bundle.mainModule, bundle.pthreadWorker);

  // Create a connection
  connection = await duckDBInstance.connect();

  console.log("DuckDB-WASM initialized >>> ", duckDBInstance);
};

export const executeQuery = async (query) => {
  if (!connection) {
    throw new Error("DuckDB is not initialized. Call initDuckDB first.");
  }

  try {
    const result = await connection.query(query);
    return result;
  } catch (error) {
    console.error("Error executing query:", error);
    throw new Error("Query execution failed");
  }
};

// Optionally export the DuckDB instance if needed
export const getDuckDBInstance = () => {
  if (!duckDBInstance) {
    throw new Error("DuckDB is not initialized. Call initDuckDB first.");
  }
  return duckDBInstance;
};