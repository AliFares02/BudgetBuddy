import React, { useState } from 'react'
import { useSignUp } from '../hooks/useSignUp'

const SignUpPage = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const {signUp, error, isLoading} = useSignUp()

  const handleSubmit = async (e) => {
    e.preventDefault()
    await signUp(username, password)
    console.log(username, password);
  }
  return (
    <div className="signup-form-div">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h3>Sign Up</h3>
          <input
            className="input-field" 
            type="text" 
            placeholder="Create Username..." 
            onChange={(e) => setUsername(e.target.value)} 
            value={username}
          />
          <input 
            className="input-field"
            type="password" 
            placeholder="Create Password..." 
            onChange={(e) => setPassword(e.target.value)} 
            value={password}
          />   
        <button disabled={isLoading} className="submit-button">Sign Up</button>
        {error && <div className='error'>{error}</div>}
      </form>
    </div>

  )
}

export default SignUpPage