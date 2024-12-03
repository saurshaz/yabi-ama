import UploadModal from "@/components/UploadModal";
import { useState } from "react";
import { Link } from "react-router-dom";

const LandingPage = ({initDb = () => {}}) => {
  const [loading, setLoading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [sqlQuery, setSqlQuery] = useState('');
  const handleFileUpload = () => {};
  return (

    <div className="flex flex-col items-center justify-center h-screen">
      {showUploadModal && <UploadModal  sqlQuery={sqlQuery} setSqlQuery={setSqlQuery} handleFileUpload={handleFileUpload} setShowUploadModal={setShowUploadModal} />}
      <h1 className="text-3xl font-bold mb-4">Dashboard Management</h1>
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
      <div className="space-y-2">
        <Link
          to="/add-dashboard"
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Add Dashboard
        </Link>
        <Link
          to="/edit-dashboard"
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Edit Dashboard
        </Link>
        <Link
          to="/list-dashboards"
          className="px-4 py-2 bg-yellow-500 text-white rounded"
        >
          List Saved Dashboards
        </Link>
        <Link
          to="/dashboard"
          className="px-4 py-2 bg-gray-500 text-white rounded"
        >
          Dashboard
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;
