import { readFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import type { AdaptiveScriptConfig } from '../types/stage.js';

const CONFIG_PATH = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../config/stageScript.json'
);

let cache: AdaptiveScriptConfig | null = null;

export async function loadAdaptiveScript(): Promise<AdaptiveScriptConfig> {
  if (cache) {
    return cache;
  }

  const raw = await readFile(CONFIG_PATH, 'utf-8');
  const parsed = JSON.parse(raw) as AdaptiveScriptConfig;
  cache = parsed;
  return parsed;
}

export function clearAdaptiveScriptCache(): void {
  cache = null;
}
