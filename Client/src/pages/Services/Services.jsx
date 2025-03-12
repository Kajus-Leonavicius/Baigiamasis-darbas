import React, { useEffect, useState } from 'react'
import Navigation from '../../components/Navigation'
import ServiceTable from '../../components/ServiceTable'

function Services() {
    const [services, setServices] = useState([])

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
  return (
    <div className='w-full h-full flex'>
        <Navigation/>
        <ServiceTable services={services} getServices={getServices}/>
    </div>
  )
}

export default Services