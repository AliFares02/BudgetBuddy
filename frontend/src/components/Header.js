import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthContext from '../hooks/useAuthContext';

const Header = () => {
  const navigate = useNavigate();
  const {user, logoutUser} = useAuthContext();

  const handleClick = () => {
    logoutUser()
  }
  return (
    <nav className='navbar'>
      <div>
        <h2 style={{cursor:'pointer', color:'#ff6f61', marginLeft:'10px'}} onClick={() => navigate('/')}>BudgetBuddy</h2>
      </div>
      <div className='navbar-user-div'>
        <Link to='/'>Dashboard</Link>
        {user 
        ? 
        (
          <div>
           <p style={{color:'#ff6f61', marginLeft:'5px', marginRight:'10px'}}>Hello, {user.username}</p>
           <button onClick={handleClick}>Log out</button>
          </div>
        )
        :
        (
        <div>
          <Link style={{marginRight:'5px'}} to='/login'>Login</Link>
          <Link style={{marginRight:'5px'}} to='/sign-up'>Sign up</Link>
        </div> 
        )}
      </div> 
    </nav>
  )
}

export default Header