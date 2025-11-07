/* Entry point: önce DB'yi başlat, sonra sunucuyu ayağa kaldır */
require('dotenv').config({ path: __dirname + '/../.env' });
const initMongoConnection = require('./db/initMongoConnection');
const setupServer = require('./server');

(async () => {
  try {
    await initMongoConnection();
    setupServer();
  } catch (err) {
    console.error('Failed to start application:', err);
    process.exit(1);
  }
})();