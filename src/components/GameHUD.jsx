import React from 'react';
import { Pause, RotateCcw, Volume2, VolumeX, Trophy, Timer, Heart, Sparkles, Flame } from 'lucide-react';
import { sound } from '../audio/soundManager';

export default function GameHUD({
  score,
  timeLeft,
  highScore,
  combo,
  isComboActive,
  onPause,
  onRestart,
  isMuted,
  onToggleMute
}) {
  const isTimeLow = timeLeft <= 5;

  return (
    <header className="w-full px-3 py-2 sm:px-6 sm:py-3 z-30 select-none">
      <div className="max-w-xl mx-auto flex flex-col gap-2">
        
        {/* Top Control Bar & Stats */}
        <div className="flex items-center justify-between gap-2">
          
          {/* High Score Capsule */}
          <div className="glass-card-subtle px-3 py-1.5 rounded-2xl flex items-center gap-1.5 text-xs sm:text-sm font-bold text-pastel-deepPurple shadow-sm">
            <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-pastel-gold fill-pastel-gold" />
            <span className="hidden xs:inline text-gray-500">Best:</span>
            <span className="text-pastel-deepPink font-extrabold">{highScore}</span>
          </div>

          {/* Center Title / Mini Brand */}
          <div className="flex items-center gap-1 text-pastel-deepPink font-black text-xs sm:text-sm tracking-wide bg-white/70 px-2.5 py-1 rounded-full shadow-inner-cute">
            <span>💗 Catch the Hearts</span>
          </div>

          {/* Action Icons: Mute, Restart, Pause */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                sound.playClick();
                onToggleMute();
              }}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl glass-card-subtle flex items-center justify-center text-pastel-deepPurple hover:text-pastel-deepPink transition shadow-sm btn-bubbly"
              aria-label="Toggle Mute"
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-gray-400" /> : <Volume2 className="w-4 h-4 text-pastel-deepPink" />}
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onRestart();
              }}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl glass-card-subtle flex items-center justify-center text-pastel-deepPurple hover:text-amber-600 transition shadow-sm btn-bubbly"
              aria-label="Restart Game"
              title="Restart"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onPause();
              }}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-pastel-pink/70 border border-white flex items-center justify-center text-pastel-deepPink hover:bg-pastel-pink transition shadow-sm btn-bubbly"
              aria-label="Pause Game"
              title="Pause"
            >
              <Pause className="w-4 h-4 fill-pastel-deepPink" />
            </button>
          </div>
        </div>

        {/* Main HUD Row: Score & Time Counter */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          
          {/* Score Card */}
          <div className="glass-card rounded-2xl p-2.5 sm:p-3 flex items-center justify-between shadow-cute border-2 border-white relative overflow-hidden">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-pastel-softPink flex items-center justify-center text-xl sm:text-2xl shadow-inner-cute">
                💗
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-pastel-deepPurple/70">Score</span>
                <span className="text-xl sm:text-2xl font-black text-pastel-deepPink leading-none tracking-tight">
                  {score}
                </span>
              </div>
            </div>

            {/* Combo Badge (if combo > 0) */}
            {combo > 1 && (
              <div className={`px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-black flex items-center gap-1 shadow-sm animate-pulse ${
                isComboActive 
                  ? 'bg-gradient-to-r from-amber-400 to-pink-500 text-white shadow-amber-300/50' 
                  : 'bg-pastel-lavender text-pastel-deepPurple'
              }`}>
                <Flame className="w-3 h-3 fill-current" />
                <span>{isComboActive ? 'COMBO x2!' : `Combo ${combo}/5`}</span>
              </div>
            )}
          </div>

          {/* Timer Card */}
          <div className={`glass-card rounded-2xl p-2.5 sm:p-3 flex items-center justify-between shadow-cute border-2 border-white transition-colors duration-300 relative overflow-hidden ${
            isTimeLow ? 'bg-red-50/90 border-red-300' : ''
          }`}>
            <div className="flex items-center gap-2">
              <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-xl sm:text-2xl shadow-inner-cute transition ${
                isTimeLow ? 'bg-red-100 text-red-600 animate-bounce-gentle' : 'bg-pastel-blue/60 text-pastel-sky'
              }`}>
                <Timer className={`w-5 h-5 sm:w-6 sm:h-6 ${isTimeLow ? 'text-red-500' : 'text-sky-500'}`} />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-pastel-deepPurple/70">Time</span>
                <span className={`text-xl sm:text-2xl font-black leading-none tracking-tight ${
                  isTimeLow ? 'text-red-500 animate-pulse' : 'text-pastel-deepPurple'
                }`}>
                  {timeLeft}s
                </span>
              </div>
            </div>

            {/* Visual Timer Progress Bar Ring / Bar */}
            <div className="w-12 sm:w-16 h-2 bg-black/10 rounded-full overflow-hidden self-center">
              <div 
                className={`h-full rounded-full transition-all duration-300 ${
                  isTimeLow ? 'bg-red-500' : 'bg-pastel-deepPink'
                }`}
                style={{ width: `${Math.max(0, Math.min(100, (timeLeft / 30) * 100))}%` }}
              />
            </div>
          </div>

        </div>

      </div>
    </header>
  );
}
