import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { IoMdArrowDropdown } from "react-icons/io";
import useAuthContext from '../hooks/useAuthContext';

const MoreCategoryInfoPage = () => {
  const {authTokens, logoutUser} = useAuthContext();
  const [organizedArray, setOrganizedArray] = useState([]);
  const [dropDownStates, setDropDownStates] = useState({});
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
      const temp = []
      for (const item in array) {
        if (temp.some(obj => obj.key === array[item].expense_category)) {
          const indexToAdd = temp.findIndex(obj => obj.key === array[item].expense_category)
          temp[indexToAdd].value.push({id: array[item].id, expense: array[item].expense, expense_date:array[item].expense_date})
        } else {
          temp.push({key: array[item].expense_category, value: [{id: array[item].id, expense: array[item].expense, expense_date:array[item].expense_date}]})
        }
      }
    setOrganizedArray(temp);   
  }
  const toggleDropDown = (index) => {
    setDropDownStates(prevState => ({
      ...prevState,
      [index]: !prevState[index]
    }));
  };
  useEffect(() => {
    getExpenses()
  }, [])
  return (
    <div className='expense-history-by-categ-container'>
      <h1 style={{ color: 'white', fontWeight: 'bold' }}>Categorized expense history</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        {organizedArray.map((obj, index) => (
          <div className='a-category-container' key={index}>
            <div style={{ height: 'auto', borderBottom: dropDownStates[index] ? '2px solid #ff6f61' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 5 }}>{obj.key}</h3>
              <IoMdArrowDropdown color='#ff6f61' size={25} style={{ cursor: 'pointer' }} onClick={() => toggleDropDown(index)} />
            </div>
            {dropDownStates[index] &&
              <div style={{ margin: '5px', height: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                {obj.value.map((expense, expenseIndex) => (
                  <div key={expenseIndex}>
                    - Expense: &#x24;{expense.expense}, Expense Date: {expense.expense_date}
                  </div>
                ))}
              </div>
            }
          </div>
        ))}
      </div>
    </div>
  )
}

export default MoreCategoryInfoPage