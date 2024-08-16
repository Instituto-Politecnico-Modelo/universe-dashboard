'use server';
import client from '@/db';
import { ObjectId } from 'mongodb';

export async function getLatestForAllCameras(): Promise<OccupancyData[]> {
    return client.connect().then(async () => {
        // get personas for each camera from snapshot collection and location from camera collection
        const snaps = client.db('galaxy').collection('snapshots');
        const cameras = client.db('galaxy').collection('cameras');

        const latestSnaps = await snaps
            .aggregate([
                {
                    // personas must be defined
                    $match: {
                        personas: {
                            $exists: true,
                        },
                    },
                },
                {
                    $sort: {
                        timestamp: -1,
                    },
                },
                {
                    $group: {
                        _id: '$camera_id',
                        latest: {
                            $first: '$$ROOT',
                        },
                    },
                },
            ])
            .toArray();

        const cameraData = await cameras.find().toArray();

        // merge camera data with snapshot data
        console.log(cameraData);
        console.log(latestSnaps);
        return latestSnaps.map((snap) => {
            const camera = cameraData.find((c) => c._id.equals(snap.latest.camera_id));
            return {
                _id: snap.latest._id.toString(),
                camera_id: snap.latest.camera_id.toString(),
                location: camera?.location,
                timestamp: snap.latest.timestamp,
                url: snap.latest.url,
                personas: snap.latest.personas,
                threshold: camera?.threshold,
            };
        });
    });
}

export async function getAllHisoticalData(): Promise<OccupancyData[]> {
    return client.connect().then(async () => {
        const snaps = client.db('galaxy').collection('snapshots');
        const cameras = client.db('galaxy').collection('cameras');

        const allSnaps = await snaps
            .aggregate([
                {
                    $match: {
                        personas: {
                            $exists: true,
                        },
                    },
                },
                {
                    $sort: {
                        timestamp: 1,
                    },
                },
            ])
            .toArray();

        const cameraData = await cameras.find().toArray();

        return allSnaps.map((snap) => {
            const camera = cameraData.find((c) => c._id.equals(snap.camera_id));
            return {
                _id: snap._id.toString(),
                camera_id: snap.camera_id.toString(),
                location: camera?.location,
                timestamp: snap.timestamp,
                url: snap.url,
                personas: snap.personas,
                threshold: camera?.threshold,
            };
        });
    });
}

export async function getLatestForCamera(camera_id: string): Promise<OccupancyData> {
    return client.connect().then(async () => {
        const snaps = client.db('galaxy').collection('snapshots');
        const cameras = client.db('galaxy').collection('cameras');

        const latestSnap = await snaps
            .aggregate([
                {
                    $match: {
                        camera_id,
                    },
                },
                {
                    $sort: {
                        timestamp: 1,
                    },
                },
                {
                    $limit: 1,
                },
            ])
            .toArray();

        const camera = await cameras.findOne({ _id: new ObjectId(camera_id) });

        return {
            _id: latestSnap[0]._id,
            camera_id: camera_id,
            location: camera?.location,
            timestamp: latestSnap[0].timeStamp,
            personas: latestSnap[0].personas,
            threshold: camera?.threshold,
            url: latestSnap[0].url,
        };
    });
}
