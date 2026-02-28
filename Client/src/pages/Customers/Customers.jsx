import React, { useEffect, useState } from 'react'
import Navigation from '../../components/Navigation.jsx'
import ToolBar from '../../components/ToolBar.jsx'
import user from '../../assets/User.svg'
import Modal from '../../components/Modal.jsx'

function Customers() {
  const [customers, setCustomers] = useState([])
  const [modal, setModal] = useState(false)
  const [appointmentHistory, setAppointmentHistory] = useState([])
  const [activeCustomer, setActiveCustomer] = useState(null)

  useEffect(() => {
    getCustomers()
  }, [])

  const getCustomers = async () => {
    try {
      const token = localStorage.getItem('access_token')
      const data = await fetch('http://127.0.0.1:5000/api/customers/get_customers', {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: 'include',
      })

      if (!data.ok) throw new Error("Failed to fetch customers")

      const response = await data.json()
      setCustomers(response)
    } catch (error) {
      console.log('Error occurred while fetching customers:', error)
    }
  }

  const getUserAppointmentHistory = async (customer_id) => {
    try {
      const token = localStorage.getItem('access_token')
      const data = await fetch(`http://127.0.0.1:5000/api/customers/get_customer_appointments/${customer_id}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: 'include',
      })

      if (!data.ok) throw new Error("Failed to fetch appointment history")

      const response = await data.json()
      setAppointmentHistory(response)

      // Find selected customer and set active
      const selectedCustomer = customers.find(c => c.id === customer_id)
      setActiveCustomer(selectedCustomer)

      setModal(true)
    } catch (error) {
      console.log('Error occurred while fetching history:', error)
    }
  }

  const closeModal = () => {
    setModal(false)
    setActiveCustomer(null)
    setAppointmentHistory([])
  }

  return (
    <div className='w-full h-full flex'>
      {modal && (
        <Modal title={'Kliento informacija'} close={closeModal}>
          <div className='mt-4 w-full flex'>
            <img src={user} alt="" className='w-18' />
            {activeCustomer && (
              <div>
                <p className='ml-4'><span className='font-semibold'>Vardas: </span>{activeCustomer.name}</p>
                <p className='ml-4'><span className='font-semibold'>Pavardė: </span>{activeCustomer.surname}</p>
                <p className='ml-4'><span className='font-semibold'>Tel. numeris: </span>{activeCustomer.phone}</p>
                <p className='ml-4'><span className='font-semibold'>El. paštas: </span>{activeCustomer.email}</p>
              </div>
            )}
          </div>

          <div className='border-b-1 w-auto pl-4 pr-4 mt-6'>
            <p className='font-semibold'>Vizitų istorija:</p>
          </div>

          <div>
            {appointmentHistory.map((data, index) => (
              <div key={index} className='p-2 border-b-1 flex justify-between gap-5'>
                <p>{data.id}</p>
                <p className='ml-6'>{data.date}</p>
                {data.services.map((service, sIdx) => (
                  <p className='ml-6' key={sIdx}>{service.title}</p>
                ))}
                <p className='ml-6'>{data.Vehicle.make} {data.Vehicle.model}</p>
                <p className='ml-6'>{data.Vehicle.VIN}</p>
                {data.employees.map((employee, eIdx) => (
                  <p className='ml-6' key={eIdx}>{employee.name} {employee.surname}</p>
                ))}
              </div>
            ))}
          </div>
        </Modal>
      )}

      <Navigation />

      <div className='w-full'>
        {customers && customers.map((customer, index) => (
          <div
            onClick={() => getUserAppointmentHistory(customer.id)}
            key={index}
            className='w-72 mt-4 ml-4  p-4 h-auto border-1 flex rounded-md hover:shadow-lg cursor-pointer'
          >
            <img src={user} alt="" className='w-14' />
            <p className='ml-4'>{customer.name} {customer.surname}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Customers
