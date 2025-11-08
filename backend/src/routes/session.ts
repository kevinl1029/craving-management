import { Router } from 'express';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import type { StageKey } from '../types/stage.js';
import { createSession, updateSessionStage, upsertCravingEvent } from '../repositories/sessionRepository.js';
import { recordConversion } from '../repositories/conversionRepository.js';

const stageEnum = z.enum(['entry', 'relief', 'reflection', 'teaser', 'conversion']);

const createSchema = z.object({
  stage: stageEnum.default('entry')
});

const updateSchema = z.object({
  stage: stageEnum.optional(),
  intensityBefore: z.number().min(0).max(10).optional(),
  intensityAfter: z.number().min(0).max(10).optional(),
  endSession: z.boolean().optional()
});

const conversionSchema = z.object({
  plan: z.string().optional(),
  checkoutStarted: z.boolean().optional()
});

export const sessionRouter = Router();

sessionRouter.post('/', async (req, res, next) => {
  try {
    const { stage } = createSchema.parse(req.body ?? {});
    const record = await createSession(stage as StageKey);

    if (!record) {
      return res.json({
        sessionId: randomUUID(),
        stage,
        persisted: false
      });
    }

    return res.json({ sessionId: record.id, stage: record.stage, persisted: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid session payload', issues: error.flatten() });
    }

    return next(error);
  }
});

sessionRouter.patch('/:id', async (req, res, next) => {
  try {
    const sessionId = req.params.id;
    const { stage, intensityBefore, intensityAfter, endSession } = updateSchema.parse(req.body ?? {});

    let stageUpdated = false;
    let intensityUpdated = false;

    if (stage) {
      stageUpdated = await updateSessionStage(sessionId, stage as StageKey, endSession ?? false);
    }

    if (intensityBefore !== undefined || intensityAfter !== undefined) {
      intensityUpdated = await upsertCravingEvent(sessionId, {
        intensity_before: intensityBefore,
        intensity_after: intensityAfter
      });
    }

    const persisted = stageUpdated || intensityUpdated;

    return res.json({ persisted, stageUpdated, intensityUpdated });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid session update payload', issues: error.flatten() });
    }

    return next(error);
  }
});

sessionRouter.post('/:id/conversion', async (req, res, next) => {
  try {
    const { plan, checkoutStarted } = conversionSchema.parse(req.body ?? {});
    const sessionId = req.params.id;

    const payload = {
      sessionId,
      plan,
      ctaClickedAt: new Date().toISOString(),
      checkoutStartedAt: checkoutStarted ? new Date().toISOString() : undefined
    };

    const persisted = await recordConversion(payload);

    return res.json({ persisted });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid conversion payload', issues: error.flatten() });
    }

    return next(error);
  }
});
