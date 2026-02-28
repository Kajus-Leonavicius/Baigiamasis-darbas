import React, { useState, useEffect } from 'react'
import Navigation from '../../components/Navigation.jsx'
import ToolBar from '../../components/ToolBar.jsx'
import DataTable from '../../components/DataTable.jsx'
import Modal from '../../components/Modal.jsx'

function Employees() {
  const [modal, setModal] = useState(false)
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    surname: '',
    role: '',
    phone: '',
    email: '',
  })
  const[employees, setEmployees] = useState([])

useEffect(()=>{
  getEmployees()
}, [])

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
        console.log(response)
    }catch(error){
        return console.log('error occured', error)
    }
}

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewEmployee((prevEmployee) => ({
      ...prevEmployee,
      [name]: value,
    }));
  };

  const addEmployee = async () =>{

    const token = localStorage.getItem('access_token')
    const company_name =localStorage.getItem('company_name')

    const formateddata = {
      name: newEmployee.name,
      surname: newEmployee.surname,
      email: newEmployee.email,
      phone: newEmployee.phone,
      role: newEmployee.role,
      company_name: company_name,
      password: newEmployee.password
    }
    const response = await fetch('http://127.0.0.1:5000/api/employees/create_employee',{
      method: 'POST',
      headers:{"Content-type": "application/json", "Authorization": `Bearer ${token}`,},
      body: JSON.stringify(formateddata)
    })

    if(!response.ok){
      throw new Error('failed to create employee')
    }
    setNewEmployee({ name: '', surname: '', role: '', phone: '', email: '', password: ''});
    setModal(false)
    getEmployees()
  }
  return (
    <div className='h-full flex w-full'>
      {modal &&(
        <Modal title={"Naujas Darbuotojas"} close={()=>setModal(false)}>
          <div className='items-center flex flex-col justify-center'>
            <div className='flex flex-col mt-4'>
              <label>Vardas</label>
              <input type="text" name='name' value={newEmployee.name} onChange={handleInputChange} className='border-1 rounded-md'/>
            </div>
            <div className='flex flex-col mt-2'>
              <label>Pavarde</label>
              <input type="text" className='border-1 rounded-md' name='surname' value={newEmployee.surname} onChange={handleInputChange}/>
            </div>
            <div className='flex flex-col mt-2'>
              <label>Pareigos</label>
              <input type="text" className='border-1 rounded-md' name='role' value={newEmployee.role} onChange={handleInputChange}/>
            </div>
            <div className='flex flex-col mt-2'>
              <label>tel.numeris</label>
              <input type="text" className='border-1 rounded-md' name='phone' value={newEmployee.phone} onChange={handleInputChange}/>
            </div>
            <div className='flex flex-col mt-2'>
              <label>El. pašto adresas</label>
              <input type="text" className='border-1 rounded-md' name='email' value={newEmployee.email} onChange={handleInputChange}/>
            </div>
            <div className='flex flex-col mt-2'>
              <label>Slaptažodis</label>
              <input type="text" className='border-1 rounded-md' name='password' value={newEmployee.password} onChange={handleInputChange}/>
            </div>
            <div>
              <button className='bg-blue-500 rounded-md p-2 text-white mt-4' onClick={addEmployee}>Pridėti naują darbuotoją</button>
            </div>
          </div>
        </Modal>
      )}
      <Navigation/>
      <div className='w-full'>
        <ToolBar>
          <button className='border-1 p-0.5 pl-3 pr-3 rounded-md' onClick={()=>setModal(true)}>+ Pridėti nauja darbuotoją</button>
        </ToolBar>
        <DataTable employees={employees} getEmployees={getEmployees}/>
      </div>
    </div>
  )
}

export default Employees