"use client";
import React, { useEffect, useState } from "react";
import "./draggable-resizable.css"; // Import the existing CSS file
import "./edit-mode-styles.css"; // Import the new edit mode styles

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Rnd } from "react-rnd";
import { useUpload } from "../utilities/runtime-helpers";
// import { initDuckDB, executeQuery } from "../utilities/duckdb-wasm"; // Import DuckDB functions
import EditModal from "../components/EditModal";
// import { runSampleQuery } from "../utilities/duckdb-queries" ; // Import query function
import UploadModal from "../components/UploadModal";
import ChartHeader from "../components/ChartHeader";
import { uploadData } from "../utilities/dataUpload"; // Import upload function
import {
  bar_chart,
  line_chart,
  pie_chart,
  scatter_chart,
  time_series_chart,
} from "@/config";

// (async function _initDuckDB() {
//   await initDuckDB(1000); // Initialize DuckDB with 1000 rows

//   console.log(" duckdb initialized with sample data ");
// })();

const dashboardConfig = [
  {
    id: 1,
    title: "Sales Distribution",
    type: "scatter",
    options: scatter_chart,
  },
  { id: 2, title: "Revenue Trends", type: "line", options: line_chart },
  { id: 3, title: "Product Categories", type: "bar", options: bar_chart },
  {
    id: 4,
    title: "Monthly Performance",
    type: "time",
    options: time_series_chart,
  },
  { id: 5, title: "Market Share", type: "pie", option: pie_chart },
]

