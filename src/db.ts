import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URL) {
    console.log('MONGODB_URL is not defined');
    process.env.MONGODB_URL = 'mongodb://localhost:27017/galaxy';
}

const uri = process.env.MONGODB_URL;
const options = { appName: 'universe' };

let client: MongoClient;

if (process.env.NODE_ENV === 'development') {
    let globalWithMongo = global as typeof globalThis & {
        _mongoClient?: MongoClient;
    };

    if (!globalWithMongo._mongoClient) {
        globalWithMongo._mongoClient = new MongoClient(uri, options);
    }
    client = globalWithMongo._mongoClient;
} else {
    client = new MongoClient(uri, options);
}

export default client;
