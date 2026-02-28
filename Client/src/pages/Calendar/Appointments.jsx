import React, { useEffect, useState } from 'react'
import Calendar from '../../components/Calendar'
import Navigation from '../../components/Navigation'
import ToolBar from '../../components/toolbar'
import Modal from '../../components/Modal'
import AppointmentForm from '../../components/AppointmentForm'


function Appointments() {
  const [modal, setModal] = useState(false)
  const [employees, setEmployees] = useState([])
  const [filter, setFilter] = useState('')
  const [refreshCalendar, setRefreshCalendar] = useState(false)

  useEffect(()=>{
    getEmployees()
  },[])

  const openModal = () =>{
    setModal(true)
  }

  const handleSuccess = () => {
    setModal(false);         // Uždaro modalą
    setRefreshCalendar(prev => !prev); // Pakeičia refresh flagą
  }

  const filterSelect = (value) =>{
    setFilter(value)
    console.log(value)
  }

  const getEmployees = async () =>{
    try{

        const token = localStorage.getItem('access_token')
        const data = await fetch('http://127.0.0.1:5000/api/employees/get_employees',{
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

        setEmployees(response)
    }catch(error){
        return console.log('error occured', error)
    }
}
  return (
    <div className='flex flex-col md:flex-row h-screen overflow-hidden'>
      {modal && (< Modal close={() => setModal(false)} title={"Naujas vizitas"}>
      < AppointmentForm onSuccess={handleSuccess}/>
      </Modal>
      )}
      < Navigation/>
      <div className='w-full h-full'>
        <ToolBar>
        <div className='flex mr-2 items-center'>
          <p>filtruoti pagal:</p>
          <select className='border-1 rounded-md ml-2 mr-4' onChange={(e)=>filterSelect(e.target.value)}>
            <option value="">pasirinkkite darbuotoja </option>
            {employees && employees.length > 0 ? (
            employees.map(employee => (
              <option key={employee.id} value={employee.id}>
              {employee.name} {employee.surname} ({employee.specialization})
              </option>
            ))
            ) : (
            <option disabled>Nėra darbuotojų</option>
            )}
          </select>
        </div>
        <button className='border-1 p-0.5 pl-3 pr-3 rounded-md' onClick={openModal}>+ Sukurti naują vizitą</button>
        </ToolBar>
        <Calendar filter={filter} refresh={refreshCalendar}/>
      </div>
    </div>
  )
}

export default Appointments