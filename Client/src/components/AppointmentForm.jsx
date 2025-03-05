import React, { useState, useEffect } from 'react';

function AppointmentForm() {
    const [formData, setFormData] = useState({
        email: "",
        name: "",
        surname: "",
        phone: "",
        make: "",
        model: "",
        year: "",
        VIN: "",
        license_plate: "",
        engine: "",
        KW: "",
        date: "",
        status: "scheduled",
        services: [],
        employee_id: ""
    });

    const [services, setServices] = useState([]); // List of available services
    const [employees, setEmployees] = useState([]); // List of available employees

    // Fetch Services and Employees on Load
    useEffect(() => {
        fetchServices();
        fetchEmployees();
    }, []);

    // Fetch Available Services
    const fetchServices = async () => {
        try {
            const response = await fetch("http://127.0.0.1:5000/api/services/get_services");
            const data = await response.json();
            console.log("Fetched Data:", data);
            setServices(data);
        } catch (error) {
            console.error("Error fetching services:", error);
        }
    };

    // Fetch Available Employees
    const fetchEmployees = async () => {
        try {
            const response = await fetch("http://127.0.0.1:5000/api/users/get_employees");
            const data = await response.json();
            setEmployees(data);
        } catch (error) {
            console.error("Error fetching employees:", error);
        }
    };

    // Handle Input Change
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Handle Service Selection
    const handleServiceSelection = (e) => {
        const selectedServices = Array.from(
            e.target.selectedOptions,
            (option) => parseInt(option.value)
        );
        setFormData({
            ...formData,
            services: selectedServices
        });
    };

    // Handle Form Submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formattedData = {
                ...formData,
                date: new Date(formData.date).toISOString(),
                services:formData.services
            };

            const response = await fetch("http://127.0.0.1:5000/api/appointments/create_appointment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formattedData)
            });

            const data = await response.json();

            if (response.status === 401) {
                alert("Customer already exists! Proceeding with appointment creation...");
            } else if (!response.ok) {
                console.error("Error:", data.message);
            } else {
                console.log("Appointment Created:", data);
                alert("Appointment successfully created!");
            }
        } catch (error) {
            console.error("Fetch error:", error);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className='flex flex-col items-center'>
                <div className='flex'>
                    
                    {/* Customer Section */}
                    <div className='flex flex-col mr-20 mt-4 ml-8'>
                        <p className='text-xl'>Klientas</p>
                        <div className='flex mb-2'>
                            <div className='flex flex-col mr-8'>
                                <label>Vardas</label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} className='border-1' required />
                            </div>
                            <div className='flex flex-col'>
                                <label>Pavarde</label>
                                <input type="text" name="surname" value={formData.surname} onChange={handleChange} className='border-1' required />
                            </div>
                        </div>
                        <label>El. pastas</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} className='border-1 mb-2' required />
                        <label>Tel.nr</label>
                        <input type="text" name="phone" value={formData.phone} onChange={handleChange} className='border-1' required />
                    </div>

                    {/* Vehicle Section */}
                    <div className='flex flex-col mt-4 mr-8'>
                        <p className='text-xl'>Automobilis</p>
                        <div className='flex mb-2'>
                            <div className='flex flex-col mr-8'>
                                <label>Marke</label>
                                <input type="text" name="make" value={formData.make} onChange={handleChange} className='border-1' required />
                            </div>
                            <div className='flex flex-col'>
                                <label>Modelis</label>
                                <input type="text" name="model" value={formData.model} onChange={handleChange} className='border-1' required />
                            </div>
                        </div>
                        <div className='flex mb-1'>
                            <div className='flex flex-col mr-8'>
                                <label>Pagaminimo metai</label>
                                <input type="number" name="year" value={formData.year} onChange={handleChange} className='border-1' required />
                            </div>
                            <div className='flex flex-col'>
                                <label>Valst. nr</label>
                                <input type="text" name="license_plate" value={formData.license_plate} onChange={handleChange} className='border-1' required />
                            </div>
                        </div>
                        <div className='flex mb-1'>
                            <div className='flex flex-col mr-8'>
                                <label>Variklio turis</label>
                                <input type="number" name="engine" value={formData.engine} onChange={handleChange} className='border-1' required />
                            </div>
                            <div className='flex flex-col'>
                                <label>Galia (KW)</label>
                                <input type="number" name="KW" value={formData.KW} onChange={handleChange} className='border-1' required />
                            </div>
                        </div>
                        <label>VIN kodas</label>
                        <input type="text" name="VIN" value={formData.VIN} onChange={handleChange} className='border-1' required />
                    </div>
                </div>

                {/* Date Picker Section */}
                <div className="mt-1 w-1/2 flex flex-col">
                    <label className="text-lg">Pasirinkite laiką</label>
                    <input 
                        type="datetime-local" 
                        name="date" 
                        value={formData.date} 
                        onChange={handleChange} 
                        className="border-1 p-2 mt-1 rounded-md" 
                        required 
                    />
                </div>

                {/* Service Selection */}
                <div className="mt-1 w-1/2 h-auto flex flex-col">
                    <label className="text-lg">Select Services</label>
                    <select multiple onChange={handleServiceSelection} className="border-1 p-2 mt-1 rounded-md">
                        {services.map(service => (
                            <option key={service.id} value={service.id}>
                                {service.service_name} ({service.duration} min)
                            </option>
                        ))}
                    </select>
                </div>

                {/* Employee Selection */}
                <div className="mt-1 w-1/2 flex flex-col">
                    <label className="text-lg">Select Employee</label>
                    <select name="employee_id" value={formData.employee_id} onChange={handleChange} className="border-1 p-2 mt-1 rounded-md">
                        <option value="">No Employee</option>
                        {employees.map(employee => (
                            <option key={employee.id} value={employee.id}>
                                {employee.name} {employee.surname} ({employee.specialization})
                            </option>
                        ))}
                    </select>
                </div>

                {/* Submit Button */}
                <button className='mt-8 mb-8 bg-blue-500 w-48 text-white rounded-md p-2' type='submit'>
                    Registruoti
                </button>
            </form>
        </div>
    );
}

export default AppointmentForm;
