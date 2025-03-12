import React, { useEffect, useState } from 'react'
import Navigation from '../../components/Navigation.jsx'
import ToolBar from '../../components/ToolBar.jsx'
import user from '../../assets/User.svg'
import Modal from '../../components/Modal.jsx'

function Customers() {
  const [customers, setCustomers] = useState([])
  const [modal, setModal] = useState(false)
  const [apoointmentHistory, setAppointmentHistory] = useState([])

  useEffect(()=>{
    getCustomers()
  },[])

  const getCustomers = async () =>{
    try{
        const token = localStorage.getItem('access_token')
        const data = await fetch('http://127.0.0.1:5000/api/customers/get_customers',{
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            credentials: 'include',
        })

        if (!data.ok) {
            throw new Error("Failed to fetch employees");
        }

        const response = await data.json()
        console.log(response)
        setCustomers(response)
  }catch(error){
      return console.log('error occured', error)
  }
  }
  const getUserAppointmentHistory = async (customer_id) =>{
    try{
      const token = localStorage.getItem('access_token')
      const data = await fetch(`http://127.0.0.1:5000/api/customers/get_customer_appointments/${customer_id}`,{
          method: "GET",
          headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
          },
          credentials: 'include',
      })

      if (!data.ok) {
          throw new Error("Failed to fetch employees");
      }
      const response = await data.json()
      console.log("response: ", response)
      setAppointmentHistory(response)
      setModal(true)
}catch(error){
    return console.log('error occured', error)
}
  }
  return (
    <div className='w-full h-full flex'>
      {modal &&(
        <Modal title={'Customer Details'} close={()=>setModal(false)}>
          <div className='mt-4 w-full flex'>
              <img src={user} alt="" className='w-18'/>
              {customers.map((customer, index)=>(
                <div key={index}>
                  <p className='ml-4'><span className='font-semibold'>Name: </span>{customer.name}</p>
                  <p className='ml-4'><span className='font-semibold'>Surname: </span>{customer.surname}</p>
                  <p className='ml-4'><span className='font-semibold'>Phone number: </span>{customer.phone}</p>
                  <p className='ml-4'><span className='font-semibold'>Email: </span>{customer.email}</p>
                </div>
              ))}
          </div>
          <div className='border-b-1 w-auto pl-4 pr-4 mt-6'>
                <p className='font-semibold'>Appointment History:</p>
          </div>
          <div>
            {setAppointmentHistory && (
              apoointmentHistory.map((data, index)=>(
                <div key={index} className='p-2 border-b-1 flex justify-between gap-5'>
                    <p>{data.id}</p>
                    <p className='ml-6'>{data.date}</p>
                    {data.services.map((service, empIndex) => (
                      <p className='ml-6' key={empIndex}>{service.title}</p>
                    ))}
                    <p className='ml-6'>{data.Vehicle.make} {data.Vehicle.model}</p>
                    <p className='ml-6'>{data.Vehicle.VIN}</p>
                    {data.employees.map((employee, empIndex) => (
                      <p className='ml-6' key={empIndex}>{employee.name} {employee.surname}</p>
                    ))}
                </div>
              ))
            )}
          </div>
        </Modal>
      )}
      <Navigation/>
      <div className='w-full'>
        <ToolBar>
        <button className='border-1 p-0.5 pl-3 pr-3 rounded-md'>+ New</button>
        </ToolBar>
        {customers && (
          customers.map((customer, index)=>(
            <div onClick={()=>getUserAppointmentHistory(customer.id)} key={index} className='w-72 mt-4 ml-4  p-4 h-auto border-1 flex rounded-md hover:shadow-lg'>
            <img src={user} alt="" className='w-14' />
            <p className='ml-4'>{customer.name} {customer.surname}</p>
        </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Customers