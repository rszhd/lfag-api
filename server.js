import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import generateContent from './generateContent.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

const requestLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  handler: function (req, res, next) {
    const err = new Error('Too many requests');
    err.status = 429;
    next(err);
  }
});

app.use('/api/content/generate', requestLimiter, generateContent);

app.get('/', (req, res) => {
  res.send('PROMPTMGR-LFAG API service API is running...');
});

// eslint-disable-next-line no-unused-vars
app.use(async (err, req, res, next) => {
  const logError = process.env.LOG_ERROR === 'true';

  if (logError) {
    console.error(err);
  }
  console.error(err);

  res.locals.message = err.message;
  res.locals.error = logError ? err : {};

  res.status(err.status || 500);
  res.json({
    success: false,
    message: logError ? err.message : 'An unexpected error occurred',
    error: logError ? {
      status: err.status,
      stack: err.stack,
      details: err
    } : undefined,
    requestId: req.id
  });
});

app.listen(
  process.env.PORT,
  '0.0.0.0',
  console.log(`PROMPTMGR-LFAG API service running in [${process.env.NODE_ENV}] on port [${process.env.PORT}]`),
);

