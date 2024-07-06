import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import LineGraph from '../components/LineGraph'
import PieChart from '../components/PieChart'
import useAuthContext from '../hooks/useAuthContext'

const HomePage = () => {
  const [expenses, setExpenses] = useState([]);
  const [timeRange, setTimeRange] = useState('all');
  const {user, authTokens, logoutUser} = useAuthContext();
  let expensesTotal = 0

  const getExpenses = async () => {
    axios.get('http://127.0.0.1:8000/api/expenses/', {
      headers: {
        'Authorization': 'Bearer ' + String(authTokens.access)
      },
    }).then(response => {
      console.log('get expenses response', response);
      setExpenses(response.data)
    }).catch(error => {
      console.error(error)
      console.log('logout called from homepage getExpenses');
      logoutUser()
    })
  }
  const createExpense = async (event) => {
    event?.preventDefault();
    axios.post('http://127.0.0.1:8000/api/create-expense/', {
    'expense': event?.target.elements.expenseAmount.value,
    'expense_category': event?.target.elements.expenseCategory.value,
    'date': event?.target.elements.expenseDate.value
  }, {
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + authTokens.access
    }
  }).then(response => {
    console.log(response);
    getExpenses();
  }).catch(error => {
    console.error(error);
  });
  }

  function handleDataFilter(event) {
    event.preventDefault();
    const selectElem = event?.target.elements['time-range'];
    const numOfDaysBack = selectElem?.value;
    const numOfDaysBackName = selectElem.options[selectElem.selectedIndex].getAttribute('name');
    setTimeRange(numOfDaysBackName)
    console.log('time range...', timeRange);
    axios.get('http://127.0.0.1:8000/api/filtered-expenses/', {
      headers: {
        'Authorization': 'Bearer ' + String(authTokens.access)
      },
      params:{
        'date': numOfDaysBack
      }
    })
    .then(response => setExpenses(response.data)
    // cache expenses in localstorage in this method and in getExpenses() so when user comes back to dashboard it still shows filtered data and doesnt reset to getExpenses() data
    )
    .catch(error => console.error(error)
    )
  }

  expenses.map(expense => {
     expensesTotal += parseFloat(expense.expense)
  })

  useEffect(() => {
    if (user) {
      getExpenses()
    }
  }, [user])

  return (
    <div className='dashboard-div'>
      <div>
        <h1 style={{color:'white'}}>Dashboard</h1>
      </div>
      
      <div className='dashboard-content-container' style={{display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column', gap:'8px'}}>
        {
          expenses.length > 0 
          ? 
          (
          <>
            <form onSubmit={handleDataFilter} className='time-range-container'>
              <label htmlFor="time-range">Expense Time Range:</label>
              <select defaultValue='all' name="time-range" id="time-range">
                <option name="30 days" value="30">30 days</option>
                <option name="6 months" value="180">6 months</option>
                <option name="1 year" value="365">1 year</option>
                <option name="all time" value="all">All time</option>
              </select>
              <button type='submit'>Apply</button>
            </form>
            <div className='graph-div' style={{display:'flex', gap:'8px'}}>
            <div className='pie-div'>
              {/* make this div a link so that when it is clicked it takes you to expenses page wher u can delete/edit an expense */}
              <PieChart expenses={expenses}/>
              <h3>Total: ${expensesTotal.toFixed(2)}</h3>
              <Link to='more-category-info'><button className='more-category-info-button'>More Category Info</button></Link>
            </div>
            <div className='line-graph-div'>
              <LineGraph expenses={expenses} timeRange={timeRange}/>
              <Link><button className='more-category-info-button'>More Expense History Info</button></Link>
            </div>
          </div>
          </>
          )
          :
          (
            <div className='no-expenses-display'><h2>You have no expenses to be displayed. Begin by adding expenses below</h2></div>
          )
        }
        
        <div className='add-expense-div'>
          <div style={{display:'flex', alignItems:'center', flexDirection:'column', gap:'3px'}}>
            <label htmlFor='add-expense-form' style={{fontWeight:'bold', fontSize:'18px'}}>Add expense</label>
            <form className='add-expense-form' onSubmit={(e) => createExpense(e)}>
              <label htmlFor="number">Enter purchase amount: </label>
              <div style={{display:'flex', height:'30px', alignItems:'center', gap:'3px'}}>
                <p>$</p>
                <input required style={{outline: 'none', borderRadius: '5px', border: 'none', padding: '5px', backgroundColor: '#666'}} type="number" step="0.01" className='add-expense-input-field' name='expenseAmount'/> 
              </div>
              

              <label htmlFor="date">Enter date of purchase:</label>
              <input style={{outline:'none', borderRadius:'5px', border: 'none', padding:'5px', backgroundColor: '#666'}} className='add-expense-input-field' type="date" name='expenseDate'/>

              <label htmlFor="expense-category">Select purchase category:</label>
              <select required style={{outline:'none', borderRadius:'5px', border: 'none', padding:'5px'}} className='add-expense-input-field' name="expenseCategory">
                <option value="" disabled>Category</option>
                <option value="food">Food</option>
                <option value="transportation">Transportation</option>
                <option value="housing">Housing</option>
                <option value="utilities">Utilities</option>
                <option value="entertainment">Entertainment</option>
                <option value="education">Education</option>
                <option value="medical">Medical</option>
                <option value="others">Others</option>
              </select>

              <input style={{cursor:'pointer'}} type="submit" value="Submit" className='expense-submit-button'/>
            </form>
          </div>
        </div>
        
      </div>
      {
        expenses.length > 0 
        ?
        ( 
        <div style={{marginTop:'8px', marginBottom:'5px'}}>
          <Link to='/budget-optimization'><button className='budget-optimization-button'>Click For Budget Optimization</button></Link>
        </div>
        )
        :
        (
          <></>
        )
      }
      
    
      
    </div>
  )
}

export default HomePage