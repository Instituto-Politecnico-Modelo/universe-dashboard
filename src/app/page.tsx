'use client';
import CubeGrid from '@/components/CubeGrid';
import Floorplan from '@/components/Floorplan';
import OccupancyLineChart from '@/components/OccupancyLineChart';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import Image from 'next/image';
import { useState } from 'react';

export default function Home() {
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
    );
    return (
        <main className='flex min-h-screen justify-center flex-col items-center p-24'>
            <div>
                <OccupancyLineChart data={currentOccupancyData} />
                <Floorplan data={currentOccupancyData} />
            </div>
        </main>
    );
}
