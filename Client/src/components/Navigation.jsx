import { useNavigate, useLocation } from 'react-router-dom'

function Navigation() {
    const navigate = useNavigate()
    const location = useLocation()
  return (
    <div className='w-48 h-full border-r-1'>
        <ul className='flex flex-col gap-10 items-center'>
            <li onClick={() => navigate('/dashboard')}
                className={`cursor-pointer px-4 py-2 rounded-md ${location.pathname === '/dashboard' ? 'bg-blue-500 text-white' : null}`}>Dashboard</li>
            <li onClick={() => navigate('/Appointments')}
                className={`cursor-pointer px-4 py-2 rounded-md ${location.pathname === '/Appointments' ? 'bg-blue-500 text-white' : null}`}>Appointments</li>
            <li onClick={() => navigate('/Employees')}
                className={`cursor-pointer px-4 py-2 rounded-md ${location.pathname === '/Employees' ? 'bg-blue-500 text-white' : null}`}>employees</li>
            <li onClick={() => navigate('/Customers')}
                className={`cursor-pointer px-4 py-2 rounded-md ${location.pathname === '/Customers' ? 'bg-blue-500 text-white' : null}`}>Customers</li>
            <li onClick={() => navigate('/Services')}
                className={`cursor-pointer px-4 py-2 rounded-md ${location.pathname === '/Services' ? 'bg-blue-500 text-white' : null}`}>Services</li>
        </ul>
    </div>
  )
}

export default Navigation