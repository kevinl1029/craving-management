import type { StageKey } from '../lib/stages';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000/api';

interface CreateSessionResponse {
  sessionId: string;
  stage: StageKey;
  persisted: boolean;
}

export interface UpdateSessionPayload {
  stage?: StageKey;
  intensityBefore?: number;
  intensityAfter?: number;
  endSession?: boolean;
}

interface UpdateSessionResponse {
  persisted: boolean;
  stageUpdated: boolean;
  intensityUpdated: boolean;
}

interface ConversionResponse {
  persisted: boolean;
}

async function safeFetch<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T | null> {
  try {
    const response = await fetch(input, init);
    if (!response.ok) {
      console.warn('Session API request failed', response.status, response.statusText);
      return null;
    }
    return (await response.json()) as T;
  } catch (error) {
    console.warn('Session API request error', error);
    return null;
  }
}

export async function createSession(stage: StageKey): Promise<CreateSessionResponse> {
  const fallback: CreateSessionResponse = {
    sessionId: crypto.randomUUID(),
    stage,
    persisted: false
  };

  const result = await safeFetch<CreateSessionResponse>(`${API_BASE_URL}/session`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ stage })
  });

  return result ?? fallback;
}

export async function updateSession(
  sessionId: string,
  payload: UpdateSessionPayload
): Promise<UpdateSessionResponse | null> {
  return safeFetch<UpdateSessionResponse>(`${API_BASE_URL}/session/${sessionId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
}

export async function recordConversion(
  sessionId: string,
  payload: { plan?: string; checkoutStarted?: boolean }
): Promise<ConversionResponse | null> {
  return safeFetch<ConversionResponse>(`${API_BASE_URL}/session/${sessionId}/conversion`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
}
