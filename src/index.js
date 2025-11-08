import 'dotenv/config'; // dotenv'i direkt import et
import initMongoConnection from './db/initMongoConnection.js';
import setupServer from './server.js';

(async () => {
  try {
    await initMongoConnection();
    setupServer();
  } catch (err) {
    console.error('Failed to start application:', err);
    process.exit(1);
  }
})();