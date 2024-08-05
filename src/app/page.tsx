'use client';
import CubeGrid from '@/components/CubeGrid';
import Floorplan from '@/components/Floorplan';
import OccupancyLineChart from '@/components/OccupancyLineChart';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import {Api, TypesData} from '@/services/dataApi';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';

function Dashboard(){
    const [currentOccupancyData, setCurrentOccupancyData] = useState<TypesData[]>([]);
    useQuery({
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
    });
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
        <main className='flex min-h-screen justify-center flex-col items-center p-24'>
            <div>
                <Floorplan data={currentOccupancyData} />
            </div>
        </main>
    );
}

export default function Home() {
    const queryClient = new QueryClient();
    return (
        <QueryClientProvider client={queryClient}>
            <Dashboard />
        </QueryClientProvider>
    );

}
