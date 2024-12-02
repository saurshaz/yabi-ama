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
}
// Function to create the dashboard_config table if it does not exist
export const createDashboardConfigTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS dashboard_config (
        id VARCHAR,
        title VARCHAR,
        owner VARCHAR,
        options JSON
    );
  `;

  try {
    await executeQuery(createTableQuery);
    console.log("Table 'dashboard_config' created successfully (if it did not already exist).");
  } catch (error) {
    console.error("Error creating table:", error);
    throw new Error("Table creation failed");
  }
};

// Function to insert dummy data
export const insertDummyData = async () => {
  const insertQuery = `
    INSERT INTO dashboard_config (id, title, owner, options)
    VALUES 
    (
        '123e4567-e89b-12d3-a456-426614174000',  -- Random UUID
        'Sample Scatter Chart',                  -- Random Title
        'John Doe',                              -- Owner
        '{
            "title": {
                "text": "Scatter Chart"
            },
            "tooltip": {},
            "xAxis": {},
            "yAxis": {},
            "series": [{
                "symbolSize": 20,
                "data": [
                    [10.0, 8.04],
                    [8.07, 6.95],
                    [13.0, 7.58],
                    [9.05, 8.81],
                    [11.0, 8.33],
                    [14.0, 7.66],
                    [13.4, 6.81],
                    [10.0, 6.33],
                    [14.0, 8.96],
                    [12.5, 6.82],
                    [9.15, 7.2],
                    [11.5, 7.2],
                    [3.03, 4.23],
                    [12.2, 7.83],
                    [2.02, 4.47],
                    [1.05, 3.33],
                    [4.05, 4.96],
                    [6.03, 7.24],
                    [12.0, 6.26],
                    [12.0, 8.84],
                    [7.08, 5.82],
                    [5.02, 5.68]
                ],
                "type": "scatter"
            }]
        }'
    ),
    (
        '234e5678-f90c-23e4-b567-537725285000',  -- Random UUID
        'Sample Pie Chart',                     -- Random Title
        'Jane Smith',                           -- Owner
        '{
            "title": {
                "text": "Pie Chart"
            },
            "tooltip": {
                "trigger": "item"
            },
            "legend": {
                "orient": "vertical",
                "left": "left"
            },
            "series": [
                {
                    "name": "Access From",
                    "type": "pie",
                    "radius": "50%",
                    "data": [
                        { "value": 1048, "name": "Search Engine" },
                        { "value": 735, "name": "Direct" },
                        { "value": 580, "name": "Email" },
                        { "value": 484, "name": "Union Ads" },
                        { "value": 300, "name": "Video Ads" }
                    ],
                    "emphasis": {
                        "itemStyle": {
                            "shadowBlur": 10,
                            "shadowOffsetX": 0,
                            "shadowColor": "rgba(0, 0, 0, 0.5)"
                        }
                    }
                }
            ]
        }'
    ),
    (
        '345f6789-g01d-34f5-c678-648836396000',  -- Random UUID
        'Sample Line Chart',                    -- Random Title
        'Alice Johnson',                        -- Owner
        '{
            "title": {
                "text": "Line Chart"
            },
            "tooltip": {
                "trigger": "axis"
            },
            "xAxis": {
                "type": "category",
                "data": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
            },
            "yAxis": {
                "type": "value"
            },
            "series": [
                {
                    "data": [820, 932, 901, 934, 1290, 1330, 1320],
                    "type": "line"
                }
            ]
        }'
    ),
    (
        '456g7890-h12e-45g6-d789-759947407000',  -- Random UUID
        'Sample Area Chart',                    -- Random Title
        'Bob Brown',                            -- Owner
        '{
            "title": {
                "text": "Area Chart"
            },
            "tooltip": {
                "trigger": "axis"
            },
            "xAxis": {
                "type": "category",
                "boundaryGap": false,
                "data": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
            },
            "yAxis": {
                "type": "value"
            },
            "series": [
                {
                    "data": [820, 932, 901, 934, 1290, 1330, 1320],
                    "type": "line",
                    "areaStyle": {}
                }
            ]
        }'
    ),
    (
        '567h8901-i23f-56h7-e890-860058518000',  -- Random UUID
        'Sample Bar Chart',                     -- Random Title
        'Charlie Davis',                        -- Owner
        '{
            "title": {
                "text": "Bar Chart"
            },
            "tooltip": {
                "trigger": "axis",
                "axisPointer": {
                    "type": "shadow"
                }
            },
            "xAxis": {
                "type": "category",
                "data": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
            },
            "yAxis": {
                "type": "value"
            },
            "series": [
                {
                    "data": [120, 200, 150, 80, 70, 110, 130],
                    "type": "bar"
                }
            ]
        }'
    ),
    (
        '678i9012-j34g-67i8-f901-971169629000',  -- Random UUID
        'Sample Time Series Chart',             -- Random Title
        'David Evans',                          -- Owner
        '{
            "title": {
                "text": "Time Series Chart"
            },
            "tooltip": {
                "trigger": "axis"
            },
            "xAxis": {
                "type": "time",
                "boundaryGap": false
            },
            "yAxis": {
                "type": "value"
            },
            "series": [
                {
                    "data": [
                        ["2023-01-01", 150],
                        ["2023-01-02", 230],
                        ["2023-01-03", 220],
                        ["2023-01-04", 180],
                        ["2023-01-05", 200],
                        ["2023-01-06", 210],
                        ["2023-01-07", 250]
                    ],
                    "type": "line"
                }
            ]
        }'
    );
  `;

  try {
    await executeQuery(insertQuery);
    console.log("Dummy data inserted successfully.");
  } catch (error) {
    console.error("Error inserting dummy data:", error);
    throw new Error("Dummy data insertion failed");
  }
};

// Function to select all records from the dashboard_config table and iterate over them
export const selectAndIterateRecords = async (selectQuery, _result=[]) => {
  try {
    const result = await executeQuery(selectQuery);
    result.toArray().forEach(row => {
      _result.push(row?.toJSON())
      console.log(`ID: ${row.id}, Title: ${row.title}, Owner: ${row.owner}, Options: ${JSON.stringify(row.options)}`);
    });
    
  } catch (error) {
    console.error("Error selecting records:", error);
    throw new Error("Record selection failed");
  }
};

// Example usage
(async () => {
  await initDuckDB();
  await createDashboardConfigTable();
  await insertDummyData();
  await selectAndIterateRecords();
})();