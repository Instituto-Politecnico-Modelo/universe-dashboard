'use client';
import { getAllHisoticalData, getLatestForAllCameras } from '@/actions/occupancyDataActions';
import Floorplan from '@/components/Floorplan';
import { InteractiveMarquee } from '@/components/Marquee';
import { OccupancyDataProvider, useOccupancyData } from '@/hooks/OccupancyDataContext';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import ChartJS from 'chart.js/auto';
import { Kanit } from 'next/font/google';
import { useEffect, useRef } from 'react';
import { Doughnut, getElementAtEvent, Line } from 'react-chartjs-2';

const kanit = Kanit({ weight: '700', subsets: ['latin'] });

function Dashboard() {
    ChartJS.defaults.color = 'white';
    const occupancyData = useOccupancyData();
    const { isError, isLoading, error, data } = useQuery({
        queryKey: ['currentData'],
        queryFn: async () => await getLatestForAllCameras(),
        refetchOnWindowFocus: true,
        refetchInterval: 30000,
    });

    const historicalDataQuery = useQuery({
        queryKey: ['historicalData'],
        queryFn: async () => await getAllHisoticalData(),
        refetchOnReconnect: true,
    });

    const historicalChartRef = useRef(null);

    useEffect(() => {
        if (!data) return;

        // TODO: evaluar si es mejor tener un hash map para evitar duplicados
        if (occupancyData.occupancyData.find((d) => d._id === data[0]._id)) return;
        occupancyData.updateOccupancyData(data);
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
        if (!element) return;
        // get from occupancyData the data for the selected timestamp
        // the element index is reversed because the data is reversed
        const data = occupancyData.occupancyData.toReversed()[element.index];
        console.log(data);
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
                <div className='flex flex-row w-full h-3/4 gap-4'>
                    <div className=' flex flex-col p-5 h-full border-2 rounded-lg border-sky-700'>
                        <Doughnut
                            data={currentChartData(occupancyData.getAllCurrentOccupancyData())}
                            options={{
                                /*
                            legend: {
                                display: false,
                                position: 'right',
                                color: 'white',
                                labels: {
                                    color: 'white',
                                },
                            },*/
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
                    <Floorplan
                        className='flex-1 border-sky-700 border-2 rounded-lg'
                        data={occupancyData.getAllCurrentOccupancyData()}
                    />
                </div>
                {/* historical line chart for all cameras (total count) */}
                <div className='h-1/4 border-sky-700 w-full border-2 rounded-lg p-4'>
                    <Line
                        className=''
                        onClick={historicalChartClick}
                        ref={historicalChartRef}
                        data={historicalChartData(occupancyData.occupancyData)}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            // HACK: mantainAspectRatio doesn't seem to be working
                            // aspectRatio: 9,
                            elements: {
                                point: {
                                    radius: 0,
                                },
                            },
                        }}
                    />
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
                    // sky-400
                    '#7dd3fc',
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

function historicalChartData(data: OccupancyData[]) {
    return {
        datasets: [
            {
                label: 'Ocupación total',
                data: data.toReversed().map((d) => d.personas),
                backgroundColor: ['#7dd3fc'],
                borderColor: '#0369a1',
                tension: 0.4,
                fill: true,
            },
        ],
        labels: data.toReversed().map((d) => d.timestamp.toTimeString().slice(0, 5)),
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
