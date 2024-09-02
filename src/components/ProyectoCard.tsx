export default function ProyectoCard({ proyecto }: { proyecto: Proyecto }) {
    // a responsive card that displays the project's name, location, description, authors and image
    return (
        <div className='sm:w-1/3 md:w-1/4 border-2 border-sky-600 rounded-md'>
            <div className='card w-fit'>
                <img src={proyecto.imageUrl} alt={proyecto.name} />
                <div className='p-10'>
                    <h2 className='text-xl'>{proyecto.name}</h2>
                    <p className='text-sm italic text-slate-400'>{proyecto.location}</p>
                    <p className='text-md'>{proyecto.description}</p>
                    <p className='text-md'>{proyecto.authors.join(', ')}</p>
                </div>
            </div>
        </div>
    );
}
