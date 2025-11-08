import { Router } from 'express';
import { loadAdaptiveScript } from '../scripts/loadScript.js';
import { getSystemPrompt } from '../services/llmService.js';

export const healthRouter = Router();

healthRouter.get('/', (_req, res) => {
  res.json({ status: 'ok' });
});

healthRouter.get('/script', async (_req, res, next) => {
  try {
    const script = await loadAdaptiveScript();
    res.json({
      version: script.version,
      stages: Object.keys(script.stages),
      systemPromptPreview: getSystemPrompt().slice(0, 160)
    });
  } catch (error) {
    next(error);
  }
});
