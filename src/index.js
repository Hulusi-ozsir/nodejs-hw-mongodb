/* Entry point: önce DB'yi başlat, sonra sunucuyu ayağa kaldır */
require('dotenv').config();
const initMongoConnection = require('./db/initMongoConnection');
const setupServer = require('./server');

(async () => {
  try {
    // Mongo bağlantısını kur
    await initMongoConnection();

    // Sunucuyu başlat
    setupServer();
  } catch (err) {
    // Hata varsa kapat ve logla
    // eslint-disable-next-line no-console
    console.error('Failed to start application:', err);
    process.exit(1);
  }
})();