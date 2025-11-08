import { getSupabaseClient } from '../services/supabaseClient.js';

export interface ConversionPayload {
  sessionId: string;
  ctaClickedAt?: string;
  checkoutStartedAt?: string;
  plan?: string;
}

export async function recordConversion(payload: ConversionPayload): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  const { sessionId, ...rest } = payload;
  const { error } = await client.from('conversions').insert({
    session_id: sessionId,
    ...rest
  });

  if (error) {
    console.error('Failed to record conversion', error);
    return false;
  }

  return true;
}
