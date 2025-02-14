import { Routes, Route } from "react-router"
import LoginPage from './pages/LoginPage/LoginPage.jsx'
import Dashboard from './Pages/Dashboard/Dashboard.jsx'

function App() {

  return (
    <Routes>
      <Route path='/' element={<LoginPage/>} />
      <Route path='/Dashboard' element={<Dashboard />}/>
    </Routes>
  )
}

export default App
