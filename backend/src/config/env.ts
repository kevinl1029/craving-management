import 'dotenv/config';
import { z } from 'zod';

const schema = z.object({
  PORT: z.string().default('4000'),
  OPENAI_API_KEY: z.string().optional(),
  LLM_PROVIDER: z.string().optional(),
  SUPABASE_URL: z.string().url().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional()
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment configuration', parsed.error.flatten());
  throw new Error('Environment validation failed');
}

const env = parsed.data;

export const appConfig = {
  port: Number(env.PORT) || 4000,
  openAiApiKey: env.OPENAI_API_KEY,
  llmProvider: env.LLM_PROVIDER ?? 'openai',
  supabaseUrl: env.SUPABASE_URL,
  supabaseServiceRoleKey: env.SUPABASE_SERVICE_ROLE_KEY,
  stripeSecretKey: env.STRIPE_SECRET_KEY
};
