const express = require('express');
const cors = require('cors');
const pino = require('pino');
const pinoHttp = require('pino-http');
const contactsRoutes = require('./routes/contactsRoutes');
const errorHandler = require('./middlewares/errorHandler');
const notFoundHandler = require('./middlewares/notFoundHandler');

const logger = pino({ level: process.env.LOG_LEVEL || 'info' });

/**
 * setupServer: express uygulamasını kurar, middleware ve rotaları register eder,
 * ve PORT'a bağlanarak sunucuyu başlatır.
 */
function setupServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(pinoHttp({ logger }));

  // Routes
  // tüm contacts endpointleri /contacts altında olacak
  app.use('/contacts', contactsRoutes);

  // Bilinmeyen rota -> 404 JSON
  app.use((req, res) => {
    res.status(404).json({ message: 'Not found' });
  });

  app.use(notFoundHandler);
  app.use(errorHandler);

  // Start server
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
    // console.log yerine pino logger ile yazıyoruz (ama console kabul ediliyorsa).
    // eslint-disable-next-line no-console
    console.log(`Server is running on port ${PORT}`);
  });

  return app;
}

module.exports = setupServer;