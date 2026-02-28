
import { useEffect } from 'react'
import Modal from '../components/Modal'

function DataTable({employees, getEmployees}) {

    const deleteEmployee = async (employee_id) =>{

        const token = localStorage.getItem('access_token')

        const response = await fetch(`http://127.0.0.1:5000/api/employees/delete_employee/${employee_id}`,{
            method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    credentials: 'include'
        })
        getEmployees()
    }
    return (
        <div>
            <table className="w-full border-collapse border border-gray-300 shadow-lg rounded-lg overflow-hidden">
                <thead className="bg-blue-500 text-white">
                    <tr>
                        <th className="p-3 text-left">Darbuotojas</th>
                        <th className="p-3 text-left">Pareigos</th>
                        <th className="p-3 text-left">Veiksmai</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {employees && employees.length > 0 ? (
                    employees.map((employee, index) => (
                        <tr className="hover:bg-gray-100 transition duration-200" key={index}>
                        <td className='p-3'>{employee.name} {employee.surname}</td>
                        <td>{employee.role}</td>
                        <td>
                            <button onClick={() => deleteEmployee(employee.id)} className='bg-red-500 mr-4 p-2 rounded-md text-white'>Ištrinti</button>
                        </td>
                        </tr>
                    ))
                    ) : (
  <tr>
    <td colSpan="3" className="text-center p-3">Darbuotojų nėra</td>
  </tr>
)}
                </tbody>
            </table>
        </div>
        )
        }

export default DataTable