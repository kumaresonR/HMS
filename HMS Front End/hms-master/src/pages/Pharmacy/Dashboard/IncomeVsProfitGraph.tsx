import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

const incomeData = [4000, 3000, 2000, 2780, 1890, 2390, 3490]; // Income data
const profitData = [2400, 1398, 9800, 3908, 4800, 3800, 4300]; // Profit data

const xLabels = [
  'Page A',
  'Page B',
  'Page C',
  'Page D',
  'Page E',
  'Page F',
  'Page G',
];

export default function IncomeVsProfitGraph() {
  return (
    <>
      <h4>Total patients vs Missed pharmacy patients</h4>
      <BarChart
        width={500}
        height={300}
        series={[
          {
            data: profitData,
            label: 'Profit',
            stack: 'stack1',
            color: '#4CAF50', // Green color for profit bars
          },
          {
            data: incomeData,
            label: 'Income',
            color: '#2196F3', // Blue color for income bars
          },
        ]}
        xAxis={[{ data: xLabels, scaleType: 'band' }]}
      /></>
  );
}
