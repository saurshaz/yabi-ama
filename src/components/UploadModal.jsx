import React from 'react';

const UploadModal = ({ sqlQuery, setSqlQuery, handleFileUpload, setShowUploadModal }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-white rounded-lg p-6 w-[500px]">
      <h2 className="text-xl font-bold mb-4">Upload Dataset</h2>
      <div className="space-y-4">
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
      </div>
    </div>
  </div>
);

export default UploadModal;
