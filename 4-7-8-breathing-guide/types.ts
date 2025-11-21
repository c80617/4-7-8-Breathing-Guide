export enum BreathingPhase {
  IDLE = 'IDLE',
  INHALE = 'INHALE',
  HOLD = 'HOLD',
  EXHALE = 'EXHALE',
}

export interface PhaseConfig {
  label: string;
  duration: number; // in milliseconds
  instruction: string;
  color: string;
}