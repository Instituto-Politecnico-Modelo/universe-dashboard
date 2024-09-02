export default function ProyectoCard({ proyecto }: { proyecto: Proyecto }) {
    // a responsive card that displays the project's name, location, description, authors and image
    return (
        <div className='flex-1 border-2 border-sky-600 rounded-md'>
            <div className='card'>
                <img src={proyecto.imageUrl} alt={proyecto.name} />
                <div className='p-3'>
                    <h2 className='text-xl'>{proyecto.name}</h2>
                    <p className='text-sm italic text-slate-400'>{proyecto.location}</p>
                    <p className='text-md'>{proyecto.description}</p>
                    <p className='text-md'>{proyecto.authors.join(', ')}</p>
                </div>
            </div>
        </div>
    );
}
