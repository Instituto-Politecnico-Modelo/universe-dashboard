import client from "@/db";
import { ObjectId } from "mongodb";
import { threshold } from "three/examples/jsm/nodes/Nodes.js";

export function getLatestForAllCameras() : Promise<OccupancyData[]> {
    return client.connect().then(async () => {
        // get personas for each camera from snapshot collection and location from camera collection
        const snaps = client.db('galaxy').collection('snapshots');
        const cameras = client.db('galaxy').collection('cameras');

        const latestSnaps = await snaps.aggregate([
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

        const cameraData = await cameras.find().toArray();

        // merge camera data with snapshot data
        return latestSnaps.map((snap) => {
            const camera = cameraData.find((c) => c._id === snap._id);
            return {
                _id: snap.latest._id,
                camera_id: snap._id,
                location: camera?.location,
                timeStamp: snap.latest.timeStamp,
                personas: snap.latest.personas,
                threshold  : camera?.threshold
            };
        });
    });
}

export function getLatestForCamera(camera_id: string) : Promise<OccupancyData> {
    return client.connect().then(async () => {
        const snaps = client.db('galaxy').collection('snapshots');
        const cameras = client.db('galaxy').collection('cameras');

        const latestSnap = await snaps.aggregate([
            {
                $match: {
                    camera_id,
                }
            },
            {
                $sort: {
                    timeStamp: -1
                }
            },
            {
                $limit: 1
            }
        ]).toArray();

        const camera = await cameras.findOne({ _id:  new ObjectId(camera_id) });

        return {
            _id: latestSnap[0]._id,
            camera_id: camera_id,
            location: camera?.location,
            timeStamp: latestSnap[0].timeStamp,
            personas: latestSnap[0].personas,
            threshold: camera?.threshold
        };
    });
}