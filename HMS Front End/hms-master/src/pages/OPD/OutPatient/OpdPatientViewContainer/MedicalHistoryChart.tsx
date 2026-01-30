import Chart from 'react-apexcharts';

const MedicalHistoryChart = (props:any) => {
    const currentYear = new Date().getFullYear();
    const previousYear = currentYear - 1;

    // Data series
    const series = [
        {
            name: 'OPD',
            data: [0, props.data.opdHistory],
        },
        {
            name: 'Pharmacy',
            data: [0, props.data.pharmacyHistory],
        },
        {
            name: 'Pathology',
            data: [0, props.data.pathologyHistory],
        },
        {
            name: 'Radiology',
            data: [0, props.data.radiologyHistory],
        },
        {
            name: 'Blood Bank',
            data: [0, props.data.bloodBankHistory],
        },
        {
            name: 'Ambulance',
            data: [0, props.data.ambulanceHistory],
        },
    ];

    // Calculate the maximum value from the series
    const maxValue = Math.max(...series.map(s => Math.max(...s.data)));

    const options: any = {
        chart: {
            type: 'line',
            height: 350,
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
        xaxis: {
            categories: [previousYear.toString(), currentYear.toString()],
        },
        yaxis: {
            min: 0, // Minimum value for y-axis
            max: maxValue + 1, // Maximum value based on the series (adding 1 for better spacing)
            tickAmount: 7, // Number of ticks between min and max
        },
        stroke: {
            curve: 'smooth',
            width: 2,
        },
        markers: {
            size: 5,
        },
        colors: ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#ff0000', '#8E44AD'], // Suggested colors
    };

    return (
        <div>
            <Chart options={options} series={series} type="line" height={350} />
        </div>
    );
};

export default MedicalHistoryChart;
