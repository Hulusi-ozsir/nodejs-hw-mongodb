import mongoose from 'mongoose';

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Mongo connection successfully established!'))
  .catch(err => console.error('Failed to start application:', err));