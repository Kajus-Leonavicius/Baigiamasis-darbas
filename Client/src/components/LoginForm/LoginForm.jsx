import '../../index.css'
// eslint-disable-next-line react/prop-types
function LoginForm({handleLogin, setEmail, setPassword, email, password}) {
  return (
    <div>
        <form action="" className='
          border-black
          border-1 
          rounded-2xl
          flex
          flex-col
          justify-center
          items-center
          align-middle
          h-96
          w-96
        '>
          <div className='
            flex
            flex-col
            mb-4
          '>
            <p className='pb-2'>el.pastas</p>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='
                w-72
                h-8
                rounded-2xl
                p-4
                bg-[#EFF3F4]
              '
              />
            </div>
            <div className='
              flex
              flex-col
              mb-4
            '>
              <p className='pb-2'>salptazodis</p>
              <input type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='
                  w-72
                  h-8
                  rounded-2xl
                  p-4
                  bg-[#EFF3F4]
                '
              />
            </div>
            <button 
            onClick={handleLogin}
            className='
              mt-8
              p-2
              bg-[#869DFD]
              w-72
              rounded-2xl
            '
            >
              Log in
            </button>
        </form>
    </div>
  )
}

export default LoginForm
