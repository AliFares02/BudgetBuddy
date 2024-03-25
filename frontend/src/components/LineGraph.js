import React from 'react'
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale, // x axis
  LinearScale, // y axis
  PointElement,
  Legend,
  Tooltip
} from 'chart.js';

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale, 
  PointElement,
  Legend,
  Tooltip
)

const LineGraph = () => {
  const data = {
    labels: ['Mon', 'Tue', 'Wed'],
    datasets: [
      {
        label: 'Expenses for the past 30 days',
        data: [30, 13, 34],
        backgroundColor: '#ff6f61',
        borderColor: 'black',
        pointBorderColor: 'white',
        fill: true,
        tension: .25,
        borderWidth: 1
      }
    ]
  }

  const options = {
    plugins: {
      legend: true,
      title: {
        display: true,
        text: 'Line Chart Example',
        color: 'white', // Set title text color
        font: {
          family: 'Lexend', // Set title font family
          size: 20,
          weight: 'bold',
        },
      },
      legend: {
        display: true,
        labels: {
          color: 'white', // Set legend text color
          font: {
            family: 'Lexend', // Set legend font family
            size: 12,
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: 'white', // Set y-axis label text color
          font: {
            family: 'Lexend', // Set y-axis label font family
            size: 12,
          },
        },
      },
      x: {
        ticks: {
          color: 'white', // Set x-axis label text color
          font: {
            family: 'Lexend', // Set x-axis label font family
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
  }
  return (
    <div style={{ width: '350px', height: '350px' }}>
      <Line data={data} options={options}>

      </Line>
    </div>
  )
}

export default LineGraph