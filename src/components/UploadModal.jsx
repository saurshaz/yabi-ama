import { uploadData } from '../utilities/dataUpload'; // Assuming this function handles DuckDB interactions
import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import { executeQuery } from '@/utilities/duckdb-wasm';

const CSVUploader = () => {
  const [db, setDb] = useState(null);
  const [file, setFile] = useState(null);
  const [tableName, setTableName] = useState('my_table');

  useEffect(() => {
    // const initializeDB = async () => {
    //   const worker = new Worker('duckdb-worker.js');
    //   // const logger = new initDuckDB.ConsoleLogger();
    //   const options = {
    //     locateFile: () => duckdbWasm,
    //     worker,
    //     logger: console.log,
    //   };

    //   const db = new initDuckDB.Database(options);
    //   setDb(db);
    // };

    // initializeDB();
  }, []);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    // if (!file || !db) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const csvData = event.target.result;
      const parsedData = Papa.parse(csvData, { header: true }).data;

      // Create table and insert data
      const columns = Object.keys(parsedData[0]).join(', ');
      const values = parsedData.map((row) => {
        return `(${Object.values(row).map((val) => `'${val}'`).join(', ')})`;
      }).join(', ');

      // // Read the file contents
      // const fileContents = await readFile(file);

      // const createTableQuery = `
      //   CREATE TABLE stocks AS SELECT * FROM read_csv_auto(${file.name});
      // `;
      await executeQuery(`CREATE TABLE ${tableName} (${columns});`);
      await executeQuery(`INSERT INTO ${tableName} VALUES ${values};`);

      console.log('Table created and data inserted!');
    };

    reader.readAsText(file);
  };

  return (
    <div>
      <h1>CSV Uploader</h1>
      <input type="file" onChange={handleFileChange} />
      <input
        type="text"
        value={tableName}
        onChange={(e) => setTableName(e.target.value)}
        placeholder="Table Name"
      />
      <button onClick={handleUpload}>Upload and Create Table</button>
    </div>
  );
};

// export default CSVUploader;
const UploadModal = ({ sqlQuery, setSqlQuery, setShowUploadModal }) => {
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'text/csv') {
      // Pass the file directly to uploadData
      uploadData(file)
        .then(() => {
          setShowUploadModal(false); // Close modal after upload
        })
        .catch((error) => {
          console.error("Error uploading data:", error);
          alert('Failed to upload data. Please check the console for details.');
        });
    } else {
      alert('Please upload a valid CSV file.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-[500px]">
        <h2 className="text-xl font-bold mb-4">Upload Dataset</h2>
        {/* <div className="space-y-4">
          <div>
            <label className="block mb-2">File Upload</label>
            <input
              type="file"
              name="dataset"
              accept=".csv,.db,.parquet"
              onChange={handleFileUpload}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-2">SQL Query</label>
            <textarea
              value={sqlQuery}
              onChange={(e) => setSqlQuery(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter SQL query..."
              rows={4}
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowUploadModal(false)}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                // Logic to execute SQL query
                setShowUploadModal(false);
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Execute Query
            </button>
          </div>
        </div> */}
        <CSVUploader />
      </div>
    </div>
  );
};

export default UploadModal;