
import { useRef, useCallback } from 'react';
import { BreathingPhase } from './types';
import { PHASE_CONFIGS } from './constants';

export const useBreathingSound = () => {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  const initAudio = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        audioCtxRef.current = new AudioContextClass();
      }
    }
    if (audioCtxRef.current?.state === 'suspended') {
      audioCtxRef.current.resume().catch(() => {});
    }
  }, []);

  const stopSound = useCallback(() => {
    const now = audioCtxRef.current?.currentTime || 0;
    if (oscRef.current) {
      try {
        // Quick fade out to avoid clicking
        const currentGain = gainRef.current?.gain.value || 0;
        gainRef.current?.gain.cancelScheduledValues(now);
        gainRef.current?.gain.setValueAtTime(currentGain, now);
        gainRef.current?.gain.linearRampToValueAtTime(0, now + 0.1);
        oscRef.current.stop(now + 0.1);
      } catch (e) {
        // ignore errors if already stopped
      }
      oscRef.current = null;
    }
  }, []);

  const playPhaseSound = useCallback((phase: BreathingPhase) => {
    initAudio();
    if (!audioCtxRef.current) return;

    const ctx = audioCtxRef.current;
    const now = ctx.currentTime;

    // Stop any existing sound
    if (oscRef.current) {
      try { oscRef.current.disconnect(); } catch (e) {}
      oscRef.current = null;
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);

    oscRef.current = osc;
    gainRef.current = gain;

    const duration = PHASE_CONFIGS[phase].duration / 1000;
    const MAX_VOL = 0.1; // Keep volume subtle/soothing

    osc.type = 'sine';

    if (phase === BreathingPhase.INHALE) {
      // Rising pitch (e.g. 180Hz -> 260Hz)
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(260, now + duration);

      // Smooth envelope
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(MAX_VOL, now + 1);
      gain.gain.setValueAtTime(MAX_VOL, now + duration - 1);
      gain.gain.linearRampToValueAtTime(0, now + duration);
      
      osc.start(now);
      osc.stop(now + duration + 0.1);

    } else if (phase === BreathingPhase.HOLD) {
      // Low steady drone (e.g. 100Hz)
      osc.frequency.setValueAtTime(100, now);

      // Very low volume
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.03, now + 0.5);
      gain.gain.setValueAtTime(0.03, now + duration - 0.5);
      gain.gain.linearRampToValueAtTime(0, now + duration);
      
      osc.start(now);
      osc.stop(now + duration + 0.1);

    } else if (phase === BreathingPhase.EXHALE) {
      // Falling pitch (e.g. 260Hz -> 130Hz)
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(130, now + duration);

      // Smooth envelope
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(MAX_VOL, now + 1);
      gain.gain.setValueAtTime(MAX_VOL, now + duration - 1);
      gain.gain.linearRampToValueAtTime(0, now + duration);
      
      osc.start(now);
      osc.stop(now + duration + 0.1);
    } else {
      // Idle
      gain.disconnect();
    }
  }, [initAudio]);

  return { playPhaseSound, stopSound, initAudio };
};
