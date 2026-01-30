import ReactApexChart from "react-apexcharts";
import getChartColorsArray from "../../../../Components/Common/ChartsDynamicColor";
import React from "react";
import ReactEcharts from "echarts-for-react";
import * as echarts from 'echarts/core';

const CreditLimitChart = (props: any) => {
    var chartDoughnutColors = getChartColorsArray(props.dataColors);
    var option = {
        tooltip: {
            trigger: 'item'
        },
        legend: {
            bottom: '0%', // Position legend at the bottom
            left: 'center',
            textStyle: {
                color: '#858d98',
            },
        },
        color: chartDoughnutColors,
        series: [{
            name: 'Access From',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            label: {
                show: false,
                position: 'center'
            },
            emphasis: {
                label: {
                    show: true,
                    fontSize: '16',
                    fontWeight: 'bold'
                }
            },
            labelLine: {
                show: false
            },
            data: [{
                value: props.usedCreditLimit,
                name: 'Used Credit Limit : ₹ ' + props.usedCreditLimit
            },
            {
                value: props.balanceCreditLimit,
                name: 'Balance Credit Limit : ₹ ' + props.balanceCreditLimit
            }
            ]
        }]
    };

    return (
        <React.Fragment>
            <ReactEcharts option={option} />
            <div className="text-center my-2">
                <label><b>Credit Limit : ₹ {props.creditLimit} </b></label>
            </div>
        </React.Fragment>
    )
}
export default CreditLimitChart