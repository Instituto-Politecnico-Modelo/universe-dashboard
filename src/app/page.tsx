'use client';
import { getBatchesSince, getLatestForAllCameras } from '@/actions/occupancyDataActions';
import Floorplan from '@/components/Floorplan';
import { InteractiveMarquee } from '@/components/Marquee';
import { OccupancyDataProvider, useOccupancyData } from '@/hooks/OccupancyDataContext';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import ChartJS from 'chart.js/auto';
import { Kanit } from 'next/font/google';
import { Button } from 'primereact/button';
import { Skeleton } from 'primereact/skeleton';
import { useEffect, useRef, useState } from 'react';
import { Doughnut, Line, getElementAtEvent } from 'react-chartjs-2';

const kanit = Kanit({ weight: '700', subsets: ['latin'] });

function Dashboard() {
    ChartJS.defaults.color = 'white';

    const [cameraLocation, setCameraLocation] = useState('patio');
    const occupancyData = useOccupancyData();
    const { isError, isLoading, error, data } = useQuery({
        queryKey: ['currentData'],
        queryFn: async () => {
            return await getLatestForAllCameras();
        },
        refetchOnWindowFocus: true,
        refetchInterval: 30000,
    });

    const historicalDataQuery = useQuery({
        queryKey: ['historicalData'],
        queryFn: async () => {
            const date = new Date();
            date.setDate(date.getDate() - 1);
            const ret = await getBatchesSince(date);
            return ret;
        },
        refetchOnReconnect: true,
    });

    const historicalChartRef = useRef(null);

    useEffect(() => {
        if (!data) return;

        // TODO: evaluar si es mejor tener un hash map para evitar duplicados
        if (data._id !== occupancyData.occupancyData[0]?._id) occupancyData.updateOccupancyData([data]);
    }, [data]);

    useEffect(() => {
        if (historicalDataQuery.data) occupancyData.setOccupancyData(historicalDataQuery.data);
    }, [historicalDataQuery.data]);

    if (isLoading) {
        return (
            <div className='centered text-4xl h-full w-full content-center'>
                <p className='text-center'>Loading </p>
            </div>
        );
    }

    if (isError) {
        return <div className='centered'>Error: {error.message}</div>;
    }

    const historicalChartClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
        // HACK: i couldn't find a way to make typescript happy
        const chart: any = historicalChartRef.current;
        // get first element at the event
        const element = getElementAtEvent(chart, event).at(0);
        if (!element) {
            occupancyData.setSelectedBatch(undefined);
            return;
        }
        // get from occupancyData the data for the selected timestamp
        // the element index is reversed because the data is reversed
        const data = occupancyData.occupancyData.toReversed()[element.index];
        occupancyData.setSelectedBatch(data);
    };

    return (
        <>
            <InteractiveMarquee className='fixed left-[-218vw] top-[219vw] uppercase' rotate={90} speed={0.02}>
                <span
                    className={`text-nowrap text-[3vw] pr-2 ${kanit.className}`}
                    style={{ WebkitTextFillColor: 'transparent', WebkitTextStroke: '1.5px orange' }}
                >
                    Politécnico Modelo Politécnico Modelo Politécnico Modelo Politécnico Modelo Politécnico Modelo
                    Politécnico Modelo Politécnico Modelo
                </span>
            </InteractiveMarquee>
            <main className='flex flex-col w-screen h-screen pl-10 p-4 gap-4'>
                <Button className='fixed top-3 w-48 left-3' label='Patio' onClick={() => setCameraLocation('patio')} />
                <Button
                    className='fixed top-3 w-48 right-3 z-10'
                    label='Labo'
                    onClick={() => setCameraLocation('laboratorio_1')}
                />
                <div className='flex flex-row w-full h-3/4 gap-4 z-10'>
                    <div className='flex-1 relative border-sky-700 border-2 rounded-lg'>
                        <Floorplan
                            className='flex-1'
                            sceneFile='/scene.gltf'
                            location={cameraLocation}
                            data={
                                occupancyData.selectedBatch
                                    ? occupancyData.selectedBatch.data
                                    : occupancyData.getAllCurrentOccupancyData().data
                            }
                        />
                        {/* text overlay on top right */}
                        <div className='absolute w-1/4 top-0 right-0 text-white  rounded-lg'>
                            <Doughnut
                                data={currentChartData(
                                    occupancyData.selectedBatch
                                        ? occupancyData.selectedBatch.data
                                        : occupancyData.getAllCurrentOccupancyData().data,
                                )}
                                options={{
                                    plugins: {
                                        title: {
                                            display: false,
                                            text: 'Ocupación actual',
                                            color: '#fff',
                                        },
                                    },
                                }}
                            />
                        </div>
                    </div>
                    <div className='flex-1 relative border-sky-700 border-2 rounded-lg'>
                        <Floorplan
                            controls
                            className='flex-1'
                            sceneFile='/scene2.gltf'
                            data={
                                occupancyData.selectedBatch
                                    ? occupancyData.selectedBatch.data
                                    : occupancyData.getAllCurrentOccupancyData().data
                            }
                        />
                        {/* text overlay on top right */}
                        <div className='absolute top-0 right-0 w-1/4 text-white rounded-lg'>
                            <Doughnut
                                data={currentChartData(
                                    occupancyData.selectedBatch
                                        ? occupancyData.selectedBatch.data
                                        : occupancyData.getAllCurrentOccupancyData().data,
                                )}
                                options={{
                                    plugins: {
                                        title: {
                                            display: false,
                                            text: 'Ocupación actual',
                                            color: '#fff',
                                        },
                                    },
                                }}
                            />
                        </div>
                    </div>
                </div>
                {/* historical line chart for all cameras (total count) */}
                <div className='h-1/4 border-sky-700 w-full border-2 rounded-lg p-4'>
                    {historicalDataQuery.isLoading ? ( // show primereact skeleton
                        <Skeleton width='100%' height='100%' />
                    ) : (
                        <Line
                            className=''
                            onClick={historicalChartClick}
                            ref={historicalChartRef}
                            data={historicalChartData(occupancyData.occupancyData)}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                elements: {
                                    point: {
                                        radius: 0,
                                    },
                                },
                                interaction: {
                                    intersect: false,
                                    mode: 'x',
                                },
                            }}
                        />
                    )}
                </div>
            </main>
        </>
    );
}

function currentChartData(data: OccupancyData[]) {
    return {
        datasets: [
            {
                label: 'Current Occupancy',
                data: data.map((d) => d.personas),
                backgroundColor: [
                    // tailwind colors
                    '#7dd3fc', // sky-300
                    '#93c5fd', // sky-400
                    '#a3bffa', // sky-500
                    '#818cf8', // violet-400
                    '#6366f1', // indigo-500
                    '#4f46e5', // indigo-600
                    '#4338ca', // indigo-700
                    '#3730a3', // indigo-800
                    '#312e81', // indigo-900
                ],
                borderColor: '#0369a1', // sky-900
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

function historicalChartData(batch: OccupancyBatch[]) {
    return {
        datasets: [
            {
                label: 'Ocupación total',
                data: batch.toReversed().map((d) => d.data.reduce((acc, curr) => acc + curr.personas, 0)),
                backgroundColor: ['#7dd3fc'],
                borderColor: '#0369a1',
                tension: 0.4,
                fill: false,
            },
        ],
        labels: batch.toReversed().map((d) => d.timestamp.toTimeString().slice(0, 5)),
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
