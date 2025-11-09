import express from 'express';
import cors from 'cors';
import pino from 'pino';
import pinoHttp from 'pino-http';
import cookieParser from 'cookie-parser';

import contactsRouter from './routers/contacts.js';
import authRouter from './routers/auth.js';
import notFoundHandler from './middlewares/notFoundHandler.js';
import errorHandler from './middlewares/errorHandler.js';

const logger = pino({ level: process.env.LOG_LEVEL || 'info' });

export default function setupServer() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(cookieParser()); // cookie parsing
  app.use(pinoHttp({ logger }));

  // auth routes (no auth required)
  app.use('/auth', authRouter);

  // contacts routes (authenticate inside router)
  app.use('/contacts', contactsRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
    // eslint-disable-next-line no-console
    console.log(`Server is running on port ${PORT}`);
  });

  return app;
}