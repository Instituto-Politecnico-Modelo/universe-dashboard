'use server';
import client from '@/db';
import { ObjectId } from 'mongodb';

function objectIdToString(id: ObjectId): string {
    return id.toHexString();
}

export async function getAllProyectos() {
    let isConnected = false;
    try {
        let lista: Proyecto[] = [];
        await client.connect();
        isConnected = true;
        const proyects = client.db('galaxy').collection('proyects');
        let result = await proyects.find().toArray();
        for (let i = 0; i < result.length; i++) {
            lista[i]._id = objectIdToString(result[i]._id);
            lista[i].name = result[i].name;
            lista[i].description = result[i].description;
            lista[i].authors = result[i].authors;
            lista[i].imageUrl = result[i].imageUrl;
            lista[i].location = result[i].location;
            console.log('aaaaaaaaaaa');
        }
        console.log(lista);
        return lista;
    } catch (error) {
        console.error('Error connecting to the database', error);
    } finally {
        if (isConnected) {
            await client.close();
        }
    }
}
