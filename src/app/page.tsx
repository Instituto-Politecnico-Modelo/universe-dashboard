'use client';
import CubeGrid from '@/components/CubeGrid';
import Floorplan from '@/components/Floorplan';
import OccupancyLineChart from '@/components/OccupancyLineChart';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Api, TypesData } from '@/services/dataApi';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { Splitter, SplitterPanel } from 'primereact/splitter';
import { Button } from 'primereact/button';
import { Skeleton } from 'primereact/skeleton';
import { Chart } from 'primereact/chart';
import { text } from 'stream/consumers';
import { ChartData, Legend, plugins, Ticks } from 'chart.js';
import { color } from 'chart.js/helpers';
import { title } from 'process';
import ChartJS from 'chart.js/auto';
import { InteractiveMarquee } from '@/components/Marquee';
import { Kanit } from 'next/font/google';
import { OccupancyDataProvider, useOccupancyData } from '@/contexts/OccupancyDataContext';

const kanit = Kanit({ weight: '700', subsets: ['latin'] });

function Dashboard() {
    ChartJS.defaults.color = 'white';
    const occupancyData = useOccupancyData();
    useQuery({
        queryKey: ['currentData'],
        queryFn: () => {
            const client = new Api({ baseUrl: 'http://localhost:8080/api/v1' });
            return client.data.dataList().then((response) => {
                occupancyData.updateOccupancyData(response.data);
                return response.data;
            });
        },
        refetchOnWindowFocus: true,
        refetchInterval: 30000,
    }); 
    return (
        <>
            <InteractiveMarquee className='fixed left-[-218vw] top-[219vw] uppercase' rotate={90} speed={0.02}>
                <span
                    className={`text-nowrap text-[3vw] pr-2 ${kanit.className}`}
                    style={{ WebkitTextFillColor: 'transparent', WebkitTextStroke: '1.5px orange' }}
                >
                    Politécnico Modelo Politécnico Modelo Politécnico Modelo Politécnico Modelo Politécnico Modelo Politécnico Modelo Politécnico Modelo 
                </span>
            </InteractiveMarquee>
            <main className='flex flex-col w-screen h-screen p-10 gap-10'>
                <div className='flex flex-row w-full h-3/4 gap-10'>
                    <div className='flex flex-col w-1/2 h-full gap-10 border-2 rounded-lg border-sky-700'>
                        <Chart
                            className='p-10'
                            type='doughnut'
                            data={toChartJSData(occupancyData.getAllCurrentOccupancyData())}
                            options={{
                                legend: {
                                    display: false,
                                    position: 'right',
                                    color: 'white',
                                    labels: {
                                        color: 'white',
                                    },
                                },
                                plugins: {
                                    title: {
                                        display: true,
                                        text: 'Ocupación actual',
                                        color: '#fff',
                                    },
                                },
                            }}
                        />
                    </div>
                    <Floorplan className='flex-1 border-sky-700 border-2 rounded-lg' data={occupancyData.getAllCurrentOccupancyData()} />
                </div>
            </main>
        </>
    );
}




function toChartJSData(data: TypesData[]): ChartData {
    return {
        datasets: [
            {
                label: 'Current Occupancy',
                data: data.map((d) => d.cant),
                backgroundColor: [
                    // tailwind colors
                    // sky-400
                    '#7dd3fc',
                ],
                borderColor: '#0369a1', // sky-900
                hoverOffset: 4,
            },
        ],
        labels: data.map((d) =>
            d.location
                .replace('_', ' ')
                .split(' ')
                .map((s) => s[0].toUpperCase() + s.slice(1))
                .join(' '),
        ),
    };
}

export default function Home() {
    const queryClient = new QueryClient();
    return (
        <QueryClientProvider client={queryClient}>
            <OccupancyDataProvider>
                <Dashboard />
            </OccupancyDataProvider>
        </QueryClientProvider>
    );
}
