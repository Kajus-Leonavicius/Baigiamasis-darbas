import React from 'react'

function DataTable() {
  return (
<table className="w-full border-collapse border border-gray-300 shadow-lg rounded-lg overflow-hidden">
    {/* Table Header */}
    <thead className="bg-blue-500 text-white">
        <tr>
            <th className="p-3 text-left">Darbuotojas</th>
            <th className="p-3 text-left">Pareigos</th>
            <th className="p-3 text-left">Veiksmai</th>
        </tr>
    </thead>

    {/* Table Body */}
    <tbody className="bg-white divide-y divide-gray-200">
        <tr className="hover:bg-gray-100 transition duration-200">
            <td className="p-4">Jonas Jonaitis</td>
            <td className="p-4">Mechanikas</td>
            <td className="p-4">
                <button className="px-4 py-2 bg-green-500 text-white rounded-md shadow-md hover:bg-green-600 transition duration-200">Edit</button>
                <button className="ml-2 px-4 py-2 bg-red-500 text-white rounded-md shadow-md hover:bg-red-600 transition duration-200">Delete</button>
            </td>
        </tr>
        <tr className="hover:bg-gray-100 transition duration-200">
            <td className="p-4">Petras Petraitis</td>
            <td className="p-4">Elektrikas</td>
            <td className="p-4">
                <button className="px-4 py-2 bg-green-500 text-white rounded-md shadow-md hover:bg-green-600 transition duration-200">Edit</button>
                <button className="ml-2 px-4 py-2 bg-red-500 text-white rounded-md shadow-md hover:bg-red-600 transition duration-200">Delete</button>
            </td>
        </tr>
    </tbody>
</table>

  )
}

export default DataTable