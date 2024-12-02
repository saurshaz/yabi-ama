import React from 'react';

const EditModal = ({ charts, editingChart, setEditingChart, setShowEditModal, handleChartEdit }) => (

  
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-white rounded-lg p-6 w-[500px]">
      <h2 className="text-xl font-bold mb-4">Edit Chart</h2>
      <div className="space-y-4">
        <div>
          <label className="block mb-2">Chart Title</label>
          <input
            type="text"
            value={editingChart?.title}
            onChange={(e) => setEditingChart({ ...editingChart, title: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-2">Chart Type</label>
          <select
            value={editingChart?.type}
            onChange={(e) => setEditingChart({ ...editingChart, type: e.target.value })}
            className="w-full p-2 border rounded"
          >
            <option value="scatter">Scatter</option>
            <option value="line">Line</option>
            <option value="bar">Bar</option>
            <option value="time">Time</option>
            <option value="pie">Pie</option>
          </select>
        </div>
        <div>
          <label className="block mb-2">ECharts Options</label>
          <textarea
            value={editingChart?.options}
            onChange={(e) => setEditingChart({ ...editingChart, options: e.target.value })}
            className="w-full p-2 border rounded"
            placeholder="Paste ECharts options here..."
            rows={4}
          />
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => {
              setEditingChart(null); // Reset editingChart on cancel
              setShowEditModal(false);
            }}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              handleChartEdit(editingChart.id, editingChart);
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