import React, { useState, useEffect } from 'react';

function AppointmentForm({onSuccess}) {
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
        Kw: "",
        date: "",
        status: "scheduled",
        services: [],
        employee_ids: []
    });

    const [services, setServices] = useState([]); 
    const [employees, setEmployees] = useState([]); 

    useEffect(() => {
        fetchServices();
        fetchEmployees();
    }, []);


    const fetchServices = async () => {
        const token = localStorage.getItem('access_token')
        try {
            const response = await fetch("http://127.0.0.1:5000/api/services/get_services",{credentials: 'include',
                headers:{"Authorization": `Bearer ${token}`}
            });
            const data = await response.json();
            setServices(data);
        } catch (error) {
            console.error("Error fetching services:", error);
        }
    };


    const fetchEmployees = async () => {
        try {
            const token = localStorage.getItem('access_token')

            console.log(localStorage.getItem('user'))
            const response = await fetch("http://127.0.0.1:5000/api/employees/get_employees", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                credentials: 'include',
            })
            const data = await response.json();
            setEmployees(data);
        } catch (error) {
            console.error("Error fetching employees:", error);
        }
    };


    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleServiceSelection = (e) => {
        const selectedServices = Array.from(
            e.target.selectedOptions,
            (option) => parseInt(option.value, 10)
        );
        setFormData(prevState => ({
            ...prevState,
            services: selectedServices.length ? selectedServices : []
        }));
    };

    const handleEmployeeSelection = (e) => {
        const selectedEmployees = Array.from(
            e.target.selectedOptions,
            (option) => parseInt(option.value, 10)
        );
        setFormData(prevState => ({
            ...prevState,
            employee_ids: selectedEmployees.length ? selectedEmployees : []
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
            const token = localStorage.getItem('access_token')
            const companyName = localStorage.getItem('company_name')
        try {
            const formattedData = {
                ...formData,
                date: formData.date,
                company_name: companyName,
            };

            const response = await fetch("http://127.0.0.1:5000/api/appointments/create_appointment", {
                method: "POST",
                credentials: 'include',
                headers: {
                    "Authorization": `Bearer ${token}`,
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
                onSuccess()
            }
        } catch (error) {
            console.error("Fetch error:", error);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className='flex flex-col items-center'>
                <div className='flex'>

                    <div className='flex flex-col mr-20 mt-4 ml-8'>
                        <p className='text-xl'>Klientas</p>
                        <div className='flex '>
                            <div className='flex flex-col mr-4'>
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

                    <div className='flex flex-col mt-4 mr-8'>
                        <p className='text-xl'>Automobilis</p>
                        <div className='flex '>
                            <div className='flex flex-col mr-4'>
                                <label>Marke</label>
                                <input type="text" name="make" value={formData.make} onChange={handleChange} className='border-1' required />
                            </div>
                            <div className='flex flex-col'>
                                <label>Modelis</label>
                                <input type="text" name="model" value={formData.model} onChange={handleChange} className='border-1' required />
                            </div>
                        </div>
                        <div className='flex '>
                            <div className='flex flex-col mr-4'>
                                <label>metai</label>
                                <input type="text" name="year" value={formData.year} onChange={handleChange} className='border-1' required />
                            </div>
                            <div className='flex flex-col'>
                                <label>valst.nr</label>
                                <input type="text" name="license_plate" value={formData.license_plate} onChange={handleChange} className='border-1' required />
                            </div>
                        </div>
                        <div className='flex '>
                            <div className='flex flex-col mr-4'>
                                <label>Variklio turis</label>
                                <input type="text" name="engine" value={formData.engine} onChange={handleChange} className='border-1' required />
                            </div>
                            <div className='flex flex-col'>
                                <label>galia(kw)</label>
                                <input type="text" name="Kw" value={formData.Kw} onChange={handleChange} className='border-1' required />
                            </div>
                        </div>
                        <label>VIN kodas</label>
                        <input type="text" name="VIN" value={formData.VIN} onChange={handleChange} className='border-1' required />
                    </div>
                </div>

                <div className="mt-1 w-1/2 flex flex-col">
                    <label className="text-lg">Laikas</label>
                    <input 
                        type="datetime-local" name="date" value={formData.date} onChange={handleChange} className="border-1 p-2 mt-1 rounded-md" required />
                </div>

                <div className="mt-1 w-1/2 h-auto flex flex-col">
                    <label className="text-lg">Paslaugos</label>
                    <select multiple value={formData.services} onChange={handleServiceSelection} className="border-1 p-2 mt-1 rounded-md">
                        {services.map(service => (
                            <option key={service.id} value={service.id}>
                                {service.service_name} ({service.duration} min)
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mt-1 w-1/2 flex flex-col">
                    <label className="text-lg">Darbuotojas</label>
                    <select multiple value={formData.employee_ids} onChange={handleEmployeeSelection} className="border-1 p-2 mt-1 rounded-md">
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

                <button className='mt-8 mb-8 bg-blue-500 w-48 text-white rounded-md p-2' type='submit'>
                    Registruoti
                </button>
            </form>
        </div>
    );
}

export default AppointmentForm;
