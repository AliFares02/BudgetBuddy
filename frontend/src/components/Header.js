import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthContext from '../context/AuthContext'

const Header = () => {
  const {user, logoutUser} = useContext(AuthContext);
  const navigate = useNavigate();
  return (
    <nav className='navbar'>
      <div>
        <h2 style={{cursor:'pointer', color:'#ff6f61', marginLeft:'10px'}} onClick={() => navigate('/')}>BudgetBuddy</h2>
      </div>

      <div className='navbar-user-div'>
        <Link to='/'>Dashboard</Link>
      {user ? (
        <a style={{marginRight:'5px',cursor: 'pointer'}} onClick={logoutUser}>Logout</a>
      ) : ( 
      <Link style={{marginRight:'5px'}} to='/login'>Login</Link>
    )}
    {user && <p style={{color:'#ff6f61', marginLeft:'5px', marginRight:'10px'}}>Hello, {user.username}</p>}
      </div>
      
    </nav>
  )
}

export default Header