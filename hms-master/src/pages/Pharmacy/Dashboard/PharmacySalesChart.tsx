import React, { useEffect, useState } from 'react';
import ReactApexChart from "react-apexcharts";
import { Card, CardHeader, CardBody } from 'reactstrap';
import DashboardApiService from '../../../helpers/services/dashboard/dashboard-api-service';

const PharmacySalesChart = ({ dataColors }: any) => {
    const dashboardApiService: DashboardApiService = new DashboardApiService();

    const [incomeData, setIncomeData] = useState<any[]>([]);

    const getChartColorsArray = (colors: string | string[] | undefined): string[] => {
        if (!colors) return [];
        const getCSSVariableColor = (varName: string): string => {
            const color = getComputedStyle(document.documentElement).getPropertyValue(varName);
            return color.trim() || '#f46a6a';
        };

        try {
            if (typeof colors === "string") {
                if (colors.trim() !== "") {
                    const parsedColors = JSON.parse(colors);
                    if (Array.isArray(parsedColors)) {
                        return parsedColors.map((color) => getCSSVariableColor(color));
                    }
                }
            }
        } catch (error) {
            console.error("Failed to parse chart colors:", error);
        }
        return [getCSSVariableColor('--vz-success'), getCSSVariableColor('--vz-danger')];
    };

    const chartColumnColors = getChartColorsArray(dataColors);
    console.log("Resolved Colors:", chartColumnColors);

    const series = [
        {
            name: "Prescription Sales",
            data: incomeData
        },
        // {
        //     name: "Over-the-Counter Sales",
        //     data: [50000, 60000, 65000, 70000, 75000, 80000, 85000, 90000, 95000], // Example data
        // },
        // {
        //     name: "Inventory Value",
        //     data: [400000, 420000, 440000, 460000, 480000, 500000, 520000, 540000, 560000], // Example data
        // },
    ];

    const options: any = {
        chart: {
            height: 350,
            type: 'bar',
            toolbar: {
                show: false,
            }
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '45%',
                endingShape: 'rounded'
            },
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            show: true,
            width: 2,
            colors: ['transparent']
        },
        colors: chartColumnColors,
        xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        },
        yaxis: {
            title: {
                text: '₹ (Rupees)',
            }
        },
        grid: {
            borderColor: '#f1f1f1',
        },
        fill: {
            opacity: 1
        },
        tooltip: {
            y: {
                formatter: function (val: any) {
                    return "₹ " + val.toLocaleString();
                }
            }
        },
        title: {
            align: 'left',
            style: {
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#333'
            }
        }
    };

    const getAllData = async () => {
        try {
            let data = await dashboardApiService.getMonthlyPharmacyIncome();
            const incomeArray = Object.values(data).map((value: any) => parseFloat(value.toFixed(2)));
            setIncomeData(incomeArray);
            console.log("Formatted Income Data:", incomeArray);
        } catch (error: any) {
            console.log("getAllData Error");
            console.log(error);
        }
    };
    

    useEffect(() => {
        getAllData();
    }, []);

    return (
        <Card className="card">
            <CardHeader className="border-0 align-items-center d-flex">
                <h4 className="card-title mb-0 flex-grow-1">Pharmacy Sales Overview</h4>
            </CardHeader>
            <CardBody>
                <ReactApexChart
                    dir="ltr"
                    className="apex-charts"
                    series={series}
                    options={options}
                    type="bar"
                    height={350} />
            </CardBody>
        </Card>
    );
};

export default PharmacySalesChart;
