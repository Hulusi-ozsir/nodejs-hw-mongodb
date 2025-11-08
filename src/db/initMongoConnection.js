import mongoose from 'mongoose';

export default async function initMongoConnection() {
  const { MONGODB_URI } = process.env;

  if (!MONGODB_URI) {
    throw new Error('Missing MongoDB URI in environment variables');
  }

  await mongoose.connect(MONGODB_URI);
  console.log('Mongo connection successfully established!');
}