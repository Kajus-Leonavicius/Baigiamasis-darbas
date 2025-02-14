import { useNavigate } from "react-router"
import LoginForm from "../../components/LoginForm/LoginForm"    

function LoginPage() {

    const Navigate = useNavigate()

    const handleLogin = () => {
        Navigate('/Dashboard')
    }
  return (
    <div>
        <LoginForm handleLogin = {handleLogin}/>
    </div>
  )
}

export default LoginPage
