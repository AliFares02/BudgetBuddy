import { jwtDecode } from 'jwt-decode'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthContext from './useAuthContext'
import axios from 'axios'

export const useLogin = () => {
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(null)
  
  const {dispatch} = useAuthContext()
  const navigate = useNavigate()

  const loginUser = async (username, password) => {
    setIsLoading(true)
    setError(null)
    
    axios.post('http://127.0.0.1:8000/api/token/', {
      username, password
      })
      .then(response => {
        localStorage.setItem('authTokens', JSON.stringify(response.data))
        setIsLoading(false)
        dispatch({
          type: 'LOGIN', 
          payload: {
            tokens: response.data, 
            user: jwtDecode(response.data.access)
          }});
        navigate('/')
      })
      .catch(() => {
        setIsLoading(false)
        setError('* Invalid credentials. Please try again.')
      })
  }
  return {loginUser, error, isLoading}
}
