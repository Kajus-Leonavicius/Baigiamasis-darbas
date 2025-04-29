import React, { useState } from 'react'

function RegisterForm() {
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [companyName, setCompanyName] = useState('')
    const [name, setName] = useState('')
    const [surname, setSurname] = useState('')
    const [phone, setPhone] = useState('')
    const [message, setMessage] = useState('')

    const register = async (e) =>{
        e.preventDefault()

        if (!email || !password || !name || !surname || !phone || !companyName) {
            setMessage("Prašome užpildyti visus laukus.");
            return;
        }

        const newUser = {
            email: email,
            password: password,
            name: name,
            surname: surname,
            phone: phone,
            company_name: companyName,
        }
        try{
            const response = await fetch('http://127.0.0.1:5000/api/auth/register',{
                method: 'POST',
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(newUser)
                })
            
            const data = await response.json()

            if(response.ok){
                setMessage('imone sekmingai uzregistruota galite prisijungti')
            }

        }catch(error){
            console.error('Registration error', error)
        }
    }
  return (
    <div className="flex flex-col justify-center items-center h-auto p-4 w-full">
        {message && (
            <div className='bg-green-500 text-white p-4 rounded-md'>
                {message}
            </div>
        )}
      <form className="flex flex-col w-full gap-4" onSubmit={register}>
        <div className="flex flex-col w-full">
          <div className="p-2 flex flex-col">
            <label>Email</label>
            <input className="border rounded-md p-2" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
          </div>
          <div className="p-2 flex flex-col">
            <label>Password</label>
            <input className="border rounded-md p-2" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
          </div>
          <div className="p-2 flex flex-col">
            <label>Name</label>
            <input className="border rounded-md p-2" type="text" value={name} onChange={(e)=>setName(e.target.value)} required />
          </div>
        </div>

        <div className="flex flex-col w-full">
          <div className="p-2 flex flex-col">
            <label>Surname</label>
            <input className="border rounded-md p-2" type="text" value={surname} onChange={(e)=>setSurname(e.target.value)} required />
          </div>
          <div className="p-2 flex flex-col">
            <label>Phone number</label>
            <input className="border rounded-md p-2" type="text" value={phone} onChange={(e)=>setPhone(e.target.value)} required />
          </div>
          <div className="p-2 flex flex-col">
            <label>Company name</label>
            <input className="border rounded-md p-2" type="text"  value={companyName} onChange={(e)=>setCompanyName(e.target.value)}required />
          </div>
        </div>
        <button className="bg-blue-500 p-2 mt-6 rounded-md text-white w-40" type="submit">Registruotis</button>
      </form>
    </div>
  )
}

export default RegisterForm
