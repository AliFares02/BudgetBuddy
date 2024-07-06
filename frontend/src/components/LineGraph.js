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

const LineGraph = ({ expenses, timeRange }) => {
  const [xAxisLabels, setXAxisLabels] = useState([]);
  const [expenseData, setExpenseData] = useState([]);
  const [yAxisStep, setYAxisStep] = useState(7);

  useEffect(() => {
    function handleAxis() {
      let maxExpense = parseFloat(expenses[0]?.expense);
      const tempExpenseData = [];
      const tempXAxisLabels = [];

      for (let i = 0; i < expenses.length; i++) {
        tempExpenseData.push(parseFloat(expenses[i].expense));
        tempXAxisLabels.push(expenses[i].expense_date);
        if (parseFloat(expenses[i]?.expense) > maxExpense) {
          maxExpense = parseFloat(expenses[i].expense);
        }
      }

      setYAxisStep(Math.ceil(maxExpense / 7));
      setExpenseData(tempExpenseData);
      setXAxisLabels(tempXAxisLabels);

      console.log('step count', Math.ceil(maxExpense / 7));
      console.log('expenseData', tempExpenseData);
      console.log('xAxisLabels', tempXAxisLabels);
    }

    handleAxis();
  }, [expenses]);

  console.log('expenses from line graph', expenses);
  console.log('expenseData used for chart', expenseData);

  const data = {
    labels: xAxisLabels,
    datasets: [
      {
        label: `Expense amount`,
        data: expenseData,
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
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = data.datasets[context.datasetIndex].label || '';

            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
              }).format(context.parsed.y);
            }
            const dateLabel = xAxisLabels[context.dataIndex];
            if (dateLabel) {
              label += ` (${dateLabel})`;
            }
            return label;
          },
        },
      },
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
          stepSize: yAxisStep,
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

export default LineGraph;
