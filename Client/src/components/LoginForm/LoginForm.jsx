import '../../index.css'
// eslint-disable-next-line react/prop-types
function LoginForm({handleLogin}) {
  return (
    <div>
        <form action="">
            <p>prisijungimo vardas</p>
            <input type="text" name="" id="" />
            <p>salptazodis</p>
            <input type="text" />
            <button onClick={handleLogin}>Log in</button>
        </form>
    </div>
  )
}

export default LoginForm
