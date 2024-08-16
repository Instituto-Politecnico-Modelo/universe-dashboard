import { genSaltSync, hashSync } from 'bcrypt-ts';
import User from '@/models/User';
import mongoose from "mongoose";

const connect = async () => {
  if (mongoose.connections[0].readyState) return;

  try {
    await mongoose.connect("mongodb://localhost:27017");
    console.log("Mongo Connection successfully established.");
  } catch (error) {
    throw new Error("Error connecting to Mongoose");
  }
};

export async function getUser(email: string) {
  await connect();
  return User.find({ email});
}

export async function createUser(email: string, password: string) {
  await connect();
  const salt = genSaltSync(10);
  const hash = hashSync(password, salt);
  return User.create({ email, password: hash });
}

export default connect;
