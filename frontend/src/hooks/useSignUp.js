import axios from 'axios'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export const useSignUp = () => {
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(null)
  const navigate = useNavigate()

  const signUp = async (username, password) => {
    setIsLoading(true)
    setError(null)

    axios.post('http://127.0.0.1:8000/api/register/', {
      username,
      password
    }).then(response => {
      setIsLoading(false)
      setError(null)
      navigate('/login')
      console.log(response);
    }).catch(error => {
      console.error('error...', error?.response?.data?.password);
      setIsLoading(false)
      setError(() => {
        return error?.response?.data?.password || error?.response?.data?.username
      })
      console.error(error);
    })
  }
  return {signUp, isLoading, error}
}  