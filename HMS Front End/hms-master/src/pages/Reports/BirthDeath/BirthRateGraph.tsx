import React from "react";
import GrowthLineChart from "../ReportChart/GrowthLineChart";

const BirthRateGraph = () => {
  const seriesData = [
    {
      name: "Birth", 
      data: [450, 520, 500, 600, 720, 800, 920, 1000, 1100],
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
  ]; 

  return (
    <div>
      <GrowthLineChart
        title="Birth Rate" 
        series={seriesData}
        categories={categoriesData}
        chartType="line"
        colors={["#28A745"]} 
      />
    </div>
  );
};

export default BirthRateGraph;
