'use server';
import client from "@/db";
import { ObjectId } from "mongodb";
import { genSaltSync, hashSync } from 'bcrypt-ts';

export async function getUserAction(email: string) {
    let isConnected = false;
    try {
        await client.connect();
        isConnected = true;
        const users = client.db('galaxy').collection('users');
        return await users.findOne({ email });
    } catch (error) {
        console.error('Error connecting to the database', error);
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
        const bcrypt = require('bcrypt');
        const salt = genSaltSync(10);
        const users = client.db('galaxy').collection('users');
        return await users.insertOne({
            email: email,
            password: bcrypt.hashSync(password, salt)
        });
    } catch (error) {
        console.error('Error connecting to the database', error);
    } finally {
        if (isConnected) {
            await client.close();
        }
    }
}