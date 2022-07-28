import React, { useState } from 'react'

const AuthBox = () => {
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()
  return (
    <div className='auth'>
      <div className='auth__box'>
        <div className='auth__header'>
          <h1>Login</h1>
        </div>

        <form>
          <div className='auth__field'>
            <label>Email</label>
            <input type='text' />
          </div>
          <div className='auth__field'>
            <label>Password</label>
            <input type='password' />
          </div>

          <div className='auth__footer'>
            <p className='auth__error'>Something went wrong.</p>
            <button className='btn'>Press Me</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AuthBox
