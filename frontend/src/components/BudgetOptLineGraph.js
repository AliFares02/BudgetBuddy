import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip,
  Filler,
} from 'chart.js';

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip,
  Filler
);

const BudgetOptLineGraph = ({ lineGraphData }) => {
  const [yAxisStep, setYAxisStep] = useState(7);
  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
    function handleAxis() {
      console.log('inflationDataBySeriesId from budgetoptlinegraph', lineGraphData);
      for (let i = 0; i < lineGraphData.length; i++) {

      }
    }

    handleAxis();
  }, [lineGraphData]);

  const data = {
    labels: ['transportation', 'food', 'housing', 'others'],
    datasets: [
      {
        label: `Expense amount`,
        data: [123, 45, 222, 124],
        backgroundColor: '#ff6f61',
        borderColor: 'black',
        pointBorderColor: 'white',
        fill: 'origin',
        tension: 0.3,
        borderWidth: 1.5,
      },
    ],
  };

  const options = {
    plugins: {
      title: {
        display: true,
        text: 'Line Chart Example',
        color: 'white',
        font: {
          family: 'Lexend',
          size: 20,
          weight: 'bold',
        },
      },
      legend: {
        display: true,
        labels: {
          color: 'white',
          font: {
            family: 'Lexend',
            size: 12,
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: 'white',
          font: {
            family: 'Lexend',
            size: 12,
          },
        },
      },
      x: {
        ticks: {
          color: 'white',
          font: {
            family: 'Lexend',
            size: 12,
          },
        },
      },
    },
    layout: {
      padding: {
        left: 10,
        right: 10,
        top: 10,
        bottom: 10,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div style={{ width: '350px', height: '350px' }}>
      <Line data={data} options={options} />
    </div>
  );
};

export default BudgetOptLineGraph;
