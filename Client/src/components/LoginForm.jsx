import React, { useState } from "react";
import {useNavigate} from 'react-router-dom'

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
        const response = await fetch("http://127.0.0.1:5000/api/auth/login", {
            method: "POST",
            mode: 'cors',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        console.log(data.company_name, data.name)

        localStorage.setItem('name', data.name)
        localStorage.setItem('role', data.role)
        localStorage.setItem('surname', data.surname)
        localStorage.setItem('company_name', data.company_name)

        if (response.ok) {
            setMessage("Login successful!");


            localStorage.setItem("access_token", data.access_token);
            localStorage.setItem('company_name', data.company_name)

            navigate('/Appointments');
        } else {
            setMessage(data.message);
        }
    } catch (error) {
        setMessage("Error logging in. Try again.");
        console.error("Login error:", error);
    }
};

  return (
    <div className="flex flex-col  justify-center items-center h-auto p-2 w-72">
      {message && (<div className="bg-red-400 p-4 rounded-md">
        {message}
      </div>)}
      <form className="flex flex-col gap-4 w-full max-w-xs" onSubmit={handleLogin}>
      <div className="flex flex-col">
        <label>Email</label>
        <input className="border rounded-md p-2 bg-blue-50" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div className="flex flex-col">
        <label>Password</label>
        <input className="border rounded-md p-2 bg-blue-50" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>
      <button className="bg-blue-500 text-white rounded-md p-2 mt-2" type="submit">Login</button>
</form>

    </div>
  );
}

export default LoginForm;
