import React, { useEffect, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import '@fullcalendar/daygrid'
import '@fullcalendar/core'
import timeGridPlugin from '@fullcalendar/timegrid';
import Modal from './Modal'
import LicensePlate from './LicensePlate'


function Calendar() {
    const [events, setEvents] = useState([])
    const [modal, setModal] = useState(false)
    const [details, setDetails] = useState(null)
    const [activeTab, setActiveTab] = useState("")
    useEffect(()=> {
        const fetchData = async () =>{
            try{
                const response = await fetch('http://127.0.0.1:5000/api/appointments/get_appointments')

                const data = await response.json()

                const event = data.map((item)=>({
                    title: item.services.length > 0 ? item.services[0].title : "No Service",
                    start: item.date,
                    end: item.end_date,
                    extendedProps: {
                        licensePlate: item.Vehicle.license_plate,
                        vehicle: item.Vehicle,
                        customer: item.Client,
                        service: item.services,
                        employee: item.Employee,
                    }
                })) 
                setEvents(event)
            }catch(error){
                return console.error('error ocured: ', error.message )
            }
        }
        fetchData()
    },[])
    const modalOpen = (appointment) =>{
        setDetails(appointment)
        setModal(true)
    }

    const closeModal = () =>{
        setModal(false)
    }
  return (
    <div className='w-full h-auto overflow-scroll m-4'>
        {modal && (
            < Modal title={"Appointment details"} close={closeModal}>
                <p>{details.extendedProps.vehicle.make} {details.extendedProps.vehicle.model}</p>
                <LicensePlate number={details.extendedProps.licensePlate}/>
                <div className='mt-4 cursor-pointer'>
                    <ul className='flex gap-5 border-b-1'>
                        <li onClick={() =>setActiveTab("Customer")} className={`pl-4 pr-4 ${activeTab ===  "Customer" ?'border-b-3' : null}`}>Customer</li>
                        <li onClick={() =>setActiveTab("Vehicle")} className={`pl-4 pr-4 ${activeTab === "Vehicle" ? 'border-b-3' : null}`}>Vehicle</li>
                        <li onClick={() =>setActiveTab("Services")} className={`pl-4 pr-4 ${activeTab === "Services" ? 'border-b-3' : null}`}>Services</li>
                        <li onClick={() =>setActiveTab("Employees")} className={`pl-4 pr-4 ${activeTab === "Employees" ? 'border-b-3' : null}`}>Assigned employees</li>
                    </ul>
                    {activeTab === "Customer" && (
                        <div>
                            <p className='p-1 border-b'>name: {details.extendedProps.customer.name}</p>
                            <p className='p-1 border-b'>surname: {details.extendedProps.customer.surname}</p>
                            <p className='p-1 border-b'>phone: {details.extendedProps.customer.phone}</p>
                            <p className='p-1 border-b'>email: {details.extendedProps.customer.email}</p>
                        </div>
                    )}
                    {activeTab === "Vehicle" && (
                        <div>
                            <p className='p-1 border-b'>make: {details.extendedProps.vehicle.VIN}</p>
                            <p className='p-1 border-b'>make: {details.extendedProps.vehicle.make}</p>
                            <p className='p-1 border-b'>model: {details.extendedProps.vehicle.model}</p>
                            <p className='p-1 border-b'>year: {details.extendedProps.vehicle.year}</p>
                            <p className='p-1 border-b'>engine displacment: {details.extendedProps.vehicle.engine} l</p>
                            <p className='p-1 border-b'>engine power: {details.extendedProps.vehicle.KW}</p>
                        </div>
                    )}
                    {activeTab === "Services" && (
                        <div>
                            {details.extendedProps.service.length > 0 ? (
                                details.extendedProps.service.map((s, index) => (
                                    <div key={index}>
                                        <p className='p-1 border-b'>Title: {s.title}</p>
                                        <p className='p-1 border-b'>Description: {s.description}</p>
                                        <p className='p-1 border-b'>Estimated Duration: {s.duration} mins</p>
                                    </div>
                                    ))
                            ) : (
                                    <p>No services assigned</p>
                                )}
                        </div>
)}
                    {activeTab === "Employees" && (
                        <div>
                            <p className='p-1 border-b'>Name: {details.extendedProps.employee.name}</p>
                            <p className='p-1 border-b'>Surname: {details.extendedProps.employee.surname}</p>
                        </div>
                    )}
                </div>
            </Modal>)}
        <FullCalendar 
            plugins={[dayGridPlugin, timeGridPlugin]} 
            initialView='timeGridWeek'
            headerToolbar = {{
                start: "prev,next",
                center: "title",
                right: 'today,dayGridMonth,timeGridWeek,timeGridDay'
            }}
            slotMaxTime ="19:00:00"
            slotDuration = "00:15:00"
            slotMinTime="07:00:00"
            editable = {true}
            selectable = {true }
            events ={events}
            eventClick ={(info)=> modalOpen(info.event)}
            
        />
    </div>
  )
}

export default Calendar