import mongoose from 'mongoose';

export const initMongoConnection = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error('Missing MongoDB environment variable MONGODB_URI');
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Mongo connection successfully established!');
};