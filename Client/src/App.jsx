import { Routes, Route } from "react-router"
import LoginPage from './pages/LoginPage/LoginPage.jsx'
import Dashboard from './Pages/Dashboard/Dashboard.jsx'
import JobBoard from "./pages/Job Board/JobBoard.jsx"

function App() {

  return (
    <Routes>
      <Route path = '/' element = {<LoginPage/>} />
      <Route path = '/Dashboard' element = {<Dashboard />}/>
      <Route path = '/JobBoard' element = {<JobBoard />}/>
    </Routes>
  )
}

export default App
