import React from 'react';
import ReactApexChart from "react-apexcharts";
import { Card, CardHeader, CardBody } from 'reactstrap';

interface ChartProps {
    title?: string;
    dataColors?: string;
    series: { name: string; data: number[] }[];
    categories: string[];
    yAxisTitle?: string;
}

const Chart: React.FC<ChartProps> = ({
    title = "",
    dataColors,
    series,
    categories,
    yAxisTitle = "₹ (Rupees)"
}) => {
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
        return [getCSSVariableColor('--vz-danger'), getCSSVariableColor('--vz-warning')];
    };

    const chartColumnColors = getChartColorsArray(dataColors);

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
            categories: categories,
        },
        yaxis: {
            title: {
                text: yAxisTitle,
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
            // text: title,
            align: 'left',
            style: {
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#333'
            }
        }
    };

    return (
        <Card className="card">
            <CardHeader className="border-0 align-items-center d-flex">
                <h4 className="card-title mb-0 flex-grow-1">{title}</h4>
            </CardHeader>
            <CardBody>
                <ReactApexChart
                    dir="ltr"
                    className="apex-charts"
                    series={series}
                    options={options}
                    type="bar"
                    height={350}
                />
            </CardBody>
        </Card>
    );
};

export default Chart;
