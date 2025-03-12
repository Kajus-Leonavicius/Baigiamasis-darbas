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
    const [comment, setComment] = useState("")

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("access_token")

            console.log
    
            if (!token) {
                console.error("No access token found. User is not logged in.");
                return;
            }

            console.log("🔍 Sending Request with Token:", token)
    
            try {
                const response = await fetch("http://127.0.0.1:5000/api/appointments/get_appointments", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`, // ✅ Send JWT token
                        "Content-Type": "application/json",
                    },
                    credentials: 'include'
                });
                

                if (!response.ok) {
                    throw new Error("Failed to fetch appointments");
                }
    
                const data = await response.json();
                console.log("API Response:", data);
    
                const event = data.map((item) => ({
                    title: item.services.length > 0 ? item.services[0].title : "No Service",
                    start: item.date,
                    end: item.end_date,
                    extendedProps: {
                        licensePlate: item.vehicle.license_plate,
                        vehicle: item.vehicle,
                        customer: item.client,
                        service: item.services,
                        employees: item.employees,
                        comments: item.comments,
                        id: item.id,
                    }
                }));
    
                setEvents(event);
            } catch (error) {
                console.error("Error fetching appointments:", error.message);
            }
        };
    
        fetchData();
    }, []);
    

    const handleChange = (event) => {
        setComment(event.target.value);
    };

    const addComment = async () => {
        try {
            console.log(details.extendedProps.id)
            const response = await fetch("http://127.0.0.1:5000/api/comments/create_comment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ text: comment, appointment_id: details.extendedProps.id}),
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error("Failed to create comment");
            }

            console.log("Comment created successfully");
            setComment("");
        } catch (error) {
            console.error("Error occurred:", error);
        }
    };

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
                        <li onClick={() =>setActiveTab("Comments")} className={`pl-4 pr-4 ${activeTab === "Comments" ? 'border-b-3' : null}`}>Comments</li>

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
                            <p className='p-1 border-b'>VIN: {details.extendedProps.vehicle.VIN}</p>
                            <p className='p-1 border-b'>make: {details.extendedProps.vehicle.make}</p>
                            <p className='p-1 border-b'>model: {details.extendedProps.vehicle.model}</p>
                            <p className='p-1 border-b'>year: {details.extendedProps.vehicle.year}</p>
                            <p className='p-1 border-b'>engine displacment: {details.extendedProps.vehicle.engine} l</p>
                            <p className='p-1 border-b'>engine power: {details.extendedProps.vehicle.Kw}</p>
                        </div>
                    )}
                    {activeTab === "Services" && (
                        <div>
                            {details.extendedProps.service.length > 0 ? (
                                details.extendedProps.service.map((s, index) => (
                                    <div key={index}>
                                        <p className='p-1 border-b'>Title: {s.title}</p>
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
                            {details.extendedProps.employees.length > 0 ? (
                                details.extendedProps.employees.map((e, index) => (
                                    <div key={index}>
                                        <p className='p-1 border-b'>name: {e.name} {e.surname}</p>
                                    </div>
                                    ))
                            ) : (
                                    <p>No services assigned</p>
                                )}
                        </div>
                    )}
                    {activeTab === "Comments" && (
                        <div className='flex'>
                            <div className='flex flex-col mr-48 mt-4 h-auto items-center'>
                                <input type="text" placeholder="Write a comment..."  value ={comment} onChange={handleChange} className='border-1 rounded-md h-20 w-52' />
                                <button className='bg-blue-500 text-white p-2 rounded-md w-52 mt-2' onClick={addComment}>Add new comment</button>
                            </div>
                            <div className='flex flex-col'>
                                {details.extendedProps.comments.length > 0 ? (
                                    details.extendedProps.comments.map((c, index) => (
                                        <div key={index} className='mt-2 rounded-md bg-gray-200 h-10  w-auto p-4 flex justify-center flex-col'>
                                            <p className=''>{c.text}</p>
                                        </div>
                                        ))
                                ) : (
                                        <p>No comments yet</p>
                                    )}
                            </div>
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
            selectable = {true}
            events ={events}
            eventClick ={(info)=> modalOpen(info.event)}
            
        />
    </div>
  )
}

export default Calendar