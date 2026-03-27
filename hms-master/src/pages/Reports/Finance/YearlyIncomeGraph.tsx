import React from "react";
import GrowthLineChart from "../ReportChart/GrowthLineChart";

const YearlyIncomeChart = () => {
  const seriesData = [
    {
      name: "Income", // Updated name
      data: [45000, 52000, 58000, 60000, 72000, 85000, 92000, 100000, 110000],
    },
  ];

  const categoriesData = [
    "2015",
    "2016",
    "2017",
    "2018",
    "2019",
    "2020",
    "2021",
    "2022",
    "2023",
  ]; // Years as categories

  return (
    <div>
      <GrowthLineChart
        title="Yearly Income Chart" // Updated title
        series={seriesData}
        categories={categoriesData}
        chartType="line"
        colors={["#28A745"]} // A green color for income
      />
    </div>
  );
};

export default YearlyIncomeChart;
