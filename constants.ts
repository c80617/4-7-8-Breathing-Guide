import { BreathingPhase, PhaseConfig } from './types';

export const PHASE_CONFIGS: Record<BreathingPhase, PhaseConfig> = {
  [BreathingPhase.IDLE]: {
    label: '準備開始',
    duration: 0,
    instruction: '點擊開始按鈕',
    color: 'bg-blue-400',
  },
  [BreathingPhase.INHALE]: {
    label: '吸氣',
    duration: 4000,
    instruction: '用鼻子緩慢吸氣...',
    color: 'bg-cyan-300',
  },
  [BreathingPhase.HOLD]: {
    label: '憋氣',
    duration: 7000,
    instruction: '保持氣息...',
    color: 'bg-indigo-300',
  },
  [BreathingPhase.EXHALE]: {
    label: '吐氣',
    duration: 8000,
    instruction: '用嘴巴緩慢吐氣...',
    color: 'bg-emerald-300',
  },
};

export const TOTAL_CYCLE_DURATION = 
  PHASE_CONFIGS[BreathingPhase.INHALE].duration +
  PHASE_CONFIGS[BreathingPhase.HOLD].duration +
  PHASE_CONFIGS[BreathingPhase.EXHALE].duration;
