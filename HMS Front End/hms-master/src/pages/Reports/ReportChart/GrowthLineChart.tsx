import React from "react";
import ReactApexChart from "react-apexcharts";

interface LineChartProps {
  chartId?: string;
  title: string;
  series: { name: string; data: number[] }[];
  categories: string[];
  chartType?: "line" | "area" | "bar";
  height?: number;
  colors?: string[];
}

const GrowthLineChart = ({
  chartId = "basic-line-chart",
  title,
  series,
  categories,
  chartType = "line",
  height = 350,
  colors = ["#008FFB"], // Default color
}: LineChartProps) => {
  const options: any = {
    chart: {
      id: chartId,
      height: height,
      type: chartType,
      zoom: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
    },
    markers: {
      size: 4,
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "straight",
    },
    colors: colors, // Accept dynamic chart colors
    title: {
      text: title,
      align: "left",
      style: {
        fontWeight: 500,
      },
    },
    xaxis: {
      categories: categories, // Accept dynamic categories
    },
  };

  return (
    <ReactApexChart
      options={options}
      series={series}
      type={chartType}
      height={height}
      className="apex-charts"
    />
  );
};

export default GrowthLineChart;
