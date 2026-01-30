import React from "react";
import ReusableChart from "../ReportChart/PieChart";

const PaidVsBalance = () => {

  const paid = 70; 
  const balance = 30;

  const chartColors = [
    "rgb(64, 81, 137)", 
    "rgb(240, 101, 72)"
  ];

  const series = [paid || 0, balance || 0];
  const categories = ["Paid", "Balance"];
  
  return (
    <ReusableChart
      chartId="Paid-VS-Balance"
      series={series} 
      categories={categories} 
      chartType="donut"
      chartColors={chartColors}
      title="Paid VS Balance" 
    />
  );
};

export default PaidVsBalance;
