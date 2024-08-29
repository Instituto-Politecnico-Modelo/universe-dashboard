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
    return <DataView value={[proyecto]} itemTemplate={ProyectoCard} />;
}
