import React, { useEffect, useState } from 'react'
import Navigation from '../../components/Navigation'
import ServiceTable from '../../components/ServiceTable'
import Modal from '../../components/Modal.jsx'
import ToolBar from '../../components/ToolBar.jsx'

function Services() {
    const [services, setServices] = useState([])
    const [modal, setModal] = useState(false)
    const [newService, setNewService] = useState({
        service_name: '',
        description: '',
        duration: '',
        status: '',
    })

    useEffect(()=>{
        getServices()
    }, [])

    const getServices = async () =>{
        try{
            const token = localStorage.getItem('access_token')
            const data = await fetch('http://127.0.0.1:5000/api/services/get_services',{
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
            setServices(response)
      }catch(error){
          return console.log('error occured', error)
      }}

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewService((prevNewService) => ({
          ...prevNewService,
          [name]: value,
        }));
      };
    
      const addNewService = async () =>{

        const token = localStorage.getItem('access_token')
        //const company_name =localStorage.getItem('company_name')
    
        const formateddata = {
          service_name: newService.service_name,
          description: newService.description,
          duration: newService.duration,
          status: newService.status,
        }

        const response = await fetch('http://127.0.0.1:5000/api/services/create_service',{
          method: 'POST',
          headers:{"Content-type": "application/json", "Authorization": `Bearer ${token}`,},
          body: JSON.stringify(formateddata)
        })
    
        if(!response.ok){
          throw new Error('failed to create employee')
        }
        setNewService({ service_name: '', duration: '', status: '', description: ''});
        setModal(false)
        getServices()
      }
  return (
    <div className='w-full h-full flex'>
        {modal && (
            <Modal title={"Nauja paslauga"} close={()=>setModal(false)}>
                <div className='items-center flex flex-col justify-center'>
                    <div className='flex flex-col mt-4'>
                        <label>Paslaugos pavadinimas</label>
                        <input type="text" name='service_name' value={newService.service_name} onChange={handleInputChange} className='border-1 rounded-md'/>
                    </div>
                        <div className='flex flex-col mt-2'>
                        <label>Aprasymas</label>
                    <input type="text" className='border-1 rounded-md' name='description' value={newService.description} onChange={handleInputChange}/>
                    </div>
                    <div className='flex flex-col mt-2'>
                        <label>trukme(min)</label>
                        <input type="text" className='border-1 rounded-md' name='duration' value={newService.duration} onChange={handleInputChange}/>
                    </div>
                    <div className='flex flex-col mt-2'>
                        <label>busena</label>
                        <input type="text" className='border-1 rounded-md' name='status' value={newService.status} onChange={handleInputChange}/>
                    </div>
                    <div>
                        <button className='bg-blue-500 rounded-md p-2 text-white mt-4' onClick={addNewService}> pridėti paslaugą</button>
                    </div>
                </div>
            </Modal>
        )}
        <Navigation/>
        <div className='w-full h-full'>
            <ToolBar>
                <button className='border-1 p-0.5 pl-3 pr-3 rounded-md' onClick={()=>setModal(true)}>+ Pridėti naują paslaugą</button>
            </ToolBar>
            <ServiceTable services={services} getServices={getServices}/>
        </div>
    </div>
  )
}

export default Services