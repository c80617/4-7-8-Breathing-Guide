import React from 'react';
import { BreathingPhase } from '../types';
import { PHASE_CONFIGS } from '../constants';

interface BreathingOrbProps {
  phase: BreathingPhase;
}

const BreathingOrb: React.FC<BreathingOrbProps> = ({ phase }) => {
  // Determine styles based on phase
  const isIdle = phase === BreathingPhase.IDLE;
  const isInhale = phase === BreathingPhase.INHALE;
  const isHold = phase === BreathingPhase.HOLD;
  const isExhale = phase === BreathingPhase.EXHALE;

  // Base styling variables
  let scaleClass = 'scale-100';
  let durationStyle = { transitionDuration: '300ms' };
  let shadowColor = 'rgba(165, 243, 252, 0.3)'; // Default Cyan glow

  if (isInhale) {
    scaleClass = 'scale-150'; // Expand
    durationStyle = { transitionDuration: `${PHASE_CONFIGS[BreathingPhase.INHALE].duration}ms` };
    shadowColor = 'rgba(103, 232, 249, 0.6)';
  } else if (isHold) {
    scaleClass = 'scale-150'; // Stay expanded
    durationStyle = { transitionDuration: '0ms' }; // No transition needed as we are already there, but we want to prevent shrinking
    shadowColor = 'rgba(165, 180, 252, 0.7)'; // Indigo glow
  } else if (isExhale) {
    scaleClass = 'scale-100'; // Contract
    durationStyle = { transitionDuration: `${PHASE_CONFIGS[BreathingPhase.EXHALE].duration}ms` };
    shadowColor = 'rgba(110, 231, 183, 0.4)'; // Emerald glow
  }

  return (
    <div className="relative flex items-center justify-center">
      {/* Outer Ripple/Glow Layers for Hold Phase */}
      {isHold && (
        <>
          <div className="absolute w-64 h-64 rounded-full border border-white/20 animate-ripple pointer-events-none" />
          <div className="absolute w-64 h-64 rounded-full border border-white/10 animate-ripple pointer-events-none" style={{ animationDelay: '0.5s' }} />
        </>
      )}

      {/* Main Orb Container for Scaling */}
      <div
        className={`
          relative w-48 h-48 md:w-64 md:h-64 rounded-full 
          flex items-center justify-center
          transition-transform ease-in-out
          ${scaleClass}
        `}
        style={durationStyle}
      >
        {/* The Glowing Sphere Surface */}
        <div
          className={`
            absolute inset-0 rounded-full 
            bg-gradient-to-br from-white/90 to-white/10
            backdrop-blur-sm
            transition-colors duration-1000
            ${isHold ? 'animate-micro-pulse' : ''}
          `}
          style={{
            boxShadow: `0 0 60px ${shadowColor}, inset 0 0 20px rgba(255,255,255,0.5)`,
            background: isHold 
              ? 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.95), rgba(199, 210, 254, 0.8))' 
              : 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.95), rgba(165, 243, 252, 0.6))'
          }}
        ></div>

        {/* Inner Text */}
        <div className="relative z-10 text-center select-none transform transition-all duration-500">
          <span className={`
            block text-2xl md:text-3xl font-light tracking-widest text-slate-800
            ${isIdle ? 'opacity-80' : 'opacity-90'}
          `}>
            {PHASE_CONFIGS[phase].label}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BreathingOrb;