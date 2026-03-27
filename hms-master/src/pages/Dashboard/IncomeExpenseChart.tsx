import React, { useEffect, useState } from 'react';
import ReactApexChart from "react-apexcharts";
import { Card, CardHeader, CardBody } from 'reactstrap';
import DashboardApiService from '../../helpers/services/dashboard/dashboard-api-service';

const IncomeExpenseChart = ({ dataColors }: any) => {
    const dashboardApiService: DashboardApiService = new DashboardApiService();

    const [incomeData, setIncomeData] = useState<any[]>([]);
    const [expenceData, setExpenceData] = useState<any[]>([]);

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
        return [getCSSVariableColor('--vz-danger'), getCSSVariableColor('--vz-danger'), getCSSVariableColor('--vz-danger')];
    };

    const chartColumnColors = getChartColorsArray(dataColors);
    console.log("Resolved Colors:", chartColumnColors);
    const series = [
        {
            name: "Income",
            data: incomeData,
        },
        {
            name: "Expenses",
            data: expenceData,
        },
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
            let data = await dashboardApiService.getMonthlyIncomeVsExpence();
            const incomeArray = Object.values(data.income);
            setIncomeData(incomeArray);
            const expenseArray = Object.values(data.expense);
            setExpenceData(expenseArray);
            console.log("data", data.income)
        } catch (error: any) {
            console.log("getAllData Error");
            console.log(error);
        }
    }

    useEffect(() => {
        getAllData();
    }, []);

    return (
        <Card className="card">
            <CardHeader className="border-0 align-items-center d-flex">
                <h4 className="card-title mb-0 flex-grow-1">Income vs Expenses</h4>
            </CardHeader>
            <CardBody>
                {(incomeData.length === 0 || expenceData.length === 0) ? (
                    <div className="no-data-message" style={{ textAlign: 'center', color: '#999' }}>
                        No data available to display.
                    </div>
                ) : (
                    <ReactApexChart
                        dir="ltr"
                        className="apex-charts"
                        series={series}
                        options={options}
                        type="bar"
                        height={350} />
                )}
            </CardBody>
        </Card>
    );
};

export default IncomeExpenseChart;
