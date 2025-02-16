import {useNavigate } from "react-router"
import LoginForm from "../../components/LoginForm/LoginForm"    
import { useState } from "react"

function LoginPage() {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate()

  const handleLogin = async (e) =>{
    e.preventDefault()

    const data = await fetch('http://127.0.0.1:5000/api/Login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({email, password})
    })

    if(data.ok){
      navigate('/Dashboard')
    }
  }
  return (
    <div className="
      flex
      flex-col
      h-full
      items-center
    ">
        <h1 className="text-4xl p-20">Prisijungimas</h1>
        <LoginForm handleLogin = {handleLogin} setEmail = {setEmail} email = {email} setPassword = {setPassword} password = {password}/>
    </div>
  )
}

export default LoginPage
