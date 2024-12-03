"use client";
import { useEffect, useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom"; // Import Router and Routes
import { createDashboardConfigTable, initDuckDB, insertDummyData } from "../utilities/duckdb-wasm"; // Import your query execution function
import "./draggable-resizable.css"; // Import the existing CSS file
import "./edit-mode-styles.css"; // Import the new edit mode styles

import AddDashboard from "./AddDashboard";
import DashboardContainer from "./DashboardContainer"; // Import the new DashboardContainer component
import EditDashboard from "./EditDashboard";
import LandingPage from "./LandingPage"; // Import the LandingPage component
import ListDashboards from "./ListDashboards";

function MainComponent() {
  const [loading, setLoading] = useState(false); // Loading state

  const refreshDB = async () => {
      try {
        await initDuckDB();
        await createDashboardConfigTable();
        await insertDummyData();
        // await selectAndIterateRecords();
        setLoading(false); // Set loading to false after fetching
      } catch (error) {
        console.error("Error initializing dashboard config:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    }; // Empty dependency array ensures this runs once on mount

  if (loading) {
    // return a full page overlapping animated spinner from here
    return (
      <>
        <div className="overlay"></div>
        <div className="spinner"></div>
      </>
    );
  }
  
  return (
    <>
    <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={() => { document.location.href = '/' }}  data-discover="true">HOME</button>
    <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={async() => { setLoading(true); await refreshDB();setLoading(false); }}  data-discover="true">REFRESH</button>
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        {/* Add other routes for adding, editing, and listing dashboards here */}
        <Route path="/add-dashboard" element={<AddDashboard />} />
        <Route path="/edit-dashboard" element={<EditDashboard />} />
        <Route path="/list-dashboards" element={<ListDashboards />} />
        <Route path="/dashboard" element={<DashboardContainer dashboard_id={1} />} /> {/* New route for DashboardContainer */}
      </Routes>
    </Router>
    </>
  );
}

export default MainComponent;
