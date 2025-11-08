type SpeechRecognition = typeof window extends { SpeechRecognition: infer T } ? T : any;

export type VoiceMode = 'continuous' | 'push-to-talk';

export interface VoiceAdapterOptions {
  mode?: VoiceMode;
}

export interface TranscriptHandler {
  (text: string): void;
}

class VoiceAdapterImpl {
  private recognition: SpeechRecognition | null = null;
  private handler: TranscriptHandler | null = null;

  isSupported(): boolean {
    return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
  }

  async startContinuous({ mode = 'continuous' }: VoiceAdapterOptions = {}) {
    console.warn('Voice adapter startContinuous stub', { mode });
  }

  async stop() {
    console.warn('Voice adapter stop stub');
  }

  onTranscript(handler: TranscriptHandler) {
    this.handler = handler;
  }
}

export const VoiceAdapter = new VoiceAdapterImpl();
