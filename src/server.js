import express from 'express';
import cors from 'cors';
import pino from 'pino';
import pinoHttp from 'pino-http';

import contactsRoutes from './routes/contactsRoutes.js';
import errorHandler from './middlewares/errorHandler.js';
import notFoundHandler from './middlewares/notFoundHandler.js';

const logger = pino({ level: process.env.LOG_LEVEL || 'info' });

function setupServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(pinoHttp({ logger }));

  // Routes
  app.use('/contacts', contactsRoutes);

  // Bilinmeyen rota -> 404 JSON
  app.use(notFoundHandler);
  app.use(errorHandler);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
  });

  return app;
}

export default setupServer;