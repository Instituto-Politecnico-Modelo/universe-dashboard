'use server';
import client from '@/db';

export const getLatestForAllCameras = (): Promise<OccupancyBatch> =>
    client.connect().then(async () => {
        const snapsCollection = client.db('galaxy').collection<Snapshot>('snapshots');
        const camerasCollection = client.db('galaxy').collection<Camera>('cameras');
        const batchesCollection = client.db('galaxy').collection<Batch>('batches');
        // this function should find the latest batch and return it with the data for all associated snaps

        // find latest batch_id from latest snap
        const batch_id = await snapsCollection
            .findOne({ personas: { $exists: true } }, { sort: { timestamp: -1 } })
            .then((snap) => snap?.batch_id);

        // find the batch
        const batch = await batchesCollection.findOne({ _id: batch_id });
        const snaps = await snapsCollection.find({ batch_id, personas: { $exists: true } }).toArray();
        const cameras = await camerasCollection.find().toArray();

        return {
            _id: batch?._id.toString() as string,
            timestamp: batch?.timestamp as Date,
            data: snaps.map((snap) => {
                const camera = cameras.find((c) => c._id.toString() === snap.camera_id.toString());
                return {
                    _id: snap._id.toString(),
                    camera_id: snap.camera_id.toString(),
                    location: camera?.location,
                    timestamp: snap.timestamp,
                    url: snap.url,
                    personas: snap.personas,
                    threshold: camera?.threshold,
                } as OccupancyData;
            }),
        } as OccupancyBatch;
    });

export const getBatchesSince = (startDate: Date): Promise<OccupancyBatch[]> =>
    client.connect().then(async () => {
        const snapsCollection = client.db('galaxy').collection<Snapshot>('snapshots');
        const camerasCollection = client.db('galaxy').collection<Camera>('cameras');
        const batchesCollection = client.db('galaxy').collection<Batch>('batches');
        // this function should find all batches since the given date in chronological order
        // and return them with the data for all associated snaps

        // find the batches and sort them by timestamp
        const batches = await batchesCollection
            .find({ timestamp: { $gte: startDate }, personas: { $exists: true } }, { sort: { timestamp: -1 } })
            .toArray();
        const snaps = await snapsCollection
            .find({ timestamp: { $gte: startDate }, personas: { $exists: true }, batch_id: { $exists: true } })
            .toArray();
        const cameras = await camerasCollection.find().toArray();

        const ret = batches.reduce((acc, curr) => {
            const batchData = snaps.filter((snap) => snap.batch_id.toString() === curr._id.toString());
            if (batchData.length > 0)
                acc.push({
                    _id: curr._id.toString(),
                    timestamp: curr.timestamp,
                    personas: curr.personas,
                    data: batchData.map((snap) => {
                        const camera = cameras.find((c) => c._id.toString() === snap.camera_id.toString());
                        return {
                            _id: snap._id.toString(),
                            camera_id: snap.camera_id.toString(),
                            location: camera?.location,
                            timestamp: snap.timestamp,
                            url: snap.url,
                            personas: snap.personas,
                            threshold: camera?.threshold,
                        } as OccupancyData;
                    }),
                });
            return acc;
        }, [] as OccupancyBatch[]);
        return ret;
    });
/*
export async function getAllHisoticalData(startDate: Date): Promise<OccupancyBatch[]> {
    return client.connect().then(async () => {
        const snapsCollection = client.db('galaxy').collection<Snapshot>('snapshots');
        const camerasCollection = client.db('galaxy').collection<Camera>('cameras');
        const batchesCollection = client.db('galaxy').collection<Batch>('batches');

        const batchesAggregation = await batchesCollection.aggregate([
            {
                $match: {
                    timestamp: {
                        $gte: startDate,
                    },
                },
            },
            {
                $sort: {
                    timestamp: -1,
                },
            },
        ]);

        const snapsAggregation = snapsCollection.aggregate([
            {
                $match: {
                    $and: [
                        {
                            timestamp: {
                                $gte: startDate,
                            },
                        },
                        {
                            personas: {
                                $exists: true,
                            },
                        },
                        {
                            batch_id: {
                                $exists: true,
                            },
                        },
                    ],
                },
            },
            {
                $group: {
                    _id: '$batch_id',
                    snaps: {
                        $push: '$$ROOT',
                    },
                },
            },
            {
                $sort: {
                    timestamp: -1,
                },
            },
        ]);

        const cameras = camerasCollection.find().toArray();

        // merge the data
        const batches = await batchesAggregation.toArray();
        const snaps = await snapsAggregation.toArray();
        const cameraData = await cameras;

        return batches.reduce((acc, curr) => {
            const batchData = snaps.filter((snap) => snap.batch_id === curr._id);
            if (batchData.length > 0)
                acc.push({
                    _id: curr._id.toString(),
                    timestamp: curr.timestamp,
                    data: batchData.map((snap) => {
                        const camera = cameraData.find((c) => c._id === snap.camera_id);
                        return {
                            _id: snap._id.toString(),
                            camera_id: snap.camera_id.toString(),
                            location: camera?.location,
                            timestamp: snap.timestamp,
                            url: snap.url,
                            personas: snap.personas,
                            threshold: camera?.threshold,
                        } as OccupancyData;
                    }),
                });
            return acc;
        }) as OccupancyBatch[];
    });
}

export async function getLatestForCamera(camera_id: string): Promise<OccupancyData> {
    return client.connect().then(async () => {
        const snaps = client.db('galaxy').collection<Snapshot>('snapshots');
        const cameras = client.db('galaxy').collection<Camera>('cameras');

        const latestSnap = await snaps
            .aggregate([
                {
                    $match: {
                        camera_id,
                    },
                },
                {
                    $sort: {
                        timestamp: -1,
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
            batch_id: latestSnap[0].batch_id,
        };
    });
}
*/
