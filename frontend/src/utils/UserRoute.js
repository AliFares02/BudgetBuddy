import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import AuthContext from '../context/AuthContext'

const UserRoute = ({children}) => {
  const {user} = useContext(AuthContext)
  return user ? <Navigate to='/'/> : children
}

export default UserRoute