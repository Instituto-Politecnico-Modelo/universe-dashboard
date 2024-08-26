'use server';
import client from "@/db";
import { genSaltSync, hashSync } from 'bcrypt-ts';


const adminUser = {
    email: process.env.A_EMAIL,
    password: process.env.A_PASS,
    role: "authorized"
};
if(adminUser.email && adminUser.password && await getUserAction(adminUser.email) == null){
    await createUserAction(adminUser.email, adminUser.password);
    console.log("Admin user created");
    updateUserAction(adminUser.email, "authorized");
}else{
    console.error("Admin user not created");
}


export async function getAllUsersAction() {
    let isConnected = false;
    try {
        await client.connect();
        isConnected = true;
        const users = await client.db('galaxy').collection('users');
        let result = await users.find().toArray();
        let aux: any[] = [];
        for (let user of result){
            aux = [...aux, {_id: String(user._id), email: user.email, role: user.role}];
        }
        return await aux;
    } catch (error) {
        console.error('Error connecting to the database', error);
    } finally {
        if (isConnected) {
            await client.close();
        }
    }
}

export async function updateUserAction(email: string, role: string) {
    let isConnected = false;
    try {
        await client.connect();
        isConnected = true;
        const users = await client.db('galaxy').collection('users');
        return await users.updateOne({ email }, { $set: { role } });
    } catch (error) {
        console.error('Error connecting to the database', error);
    } finally {
        if (isConnected) {
            await client.close();
        }
    }
}

export async function getUserAction(email: string) {
    let isConnected = false;
    try {
        await client.connect();
        isConnected = true;
        const users = await client.db('galaxy').collection('users');
        return await users.findOne({ email });
    } catch (error) {
        console.error('Error connecting to the database', error);
        return null;
    } finally {
        if (isConnected) {
            await client.close();
        }
    }
}

export async function createUserAction(email: string, password: string) {
    let isConnected = false;
    try {
        await client.connect();
        isConnected = true;
        console.log("Creating user"+email);
        const bcrypt = require('bcrypt');
        const salt = bcrypt.genSaltSync(10);
        const users = client.db('galaxy').collection('users');
        return await users.insertOne({
            email: email,
            password: bcrypt.hashSync(password, salt),
            role:"unauthorized"
        });
    } catch (error) {
        console.error('Error connecting to the database', error);
    } finally {
        if (isConnected) {
            await client.close();
        }
    }
}