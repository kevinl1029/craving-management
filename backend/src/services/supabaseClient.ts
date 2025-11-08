import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { appConfig } from '../config/env.js';

let client: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (client) return client;
  if (!appConfig.supabaseUrl || !appConfig.supabaseServiceRoleKey) {
    return null;
  }

  client = createClient(appConfig.supabaseUrl, appConfig.supabaseServiceRoleKey, {
    auth: { persistSession: false }
  });

  return client;
}
