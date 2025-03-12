import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Routes, Route } from "react-router"
import Dashboard from './pages/Dashboard/Dashboard.jsx'
import Customers from './pages/Customers/Customers.jsx'
import Employees from './pages/Employees/Employees.jsx'
import Appointments from './pages/Calendar/Appointments.jsx'
import Auth from './pages/Auth/Auth.jsx'
import PrivateRoute from "./components/PrivateRoute.jsx"
import Services from './pages/Services/Services.jsx'


createRoot(document.getElementById('root')).render(
<StrictMode>
  <BrowserRouter>
    <Routes>
      <Route path='/Login' element={<Auth/>}/>

      <Route element={<PrivateRoute/> }>
        <Route path='/Services' element={<Services/>}/>
        <Route path='/Appointments' element={<Appointments/>}/>
        <Route path='/Employees' element={<Employees/>}/>
        <Route path='/Customers' element={<Customers/>}/>
        <Route path='/Dashboard' element={<Dashboard/>}/>
      </Route>
    </Routes>
  </BrowserRouter>
</StrictMode>
)
