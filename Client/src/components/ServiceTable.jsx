import React from 'react'

function ServiceTable({services, getServices}) {
  return (
    <div className='w-full'>
            <table className="w-full border-collapse border border-gray-300 shadow-lg rounded-lg overflow-hidden">
                <thead className="bg-blue-500 text-white">
                    <tr>
                        <th className="p-3 text-left">Pavadinimas</th>
                        <th className="p-3 text-left">Aprasymas</th>
                        <th className="p-3 text-left">Trukme</th>
                        <th className="p-3 text-left">busena</th>
                        <th className="p-3 text-left">Veiksmai</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {services ? services.map((service, index)=>(
                        <tr key={index}>
                            <td>{service.service_name}</td>
                            <td>{service.description}</td>
                            <td>{service.duration}</td>
                            <td>{service.status}</td>
                            <td>
                            <button className='bg-red-500 mr-4 p-2 rounded-md text-white'>istrinti</button>
                            </td>
                        </tr>
                    )) : <td>no services yet</td>}
                </tbody>
            </table>
        </div>
  )
}

export default ServiceTable