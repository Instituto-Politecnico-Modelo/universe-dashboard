'use client';
import { getAnnouncements } from '@/actions/announcementActions';
import { getAllLocations, getLocations } from '@/actions/cameraActions';
import { getBatchesSince, getLatestForAllCameras, getMaxBatchPersonas } from '@/actions/occupancyDataActions';
import Floorplan from '@/components/Floorplan';
import { InteractiveMarquee } from '@/components/Marquee';
import { OccupancyDataProvider, useOccupancyData } from '@/hooks/OccupancyDataContext';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import ChartJS from 'chart.js/auto';
import { Kanit, Rajdhani } from 'next/font/google';
import { Skeleton } from 'primereact/skeleton';
import { use, useEffect, useRef, useState } from 'react';
import { Doughnut, Line, getElementAtEvent } from 'react-chartjs-2';
import AnnouncementMarquee from './AnnouncementMarquee';
import Clock from './Clock';

const kanit = Kanit({ weight: '700', subsets: ['latin'] });
const rajdhani = Rajdhani({ weight: '700', subsets: ['latin'] });

function repeatArray<T>(arr: T[], length: number): T[] {
    // this function repeats the array until it reaches the desired length
    const ret = [];
    for (let i = 0; i < length; i++) {
        ret.push(arr[i % arr.length]);
    }
    return ret;
}

