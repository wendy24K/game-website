import React from 'react';
import { Play, HelpCircle, Volume2, VolumeX, Trophy, Sparkles, Heart } from 'lucide-react';
import { sound } from '../audio/soundManager';

export default function StartScreen({ onPlay, onHowToPlay, highScore, isMuted, onToggleMute }) {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between p-6 sm:p-8 max-w-md mx-auto text-center z-10 select-none">
      {/* Top Bar with High Score & Audio Button */}
      <div className="w-full flex justify-between items-center pt-2">
        <div className="glass-card-subtle px-4 py-2 rounded-full flex items-center gap-2 shadow-sm text-pastel-deepPurple font-bold text-sm">
          <Trophy className="w-4 h-4 text-pastel-gold fill-pastel-gold" />
          <span>High Score: <span className="text-pastel-deepPink">{highScore}</span></span>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            onToggleMute();
          }}
          className="glass-card-subtle w-10 h-10 rounded-full flex items-center justify-center text-pastel-deepPurple hover:text-pastel-deepPink transition shadow-sm btn-bubbly active:scale-90"
          title={isMuted ? "Unmute Sound" : "Mute Sound"}
          aria-label="Toggle Sound"
        >
          {isMuted ? <VolumeX className="w-5 h-5 text-gray-400" /> : <Volume2 className="w-5 h-5 text-pastel-deepPink" />}
        </button>
      </div>

      {/* Hero Content */}
      <div className="flex flex-col items-center my-auto">
        {/* Animated Heart Icon / Mascot */}
        <div className="relative mb-6">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-pastel-pink to-pastel-hotPink shadow-cute flex items-center justify-center animate-bounce-gentle">
            <span className="text-5xl sm:text-6xl drop-shadow-md">💗</span>
          </div>
          {/* Floating mini sparkles */}
          <div className="absolute -top-3 -right-3 text-pastel-gold animate-sparkle">
            <Sparkles className="w-7 h-7 fill-pastel-gold" />
          </div>
          <div className="absolute -bottom-2 -left-3 text-pastel-hotPink animate-float">
            <Heart className="w-6 h-6 fill-pastel-hotPink" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-pastel-deepPink drop-shadow-sm mb-3">
          CATCH THE HEARTS <span className="inline-block animate-pulse">💗</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl font-bold text-pastel-deepPurple/80 max-w-xs mx-auto">
          How many hearts can you catch?
        </p>

        {/* Quick Highlights Badge */}
        <div className="flex items-center gap-2 mt-4 text-xs font-bold text-gray-500 bg-white/60 px-3 py-1.5 rounded-full">
          <span>⏱️ 30s Fast Pace</span>
          <span>•</span>
          <span>⭐ Golden Hearts</span>
          <span>•</span>
          <span>🔥 Combo x2</span>
        </div>
      </div>

      {/* Buttons */}
      <div className="w-full flex flex-col gap-3.5 pb-4">
        <button
          onClick={() => {
            sound.playClick();
            onPlay();
          }}
          className="btn-bubbly w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-pastel-hotPink to-pastel-deepPink text-white font-extrabold text-xl shadow-cute hover:shadow-cute-lg flex items-center justify-center gap-3 border-2 border-white/50"
        >
          <Play className="w-6 h-6 fill-white" />
          <span>PLAY</span>
        </button>

        <button
          onClick={() => {
            sound.playClick();
            onHowToPlay();
          }}
          className="btn-bubbly w-full py-3.5 px-6 rounded-2xl glass-card text-pastel-deepPurple font-bold text-base hover:bg-white transition flex items-center justify-center gap-2 shadow-sm border border-pastel-lavender"
        >
          <HelpCircle className="w-5 h-5 text-pastel-deepPurple" />
          <span>HOW TO PLAY</span>
        </button>
      </div>
    </div>
  );
}
