import React from 'react';
import Chart from '../ReportChart/BarChart';

const DashboardChart = () => {
    const seriesData = [
        { name: "Paid", data: [1000, 1500, 2000, 2500, 3000] },
        { name: "Balance", data: [800, 1200, 1500, 1700, 2000] },
    ];
    const categories = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];

    return (
        <Chart
            title="Paid and Balance"
            series={seriesData}
            categories={categories}
            dataColors='["--vz-primary", "--vz-danger"]'
            yAxisTitle="₹ (Thousands)"
        />
    );
};

export default DashboardChart;
