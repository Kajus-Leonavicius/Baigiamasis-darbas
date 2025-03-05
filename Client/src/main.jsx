import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Routes, Route } from "react-router"
import Dashboard from './pages/Dashboard/Dashboard.jsx'
import Customers from './pages/Customers/Customers.jsx'
import Employees from './pages/Employees/Employees.jsx'
import Appointments from './pages/Calendar/Appointments.jsx'


createRoot(document.getElementById('root')).render(
<StrictMode>
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<App/>}/>
      <Route path='/Appointments' element={<Appointments/>}/>
      <Route path='/Employees' element={<Employees/>}/>
      <Route path='/Customers' element={<Customers/>}/>
      <Route path='/Dashboard' element={<Dashboard/>}/>
    </Routes>
  </BrowserRouter>
</StrictMode>
)
