import React from "react";
import ReactApexChart from "react-apexcharts";
import { Card, CardHeader, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";

interface ChartProps {
  chartId: string;
  series: any;
  categories: string[];
  chartType: "line" | "area" | "bar" | "pie" | "donut" | "radialBar" | "scatter" | "bubble" | "heatmap" | "candlestick" | "boxPlot" | "radar" | "polarArea" | "rangeBar" | "rangeArea" | "treemap";
  chartColors: string[];
  title: string;
}

const PieChart = ({ chartId, series, categories, chartType, chartColors, title }: ChartProps) => {
  const options: any = {
    chart: {
      height: 370,
      type: chartType,
      toolbar: {
        show: false,
      },
    },
    labels: categories,
    stroke: {
      curve: "smooth",
      width: [2],
    },
    fill: {
      opacity: [0.1, 0.9, 1],
    },
    markers: {
      size: [0, 0, 0],
      strokeWidth: 2,
      hover: {
        size: 4,
      },
    },
    grid: {
      show: true,
      xaxis: { lines: { show: true } },
      yaxis: { lines: { show: false } },
      padding: { top: 0, right: -2, bottom: 15, left: 10 },
    },
 
    legend: {
      show: true,
      horizontalAlign: "center",
      offsetY: -5,
      markers: { width: 9, height: 9, radius: 6 },
      itemMargin: { horizontal: 10, vertical: 0 },
      onItemHover: {
        highlightDataSeries: false,
      },
    },
    colors: chartColors,
    tooltip: {
      shared: true,
      y: [
        {
          formatter: (y: any) => (y !== undefined ? y.toFixed(0) : y),
        },
      ],
    },
  };


  return (
    <React.Fragment>
      <Card className="card-height-100">
        <CardHeader className="align-items-center d-flex">
          <h4 className="card-title mb-0 flex-grow-1">{title}</h4>
          <div className="flex-shrink-0">
            <UncontrolledDropdown className="card-header-dropdown">
              <DropdownToggle tag="a" className="text-reset dropdown-btn" role="button">
                <span className="text-muted">Report<i className="mdi mdi-chevron-down ms-1"></i></span>
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-end">
                <DropdownItem>Download Report</DropdownItem>
                <DropdownItem>Export</DropdownItem>
                <DropdownItem>Import</DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </div>
        </CardHeader>

        <div className="card-body px-0">
          <ReactApexChart
            dir="ltr"
            options={options}
            series={series}
            id={chartId}
            type={chartType}
            height="370"
            className="apex-charts"
          />
        </div>
      </Card>
    </React.Fragment>
  );
};

export default PieChart;
