'use client';
import { getLatestForAllCameras } from '@/actions/occupancyDataActions';
import Floorplan from '@/components/Floorplan';
import { InteractiveMarquee } from '@/components/Marquee';
import { OccupancyDataProvider, useOccupancyData } from '@/hooks/OccupancyDataContext';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { ChartData } from 'chart.js';
import ChartJS from 'chart.js/auto';
import { Kanit } from 'next/font/google';
import { Chart } from 'primereact/chart';

const kanit = Kanit({ weight: '700', subsets: ['latin'] });

function Dashboard() {
    ChartJS.defaults.color = 'white';
    const occupancyData = useOccupancyData();
    useQuery({
        queryKey: ['currentData'],
        queryFn: async () => {
            const latestData = await getLatestForAllCameras();
            occupancyData.updateOccupancyData(latestData);
            return latestData;
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
                    Politécnico Modelo Politécnico Modelo Politécnico Modelo Politécnico Modelo Politécnico Modelo
                    Politécnico Modelo Politécnico Modelo
                </span>
            </InteractiveMarquee>
            <main className='flex flex-col w-screen h-screen p-10 gap-10'>
                <div className='flex flex-row w-full h-3/4 gap-10'>
                    <Chart
                        className=' flex flex-col p-5 h-full border-2 rounded-lg border-sky-700'
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
                    <Floorplan
                        className='flex-1 border-sky-700 border-2 rounded-lg'
                        data={occupancyData.getAllCurrentOccupancyData()}
                    />
                </div>
            </main>
        </>
    );
}

function toChartJSData(data: OccupancyData[]): ChartData {
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
