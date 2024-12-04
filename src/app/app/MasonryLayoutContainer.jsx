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


export const MasonryLayout = ({
  charts=[],
  chartInstances=[],
  setLayouts = () => { alert('missed') },
  setEditingChart = () => { alert('missed') },
  setShowEditModal = () => { alert('missed') },
  setEditingChartData = () => { alert('missed') }}) => {
  const draggableRef = useRef(null);
  // Split the images into columns
  const splitImagesIntoColumns = (charts, numColumns) => {
    const columns = Array.from({ length: numColumns }, () => []);
    charts.forEach((chart, index) => {
      columns[index % numColumns].push(chart);
    });
    return columns;
  };

  const numColumns = 3; // Number of columns for mobile
  const numColumnsMd = 4; // Number of columns for medium screens and above

  const columns = splitImagesIntoColumns(charts, numColumns);
  const columnsMd = splitImagesIntoColumns(charts, numColumnsMd);



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

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {columns.map((column, rowIndex) => (
        <div key={rowIndex} className="grid gap-4">
          {column.map((chart, colIndex) => (
            <Draggable
              key={chart.id}
              draggableId={`${chart.id}`}
              index={`${rowIndex}-${colIndex}`}
              isDragDisabled={false}
            >
              {(provided) => (
                <Rnd
                  className="bg-white rounded-lg shadow-lg"
                  ref={(element) => {
                    console.log(" element >>> ", element);
                    draggableRef.current = element;
                    provided.innerRef(element);
                  }}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  enableResizing={{
                    top: true,
                    right: true,
                    bottom: true,
                    left: true,
                    topRight: true,
                    bottomRight: true,
                    bottomLeft: true,
                    topLeft: true,
                  }}
                  onResizeStop={(e, direction, ref, delta, position) => {
                    handleResize(`${chart.id}`, {
                      width: ref.offsetWidth,
                      height: ref.offsetHeight,
                      ...position,
                    });
                  }}
                  style={{
                    width: "200px",
                    height: "400px",
                    position: "relative",
                    margin: "50px",
                    padding: "20px",
                    border: "1px solid blue",
                  }}
                >
                  <div className="col gap-4" key={chart.id}>
                    <div className="h-auto max-w-full rounded-lg">
                      <ChartHeader
                        charts={charts}
                        title={chart.title}
                        chartId={chart.id}
                        setEditingChart={setEditingChart}
                        setShowEditModal={setShowEditModal}
                        setEditingChartData={setEditingChartData}
                      />
                      <div
                        id={chart["id"]}
                        className="chart-frame h-[300px] w-full"
                      ></div>
                    </div>
                  </div>
                </Rnd>
              )}
            </Draggable>
          ))}
        </div>
      ))}
    </div>
  );
};