'use client';
import ProyectList from '@/components/ProyectList';
import ProyectoCard from '@/components/ProyectoCard';
export default function Page() {
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

    return (
        <>
            <ProyectList />
        </>
    );
}
