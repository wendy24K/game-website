import React from 'react';
import { X, Play, ArrowLeftRight, Flame, ShieldAlert, Sparkles } from 'lucide-react';
import { sound } from '../audio/soundManager';

export default function HowToPlayModal({ onClose, onPlay }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pastel-deepPurple/40 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-7 shadow-cute-lg border-2 border-white flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center pb-2 border-b border-pastel-softPink">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📖</span>
            <h2 className="text-2xl font-black text-pastel-deepPink">HOW TO PLAY</h2>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-9 h-9 rounded-full bg-pastel-softPink flex items-center justify-center text-pastel-deepPurple hover:bg-pastel-pink hover:text-white transition btn-bubbly"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Instruction */}
        <p className="text-sm sm:text-base font-semibold text-pastel-deepPurple/90 leading-relaxed bg-pastel-softPink/60 p-3 rounded-2xl border border-pastel-pink/30">
          Move the basket left and right to catch the falling hearts. Avoid the bombs! Catch as many hearts as possible before the timer reaches zero.
        </p>

        {/* Items & Points Grid */}
        <div className="grid grid-cols-3 gap-2.5">
          {/* Regular Heart */}
          <div className="flex flex-col items-center p-3 rounded-2xl bg-pastel-softPink/50 border border-pastel-pink/40 text-center">
            <span className="text-3xl mb-1 drop-shadow-sm animate-bounce-gentle">💗</span>
            <span className="font-extrabold text-xs text-pastel-deepPink">Heart</span>
            <span className="font-black text-sm text-green-600 bg-green-100 px-2 py-0.5 rounded-full mt-1">+1 Point</span>
          </div>

          {/* Golden Heart */}
          <div className="flex flex-col items-center p-3 rounded-2xl bg-amber-50 border border-amber-200 text-center">
            <span className="text-3xl mb-1 drop-shadow-sm animate-sparkle">💛</span>
            <span className="font-extrabold text-xs text-amber-700">Golden</span>
            <span className="font-black text-sm text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full mt-1">+5 Points</span>
          </div>

          {/* Bomb */}
          <div className="flex flex-col items-center p-3 rounded-2xl bg-red-50 border border-red-200 text-center">
            <span className="text-3xl mb-1 drop-shadow-sm">💣</span>
            <span className="font-extrabold text-xs text-red-600">Bomb</span>
            <span className="font-black text-sm text-red-600 bg-red-100 px-2 py-0.5 rounded-full mt-1">-2 Points</span>
          </div>
        </div>

        {/* Bonus Combo Info */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-gradient-to-r from-pastel-lavender/60 to-pastel-blue/60 border border-pastel-purple/30">
          <div className="w-10 h-10 rounded-xl bg-pastel-deepPurple text-white flex items-center justify-center flex-shrink-0">
            <Flame className="w-6 h-6 fill-pastel-gold text-pastel-gold" />
          </div>
          <div className="text-left text-xs font-bold text-pastel-deepPurple">
            <span className="text-pastel-deepPink font-extrabold text-sm block">COMBO x2 Power!</span>
            Catch 5 hearts in a row without hitting bombs to double your points!
          </div>
        </div>

        {/* Controls Info */}
        <div className="bg-pastel-blue/30 rounded-2xl p-3.5 border border-pastel-blue/60 text-xs font-semibold text-pastel-deepPurple/90 space-y-2">
          <div className="flex items-center gap-2 font-bold text-pastel-deepPurple">
            <ArrowLeftRight className="w-4 h-4 text-pastel-sky" />
            <span>Game Controls</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-left">
            <div className="bg-white/80 p-2 rounded-xl border border-white">
              <span className="font-bold block text-pastel-deepPink">🖥️ Desktop:</span>
              <span>Left/Right Arrows, A/D, or Mouse Drag</span>
            </div>
            <div className="bg-white/80 p-2 rounded-xl border border-white">
              <span className="font-bold block text-pastel-deepPink">📱 Mobile:</span>
              <span>Touch Screen Drag or Bottom Left/Right Buttons</span>
            </div>
          </div>
        </div>

        {/* Play Action Button */}
        <button
          onClick={() => {
            sound.playClick();
            onPlay();
          }}
          className="btn-bubbly w-full py-3.5 rounded-2xl bg-gradient-to-r from-pastel-hotPink to-pastel-deepPink text-white font-black text-lg shadow-cute flex items-center justify-center gap-2 mt-1"
        >
          <Play className="w-5 h-5 fill-white" />
          <span>START PLAYING</span>
        </button>
      </div>
    </div>
  );
}
