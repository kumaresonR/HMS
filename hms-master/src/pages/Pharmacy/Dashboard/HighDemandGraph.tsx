import * as React from 'react';
import Box from '@mui/material/Box';
import { PieChart } from '@mui/x-charts/PieChart';
import { normalizedMedicines, valueFormatter } from './WebUsageStats'; 

export default function MedicineStockGraph() {
  const [radius, setRadius] = React.useState(50);
  const [itemNb, setItemNb] = React.useState(5);
  const [skipAnimation, setSkipAnimation] = React.useState(false);

  const handleItemNbChange = (event: Event, newValue: number | number[]) => {
    if (typeof newValue !== 'number') {
      return;
    }
    setItemNb(newValue);
  };

  const handleRadiusChange = (event: Event, newValue: number | number[]) => {
    if (typeof newValue !== 'number') {
      return;
    }
    setRadius(newValue);
  };

  // Define an array of custom colors for the pie chart
  const customColors = ['#FF5678', '#00E096', '#0095FF', '#884DFF'];

  // Map custom colors to the data based on the number of items
  const dataWithColors = normalizedMedicines.slice(0, itemNb).map((item, index) => ({
    ...item,
    color: customColors[index % customColors.length], // Cycle through colors if more data than colors
  }));

  // Calculate total value for percentage calculation
  const totalValue = dataWithColors.reduce((acc, item) => acc + item.value, 0);

  // Calculate percentage for each slice
  const arcLabel = (params: { value: number }) => {
    const percentage = ((params.value / totalValue) * 100).toFixed(2); // Calculate percentage
    return `${percentage}%`; // Return percentage inside the slice
  };

  return (
    <>
      <h4>Highest demand Medicine</h4>
      <Box sx={{ width: '100%' }}>
        <PieChart
          height={250}
          series={[
            {
              data: dataWithColors, // Apply the mapped data with colors
              innerRadius: radius,
              arcLabel: arcLabel, // Display percentage inside the slice
              arcLabelMinAngle: 20,
              valueFormatter: valueFormatter, // Use the valueFormatter for displaying quantities
            },
          ]}
          skipAnimation={skipAnimation}
        />
      </Box>
    </>
  );
}
