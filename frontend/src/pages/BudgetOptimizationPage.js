import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useAuthContext from '../hooks/useAuthContext';
import { Ring } from 'react-spinners-css';

const BudgetOptimizationPage = () => {
  const { sharedCategArray, setSharedCategArray } = useAuthContext();
  const [buttonClicked, setButtonClicked] = useState(false);
  const [inflationResponse, setInflationResponse] = useState([])
  console.log("sharedCategArray: ", sharedCategArray);
  const [localSharedCategArray, setLocalSharedCategArray] = useState([]);
  const inflationDataBySeriesId = [];

  useEffect(() => {
    const storedCategArray = JSON.parse(localStorage.getItem('sharedCategArray'));
    if (storedCategArray) {
      setLocalSharedCategArray(storedCategArray);
      console.log("stored array in local storage found: ", storedCategArray);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (sharedCategArray.length > 0) {
        setLocalSharedCategArray(sharedCategArray);
        localStorage.setItem('sharedCategArray', JSON.stringify(sharedCategArray));
        await updateSeriesIdArray();
        console.log("fetch called after await");
        console.log("Context array exists, so it is added to local storage again");
      }
    };
    fetchData();
  }, [sharedCategArray]);

  const seriesIds = {
    overall: "CUUR0000SA0",
    food: "CUSR0000SAF",
    utilities: "CUSR0000SAH2",
    housing: "CUSR0000SAH",
    education: "CUSR0000SAE1",
    medical: "CUSR0000SAM",
    transportation: "CUSR0000SAT",
    entertainment: "CUSR0000SAR"
  };

  const seriesIdsRelevant = [];

  const updateSeriesIdArray = () => {
    for (const keys in localSharedCategArray) {
      if (localSharedCategArray[keys].expenseCategory in seriesIds) {
        seriesIdsRelevant.push(seriesIds[localSharedCategArray[keys].expenseCategory]);
      }
    }
    
    console.log('seriesIdsRelevant: ', seriesIdsRelevant);
  };

  function fetchInflationData () {
    console.log("fetch inflationdata called");
    axios.post('http://127.0.0.1:8000/api/inflation-data/', {
      seriesid: seriesIdsRelevant,
      startyear: "2023",
      endyear: "2024"
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      console.log('inflation data ', response?.data?.Results);
      calculateBudget(response?.data?.Results?.series)
      setButtonClicked(false);
    })
    .catch(error => {
      console.error('Error!', error);
      setButtonClicked(false);
    });
  };

  function calculateBudget(results) {
    console.log("calculateBudget called with this parameter", results);
    if (results.length > 0) {
      for (let i = 0; i < results.length; i++) {
          const result = results[i];
          const inflationData = result.data;
          inflationDataBySeriesId.push({seriesID: result.seriesID, twoMonthIAFPrediction: []})
          let CPIDifferenceTotal = 0;
          for (let j = 4; j >= 0; j--) {
            CPIDifferenceTotal += inflationData[j]?.value - inflationData[j+1]?.value
            console.log("current CPIDifferenceTotal", CPIDifferenceTotal);
            console.log(`${inflationData[j]?.periodName}'s and ${inflationData[j+1]?.periodName}'s CPI Difference`, inflationData[j]?.value - inflationData[j+1]?.value);
            console.log(`${inflationData[j]?.periodName}'s inflation CPI`, inflationData[j]?.value);
          }
          const CPIAverage = CPIDifferenceTotal / 5;
          console.log(CPIAverage);
          const currentMonthsCPIPrediction = inflationData[0]?.value - CPIAverage;
          const nextMonthsCPIPrediction = currentMonthsCPIPrediction - CPIAverage;
          const currentMonthIAF = 1 + ((((currentMonthsCPIPrediction - inflationData[0]?.value)/inflationData[0]?.value) * 100) / 100);
          const nextMonthIAF = 1 + ((((nextMonthsCPIPrediction - currentMonthsCPIPrediction)/currentMonthsCPIPrediction) * 100) / 100);
          inflationDataBySeriesId[i].twoMonthIAFPrediction.push(currentMonthIAF, nextMonthIAF)
          
          // calculating budget adjustments for each expense category
          const categoryArray = sharedCategArray.length > 0 ? sharedCategArray : localSharedCategArray;

          let relevantCategory = null;
          Object.entries(seriesIds).forEach(([key, value]) => {
            if (value === result.seriesID) {
              relevantCategory = key;
            }
          })
          console.log("relevant category for this seriesid: ", relevantCategory);
          if (relevantCategory) {
            for (let k = 0; k < categoryArray.length; k++) {
              if (categoryArray[k].expenseCategory === relevantCategory) {
                categoryArray[k].currentMonthExpenseBudgetAmount = Number((categoryArray[k].expenseAmount * currentMonthIAF).toFixed(2));
                categoryArray[k].nextMonthExpenseBudgetAmount = Number((categoryArray[k].expenseAmount * nextMonthIAF).toFixed(2));
              }
            }
            console.log("in method categoryArray", categoryArray);
          }
      }
      console.log("inflationDataBySeriesId: ", inflationDataBySeriesId);
    } else {
      console.log("results.length not greater than 0");
    }
    
  }

  useEffect(() => {
    updateSeriesIdArray();
    console.log("category array changed");
    
  }, [localSharedCategArray]);

  function handleButtonClick() {
    setButtonClicked(true);
    fetchInflationData();
  }
    
  return (
    <div className='budget-optimization-container'>
      {
        buttonClicked 
        ?
        (
          <div style={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
            <Ring color='#ff6f61'/>
            <p style={{fontSize:'18px', color:'white', textAlign:'center'}}>In progress...should take less than 30 seconds</p>
          </div>
        )
        :
        <button className='budget-optimization-btn' onClick={handleButtonClick} disabled={buttonClicked} style={{cursor: buttonClicked ? 'progress' : 'pointer'}}>Click to begin budget optimization process</button>
      }
    </div>
  );
};

export default BudgetOptimizationPage;
