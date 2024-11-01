import { InteractiveMarquee } from './Marquee';
import { motion } from 'framer-motion';

export default function AnnouncementMarquee({
    announcements,
}: Readonly<{
    announcements: Announcement[];
}>) {
    // this component should be invisible until there is an announcement
    // the layout change should be animated using framer motion
    // the announcement should be displayed in a marquee

    return (
        <div className='fixed z-50 w-full left-0 top-0'>
            <div className='flex align-middle justify-center'>
                {announcements.map((announcement, index) => (
                    <div
                        key={index}
                        className='animate-border inline-block rounded-md bg-white bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 bg-[length:400%_400%] p-2 mt-2'
                        // className='text-white text-center bg-teal-600 rounded-xl whitespace-nowrap flex align-middle p-4 mt-2'
                    >
                        {/* title text */}
                        <div className='text-white text-center font-bold'>{announcement.title}</div>
                        {announcement.message}{' '}
                    </div>
                ))}
            </div>

            {/*
            <InteractiveMarquee
                className='w-full'
                speed={0.5}
                threshold={0.01}
                wheelFactor={1.8}
                dragFactor={1.2}
                rotate={0}
            >
           </InteractiveMarquee>
            */}
        </div>
    );
}
