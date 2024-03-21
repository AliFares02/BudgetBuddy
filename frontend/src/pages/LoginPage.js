import React, { useContext } from 'react'
import AuthContext from '../context/AuthContext'

const LoginPage = () => {
  const {loginUser} = useContext(AuthContext);
  return (
    <div className='login-form-div'>
      <form onSubmit={loginUser} className='login-form'>
        <h3>Login</h3>
        <input type="text" name="username" placeholder='Enter username...' className='input-field'/>
        <input type="password" name="password" placeholder='Enter password...' className='input-field'/>
        <input type="submit" className='submit-button'/>
      </form>
    </div>
  )
}

export default LoginPage