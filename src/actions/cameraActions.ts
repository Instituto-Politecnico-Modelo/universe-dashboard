'use server';
import client from '@/db';
import { ObjectId } from 'mongodb';

let emptyCamera: Camera = {
    _id: '',
    name: '',
    location: '',
    url: '',
    threshold: 0,
};

export async function getAllCameras() {
    let isConnected = false;
    try {
        await client.connect();
        isConnected = true;
        const cameras = client.db('galaxy').collection('cameras');
        let result = await cameras.find().toArray();
        let aux: Camera[] = [];
        for (let i = 0; i < result.length; i++) {
            aux.push({ ...emptyCamera });
        }
        for (let i = 0; i < result.length; i++) {
            aux[i]._id = String(result[i]._id);
            aux[i].name = result[i].name;
            aux[i].url = result[i].url;
            aux[i].location = result[i].location;
            aux[i].threshold = result[i].threshold;
        }
        return aux;
    } catch (error) {
        console.error('Error connecting to the database', error);
    } finally {
        if (isConnected) {
            await client.close();
        }
    }
}
export async function getCameraById(id: string) {
    let isConnected = false;
    try {
        await client.connect();
        isConnected = true;
        const cameras = client.db('galaxy').collection('cameras');
        let aux: ObjectId = new ObjectId(id);
        let result = await cameras.findOne({ _id: aux });
        if (result != null) {
            return {
                _id: String(result._id),
                name: result.name,
                url: result.url,
                location: result.location,
                threshold: result.threshold,
            };
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error connecting to the database', error);
    } finally {
        if (isConnected) {
            await client.close();
        }
    }
}
export async function createCameraAction(camera: Camera) {
    let isConnected = false;
    try {
        await client.connect();
        isConnected = true;
        const cameras = client.db('galaxy').collection('cameras');
        let result = await cameras.insertOne({
            _id: new ObjectId(),
            name: camera.name,
            url: camera.url,
            location: camera.location,
            threshold: camera.threshold,
        });
        console.log(result);
        return {
            _id: String(result.insertedId),
        };
    } catch (error) {
        console.error('Error connecting to the database', error);
    } finally {
        if (isConnected) {
            await client.close();
        }
    }
}
export async function updateCameraAction(camera: Camera) {
    let isConnected = false;
    try {
        await client.connect();
        isConnected = true;
        const cameras = client.db('galaxy').collection('cameras');
        return await cameras.updateOne(
            { _id: new ObjectId(camera._id) },
            {
                $set: {
                    name: camera.name,
                    url: camera.url,
                    location: camera.location,
                    threshold: camera.threshold,
                },
            },
        );
    } catch (error) {
        console.error('Error connecting to the database', error);
    } finally {
        if (isConnected) {
            await client.close();
        }
    }
}

export async function deleteCameraAction(id: string) {
    let isConnected = false;
    console.log('Delete:' + id);
    try {
        await client.connect();
        isConnected = true;
        const cameras = client.db('galaxy').collection('cameras');
        let aux = new ObjectId(id);
        return await cameras.deleteOne({ _id: aux });
    } catch (error) {
        console.error('Error connecting to the database', error);
    } finally {
        if (isConnected) {
            await client.close();
        }
    }
}

export async function getAllLocations(): Promise<string[]> {
    return client.connect().then(async () => {
        const cameras = client.db('galaxy').collection('cameras');
        return await cameras.distinct('location');
    });
}
