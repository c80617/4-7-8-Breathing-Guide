
import React, { useState, useEffect, useCallback, useRef } from 'react';
import BreathingOrb from './components/BreathingOrb';
import ControlPanel from './components/ControlPanel';
import { BreathingPhase } from './types';
import { PHASE_CONFIGS } from './constants';
import { useBreathingSound } from './useBreathingSound';

const App: React.FC = () => {
  const [phase, setPhase] = useState<BreathingPhase>(BreathingPhase.IDLE);
  const [isActive, setIsActive] = useState(false);
  const [cycleCount, setCycleCount] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  
  const { playPhaseSound, stopSound } = useBreathingSound();

  // Use refs for timers to clear them reliably
  const timerRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);

  // We use a ref to store the cycle functions to handle recursion without complex dependency chains
  const cycleRef = useRef<{
    inhale: () => void;
    hold: () => void;
    exhale: () => void;
  }>({ inhale: () => {}, hold: () => {}, exhale: () => {} });

  // Define cycle steps
  useEffect(() => {
    cycleRef.current.inhale = () => {
      if (!isActive) return;
      setPhase(BreathingPhase.INHALE);
      playPhaseSound(BreathingPhase.INHALE);
      
      timerRef.current = window.setTimeout(() => {
        cycleRef.current.hold();
      }, PHASE_CONFIGS[BreathingPhase.INHALE].duration);
    };

    cycleRef.current.hold = () => {
      if (!isActive) return;
      setPhase(BreathingPhase.HOLD);
      playPhaseSound(BreathingPhase.HOLD);
      
      timerRef.current = window.setTimeout(() => {
        cycleRef.current.exhale();
      }, PHASE_CONFIGS[BreathingPhase.HOLD].duration);
    };

    cycleRef.current.exhale = () => {
      if (!isActive) return;
      setPhase(BreathingPhase.EXHALE);
      playPhaseSound(BreathingPhase.EXHALE);
      
      timerRef.current = window.setTimeout(() => {
        setCycleCount(c => c + 1);
        cycleRef.current.inhale();
      }, PHASE_CONFIGS[BreathingPhase.EXHALE].duration);
    };
  }, [isActive, playPhaseSound]);


  const startCycle = useCallback(() => {
    cycleRef.current.inhale();
  }, []);

  // Handle Start/Pause Logic
  useEffect(() => {
    if (isActive && phase === BreathingPhase.IDLE) {
      // Starting fresh
      setCycleCount(0);
      setElapsedTime(0);
      startCycle();

      // Start elapsed timer
      intervalRef.current = window.setInterval(() => {
        setElapsedTime(t => t + 1);
      }, 1000);
    } else if (!isActive) {
      // Stopped/Paused
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      stopSound();
    }
    
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, startCycle, phase, stopSound]);

  const handleToggle = () => {
    if (isActive) {
      setIsActive(false);
      setPhase(BreathingPhase.IDLE);
    } else {
      setIsActive(true);
    }
  };

  const handleReset = () => {
    setIsActive(false);
    setPhase(BreathingPhase.IDLE);
    setCycleCount(0);
    setElapsedTime(0);
    stopSound();
    if (timerRef.current) clearTimeout(timerRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  // Dynamic instruction text based on phase
  const getInstructionText = () => {
    if (!isActive) return "4-7-8 呼吸法能幫助您放鬆神經系統";
    return PHASE_CONFIGS[phase].instruction;
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen w-full overflow-hidden bg-gradient-to-b from-[#0f172a] via-[#172554] to-[#0f172a] flex flex-col items-center justify-center p-6 relative">
      
      {/* Ambient Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-900/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-900/20 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Stats Display (Top Right Corner) */}
      <div className="absolute top-6 right-6 md:top-8 md:right-10 z-30 flex flex-col items-end space-y-2 pointer-events-none select-none">
        <div className="bg-slate-800/40 backdrop-blur-md rounded-xl px-4 py-2 border border-slate-700/30 shadow-lg flex flex-col items-end min-w-[100px]">
           <div className="text-[10px] text-cyan-200/50 tracking-widest font-bold mb-0.5">TIME</div>
           <div className="text-lg font-mono text-cyan-100 tabular-nums leading-none">{formatTime(elapsedTime)}</div>
        </div>
        <div className="bg-slate-800/40 backdrop-blur-md rounded-xl px-4 py-2 border border-slate-700/30 shadow-lg flex flex-col items-end min-w-[100px]">
           <div className="text-[10px] text-indigo-200/50 tracking-widest font-bold mb-0.5">CYCLES</div>
           <div className="text-lg font-mono text-indigo-100 tabular-nums leading-none">{cycleCount}</div>
        </div>
      </div>

      <header className="absolute top-8 left-0 w-full text-center z-10">
        <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 to-blue-200 tracking-wider opacity-90">
          4-7-8 呼吸引導
        </h1>
        <p className="text-slate-400 text-sm mt-2 tracking-wide uppercase">Deep Relaxation Tool</p>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center w-full max-w-md mx-auto z-10">
        
        {/* Status / Instruction Text */}
        <div className="h-20 mb-8 flex items-center justify-center text-center">
           <p className={`
             text-xl md:text-2xl text-cyan-50 font-light leading-relaxed transition-all duration-700 ease-in-out
             ${isActive ? 'opacity-100 transform translate-y-0' : 'opacity-60 transform translate-y-2'}
           `}>
             {getInstructionText()}
           </p>
        </div>

        {/* The Orb */}
        <div className="py-10">
          <BreathingOrb phase={phase} />
        </div>

        {/* Controls */}
        <ControlPanel 
          isActive={isActive} 
          onToggle={handleToggle} 
          onReset={handleReset}
          phase={phase}
        />
      </main>

      <footer className="absolute bottom-6 text-slate-600 text-xs tracking-widest">
        RELAX & BREATHE
      </footer>
    </div>
  );
};

export default App;
