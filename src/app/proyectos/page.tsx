'use client';
import ProyectoCard from '@/components/ProyectoCard';
import { DataView } from 'primereact/dataview';

export default function Page() {
    const proyecto = {
        _id: '1',
        name: 'Proyecto',
        imageUrl: 'https://placehold.co/600x400',
        location: 'Ubicación',
        description: 'Descripción',
        authors: ['Autor 1', 'Autor 2'],
    };

    const listTemplate = (proyectos: Proyecto[]) => {
        if (!proyectos || proyectos.length === 0) return null;

        let list = proyectos.map((proyecto, index) => {
            return <ProyectoCard key={index} proyecto={proyecto} />;
        });
        return <div className='flex p-2 gap-2 flex-wrap'>{list}</div>;
    };

    return (
        <DataView
            value={[
                proyecto,
                proyecto,
                proyecto,
                proyecto,
                proyecto,
                proyecto,
                proyecto,
                proyecto,
                proyecto,
                proyecto,
                proyecto,
            ]}
            className='scrollable-container'
            listTemplate={listTemplate as any}
            paginator
            rows={5}
        />
    );
}
