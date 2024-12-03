import React from 'react';
import { Link } from 'react-router-dom';

const ListDashboards = () => {
  return (
    <div>
      <h1>List of Dashboards</h1>
      {/* Add functionality to list saved dashboards here */}
    <Link to="/dashboard" className="px-4 py-2 bg-gray-500 text-white rounded row">
        Dashboard
    </Link>
    </div>
  );
};

export default ListDashboards;
