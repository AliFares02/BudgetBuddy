import React, { useState } from 'react'
import { useLogin } from '../hooks/useLogin'

const LoginPage = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const {loginUser, error, isLoading} = useLogin()

  const handleSubmit = async (e) => {
    e.preventDefault()

    await loginUser(username, password);
  }
  return (
    <div className='login-form-div'>
      <form onSubmit={handleSubmit} className='login-form' >
        <h3>Login</h3>
        <input 
            className='input-field'
            type="text" 
            placeholder="Enter Username..." 
            onChange={(e) => setUsername(e.target.value)} 
            value={username}
        />
        <input
            className='input-field' 
            type="password" 
            placeholder="Enter Password..." 
            onChange={(e) => setPassword(e.target.value)} 
            value={password}
        />
        <button disabled={isLoading} type="submit" className='submit-button'>Log in</button>
        {error && <div className='error'>{error}</div>}
      </form>
    </div>
  )
}

export default LoginPage
