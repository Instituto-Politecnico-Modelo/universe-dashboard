import { InteractiveMarquee } from './Marquee';

export default function AnnouncementMarquee({
    announcements,
}: Readonly<{
    announcements: Announcement[];
}>) {
    // this component should be invisible until there is an announcement
    // the layout change should be animated using framer motion
    // the announcement should be displayed in a marquee

    return (
        <div className='bg-slate-800 rounded-xl '>
            {announcements.map((announcement, index) => (
                <InteractiveMarquee className='bg-slate-800 rounded-b-xl' speed={1} key={index}>
                    <span className={`text-nowrap text-[3vw] pr-2 `}>{announcement.message}</span>
                </InteractiveMarquee>
            ))}
        </div>
    );
}
