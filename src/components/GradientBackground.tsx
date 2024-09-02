export default function GradientBackground({ children }: { children: React.ReactNode }) {
    return (
        <div className='gradient-bg'>
            {children}
            <div className='gradients-container'>
                <div className='g1'></div>
                <div className='g2'></div>
                <div className='g3'></div>
                <div className='g4'></div>
                <div className='g5'></div>
            </div>
        </div>
    );
}
