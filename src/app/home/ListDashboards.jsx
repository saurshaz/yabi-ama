import React, { useState } from 'react';
import Link from 'next/link';

const dummyData = [
  { id: 1, name: 'Dashboard 1', dateCreated: '2023-01-01', owner: 'Alice' },
  { id: 2, name: 'Dashboard 2', dateCreated: '2023-01-02', owner: 'Bob' },
  { id: 3, name: 'Dashboard 3', dateCreated: '2023-01-03', owner: 'Charlie' },
  // Add more dummy data as needed
];

const ListDashboards = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = dummyData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">List of Dashboards</h1>
      <div className="mb-4 flex items-center">
        <input type="text" placeholder="Search..." className="border rounded p-2" />
        <select className="border rounded p-2 ml-2">
          <option value="name">Sort by Name</option>
          <option value="date">Sort by Date</option>
        </select>
      </div>
      <table className="min-w-full border">
        <thead>
          <tr>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Date Created</th>
            <th className="border px-4 py-2">Owner</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((dashboard) => (
            <tr key={dashboard.id}>
              <td className="border px-4 py-2">
                <Link href={`/app/${dashboard.id}`} className="text-blue-500 hover:underline">
                  {dashboard.name}
                </Link>
              </td>
              <td className="border px-4 py-2">{dashboard.dateCreated}</td>
              <td className="border px-4 py-2">{dashboard.owner}</td>
              <td className="border px-4 py-2 flex space-x-2">
                <button className="text-yellow-500 hover:underline">Edit</button>
                <button className="text-red-500 hover:underline">Delete</button>
                <button className="text-gray-500 hover:underline">Settings</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4">
        {Array.from({ length: Math.ceil(dummyData.length / itemsPerPage) }, (_, index) => (
          <button key={index + 1} onClick={() => paginate(index + 1)} className="border px-2 py-1 mx-1">
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ListDashboards;
