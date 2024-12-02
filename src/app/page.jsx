"use client";
import React, { useEffect, useState } from "react";
import "./draggable-resizable.css"; // Import the existing CSS file
import "./edit-mode-styles.css"; // Import the new edit mode styles
import { createDashboardConfigTable, executeQuery, initDuckDB, selectAndIterateRecords } from "../utilities/duckdb-wasm"; // Import your query execution function

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Rnd } from "react-rnd";
import { useUpload } from "../utilities/runtime-helpers";
import EditModal from "../components/EditModal";
import UploadModal from "../components/UploadModal";
import ChartHeader from "../components/ChartHeader";
import { uploadData } from "../utilities/dataUpload"; // Import upload function
import {
  bar_chart,
  line_chart,
  pie_chart,
  scatter_chart,
  time_series_chart,
} from "../config";

const _dashboardConfig = [
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
  { id: 5, title: "Market Share", type: "pie", options: pie_chart },
];

function MainComponent() {
  const [dashboardConfig, setDashboardConfig] = useState(_dashboardConfig);

  useEffect(() => {
    (async () => {
      try {
        await initDuckDB();
        await createDashboardConfigTable();
        console.log("config from DB ", result);
      } catch (error) {
        console.error("Error fetching dashboard config:", error);
      }
      
      const result = [];
      await selectAndIterateRecords(result);
      setDashboardConfig(result); // Assuming result is in the correct format
    })()
  }, []); // Empty dependency array ensures this runs once on mount

  const [searchTerm, setSearchTerm] = useState("");
  const [charts, setCharts] = useState(dashboardConfig);
  const [chartInstances, setChartInstances] = useState({});
  const [editingChart, setEditingChart] = useState(null); // State for editing chart
  const [showEditModal, setShowEditModal] = useState(false);
  const [layouts, setLayouts] = useState({});
  const [showUploadModal, setShowUploadModal] = useState(false);

  
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
    "https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js";
    script.async = true;
    script.onload = () => {
      const instances = {};
      if(charts && charts.length > 0){
        charts.forEach((chart) => {
          const element = document.getElementById(chart.id);
          if (element) {
            const instance = echarts.init(element);
            instances[chart.id] = instance;
            renderChart(instance, chart.type);
          }
        });

      }
      setChartInstances(instances);
      
      // window.addEventListener("resize", handleResize);
      return () => {
        Object.values(instances).forEach((instance) => instance.dispose());
        window.removeEventListener("resize", handleResize);
      };
    };
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);
  
  // if(!dashboardConfig) {
  //   return <p className="tw-head">Loading</p>
  // }
  
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
    if (!result.destination) return; // Allow drag only in edit mode
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

  const handleChartEdit = (chartId, formData) => {
    const { title, type, options } = formData;

    // Ensure options are parsed correctly
    let parsedOptions;
    try {
      parsedOptions = JSON.parse(options);
    } catch (error) {
      console.error("Failed to parse ECharts options:", error);
      return; // Exit if parsing fails
    }

    const updatedChart = {
      ...charts.find((c) => c.id === chartId),
      title,
      type,
      options: parsedOptions, // Use parsed options
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
        <Droppable droppableId="droppable" direction="vertical">
          {(provided) => (
            <div
              className="p-4 bg-[#ffffff] flex flex-col"
              ref={provided.innerRef}
              {...provided.droppableProps}
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
                          ref={provided.innerRef}
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
