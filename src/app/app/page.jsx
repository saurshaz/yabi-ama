"use client";
import React, { useEffect, useRef, useState } from "react";
import ChartHeader from "@/components/ChartHeader";
import EditModal from "@/components/EditModal";
import UploadModal from "@/components/UploadModal";

// import { createDashboardConfigTable, initDuckDB } from "../utilities/duckdb-wasm"; // Import your query execution function
import "./draggable-resizable.css"; // Import the existing CSS file
import "./edit-mode-styles.css"; // Import the new edit mode styles
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { initDuckDB, selectAndIterateRecords } from "@/utilities/duckdb-wasm";

import { Rnd } from "react-rnd";
import { useUpload } from "@/utilities/runtime-helpers";
import { uploadData } from "@/utilities/dataUpload"; // Import upload function
import { MasonryLayout } from "./MasonryLayoutContainer";

const DashboardContainer = ({ dashboard_id = 1 }) => {
  const [dashboardConfig, setDashboardConfig] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [searchTerm, setSearchTerm] = useState(``);
  const [charts, setCharts] = useState(dashboardConfig);
  const [chartInstances, setChartInstances] = useState({});
  const [editingChart, setEditingChart] = useState(null); // State for editing chart
  const [showEditModal, setShowEditModal] = useState(false);
  const [layouts, setLayouts] = useState({});
  const [editChartData, setEditingChartData] = useState({});
  const [isEditing, setIsEditing] = useState(false); // State for edit mode
  const [sqlQuery, setSqlQuery] = useState("select * from dashboard_config;"); // Stat

  useEffect(() => {
    (async () => {
      try {
        const result = [];
        await selectAndIterateRecords(
          `
          SELECT * FROM dashboard_config;
        `,
          result
        );
        setDashboardConfig(result);
        setCharts(result); // Assuming result is in the correct format
        setLoading(false); // Set loading to false after fetching
      } catch (error) {
        console.error("Error fetching dashboard config:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    })();
  }, []); // Empty dependency array ensures this runs once on mount

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js";
    script.async = true;
    script.onload = () => {
      const instances = {};
      if (charts && charts.length > 0) {
        charts.forEach((chart) => {
          const element = document.getElementById(chart.id);
          if (element) {
            const instance = echarts.init(element);
            instances[chart.id] = instance;
            if (typeof chart?.options === "string") {
              renderChart(instance, JSON.parse(chart.options));
            } else {
              renderChart(instance, chart.options);
            }
          }
        });
      }
      setChartInstances(instances);

      return () => {
        Object.values(instances).forEach((instance) => instance.dispose());
      };
    };
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, [charts]);

  const executeSQLQuery = async () => {
    try {
      const result = await selectAndIterateRecords(sqlQuery); // Execute the SQL query
      console.log("Query Result:", result); // Log the result to the console
    } catch (error) {
      console.error("Error executing SQL query:", error);
    }
  };
  const onDragEnd = (result) => {
    if (!result.destination || !isEditing) return; // Allow drag only in edit mode
    const reorderedCharts = Array.from(charts);
    const [removed] = reorderedCharts.splice(result.source.index, 1);
    reorderedCharts.splice(result.destination.index, 0, removed);

    console.log("  onDragEnd", result);

    // if (draggableRef.current) {
    //   // Set initial position using CSS transform
    //   draggableRef.current.style.transform = "translate(100px, 100px)";
    //   const rect = draggableRef.current.getBoundingClientRect();
    //   console.log("Top:", rect.top);
    //   console.log("Right:", rect.right);
    //   console.log("Bottom:", rect.bottom);
    //   console.log("Left:", rect.left);
    //   console.log("Width:", rect.width);
    //   console.log("Height:", rect.height);
    // }
    setCharts(reorderedCharts);
  };

  const renderChart = (instance, options) => {
    instance.setOption(options);
  };

  const handleChartEdit = (chartId, editChartData) => {
    let parsedOptions;
    try {
      parsedOptions = JSON.parse(editChartData?.options);
    } catch (error) {
      console.error("Failed to parse ECharts options:", error);
      return; // Exit if parsing fails
    }

    const updatedChart = {
      ...charts.find((c) => c.id === chartId),
      title: editChartData?.title,
      type: parsedOptions?.series?.title || "bar",
      options: parsedOptions, // Use parsed options
    };

    setCharts((prev) => prev.map((c) => (c.id === chartId ? updatedChart : c)));

    const instance = chartInstances[chartId];
    if (instance) {
      renderChart(instance, parsedOptions);
    }

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
      <div className="mb-4 flex gap-4">
        <input
          type="text"
          placeholder="Search charts..."
          className="w-full p-2 border rounded font-roboto"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          onClick={() => false}
          className="px-4 py-2 bg-gray-500 text-white rounded"
        >
          Save
        </button>
        <button
          onClick={() => false}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Edit
        </button>
      </div>
      <div className="h-auto max-w-full rounded-lg">
        <div className="mb-4">
          <textarea
            value={sqlQuery}
            onChange={(e) => setSqlQuery(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter SQL query..."
            rows={4}
          />
          <button
            onClick={executeSQLQuery}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Execute Query
          </button>
        </div>
      </div>
      {loading ? ( // Show spinner while loading
        <div className="flex justify-center items-center h-full">
          <div className="loader"></div> {/* Add your spinner here */}
        </div>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable" direction="vertical">
            {(provided) => (
              <div
                className="p-4 bg-[#ffffff] flex flex-col"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <div className="flex flex-col gap-4">
                  <MasonryLayout
                    charts={charts
                    .filter((chart) => {
                      return chart.title
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase());
                    })}
                    setEditingChart={setEditingChart}
                    setShowEditModal={setShowEditModal}
                    setEditingChartData={setEditingChartData}
                    chartInstances={chartInstances}
                    setLayouts={setLayouts}
                  />

                  {provided.placeholder}
                </div>
                {showEditModal && (
                  <EditModal
                    setEditingChart={setEditingChart}
                    setShowEditModal={setShowEditModal}
                    setEditingChartData={setEditingChartData}
                    editChartData={editChartData}
                    editingChart={editingChart}
                    handleChartEdit={handleChartEdit}
                  />
                )}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </div>
  );
};

export default DashboardContainer;
