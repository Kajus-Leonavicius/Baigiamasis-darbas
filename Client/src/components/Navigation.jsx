import { useNavigate, useLocation } from 'react-router-dom'
import LoggedUser from './LoggedUser'
import { useState, useEffect } from 'react'

function Navigation() {
    const navigate = useNavigate()
    const location = useLocation()
    const [role, setRole] = useState('')

    useEffect(() => {
        const storedRole = localStorage.getItem('role')
        setRole(storedRole)
    }, [])
  return (
    <div className='w-72 h-full border-r-1'>
        <div>
            <LoggedUser/>
        </div>
        <ul className='flex flex-col gap-10 items-center'>
            <li onClick={() => navigate('/Appointments')}
                className={`cursor-pointer px-4 py-2 rounded-md ${location.pathname === '/Appointments' ? 'bg-blue-500 text-white' : null}`}>Kalendorius</li>
            {role === 'owner' && ( <li onClick={() => navigate('/Employees')}
                className={`cursor-pointer px-4 py-2 rounded-md ${location.pathname === '/Employees' ? 'bg-blue-500 text-white' : null}`}>Darbuotojai</li>)}
            <li onClick={() => navigate('/Customers')}
                className={`cursor-pointer px-4 py-2 rounded-md ${location.pathname === '/Customers' ? 'bg-blue-500 text-white' : null}`}>Klientu Kontaktai</li>
            { role === 'owner' && (<li onClick={() => navigate('/Services')}
                className={`cursor-pointer px-4 py-2 rounded-md ${location.pathname === '/Services' ? 'bg-blue-500 text-white' : null}`}>Paslaugu valdymas</li>)}
        </ul>
    </div>
  )
}

export default Navigation