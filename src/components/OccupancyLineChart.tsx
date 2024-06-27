"use client";

import {
    BarElement,
    CategoryScale,
    Chart as ChartJS, Legend, LineController, LineElement, LinearScale, PointElement, Title, Tooltip
} from 'chart.js'

import { Bar } from 'react-chartjs-2';
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function OccupancyLineChart({data, options} : {data: Map<string,number>, options?: any}) {
    const chartData = {
        labels: Array.from(data.keys()),
        datasets: [
            {
                label: 'Ocupación',
                data: Array.from(data.values()),
                fill: false,
                backgroundColor: '#36A2EB66',
                borderColor: 'rgb(75, 192, 192)',
                borderWidth: 2,
                borderRadius: 10,
            },
        ],
    };
    if (!options) {
        const options = {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top' as const,
                },
                title: {
                    display: true,
                    text: 'Cantidad de personas',
                },
            },
        };
    }

    return (
       <Bar data={chartData} options={options} />
    );
};

export default OccupancyLineChart;
