import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router"

function MenuList() {
    const [active, setActive] = useState(null)
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {

        const path = location.pathname

        switch (path) {
            case "/Dashboard":
                setActive('Dashboard')
            break
            case "/JobBoard":
                setActive('JobBoard')
            break
            case "/Appointments":
                setActive('Appointment List')
            break
            case "/Services":
                setActive('Services')
            break
            case "/Customers":
                setActive('Customers')
            break

        }

    },[location.pathname])

    const handleClick = (path, item) =>{
        setActive(item)
        navigate(path)
    }

  return (
    <div>
        <ul>
            <li className={`
                mt-8
                mb-8
                p-1
                flex 
                justify-center
                cursor-pointer
                ${active === 'Dashboard' ? "bg-[#869DFD] rounded-2xl text-white": ""}
            `}
            onClick={() => handleClick("/Dashboard", "Dashboard")}
            >
                Dashboard
            </li>
            <li className={`
                mb-8
                p-1
                flex
                justify-center
                cursor-pointer
                ${active === 'JobBoard' ? 'bg-[#869DFD] rounded-2xl text-white' : ""}
                `}
                onClick={() => handleClick('/JobBoard', 'Job Board')}
                >
                Job Board
            </li>
            <li className={`
                mb-8
                p-1
                flex
                justify-center
                cursor-pointer
                ${active === 'Appointment List' ? 'bg-[#869DFD] rounded-2xl text-white' : ""}
                `}
                onClick={() => handleClick('/Appointments', 'Appointment List')}>
                Appointment List
            </li>
            <li className={`
                mb-8
                p-1
                flex
                justify-center
                cursor-pointer
                ${active === 'Services' ? 'bg-[#869DFD] rounded-2xl text-white' : ""}
                `}
                onClick={() => handleClick('/Services', 'Services')}>
                Services
            </li>
            <li className={`
                mb-8
                p-1
                flex
                justify-center
                cursor-pointer
                ${active === 'Customers' ? 'bg-[#869DFD] rounded-2xl text-white' : ""}
                `}
                onClick={() => handleClick('/Customers', 'Customers')}>
                Customers
            </li>
        </ul>
    </div>
  )
}

export default MenuList
