import { createContext, useState, useEffect } from "react";
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({children}) => {
  const [sharedCategArray, setSharedCategArray] = useState([])
  
  localStorage.getItem('authTokens')
  const [authTokens, setAuthTokens] = useState(() => {
    const storedAuthTokens = localStorage.getItem('authTokens');
    return storedAuthTokens ? JSON.parse(storedAuthTokens) : null;
  })
  
  const [user, setUser] = useState(() => {
    const storedAuthTokens = localStorage.getItem('authTokens');
    return storedAuthTokens ? jwtDecode(storedAuthTokens) : null;
  })
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate();

  const loginUser = async (e) => {
    e.preventDefault()
    axios.post('http://127.0.0.1:8000/api/token/', {
        'username':e.target.username.value, 'password':e.target.password.value
        }, {
        headers: {
          'Content-Type': 'application/json'
        }}).then(response => {
          setAuthTokens(response.data)
          setUser(jwtDecode(response.data.access))
          localStorage.setItem('authTokens', JSON.stringify(response.data))
          navigate('/')
        }).catch(error => {
          console.error(error);
        })
  }
  const logoutUser = () => {
    setAuthTokens(null)
    setUser(null)
    localStorage.removeItem('authTokens')
    navigate('/login')
  }

  const updateToken = async () => {
    console.log('update token called');
    axios.post('http://127.0.0.1:8000/api/token/refresh/', {
        'refresh':authTokens?.refresh
        }, {
        headers: {
          'Content-Type': 'application/json'
        }}).then(response => {
          console.log('updated token', response);
          setAuthTokens(response.data)
          setUser(jwtDecode(response.data.access))
          localStorage.setItem('authTokens', JSON.stringify(response.data))
        }).catch(error => {
          console.error(error);
          logoutUser()
        })
    if(loading) {
      setLoading(false)
    }
  }

  useEffect(() => {
    if(loading){
      updateToken()
    } 
    const intervaleId = setInterval(() => {
      if (authTokens) {
        updateToken()
      }
    }, 1000 * 60 * 5)
    return () => clearInterval(intervaleId)
  }, [authTokens, loading])

  const contextData = {
    sharedCategArray:sharedCategArray,
    setSharedCategArray:setSharedCategArray,
    user:user,
    authTokens:authTokens,
    loginUser:loginUser,
    logoutUser: logoutUser
  }

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? null : children}
    </AuthContext.Provider> 
  )
}