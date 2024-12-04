"use client";
// import { useEffect, useState } from "react";
import {
  createDashboardConfigTable,
  initDuckDB,
  insertDummyData,
} from "@/utilities/duckdb-wasm"; // Import your query execution function
import "./app/draggable-resizable.css"; // Import the existing CSS file
import "./app/edit-mode-styles.css"; // Import the new edit mode styles
import { useRouter } from "next/navigation";
import Link from "next/link";

function MainComponent() {
  const router = useRouter();
  // const [loading, setLoading] = useState(false); // Loading state

  const refreshDB = async () => {
    try {
      await initDuckDB();
      await createDashboardConfigTable();
      await insertDummyData();
      // await selectAndIterateRecords();
      // setLoading(false); // Set loading to false after fetching
    } catch (error) {
      console.error("Error initializing dashboard config:", error);
    } finally {
      // setLoading(false); // Set loading to false after fetching
    }
  }; // Empty dependency array ensures this runs once on mount

  // if (loading) {
  //   // return a full page overlapping animated spinner from here
  //   return (
  //     <>
  //       <div className="overlay"></div>
  //       <div className="spinner"></div>
  //     </>
  //   );
  // }

  return (
    <>
      <nav>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => {
            document.location.href = "/";
          }}
          data-discover="true"
        >
          HOME
        </button>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={async () => {
            // setLoading(true);
            await refreshDB();
            // setLoading(false);
          }}
          data-discover="true"
        >
          REFRESH
        </button>
      </nav>
      <main>
        <div className="space-y-2">
          <Link
            href="/add"
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Add
          </Link>
          <Link
            href="/edit"
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            Edit
          </Link>
          <Link
            href="/app"
            className="px-4 py-2 bg-gray-500 text-white rounded"
          >
            App
          </Link>
        </div>
        
      </main>
    </>
  );
}

export default MainComponent;
