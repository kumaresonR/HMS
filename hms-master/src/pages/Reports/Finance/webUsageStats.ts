export const paidVsBalanceData = [

    { 
        label: 'Balance',
         value: 40, id: 1, color: '#ffa800' }, // Red for Balance
    { label: 'Paid', value: 60, id: 2, color: '#4ab58e' }, // Green for Paid
  ];
  
  export const valueFormatter = (value: { value: number; id?: string | number }) => {
    return `${value.value}%`; // Display percentage for the pie chart
  };
  