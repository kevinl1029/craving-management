import { Router } from 'express';
import { z } from 'zod';
import { generateCoachResponse } from '../services/llmService.js';
import type { StageKey } from '../types/stage.js';

const conversationSchema = z.object({
  sessionId: z.string().min(1),
  stage: z.enum(['entry', 'relief', 'reflection', 'teaser', 'conversion']),
  userInput: z.string().min(1),
  metadata: z
    .object({
      cravingIntensity: z.number().min(0).max(10).optional(),
      mode: z.enum(['voice', 'text']).optional()
    })
    .optional()
});

export const conversationRouter = Router();

conversationRouter.post('/', async (req, res, next) => {
  try {
    const payload = conversationSchema.parse(req.body);
    const response = await generateCoachResponse(payload);
    return res.json(response);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid request', issues: error.flatten() });
    }

    return next(error);
  }
});
