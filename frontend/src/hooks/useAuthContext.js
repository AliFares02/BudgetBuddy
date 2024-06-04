import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

const useAuthContext = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw Error('Auth context must be used inside an auth context provider')
  }
  return context
}

export default useAuthContext