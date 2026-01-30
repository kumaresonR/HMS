import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { Card, CardHeader, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import DashboardApiService from "../../helpers/services/dashboard/dashboard-api-service";

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

const MonthlyIncomeChart = ({ chartId }: any) => {
  const dashboardApiService: DashboardApiService = new DashboardApiService();
  const [monthlyData, setMonthlyData] = useState({});
  const [series, setSeries] = useState<any>([]);

  const chartColors = [
    "rgb(10, 179, 156)",
    "rgb(64, 81, 137)",
    "rgb(41, 156, 219)",
    "rgb(240, 101, 72)",
    "rgb(247, 184, 75)",
    "rgb(72, 240, 111)",
    "rgb(201, 75, 247)"
  ];

  // const series = [4400, 5500, 4100, 1700, 1500]; 
  const options: any = {
    labels: ["IPD Income", "OPD Income", "Blood Bank Income", "Ambulance Income", "Pathology Income", "Radiology Income", "Pharmacy Income"],
    chart: {
      height: 333,
      type: "donut",
      toolbar: {
        show: true,
        tools: {
          selection: false,
          zoom: false,
          reset: false,
          pan: false,
          zoomin: false,
          zoomout: false,
        },
      },
    },
    legend: {
      onItemHover: {
        highlightDataSeries: false,
      },
      position: "bottom",
    }
    ,
    stroke: {
      show: false,
    },
    dataLabels: {
      dropShadow: { enabled: false },
    },
    colors: chartColors,
  };

  const convertPercentageToNumber = (percentage: any) => {
    if (!percentage || typeof percentage !== "string") {
      return 0;
    }
    return parseFloat(percentage.replace('%', '')) || 0;
  };

  const getAllData = async () => {
    try {
      let data = await dashboardApiService.getMonthlyIncome();
      setMonthlyData(data);
      console.log("data.ipdPercentageChange", data.ipdPercentageChange)
      setSeries([
        convertPercentageToNumber(data.ipdPercentageChange) || 0,
        convertPercentageToNumber(data.opdPercentageChange) || 0,
        convertPercentageToNumber(data.bloodBankPercentageChange) || 0,
        convertPercentageToNumber(data.ambulancePercentageChange) || 0,
        convertPercentageToNumber(data.pathologyPercentageChange) || 0,
        convertPercentageToNumber(data.radiologyPercentageChange) || 0,
        convertPercentageToNumber(data.pharmacyPercentageChange) || 0,
      ]);
    } catch (error: any) {
      console.log("getAllData Error");
      console.log(error);
    }
  }

  useEffect(() => {
    getAllData();
  }, []);

  return (
    <React.Fragment>
      <Card className="card-height-100">
        <CardHeader className="align-items-center d-flex">
          <h4 className="card-title mb-0 flex-grow-1">Monthly Income Overview</h4>
          <div className="flex-shrink-0">
            <UncontrolledDropdown className="card-header-dropdown">
              <DropdownToggle tag="a" className="text-reset dropdown-btn" role="button">
                <span className="text-muted">Report<i className="mdi mdi-chevron-down ms-1"></i></span>
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-end">
                <DropdownItem>Download Report</DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </div>
        </CardHeader>

        <div className="card-body px-0">
          {series.length === 0 ? (
            <div className="no-data-message" style={{ textAlign: 'center', color: '#999' }}>
              No data available to display.
            </div>
          ) : (
            <ReactApexChart
              dir="ltr"
              options={options}
              series={series}
              id={chartId}
              type="donut"
              height="333"
              className="apex-charts"
            />
          )}
        </div>
      </Card>
    </React.Fragment>
  );
};

export { RevenueCharts, MonthlyIncomeChart };
