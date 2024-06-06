"use client";

import {
    CategoryScale,
    Chart as ChartJS, Legend, LineController, LineElement, LinearScale, PointElement, Title, Tooltip
} from 'chart.js'
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend
);

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

const data = {
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio'],
    datasets: [
        {
            label: 'Ocupación',
            data: [65, 59, 80, 81, 56, 55, 40 ],
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
        },
    ],
};

const OccupancyLineChart = () => {
    return (
        <div className="flex justify-center items-center h-screen w-screen">
            <Line data={data} options={options} />
        </div>
    );
};

export default OccupancyLineChart;
