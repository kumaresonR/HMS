import React from "react";
import ReactApexChart from "react-apexcharts";
import { Card, CardHeader, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";

const RevenueCharts = ({ chartId, series }: any) => {
  const chartColors = [
    "rgb(10, 179, 156)",
    "rgb(64, 81, 137)",
    "rgb(41, 156, 219)",
    "rgb(240, 101, 72)",
    "rgb(247, 184, 75)"
  ];

  const options: any = {
    chart: {
      height: 370,
      type: "line",
      toolbar: {
        show: false,
      },
    },
    stroke: {
      curve: "straight",
      dashArray: [0, 0, 8],
      width: [2, 0, 2.2],
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
    xaxis: {
      categories: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ],
      axisTicks: {
        show: false,
      },
      axisBorder: {
        show: false,
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
    },
    colors: chartColors,
    tooltip: {
      shared: true,
      y: [
        {
          formatter: (y: any) => (y !== undefined ? y.toFixed(0) : y),
        },
        {
          formatter: (y: any) => (y !== undefined ? "$" + y.toFixed(2) + "k" : y),
        },
        {
          formatter: (y: any) => (y !== undefined ? y.toFixed(0) + " Sales" : y),
        },
      ],
    },
  };

  return (
    <React.Fragment>
      <ReactApexChart
        dir="ltr"
        options={options}
        series={series}
        id={chartId}
        type="line"
        height="370"
        className="apex-charts"
      />
    </React.Fragment>
  );
};

const PaidBalanceChart = ({ chartId }: any) => {

  const chartColors = [
    "rgb(10, 179, 156)",
    "rgb(64, 81, 137)",
    "rgb(41, 156, 219)",
    "rgb(240, 101, 72)",
    "rgb(247, 184, 75)"
  ];

  const series = [44, 55, 41, 17, 15];
  const options: any = {
    labels: ["IPD Income", "OPD Income", "Blood Bank Income", "Ambulance Income", "Others"],
    chart: {
      height: 333,
      type: "donut",
    },
    legend: {
      position: "bottom",
    },
    stroke: {
      show: false,
    },
    dataLabels: {
      dropShadow: { enabled: false },
    },
    colors: chartColors,
  };

  return (
    <React.Fragment>

      <Card className="card-height-100">
        <CardHeader className="align-items-center d-flex">
          <h4 className="card-title mb-0 flex-grow-1">Monthly Income Overview</h4>
          <div className="flex-shrink-0">
            <UncontrolledDropdown className="card-header-dropdown" >
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
            type="donut"
            height="333"
            className="apex-charts"
          />
        </div>


      </Card>

    </React.Fragment>
  );
};

export { RevenueCharts, PaidBalanceChart };
