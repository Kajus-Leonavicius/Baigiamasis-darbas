import React from "react";
import LoginForm from "../../components/LoginForm";
import RegisterForm from "../../components/RegisterForm";

function AuthPage() {
  return (
    <div className="flex flex-col md:flex-row h-screen">

      <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-8">
        <h2 className="text-3xl font-bold mb-6">PRISIJUNGIMAS</h2>
        <LoginForm />
      </div>


      <div className="hidden md:block border-l h-full"></div>

      <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-8">
        <h2 className="text-3xl font-bold mb-6">REGISTRACIJA</h2>
        <RegisterForm />
      </div>
    </div>
  );
}

export default AuthPage;
