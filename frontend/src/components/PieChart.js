import React, { useContext, useEffect } from 'react'
import { Pie } from 'react-chartjs-2'
import {Chart, ArcElement} from 'chart.js'
import AuthContext from '../context/AuthContext';
Chart.register(ArcElement);

const PieChart = ({expenses}) => {
  const {sharedCategArray, setSharedCategArray} = useContext(AuthContext)
  const expenseCategoriesForPieChart = []
  const expenseCategoryColorsForPieChart = []
  const expenseCategoryAmountForPieChart = []
  const expenseAmountPerCategory = []
  expenses.forEach(expense => {
    if (!expenseAmountPerCategory.some(item => item.expenseCategory === expense.expense_category)) {
      expenseAmountPerCategory.push({ expenseCategory: expense.expense_category, expenseAmount: expense.expense});
    } else {
      const expenseAmountIndex = expenseAmountPerCategory.findIndex(item => item.expenseCategory === expense.expense_category)
      const num = parseFloat(expenseAmountPerCategory[expenseAmountIndex].expenseAmount)
      expenseAmountPerCategory[expenseAmountIndex].expenseAmount = num + parseFloat(expense.expense) + ''
    }
    
  });
  console.log('expenseAmountPerCategory', expenseAmountPerCategory);
  const pieChartData = {
    food: [expenseAmountPerCategory.find(item => item?.expenseCategory === 'food')?.expenseCategory || '' , expenseAmountPerCategory.find(item => item?.expenseCategory === 'food')?.expenseAmount || '0', '#005F73'],
    transportation: [expenseAmountPerCategory.find(item => item?.expenseCategory === 'transportation')?.expenseCategory || '', expenseAmountPerCategory.find(item => item?.expenseCategory === 'transportation')?.expenseAmount || '0',  "#0A9396"],

    housing: [expenseAmountPerCategory.find(item => item?.expenseCategory === 'housing')?.expenseCategory || '', expenseAmountPerCategory.find(item => item?.expenseCategory === 'housing')?.expenseAmount || '0', "#94D2BD"],

    utilities: [expenseAmountPerCategory.find(item => item?.expenseCategory === 'utilities')?.expenseCategory || '', expenseAmountPerCategory.find(item => item?.expenseCategory === 'utilities')?.expenseAmount || '0', "#E9D8A6"],

    entertainment: [expenseAmountPerCategory.find(item => item?.expenseCategory === 'entertainment')?.expenseCategory || '', expenseAmountPerCategory.find(item => item?.expenseCategory === 'entertainment')?.expenseAmount || '0', "#EE9B00"],

    education: [expenseAmountPerCategory.find(item => item?.expenseCategory === 'education')?.expenseCategory || '', expenseAmountPerCategory.find(item => item?.expenseCategory === 'education')?.expenseAmount || '0', "#CA6702"],

    medical: [expenseAmountPerCategory.find(item => item?.expenseCategory === 'medical')?.expenseCategory || '', expenseAmountPerCategory.find(item => item?.expenseCategory === 'medical')?.expenseAmount || '0', "#BB3E03"],

    others: [expenseAmountPerCategory.find(item => item?.expenseCategory === 'others')?.expenseCategory || '', expenseAmountPerCategory.find(item => item?.expenseCategory === 'others')?.expenseAmount || '0', "#ff6f61"]
  }
  for (const key in pieChartData) {
    if (pieChartData[key][0] === '') {
      continue
    } else {
      expenseCategoriesForPieChart.push(pieChartData[key][0])
      expenseCategoryAmountForPieChart.push(pieChartData[key][1])
      expenseCategoryColorsForPieChart.push(pieChartData[key][2])
    }
  }
  useEffect(() => {
    setSharedCategArray(expenseAmountPerCategory);
    localStorage.setItem('sharedCategArray', JSON.stringify(sharedCategArray))
  }, [expenses]);

  console.log('expenseCategoriesForPieChart', expenseCategoriesForPieChart);
  console.log('expenseCategoryAmountForPieChart', expenseCategoryAmountForPieChart);
  console.log('expenseCategoryColorsForPieChart', expenseCategoryColorsForPieChart);
  const data = {
    labels: expenseCategoriesForPieChart,
    datasets: [
      {
        label: "Total spent",
        data: expenseCategoryAmountForPieChart,
        backgroundColor: expenseCategoryColorsForPieChart,
        borderColor: "#2B0B3F",
        borderWidth: 1,
      }
    ]
  }
  const options = {
    plugins: {
      title: {
        display: true,
        text: 'Expenses By Category',
        color: 'white', 
        font: {
          family: 'Lexend',
          size: 18,
          weight: 'bold',
        },
      },
      legend: {
        labels: {
          font: {
            family: 'Lexend',
          },
          color: 'white',
        },
      }
    }
  }
  return (
    <div style={{ width: '350px', height: '350px' }}><Pie data={data} options={options}/> </div>
  )
}

export default PieChart