import React from 'react';
import { Play, RotateCcw, Home } from 'lucide-react';
import { sound } from '../audio/soundManager';

export default function PauseModal({ onResume, onRestart, onHome }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pastel-deepPurple/40 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xs bg-white/95 backdrop-blur-md rounded-3xl p-6 shadow-cute-lg border-2 border-white flex flex-col items-center gap-4 text-center">
        
        {/* Pause Icon Header */}
        <div className="w-16 h-16 rounded-2xl bg-pastel-softPink flex items-center justify-center text-3xl shadow-inner-cute animate-bounce-gentle">
          ⏸️
        </div>

        <div>
          <h2 className="text-2xl font-black text-pastel-deepPink">GAME PAUSED</h2>
          <p className="text-xs font-bold text-gray-500 mt-1">Take a breath and continue!</p>
        </div>

        {/* Buttons */}
        <div className="w-full flex flex-col gap-2.5 mt-2">
          {/* Resume */}
          <button
            onClick={() => {
              sound.playClick();
              onResume();
            }}
            className="btn-bubbly w-full py-3 rounded-2xl bg-gradient-to-r from-pastel-hotPink to-pastel-deepPink text-white font-extrabold text-base shadow-cute flex items-center justify-center gap-2"
          >
            <Play className="w-5 h-5 fill-white" />
            <span>RESUME</span>
          </button>

          {/* Restart */}
          <button
            onClick={() => {
              sound.playClick();
              onRestart();
            }}
            className="btn-bubbly w-full py-2.5 rounded-2xl glass-card text-pastel-deepPurple font-bold text-sm hover:bg-white transition flex items-center justify-center gap-2 border border-pastel-lavender"
          >
            <RotateCcw className="w-4 h-4" />
            <span>RESTART</span>
          </button>

          {/* Home */}
          <button
            onClick={() => {
              sound.playClick();
              onHome();
            }}
            className="btn-bubbly w-full py-2.5 rounded-2xl glass-card text-gray-600 font-bold text-sm hover:bg-white transition flex items-center justify-center gap-2 border border-gray-200"
          >
            <Home className="w-4 h-4" />
            <span>MAIN MENU</span>
          </button>
        </div>

      </div>
    </div>
  );
}
