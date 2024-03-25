import React, { useContext, useEffect, useState } from 'react'
import AuthContext from '../context/AuthContext'
import axios from 'axios'
import PieChart from '../components/PieChart'
import LineGraph from '../components/LineGraph'
import { Link } from 'react-router-dom'

const HomePage = () => {
  const [expenses, setExpenses] = useState([])
  const {authTokens, logoutUser} = useContext(AuthContext)
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
      logoutUser()
    })
  }

  const createExpense = async (event) => {
    event?.preventDefault();
    console.log('create expense method called');
    axios.post('http://127.0.0.1:8000/api/create-expense/', {
    'expense': event?.target.elements.expenseAmount.value,
    'expense_category': event?.target.elements.expenseCategory.value,
    'date': '1969-05-05'
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

  const formatDate = (dateStr) => {
    const [month, day, year] = dateStr.split('-');
    const formattedDate = new Date(`${year}-${month}-${day}`);
    const yyyy_mm_dd = formattedDate.toISOString().split('T')[0];
    console.log(yyyy_mm_dd);
    return yyyy_mm_dd;
  };

  expenses.map(expense => {
     expensesTotal += parseFloat(expense.expense)
  })

  useEffect(() => {
    getExpenses()
  }, [])

  return (
    <div className='dashboard-div'>
      <div>
        <h1 style={{color:'white'}}>Dashboard</h1>
      </div>
      <div className='dashboard-content-container' style={{display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column', gap:'8px'}}>
        <div className='graph-div' style={{display:'flex', gap:'8px'}}>
          <div className='pie-div'>
            <PieChart expenses={expenses}/>
            <h3>Total: ${expensesTotal.toFixed(2)}</h3>
          </div>
          <div className='line-graph-div'>
          <LineGraph/>
          </div>
        </div>
        <div className='add-expense-div'>
          <div style={{display:'flex', alignItems:'center', flexDirection:'column', gap:'5px'}}>
            <label htmlFor='add-expense-form' style={{fontWeight:'bold', fontSize:'18px'}}>Add expense</label>
            <form className='add-expense-form' onSubmit={(e) => createExpense(e)}>
              <label htmlFor="number">Enter purchase amount: $</label>
              <input required style={{outline: 'none', borderRadius: '5px', border: 'none', padding: '5px'}} type="text" pattern="[0-9]*[.,]?[0-9]+" title="Please enter a valid number" name='expenseAmount'/>

              <label htmlFor="date">Enter date of purchase: $</label>
              <input style={{outline:'none', borderRadius:'5px', border: 'none', padding:'5px'}} type="date" name='expenseDate'/>

              <label htmlFor="expense-category">Select purchase category: $</label>
              <select required style={{outline:'none', borderRadius:'5px', border: 'none', padding:'5px'}} name="expenseCategory">
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
      <div style={{marginTop:'8px', marginBottom:'5px'}}>
        <Link><button className='budget-optimization-button'>Budget Optimization</button></Link>
      </div>
    
      
    </div>
  )
}

export default HomePage