import type { SupabaseClient } from '@supabase/supabase-js';
import { getSupabaseClient } from '../services/supabaseClient.js';
import type { StageKey } from '../types/stage.js';

export interface SessionRecord {
  id: string;
  stage: StageKey;
  started_at: string;
  ended_at: string | null;
}

function ensureClient(): SupabaseClient | null {
  const client = getSupabaseClient();
  if (!client) {
    console.warn('Supabase client not configured');
  }
  return client;
}

export async function createSession(stage: StageKey): Promise<SessionRecord | null> {
  const client = ensureClient();
  if (!client) return null;

  const startedAt = new Date().toISOString();
  const { data, error } = await client
    .from('sessions')
    .insert({ stage, started_at: startedAt })
    .select('*')
    .single();

  if (error) {
    console.error('Failed to create session', error);
    return null;
  }

  return data as SessionRecord;
}

export async function updateSessionStage(
  sessionId: string,
  stage: StageKey,
  ended = false
): Promise<boolean> {
  const client = ensureClient();
  if (!client) return false;

  const payload: Record<string, unknown> = { stage };
  if (ended) {
    payload.ended_at = new Date().toISOString();
  }

  const { error } = await client
    .from('sessions')
    .update(payload)
    .eq('id', sessionId);

  if (error) {
    console.error('Failed to update session', error);
    return false;
  }

  return true;
}

export async function upsertCravingEvent(
  sessionId: string,
  { intensity_before, intensity_after }: { intensity_before?: number; intensity_after?: number }
): Promise<boolean> {
  const client = ensureClient();
  if (!client) return false;

  const payload: Record<string, unknown> = {
    session_id: sessionId
  };

  if (intensity_before !== undefined) {
    payload.intensity_before = intensity_before;
  }

  if (intensity_after !== undefined) {
    payload.intensity_after = intensity_after;
  }

  const { error } = await client
    .from('craving_events')
    .upsert(payload, { onConflict: 'session_id' });

  if (error) {
    console.error('Failed to upsert craving event', error);
    return false;
  }

  return true;
}
