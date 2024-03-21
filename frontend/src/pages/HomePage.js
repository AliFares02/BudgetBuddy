import React, { useContext, useEffect, useState } from 'react'
import AuthContext from '../context/AuthContext'
import axios from 'axios'

const HomePage = () => {
  const [expenses, setExpenses] = useState([])
  const {authTokens, logoutUser} = useContext(AuthContext)

  const getExpenses = async () => {
    axios.get('http://127.0.0.1:8000/api/expenses/', {
      headers: {
        'Authorization': 'Bearer ' + String(authTokens.access)
      },
    }).then(response => {
      console.log(response);
      setExpenses(response.data)
    }).catch(error => {
      console.error(error)
      logoutUser()
    })
  }

  const createExpense = async () => {
    axios.post('http://127.0.0.1:8000/api/create-expense/', {
    'expense': '202.23',
    'expense_category': 'medical',
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

  useEffect(() => {
    getExpenses()
  }, [])

  return (
    <div className='dashboard-div'>
      <div>
        <h1 style={{color:'white'}}>Dashboard</h1>
      </div>
      <div className='graphs-container' style={{display:'flex', gap:'10px'}}>
        <div style={{display:'flex', justifyContent:'center', alignItems:'center'}} className='pie-chart-div'>
          <p>Spenditure pie chart</p>
          <ul>
          {expenses.map(expense => {
            return <li key={expense.id}>${expense.expense}</li>
          })}
          </ul>
          <div >
            <form className='add-expense-form'>
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

              <input onClick={(e) => createExpense()} type="submit" className='expense-submit-button'/>
            </form>
          </div>
        </div>

        <div className='graph-div'>
          last 30 days of purchases graph
        </div>
        
      </div>
      <div>
       Enter a purchase here
      </div>
    
      
    </div>
  )
}

export default HomePage