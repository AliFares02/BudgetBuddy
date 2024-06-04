import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import { createContext, useEffect, useReducer, useState } from "react";
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const authReducer = (state, action) => {
  switch(action.type) {
    case 'LOGIN':
      return {
        ...state,
        authTokens: action.payload.tokens,
        user: action.payload.user
      };
    case 'LOGOUT':
      return {
        ...state,
        authTokens: null,
        user: null
      };
    default:
      return state;
  }
};

export const AuthProvider = ({children}) => {
  const [sharedCategArray, setSharedCategArray] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate();

  const [state, dispatch] = useReducer(authReducer, {
    user: localStorage.getItem('authTokens') ? jwtDecode(localStorage.getItem('authTokens')) : null
    ,
    authTokens: localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null
  })

  console.log('Authcontext state: ', state);

  const updateToken = async () => {
    const storedTokens = JSON.parse(localStorage.getItem('authTokens'))
    console.log('update token called');
      axios.post('http://127.0.0.1:8000/api/token/refresh/', {
      'refresh':storedTokens?.refresh
      })
      .then(response => {
        console.log('updated token', response);
        localStorage.setItem('authTokens', JSON.stringify(response.data))
        dispatch({
          type: 'LOGIN', 
          payload: {
            tokens: response.data, 
            user: jwtDecode(response.data.access)
          }});
      })
      .catch(error => {
        console.error(error);
        console.log('logout called from authcontext updateToken');
        logoutUser()
      })
      if(loading) {
          setLoading(false) 
      }
  }
  

  const logoutUser = () => {
    console.log('logout function called');
    console.log('authToken before deletion', localStorage.getItem('authTokens'));
    localStorage.removeItem('authTokens')
    localStorage.removeItem('sharedCategArray')
    dispatch({type: 'LOGOUT'})
    navigate('/login')
  }

  useEffect(() => {
    if (loading) {
      updateToken();
    }
    const intervalId = setInterval(() => {
      if (state.authTokens) {
        updateToken();
      }
    }, 1000 * 60 * 5);
    return () => clearInterval(intervalId);
  }, [state.authTokens, loading]);


  return (
    <AuthContext.Provider value={{...state, dispatch, sharedCategArray, setSharedCategArray, logoutUser}}>
      {children}
    </AuthContext.Provider> 
  )
}