import React, { useContext } from 'react'
import AuthContext from '../context/AuthContext'


const BudgetOptimizationPage = () => {
  const sharedCategoryArray = JSON.parse(localStorage.getItem('sharedCategArray'));
  console.log("shared array from budget optimization", sharedCategoryArray);

  const seriesIds = {
    overall: "CUUR0000SA0",
    food: "CUSR0000SAF", 
    utilities: "CUSR0000SAH2", 
    housing: "CUSR0000SAH", 
    education: "CUSR0000SAE1", 
    medical: "CUSR0000SAM",
    transportation: "CUSR0000SAT",
    entertainment: "CUSR0000SAR"
  }
  const seriesIdsRelevant = []

  for (const keys in sharedCategoryArray) {
    if (sharedCategoryArray[keys].expenseCategory in seriesIds) {
      seriesIdsRelevant.push(seriesIds[sharedCategoryArray[keys].expenseCategory])
    } else {
      continue
    }
  }

  console.log('seriesIdsRelevant: ', seriesIdsRelevant);
  return (
    <div>

    </div>
  )
}

export default BudgetOptimizationPage