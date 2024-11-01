import { useEffect, useState } from 'react';

export default function Clock({ className }: { className?: string }) {
    // div with clock that updates every second
    const [time, setTime] = useState(new Date());
    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);
    return <span className={className}>{time.toLocaleTimeString()}</span>;
}
