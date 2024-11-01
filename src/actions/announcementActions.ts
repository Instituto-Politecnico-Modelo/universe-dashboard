"use server";
import client from "@/db";

export const getAnnouncements = async (target: string): Promise<Announcement[] > => 
    client.connect().then(async () => {
        const announcements = client.db('galaxy').collection<Announcement>('announcements');
        // we need to convert the object id to a string
        const result = await announcements.find({ targets: target,
            // check if the announcement is active
            start: { $lte: new Date() },
            end: { $gte: new Date() },
         }).toArray();
        return result.map((announcement) => ({
            ...announcement,
            _id: announcement._id.toString(),
        }));
    }).catch((error) => {
        console.error('Error connecting to the database', error);
        return [];
    });