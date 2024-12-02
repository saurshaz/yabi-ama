import React from 'react';

const ChartHeader = ({ title, chartId, setEditingChart, setShowEditModal, saveDashboard, generatePDF }) => (
  <div className="flex justify-between items-center p-2 bg-[#f8f9fa] rounded-t">
    <h3 className="font-roboto text-lg">{title}</h3>
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <i
          className={`fas fa fa-edit text-gray-400 cursor-not-allowed h-7 w-7`}
          onClick={() => {
            setEditingChart(chartId);
            setShowEditModal(true);
          }}
        ></i>
        <span className="text-xs">Edit</span>
      </div>
      <div className="flex flex-col items-center">
        <i
          className={`fas fa-trash text-gray-400 cursor-not-allowed h-7 w-7`}
          onClick={() => {
            // Add delete functionality here
          }}
        ></i>
        <span className="text-xs">Delete</span>
      </div>
      <div className="flex flex-col items-center">
        <i
          className="fas fa-save text-gray-400 cursor-pointer h-7 w-7"
          onClick={() => {
            // Save chart functionality will be implemented in page.jsx
          }}
        ></i>
        <span className="text-xs">Save</span>
      </div>
      <div className="relative flex flex-col items-center">
        <i
          className="fas fa-chart-line text-green-500 cursor-pointer h-7 w-7"
          onMouseEnter={() => {
            setShowChartTypes(true);
            setSelectedChart(chartId);
          }}
        ></i>
        <span className="text-xs">Switch</span>
      </div>
      <div className="flex flex-col items-center">
        <i
          className="fas fa-save text-gray-400 cursor-pointer h-7 w-7"
          onClick={() => {
            saveChart(chartId);
          }}
        ></i>
        <span className="text-xs">Save</span>
      </div>
    </div>
  </div>
);

export default ChartHeader;
