'use client';
import { Card } from 'primereact/card';

export default function ProyectoCard({ proyecto }: { proyecto: Proyecto }) {
    // eslint-disable-next-line @next/next/no-img-element
    const header = <img alt='Imagen de Proyecto' src={proyecto.imageUrl} />;
    return (
        <Card title={proyecto.name} header={header} subTitle={proyecto.location}>
            {proyecto.description}
        </Card>
    );
}
