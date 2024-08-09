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

function Dashboard() {
    const [currentOccupancyData, setCurrentOccupancyData] = useState<TypesData[]>([
        {
            location: 'patio',
            cant: 50,
            threshold: 50,
            camera_id: '',
            time: Date(),
        },
        {
            location: 'laboratorio_1',
            cant: 10,
            threshold: 50,
            camera_id: '',
            time: Date(),
        },
        {
            location: 'laboratorio_2',
            cant: 20,
            threshold: 50,
            camera_id: '',
            time: Date(),
        },
        {
            location: 'laboratorio_3',
            cant: 5,
            threshold: 50,
            camera_id: '',
            time: Date(),
        },
        {
            location: 'electronica',
            cant: 40,
            threshold: 50,
            camera_id: '',
            time: Date(),
        },
    ]);
    ChartJS.defaults.color = 'white';
    /* useQuery({
        queryKey: ['currentData'],
        queryFn: () => {
            const client = new Api({ baseUrl: 'http://localhost:8080/api/v1' });
            return client.data.dataList().then((response) => {
                setCurrentOccupancyData(response.data);
                return response.data;
            });
        },
        refetchOnWindowFocus: true,
        refetchInterval: 30000,
    }); */
    /*
    const [currentOccupancyData, setCurrentOccupancyData] = useState<Map<string, number>>(
        new Map([
            ['patio', 10],
            ['laboratorio_1', 10],
            ['laboratorio_2', 20],
            ['laboratorio_3', 5],
            ['electronica', 5],
            ['pasillo', 5],
            ['aula_6', 4],
            ['aula_8', 15],
        ]),
    ); */
    return (
        <>
            {/* https://olavihaapala.fi/2021/02/23/modern-marquee.html */}
            <div className="fixed w-full h-full whitespace-no-wrap overflow-x-scroll motion-safe:overflow-x-hidden">
                <ul className="flex motion-safe:animate-marquee">
                    <li className="mx-8 text-slate-500"> Politécnico Modelo</li>
                    <li className="mx-8 text-slate-500"> Politécnico Modelo</li>
                    <li className="mx-8 text-slate-500"> Politécnico Modelo</li>
                    <li className="mx-8 text-slate-500"> Politécnico Modelo</li>
                    <li className="mx-8 text-slate-500"> Politécnico Modelo</li>
                    <li className="mx-8 text-slate-500"> Politécnico Modelo</li>
                    <li className="mx-8 text-slate-500"> Politécnico Modelo</li>
                    <li className="mx-8 text-slate-500"> Politécnico Modelo</li>

                </ul>
                <ul className="flex absolute top-0 motion-safe:animate-marquee2">
                    <li className="mx-8 text-slate-500"> Politécnico Modelo</li>
                    <li className="mx-8 text-slate-500"> Politécnico Modelo</li>
                    <li className="mx-8 text-slate-500"> Politécnico Modelo</li>
                    <li className="mx-8 text-slate-500"> Politécnico Modelo</li>
                    <li className="mx-8 text-slate-500"> Politécnico Modelo</li>
                    <li className="mx-8 text-slate-500"> Politécnico Modelo</li>
                    <li className="mx-8 text-slate-500"> Politécnico Modelo</li>
                    <li className="mx-8 text-slate-500"> Politécnico Modelo</li>
                </ul>
            </div>
            <main className='flex flex-col w-screen h-screen p-10 gap-10'>
                <div className='flex flex-row w-full h-3/4 gap-10'>
                    <div className='flex flex-col w-1/2 h-full gap-10 border-2 rounded-lg border-sky-700'>
                        <Chart
                            className='flex-1 p-10'
                            type='doughnut'
                            data={toChartJSData(currentOccupancyData)}
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
                    <Floorplan className='flex-1 border-sky-700 border-2 rounded-lg' data={currentOccupancyData} />
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
            <Dashboard />
        </QueryClientProvider>
    );
}
