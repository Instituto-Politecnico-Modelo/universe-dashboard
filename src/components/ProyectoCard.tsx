import { Button } from 'primereact/button';
export default function ProyectoCard({ proyecto }: { proyecto: Proyecto }) {
    // a responsive card that displays the project's name, location, description, authors and image
    return (
        <div className='sm:w-1/3 md:w-1/4 border-2 border-sky-600 rounded-md'>
            <div className='card w-fit'>
                <div className='p-7'>
                    <h2 className='text-xl'> {proyecto?.name}</h2>
                    <p className='text-sm italic text-slate-400'>{proyecto?.location}</p>
                    <p className='text-md'>{proyecto?.description}</p>

                    <a href={`/proyect/${proyecto?.name} `} className='p-button-info  r----zxczxounded-lg ring-2'>
                        Ver más
                    </a>
                </div>
            </div>
        </div>
    );
}
//            <p className='text-md'>{proyecto.authors.join(', ')}</p>
//                 <img src={proyecto.imageUrl} alt={proyecto.name} />
