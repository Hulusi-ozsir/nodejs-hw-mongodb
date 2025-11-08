import 'dotenv/config';
import setupServer from './server.js';
import initMongoConnection from './db/initMongoConnection.js';

(async () => {
  try {
    await initMongoConnection();
    setupServer();
  } catch (err) {
    console.error('Failed to start application:', err);
    process.exit(1);
  }
})();