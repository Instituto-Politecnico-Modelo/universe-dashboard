'use client';
import { use, useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { getAllProyectos } from '@/actions/proyectoActions';
import { DataView } from 'primereact/dataview';
import ProyectoCard from './ProyectoCard';
function Proyectos() {
    const proyecto = {
        _id: '1',
        name: 'Proyecto',
        imageUrl: 'https://placehold.co/600x400',
        location: 'Ubicación',
        description: 'Descripción',
        authors: ['Autor 1', 'Autor 2'],
    };

    const listTemplate = async (proyectos: Proyecto[]) => {
        if (!proyectos || proyectos.length === 0) return null;
        let list = proyectos.map((proyecto, index) => {
            return <ProyectoCard key={index} proyecto={proyecto} />;
        });
        // return <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>{list}</div>;
        return <div className='flex flex-wrap pt-2 justify-center gap-4'>{list}</div>;
    };

    const [proyects, setProjects] = useState<Proyecto[]>([]);

    const proyectsQuery = useQuery({
        queryKey: ['proyects'],
        queryFn: async () => getAllProyectos(),
        refetchOnReconnect: true,
    });
    useEffect(() => {
        if (proyectsQuery.data) {
            setProjects(proyectsQuery.data);
        }
    }, [proyectsQuery.data]);
    return (
        <DataView
            value={[proyects]}
            className='scrollable-container'
            listTemplate={listTemplate as any}
            paginator
            rows={6}
        />
    );
}
export default function Page() {
    const queryClient = new QueryClient();
    return (
        <QueryClientProvider client={queryClient}>
            <Proyectos />
        </QueryClientProvider>
    );
}
