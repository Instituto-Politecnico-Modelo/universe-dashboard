"use server";
import client from "@/db";

export async function getAllSnaps(){
    let isConnected = false;
    try {
        await client.connect();
        isConnected = true;
        const snaps = client.db('galaxy').collection<Snapshot>('snapshots');
        const snapArray = await snaps.find().toArray();
        console.log("snap array:", snapArray)
        return snapArray;
    } catch (error) {
        console.error('Error connecting to the database', error);
    } finally {
        if (isConnected) {
            await client.close();
        }
    }
}

export async function getLatestSnapshotForAllCameras(){
    let isConnected = false;
    try {
        await client.connect();
        isConnected = true;
        const snaps = client.db('galaxy').collection<Snapshot>('snapshots');
        return await snaps.aggregate([
            {
                $sort: {
                    timeStamp: -1
                }
            },
            {
                $group: {
                    _id: '$camera_id',
                    latest: {
                        $first: '$$ROOT'
                    }
                }
            }
        ]).toArray();
    } catch (error) {
        console.error('Error connecting to the database', error);
    } finally {
        if (isConnected) {
            await client.close();
        }
    }
}