function MainComponent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [charts, setCharts] = useState(dashboardConfig);
  const [chartInstances, setChartInstances] = useState({});
  const [editingChart, setEditingChart] = useState(null); // State for editing chart
  const [showChartTypes, setShowChartTypes] = useState(false);
  const [selectedChart, setSelectedChart] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [layouts, setLayouts] = useState({});
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [availableData] = useState({
    dimensions: [
      { name: "Date", type: "time" },
      { name: "Product", type: "string" },
      { name: "Region", type: "string" },
      { name: "Category", type: "string" },
      { name: "Customer", type: "string" },
      { name: "Channel", type: "string" },
      { name: "Brand", type: "string" },
      { name: "Campaign", type: "string" },
    ],
    metrics: [
      { name: "Sales", type: "number" },
      { name: "Revenue", type: "currency" },
      { name: "Profit", type: "number" },
      { name: "Units", type: "number" },
      { name: "Customers", type: "number" },
      { name: "Average Order Value", type: "currency" },
      { name: "Conversion Rate", type: "percentage" },
      { name: "Customer Lifetime Value", type: "currency" },
    ],
  });
  const [uploadError, setUploadError] = useState(null);
  const [upload, { loading }] = useUpload();
  const [dataSource, setDataSource] = useState(null);
  const [sqlQuery, setSqlQuery] = useState("");
  const [queryResult, setQueryResult] = useState(null);

  const [isEditMode, setIsEditMode] = useState(false); // New state for edit mode

  const handleEditModeToggle = () => {
    setIsEditMode((prev) => !prev);
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js";
    script.async = true;
    script.onload = () => {
      const instances = {};
      charts.forEach((chart) => {
        const element = document.getElementById(chart.id);
        if (element) {
          const instance = echarts.init(element);
          instances[chart.id] = instance;
          renderChart(instance, chart.type);
        }
      });
      setChartInstances(instances);

      window.addEventListener("resize", handleResize);
      return () => {
        Object.values(instances).forEach((instance) => instance.dispose());
        window.removeEventListener("resize", handleResize);
      };
    };
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  const handleResize = (chartId, size) => {
    setLayouts((prev) => ({
      ...prev,
      [chartId]: size,
    }));
    const instance = chartInstances[chartId];
    if (instance) {
      instance.resize();
    }
  };

  const onDragEnd = (result) => {
    if (!result.destination || !isEditMode) return; // Allow drag only in edit mode
    const reorderedCharts = Array.from(charts);
    const [removed] = reorderedCharts.splice(result.source.index, 1);
    reorderedCharts.splice(result.destination.index, 0, removed);
    setCharts(reorderedCharts);
  };

  const renderChart = (instance, type) => {
    const options = getChartOptions(type);
    instance.setOption(options);
  };

  const getChartOptions = (type) => {
    switch (type) {
      case "scatter":
        return scatter_chart;
      case "line":
        return line_chart;
      case "bar":
        return bar_chart;
      case "time":
        return time_series_chart;
      case "pie":
        return pie_chart;
      default:
        return {};
    }
  };

  const handleSqlQuery = async () => {
    if (!sqlQuery.trim()) return;

    try {
      // const result = await executeQuery(sqlQuery);
      // setQueryResult(result); // Set the result to state
      // console.log("Query Result:", result);
    } catch (error) {
      console.error("Failed to execute query:", error);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const message = await uploadData(file);
      console.log(message);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChartEdit = (chartId, formData) => {
    const { title, type, options } = formData;

    const updatedChart = {
      ...charts.find((c) => c.id === chartId),
      title,
      type,
      options: JSON.parse(options), // Parse the ECharts options
    };

    setCharts((prev) => prev.map((c) => (c.id === chartId ? updatedChart : c)));

    const instance = chartInstances[chartId];
    if (instance) {
      renderChart(instance, updatedChart.type);
    }

    // Send chart updated event
    const event = new CustomEvent("chartupdated", {
      detail: {
        dashboardName: "Your Dashboard Name", // Replace with actual dashboard name
        chartName: updatedChart.title,
      },
    });
    window.dispatchEvent(event);
  };

  const shuffleCharts = () => {
    const shuffledCharts = [...charts].sort(() => Math.random() - 0.5);
    setCharts(shuffledCharts);
  };

  return (
    <div className="relative">
      <DragDropContext onDragEnd={onDragEnd}>
        <button
          className={`absolute top-4 right-4 p-3 bg-blue-600 text-white rounded-full shadow-lg transition-transform transform border-2 border-yellow-500 ${
            isEditMode ? "scale-110" : ""
          }`}
          title="Edit Dashboard"
          onClick={handleEditModeToggle}
        >
          <i className="fas fa-edit"></i>
        </button>
        {isEditMode && (
          <button
            className="absolute top-16 right-4 p-2 bg-red-500 text-white rounded-full border-2 border-yellow-500"
            title="Exit Edit Mode"
            onClick={handleEditModeToggle}
          >
            <i className="fas fa-times"></i>
          </button>
        )}
        <button
          className="absolute top-16 right-4 p-2 bg-green-500 text-white rounded-full border-2 border-yellow-500"
          title="Shuffle Charts"
          onClick={shuffleCharts}
        >
          <i className="fas fa-random"></i>
        </button>
        <Droppable droppableId="droppable" direction="vertical">
          {(provided) => (
            <div
              className="p-4 bg-[#ffffff] flex flex-col"
              ref={provided.innerRef}
              {...provided.droppableProps}
              onMouseLeave={() => setShowChartTypes(false)}
            >
              <div className="mb-4 flex gap-4">
                <input
                  type="text"
                  placeholder="Search charts..."
                  className="w-full p-2 border rounded font-roboto"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Upload Dataset
                </button>
              </div>
              <div className="flex flex-col gap-4">
                {charts
                  .filter((chart) =>
                    chart.title.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((chart, index) => (
                    <Draggable
                      key={chart.id}
                      draggableId={String(chart.id)}
                      index={index}
                    >
                      {(provided) => (
                        <Rnd
                          className="bg-white rounded-lg shadow-lg"
                          style={layouts[chart.id]}
                          onResize={(e, direction, ref, delta, position) => {
                            handleResize(chart.id, {
                              width: ref.offsetWidth,
                              height: ref.offsetHeight,
                              ...position,
                            });
                          }}
                          ref={(ref) => {
                            provided.innerRef(ref);
                            if (ref && ref.style) {
                              ref.style.position = "relative"; // Ensure Rnd has a position
                            }
                          }}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <ChartHeader
                            charts={charts}
                            title={chart.title}
                            chartId={chart.id}
                            setEditingChart={setEditingChart}
                            setShowEditModal={setShowEditModal}
                          />
                          <div id={chart.id} className="h-[300px] w-full"></div>
                        </Rnd>
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}
              </div>
              {showEditModal && (
                <EditModal
                  setEditingChart={setEditingChart}
                  editingChart={editingChart}
                  handleChartEdit={handleChartEdit}
                  setShowEditModal={setShowEditModal}
                />
              )}
              {showUploadModal && <UploadModal />}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

export default MainComponent;
