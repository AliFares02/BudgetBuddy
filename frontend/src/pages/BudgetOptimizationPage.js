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
  const inflationDataBySeriesId = []

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
          const currentMonthIAF = ((currentMonthsCPIPrediction - inflationData[0]?.value)/inflationData[0]?.value) * 100;
          const nextMonthIAF = ((nextMonthsCPIPrediction - currentMonthsCPIPrediction)/currentMonthsCPIPrediction) * 100;
          inflationDataBySeriesId[i].twoMonthIAFPrediction.push(currentMonthIAF, nextMonthIAF) 
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
    // rotateLoadingText();
    fetchInflationData();
    const data = [{
      seriesID: 'CUSR0000SAF', 
      data:[
        {year: '2024', period: 'M04', periodName: 'April', latest: 'true', value: '325.706'},
        {year: '2024', period: 'M03', periodName: 'March', value: '325.645'},
        {year: '2024', period: 'M02', periodName: 'February', value: '325.318'},
        {year: '2024', period: 'M01', periodName: 'January', value: '325.265'},
        {year: '2023', period: 'M12', periodName: 'December', value: '324.029'},
        {year: '2023', period: 'M11', periodName: 'November', value: '323.376'}
      ]
    }]
    
  }
    
  // function rotateLoadingText(i=0) {
  //   if (i < loadingTexts.length) {
  //     setLoadingTextDisplayed(loadingTexts[i]);
  //     setTimeout(() => rotateLoadingText(i + 1), 5000);
  //   } else {
  //     rotateLoadingText(0)
  //   }
  // };
    
  
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
