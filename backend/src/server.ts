import express from 'express';
import cors from 'cors';
import type { Request, Response, NextFunction } from 'express';
import { appConfig } from './config/env.js';
import { conversationRouter } from './routes/conversation.js';
import { healthRouter } from './routes/health.js';
import { sessionRouter } from './routes/session.js';

export const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/health', healthRouter);
app.use('/api/conversation', conversationRouter);
app.use('/api/session', sessionRouter);

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

if (process.env.NODE_ENV !== 'test') {
  const { port } = appConfig;
  app.listen(port, () => {
    console.log(`Ascend Craving Companion backend listening on port ${port}`);
  });
}
