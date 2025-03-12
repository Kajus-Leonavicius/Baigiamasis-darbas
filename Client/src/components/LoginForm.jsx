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

        console.log(data.company_name)

        if (response.ok) {
            setMessage("Login successful!");

            // ✅ Store JWT token in localStorage
            localStorage.setItem("access_token", data.access_token);
            localStorage.setItem('company_name', data.company_name)

            // ✅ Redirect user
            navigate('/Appointments');
        } else {
            setMessage(data.message);
        }
    } catch (error) {
        setMessage("Error logging in. Try again.");
        console.error("Login error:", error);
    }
};



// ✅ Debug Session (Optional for Testing)
const debugSession = async () => {
    const token = localStorage.getItem("access_token");

    try {
        const response = await fetch("http://127.0.0.1:5000/api/auth/debug_session", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`, // ✅ Send JWT token
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();
        console.log("Debug Session:", data);
    } catch (error) {
        console.error("Debug Session Error:", error);
    }
};


  return (
    <div>
      <form onSubmit={handleLogin}>
        <label>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        
        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        
        <button type="submit">Login</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default LoginForm;
