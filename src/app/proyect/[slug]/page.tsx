export default function Page({ params }: { params: { slug: string } }) {
    return (
    <div>
        <a href="/proyectos/" target="_blank" rel="noopener noreferrer" className="p-button font-bold">
            Navigate
        </a>
        My Post: {params.slug}
    </div>
        
    );
  }