import { executeQuery, selectAndIterateRecords } from '@/utilities/duckdb-wasm';
import React from 'react';

const ChartHeader = ({ title, chartId, setEditingChart, setShowEditModal, saveDashboard, generatePDF, option, setEditingChartData }) => {
  return (<div className="flex justify-between items-center p-2 bg-[#f8f9fa] rounded-t">
    <h3 className="font-roboto text-lg">{title}</h3>
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <i
          className={`fas fa fa-edit text-gray-400 cursor-not-allowed h-7 w-7`}
          onClick={async () => {
            let chartId = event.target.parentElement.parentElement.parentElement.nextElementSibling.getAttribute('id');
            setEditingChart(chartId);
            const chartData = [];
            await selectAndIterateRecords(`select * from dashboard_config where id = '${chartId}'`,chartData);
            setEditingChartData(chartData[0]);
            setShowEditModal(true);
          }}
        ></i>
        <span className="text-xs">Edit</span>
      </div>
      <div className="flex flex-col items-center">
        <i
          className={`fas fa fa-trash text-gray-400 cursor-not-allowed h-7 w-7`}
          onClick={() => {
            // Add delete functionality here
          }}
        ></i>
        <span className="text-xs">Delete</span>
      </div>
      <div className="flex flex-col items-center">
        <i
          className="fas fa fa-gear text-gray-400 cursor-not-allowed h-7 w-7"
          onClick={() => {
            // Save chart functionality will be implemented in page.jsx
          }}
        ></i>
        <span className="text-xs">Switch</span>
      </div>
      <div className="relative flex flex-col items-center">
        <i
          aria-describedby="tt-insights"
          className="fas fa fa-info text-gray-400 cursor-not-allowed h-7 w-7"
          onMouseEnter={() => {
            // setShowChartTypes(true);
            // setSelectedChart(chartId);
          }}
          title="insights"
        ></i>
      </div>
      <span className="text-xs hidden" id="tt-insights">show chart insights</span>
      <div className="flex flex-col items-center">
        <i
          className="fas fa fa-save text-gray-400 cursor-not-allowed h-7 w-7"
          onClick={() => {
            saveChart(chartId);
          }}
        ></i>
        <span className="text-xs">Save</span>
      </div>
    </div>
  </div>
)};

export default ChartHeader;