function Content({ outputUrl, regex }: { outputUrl: string; regex: string }) {
    'use client';
    ChartJS.defaults.color = 'white';

    const [cameraLocation, setCameraLocation] = useState({ location: 'tetas', locationText: 'Cargando...' });
    const occupancyData = useOccupancyData();
    const { isError, isLoading, error, data } = useQuery({
        queryKey: ['currentData'],
        queryFn: async () => {
            const maxBatch = await getMaxBatchPersonas('1p');
            occupancyData.setMaxOccupancy(maxBatch);
            return await getLatestForAllCameras();
        },
        refetchOnWindowFocus: true,
        refetchInterval: 30000,
    });

    const locationsQuery = useQuery({
        queryKey: ['locations'],
        queryFn: async () => await getLocations(regex),
        refetchOnReconnect: false,
    });

    const historicalDataQuery = useQuery({
        queryKey: ['historicalData'],
        queryFn: async () => {
            const date = new Date();
            date.setDate(date.getDate() - 1);
            const ret = await getBatchesSince(date);
            return ret;
        },
        // refetchInterval: 30000,
        refetchOnReconnect: true,
    });

    const announcementQuery = useQuery({
        queryKey: ['announcements'],
        queryFn: async () => await getAnnouncements('dashboard'),
        refetchInterval: 30000,
        refetchOnReconnect: true,
    });
    let time = new Date().toLocaleTimeString('es-AR', { hour12: false });

    const [ctime, setTime] = useState(time);
    /*
    const UpdateTime = () => {
        time = new Date().toLocaleTimeString('es-AR', { hour12: false });
        setTime(time);
    };
    setInterval(UpdateTime);
    */

    const historicalChartRef = useRef(null);

    // change location every 10 seconds
    useEffect(() => {
        if (locationsQuery.data) {
            const locations = locationsQuery.data;
            let i = 0;
            const interval = setInterval(() => {
                setCameraLocation(locations[i]);
                i = (i + 1) % locations.length;
            }, 10000);
            return () => clearInterval(interval);
        }
    }, [locationsQuery.data]);

    useEffect(() => {
        if (!data) return;

        // TODO: evaluar si es mejor tener un hash map para evitar duplicados
        if (data._id !== occupancyData.occupancyData[0]?._id) occupancyData.updateOccupancyData([data]);
    }, [data]);

    useEffect(() => {
        if (historicalDataQuery.data) occupancyData.setOccupancyData(historicalDataQuery.data);
    }, [historicalDataQuery.data]);

    const [announcements, setAnnouncements] = useState([]);

    useEffect(() => {
        if (announcementQuery.data) {
            setAnnouncements(repeatArray(announcementQuery.data, 7));
        }
    }, [announcementQuery.data]);
    if (isLoading) {
        return (
            <div className='centered text-4xl h-full w-full content-center'>
                <p className='text-center text-6xl'>Cargando...</p>
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

    //    const announcements = announcementQuery.isLoading ? [] : repeatArray(announcementQuery.data, 7);

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
            <main className='flex flex-col w-screen h-screen pl-14 p-4 gap-4 overflow-hidden pb-11'>
                <div className='flex flex-row w-full h-3/4 gap-4 z-10'>
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
                        <div className='absolute bottom-0 left-0 text-white rounded-bl-md rounded-tr-md p-2 bg-sky-700 text-2xl bold'>
                            <div className='flex'>
                                {
                                    /*total occupancy*/
                                    occupancyData.selectedBatch
                                        ? occupancyData.selectedBatch.personas_1p
                                        : occupancyData.getAllCurrentOccupancyData().personas_1p
                                }{' '}
                                <img src='/person.svg' alt='person' className='h-8 w-8' />
                            </div>
                        </div>

                        {/* top left showing max occupancy for 1p */}
                        <div className='absolute top-0 left-0 text-white rounded-tl-md rounded-br-md p-2 bg-red-700 text-2xl bold'>
                            <div className='flex'>
                                MAX: {occupancyData.maxOccupancy}{' '}
                                <img src='/person.svg' alt='person' className='h-8 w-8' />
                            </div>
                        </div>

                        {/* text overlay on top right 
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
*/}
                    </div>
                    <div className='flex-1 relative border-sky-700 border-2 rounded-lg overflow-hidden'>
                        {/* locaiton as title */}
                        <h2 className='text-center absolute top-0 left-0 z-50 text-2xl text-white bg-none bg-sky-700 rounded-br-md p-2'>
                            {cameraLocation.locationText}
                        </h2>
                        <Floorplan
                            className='flex-1'
                            sceneFile='/scene.gltf'
                            location={cameraLocation.location}
                            data={
                                occupancyData.selectedBatch
                                    ? occupancyData.selectedBatch.data
                                    : occupancyData.getAllCurrentOccupancyData().data
                            }
                        />
                        {/* text overlay on top right */}
                        <div className='absolute w-1/2 top-0 right-0 text-white border-2 border-sky-700 rounded-bl-md rounded-tr-md overflow-hidden'>
                            <img
                                src={
                                    outputUrl +
                                    '/' +
                                    cameraLocation.location +
                                    '_' +
                                    (occupancyData.selectedBatch
                                        ? occupancyData.selectedBatch?._id
                                        : occupancyData.getAllCurrentOccupancyData()._id) +
                                    '.jpg'
                                }
                                alt='output'
                                className='w-full h-full object-cover'
                            />
                        </div>
                        {/* bottom right overlay showing current occupancy for location as text */}
                        <div className='absolute bottom-0 left-0 text-white rounded-bl-md rounded-tr-md p-2 bg-sky-700 text-2xl bold'>
                            <div className='flex'>
                                {occupancyData.selectedBatch
                                    ? occupancyData.selectedBatch.data.reduce(
                                          (acc, curr) =>
                                              curr.location === cameraLocation.location ? curr.personas : acc,
                                          0,
                                      )
                                    : occupancyData
                                          .getAllCurrentOccupancyData()
                                          .data.reduce(
                                              (acc, curr) =>
                                                  curr.location === cameraLocation.location ? curr.personas : acc,
                                              0,
                                          )}{' '}
                                <img src='/person.svg' alt='person' className='h-8 w-8' />
                            </div>
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
                                // integer only
                                scales: {
                                    y: {
                                        ticks: {
                                            stepSize: 1,
                                        },
                                    },
                                },
                            }}
                        />
                    )}
                </div>
            </main>
            <div className='fixed bottom-0 left-0 animate-border h-9 inline-block w-screen bg-white bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 bg-[length:400%_400%]  text-white text-center z-50'>
                <div className='flex  justify-end h-full'>
                    <Clock className='bg-slate-950 font-bold text-3xl px-2 py-0 m-0 text-white z-50' />
                    <div className='relative'>
                        <InteractiveMarquee className={`fixed bottom-0 left-0`} speed={0.5}>
                            {announcements.map((announcement, index) => (
                                <>
                                    <span
                                        className={`text-2xl ${rajdhani.className} whitespace-nowrap px-0 `}
                                        key={index}
                                    >
                                        {' '}
                                        \\\{' '}
                                    </span>
                                    <span
                                        className={`text-2xl ${rajdhani.className} whitespace-nowrap px-3  `}
                                        key={index}
                                    >
                                        <span className='whitespace-nowrap pr-1 uppercase'>{announcement.title}</span>
                                        {announcement.message}
                                    </span>
                                </>
                            ))}
                        </InteractiveMarquee>
                    </div>
                </div>
            </div>
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
                data: batch.toReversed().map((d) => d.personas_1p),
                backgroundColor: ['#7dd3fc'],
                borderColor: '#0369a1',
                tension: 0.4,
                fill: false,
            },
        ],
        labels: batch.toReversed().map((d) => d.timestamp.toTimeString().slice(0, 5)),
    };
}

export default function Dashboard({ outputUrl, prefix }: { outputUrl: string; prefix: string }) {
    'use client';
    const queryClient = new QueryClient();
    return (
        <QueryClientProvider client={queryClient}>
            <OccupancyDataProvider>
                <Content outputUrl={outputUrl} regex={prefix} />
            </OccupancyDataProvider>
        </QueryClientProvider>
    );
}
