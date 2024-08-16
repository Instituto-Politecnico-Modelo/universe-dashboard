'use server';
import client from "@/db";
import { ObjectId } from "mongodb";

export async function getAllCameras(){
    let isConnected = false;
    try {
        await client.connect();
        isConnected = true;
        const cameras = client.db('galaxy').collection('cameras');
        return await cameras.find().toArray();
    } catch (error) {
        console.error('Error connecting to the database', error);
    } finally {
        if (isConnected) {
            await client.close();
        }
    }
}
export async function getCameraById(id: string){
    let isConnected = false;
    try {
        await client.connect();
        isConnected = true;
        const cameras = client.db('galaxy').collection('cameras');
        return await cameras.findOne({_id: new ObjectId(id)});
    } catch (error) {
        console.error('Error connecting to the database', error);
    } finally {
        if (isConnected) {
            await client.close();
        }
    }
}
export async function createCameraAction(camera: Camera){
    let isConnected = false;
    try {
        await client.connect();
        isConnected = true;
        const cameras = client.db('galaxy').collection('cameras');
        return await cameras.insertOne({
            name: camera.name,
            url: camera.url,
            location: camera.location,
            threshold: camera.threshold
        });
    } catch (error) {
        console.error('Error connecting to the database', error);
    } finally {
        if (isConnected) {
            await client.close();
        }
    }
}
export async function updateCamera(camera: Camera){
    let isConnected = false;
    try {
        await client.connect();
        isConnected = true;
        const cameras = client.db('galaxy').collection('cameras');
        return await cameras.updateOne({_id: new ObjectId(camera._id)}, {
            $set: {
                name: camera.name,
                url: camera.url,
                location: camera.location,
                threshold: camera.threshold
            }
        });
    } catch (error) {
        console.error('Error connecting to the database', error);
    } finally {
        if (isConnected) {
            await client.close();
        }
    }
}

export async function deleteCamera(id: string){
    let isConnected = false;
    try {
        await client.connect();
        isConnected = true;
        const cameras = client.db('galaxy').collection('cameras');
        return await cameras.deleteOne({_id: new ObjectId(id)});
    } catch (error) {
        console.error('Error connecting to the database', error);
    } finally {
        if (isConnected) {
            await client.close();
        }
    }
}