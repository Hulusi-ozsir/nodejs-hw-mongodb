import dotenv from 'dotenv';
dotenv.config();

import app from './server.js';
import './db/connection.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});