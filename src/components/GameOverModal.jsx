import React, { useEffect } from 'react';
import { RotateCcw, Home, Trophy, Sparkles, Heart, Zap, ShieldAlert } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../audio/soundManager';

export default function GameOverModal({
  score,
  highScore,
  isNewHighScore,
  stats,
  onPlayAgain,
  onHome
}) {
  useEffect(() => {
    // Confetti effect if new high score or good score
    if (isNewHighScore) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF6584', '#FFB7D5', '#FFD166', '#B39DDB', '#81D4FA']
      });
      const timeout = setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#FF6584', '#FFD166', '#FFB7D5']
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#81D4FA', '#B39DDB', '#FFB7D5']
        });
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [isNewHighScore]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pastel-deepPurple/50 backdrop-blur-md animate-fadeIn select-none">
      <div className="relative w-full max-w-sm bg-white/95 backdrop-blur-lg rounded-3xl p-6 sm:p-7 shadow-cute-lg border-2 border-white flex flex-col items-center gap-4 text-center">
        
        {/* Header Badge */}
        {isNewHighScore ? (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-300 to-amber-500 shadow-cute flex items-center justify-center text-3xl animate-bounce-gentle">
              🏆
            </div>
            <div className="bg-amber-100 text-amber-800 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider mt-2 flex items-center gap-1 border border-amber-300">
              <Sparkles className="w-3 h-3 fill-amber-500 text-amber-500" />
              <span>NEW HIGH SCORE! 🎉</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-pastel-pink to-pastel-hotPink shadow-cute flex items-center justify-center text-3xl animate-bounce-gentle">
              💕
            </div>
            <h2 className="text-2xl font-black text-pastel-deepPink mt-2 tracking-tight">
              TIME'S UP! 💕
            </h2>
          </div>
        )}

        {/* Score Display Card */}
        <div className="w-full bg-pastel-softPink/60 rounded-2xl p-4 border border-pastel-pink/40 shadow-inner-cute flex flex-col items-center">
          <span className="text-xs font-extrabold text-pastel-deepPurple/70 uppercase tracking-wider">Final Score</span>
          <span className="text-5xl font-black text-pastel-deepPink my-1 drop-shadow-sm">
            {score}
          </span>
          <div className="flex items-center gap-1.5 text-xs font-bold text-pastel-deepPurple mt-1">
            <Trophy className="w-3.5 h-3.5 text-pastel-gold fill-pastel-gold" />
            <span>High Score: <span className="font-extrabold text-pastel-deepPink">{highScore}</span></span>
          </div>
        </div>

        {/* Game Stats Breakdown */}
        {stats && (
          <div className="w-full grid grid-cols-2 gap-2 text-xs font-bold">
            <div className="bg-white/80 p-2.5 rounded-xl border border-pastel-pink/30 flex items-center justify-between">
              <span className="text-gray-500 flex items-center gap-1">
                <span>💗</span> Hearts
              </span>
              <span className="text-pastel-deepPink font-black text-sm">{stats.heartsCaught || 0}</span>
            </div>

            <div className="bg-white/80 p-2.5 rounded-xl border border-amber-200 flex items-center justify-between">
              <span className="text-gray-500 flex items-center gap-1">
                <span>💛</span> Golden
              </span>
              <span className="text-amber-600 font-black text-sm">{stats.goldCaught || 0}</span>
            </div>

            <div className="bg-white/80 p-2.5 rounded-xl border border-red-200 flex items-center justify-between">
              <span className="text-gray-500 flex items-center gap-1">
                <span>💣</span> Bombs
              </span>
              <span className="text-red-500 font-black text-sm">{stats.bombsHit || 0}</span>
            </div>

            <div className="bg-white/80 p-2.5 rounded-xl border border-purple-200 flex items-center justify-between">
              <span className="text-gray-500 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-purple-500 fill-purple-500" /> Max Combo
              </span>
              <span className="text-pastel-deepPurple font-black text-sm">{stats.maxCombo || 0}x</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-2.5 mt-1">
          <button
            onClick={() => {
              sound.playClick();
              onPlayAgain();
            }}
            className="btn-bubbly w-full py-3.5 rounded-2xl bg-gradient-to-r from-pastel-hotPink to-pastel-deepPink text-white font-black text-lg shadow-cute flex items-center justify-center gap-2 border-2 border-white"
          >
            <RotateCcw className="w-5 h-5" />
            <span>PLAY AGAIN</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onHome();
            }}
            className="btn-bubbly w-full py-3 rounded-2xl glass-card text-pastel-deepPurple font-bold text-sm hover:bg-white transition flex items-center justify-center gap-2 border border-pastel-lavender"
          >
            <Home className="w-4 h-4" />
            <span>HOME</span>
          </button>
        </div>

      </div>
    </div>
  );
}
