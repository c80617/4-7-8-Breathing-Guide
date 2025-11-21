import React from 'react';
import { BreathingPhase } from '../types';

interface ControlPanelProps {
  isActive: boolean;
  onToggle: () => void;
  onReset: () => void;
  phase: BreathingPhase;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ isActive, onToggle, onReset, phase }) => {
  return (
    <div className="flex flex-col items-center space-y-6 z-20 mt-12">
      <div className="h-8 text-cyan-100 font-light text-lg tracking-wider transition-opacity duration-500">
        {isActive ? (
           <span className="animate-pulse">{/* Running indicator if needed, mostly handled by Orb */}</span>
        ) : (
          "按下開始以進入 4-7-8 循環"
        )}
      </div>
      
      <div className="flex space-x-6">
        <button
          onClick={onToggle}
          className={`
            px-8 py-3 rounded-full text-lg font-medium tracking-wide transition-all duration-300
            focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900
            ${isActive 
              ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-600' 
              : 'bg-cyan-500 text-slate-900 hover:bg-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.5)] hover:shadow-[0_0_30px_rgba(6,182,212,0.7)]'
            }
          `}
        >
          {isActive ? '暫停' : '開始'}
        </button>

        {!isActive && phase !== BreathingPhase.IDLE && (
          <button
            onClick={onReset}
            className="px-8 py-3 rounded-full text-lg font-medium tracking-wide text-slate-400 hover:text-white hover:bg-white/10 transition-all"
          >
            重置
          </button>
        )}
      </div>
    </div>
  );
};

export default ControlPanel;