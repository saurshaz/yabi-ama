import { executeQuery } from '@/utilities/duckdb-wasm';
import React from 'react';

const EditModal = ({ charts, editingChart, setEditingChart, setShowEditModal, handleChartEdit, editChartData, setEditingChartData }) => (

  
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-white rounded-lg p-6 w-[500px]">
      <h2 className="text-xl font-bold mb-4">Edit Chart</h2>
      <div className="space-y-4">
        <div>
          <label className="block mb-2">Chart Title</label>
          <input
            type="text"
            value={editChartData?.title}
            onChange={(e) => setEditingChartData({ ...editChartData, title: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-2">Chart Type</label>
          <select
            value={editChartData?.options?.series?.type || 'bar'}
            onChange={(e) => setEditingChartData({ ...editChartData, type: e.target.value })}
            className="w-full p-2 border rounded"
          >
            <option value="scatter">scatter</option>
            <option value="line">line</option>
            <option value="bar">bar</option>
            <option value="time">time</option>
            <option value="pie">pie</option>
          </select>
        </div>
        <div>
          <label className="block mb-2">ECharts Options</label>
          <textarea
            value={editChartData?.options}
            onChange={(e) => setEditingChartData({ ...editChartData, options: e.target.value })}
            className="w-full p-2 border rounded"
            placeholder="Paste ECharts options here..."
            rows={4}
          />
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => {
              setEditingChartData(null); // Reset editingChart on cancel
              setShowEditModal(false);
            }}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              // handleChartEdit(editChartData.id, editChartData);
              await executeQuery(`update dashboard_config set options='${JSON.stringify(editChartData?.options || {})}', title='${editChartData?.title}'  where id='${editChartData?.id}'`);
              handleChartEdit(editChartData?.id, editChartData);
              setShowEditModal(false);
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default EditModal;