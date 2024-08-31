import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { IoMdArrowDropdown } from "react-icons/io";
import { CiEdit } from "react-icons/ci";
import { IoTrashOutline } from "react-icons/io5";
import { MdOutlineCancel } from "react-icons/md";
import { FaRegCheckCircle } from "react-icons/fa";

import useAuthContext from '../hooks/useAuthContext';

const MoreCategoryInfoPage = () => {
  const {authTokens, logoutUser} = useAuthContext();
  const [organizedArray, setOrganizedArray] = useState([]);
  const [dropDownStates, setDropDownStates] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [updatedExpense, setUpdatedExpense] = useState("");
  const [updatedExpenseDate, setUpdatedExpenseDate] = useState("");
  const [expenseEditError, setExpenseEditError] = useState(null);
  const [expenseDeleteError, setExpenseDeleteError] = useState(null);

  const getExpenses = async () => {
    axios.get('http://127.0.0.1:8000/api/expenses/', {
      headers: {
        'Authorization': 'Bearer ' + String(authTokens.access)
      },
    }).then(response => {
      console.log(response.data);
      organizeArray(response.data)
    }).catch(error => {
      console.error(error)
      logoutUser()
    })
  }
  const organizeArray = (array) => {
    console.log('array before organizing', array);
      const temp = []
      for (const item in array) {
        if (temp.some(obj => obj.key === array[item].expense_category)) {
          const indexToAdd = temp.findIndex(obj => obj.key === array[item].expense_category)
          temp[indexToAdd].value.push({id: array[item].id, expense: array[item].expense, expense_date:array[item].expense_date})
        } else {
          temp.push({key: array[item].expense_category, value: [{id: array[item].id, expense: array[item].expense, expense_date:array[item].expense_date}]})
        }
      }
    // randomness of ordering of data with same exact date is what leads to different ordering of values with the same date everytime which then leads to organizedArray having a different ordering. i.e lets say first query had a value of transportation, then food, then utils and they all had the same date, the next query might randomly give a diff ordering i.e food, transportation, utils which then causes organizedArray to have them in that order. This is why you might see the categorized expense hist be reordered after a query.
    console.log('organized array',temp);
    setOrganizedArray(temp);   
  }
  const toggleDropDown = (index) => {
    setDropDownStates(prevState => ({
      ...prevState,
      [index]: !prevState[index]
    }));
  };

  function handleEdit(expense) {
    setIsEditing(true)
    setEditingIndex(expense.id)
    setUpdatedExpense(expense.expense)
    setUpdatedExpenseDate(expense.expense_date)
  }

  function handleEditCancel() {
    setIsEditing(false);
    setEditingIndex(null);
    setUpdatedExpense("");
    setUpdatedExpenseDate("");
  }

  function handleEditSubmit() {
    axios.patch(`http://127.0.0.1:8000/api/update-expense/?expense-id=${editingIndex}`,
      {
        newExpense: updatedExpense,
        newExpenseDate: updatedExpenseDate
      },{
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + authTokens.access
        }
      })
      .then(response => {
        getExpenses()
        setIsEditing(false)
        setExpenseEditError(null)
      })
      .catch(error => setExpenseEditError(error?.response?.data?.error))
  }

  function handleExpenseDelete(expense) {
    axios.delete(`http://127.0.0.1:8000/api/delete-expense/?expense-id=${expense.id}`, {
      headers: {
        'Authorization': 'Bearer ' + authTokens.access
      }
    })
    .then(response => {
      setExpenseDeleteError(null)
      getExpenses()
    })
    .catch(error => {
      setExpenseDeleteError(error?.response?.data?.error)
    })
  }

  useEffect(() => {
    getExpenses()
  }, [])
  return (
    <div className='expense-history-by-categ-container'>
      <h1 style={{ color: 'white', fontWeight: 'bold' }}>Categorized expense history</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px',width:'60%'}}>
        {organizedArray.map((obj, index) => (
          <div className='a-category-container' key={index}>
            <div 
              onClick={() => toggleDropDown(index)} 
              style={{ height: 'auto', borderBottom: dropDownStates[index] ? '2px solid #ff6f61' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor:'pointer'}}
            >
              <h3 style={{ margin: 5 }}>{obj.key}</h3>
              <IoMdArrowDropdown color='#ff6f61' size={25} style={{ cursor: 'pointer' }}  />
            </div>
            {dropDownStates[index] &&
              <div 
                style={{ margin: '5px', height: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap:'8px' }}
              >
                {obj.value.map((expense) => (
                  <div className='expense-del-edit' key={expense.id}>
                    {
                      isEditing && editingIndex === expense.id
                      ?
                      (
                      <>
                      <form className='edit-expense-form'>
                        <p>&#x24;</p>
                        <input 
                          onChange={(e) => setUpdatedExpense(e.target.value)} 
                          value={updatedExpense || expense.expense} 
                          type="number" 
                          style={{outline: 'none', borderRadius: '5px', border: 'none', padding: '5px', backgroundColor: '#666', color:'white', width:`${(updatedExpense || expense.expense).toString().length * 10}px`}} 
                          step={.01} 
                        />
                        <input 
                          onChange={(e) => setUpdatedExpenseDate(e.target.value)} 
                          value={updatedExpenseDate || expense.expense_date} 
                          type="date" 
                          style={{outline: 'none', borderRadius: '5px', border: 'none', padding: '5px', backgroundColor: '#666', color:'white', width:`${(updatedExpenseDate || expense.expense_date).toString().length * 10}px`}}
                        />
                        <FaRegCheckCircle 
                          size={21} 
                          color='#ff6f61' 
                          style={{ cursor: 'pointer', marginLeft:'16px' }}
                          onClick={handleEditSubmit}
                        />
                        <MdOutlineCancel 
                          size={25} 
                          color='#ff6f61' 
                          style={{ cursor: 'pointer',marginLeft:'5px' }} 
                          onClick={handleEditCancel}
                        />
                      </form>
                      
                      </>
                      )
                      :
                      (
                        <>
                        <p className='expense-details'>
                          - Expense: &#x24;{expense.expense}, Expense Date: {expense.expense_date}
                        </p>
                        <div className='edit-delete-btns'>
                          <CiEdit 
                            onClick={() => handleEdit(expense)} 
                            size={25} 
                            strokeWidth={.5} 
                            color='#ff6f61' 
                            style={{ cursor: 'pointer' }}
                          />
                          <IoTrashOutline 
                            size={25}
                            color='#ff6f61' 
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleExpenseDelete(expense)}
                          />
                        </div>
                        </>
                      )
                    }
                  </div>
                ))}
              </div>
            }
          </div>
        ))}
      </div>
        {expenseDeleteError && <p className='error'>{expenseDeleteError}</p>}
        {expenseEditError && <p className='error'>{expenseEditError}</p>} 
    </div>
  )
}

export default MoreCategoryInfoPage