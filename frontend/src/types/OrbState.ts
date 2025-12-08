export interface OrbState {
    mode: 'idle' | 'breathe' | 'observe' | 'release';
    phase: 'inhale' | 'exhale';
    intensity: number;
    progress: number;
    opacity: number;
}
