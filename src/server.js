import express from 'express';
import authRouter from './routes/auth.js';
import contactsRouter from './routes/contactsRoutes.js';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routers
app.use('/auth', authRouter);
app.use('/contacts', contactsRouter);

// Hata middleware
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({ status, message });
});

export default app;