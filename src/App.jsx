import React, { useState, useEffect, useRef, useCallback } from 'react';
import StartScreen from './components/StartScreen';
import HowToPlayModal from './components/HowToPlayModal';
import GameHUD from './components/GameHUD';
import GameCanvas from './components/GameCanvas';
import MobileControls from './components/MobileControls';
import PauseModal from './components/PauseModal';
import GameOverModal from './components/GameOverModal';
import { sound } from './audio/soundManager';

export default function App() {
  // Game Lifecycle States: 'start' | 'playing' | 'paused' | 'gameover'
  const [gameState, setGameState] = useState('start');
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(() => sound.isMuted);

  // Score & Timer
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [highScore, setHighScore] = useState(0);
  const [isNewHighScore, setIsNewHighScore] = useState(false);

  // Combo & Stats
  const [combo, setCombo] = useState(0);
  const [stats, setStats] = useState({
    heartsCaught: 0,
    goldCaught: 0,
    bombsHit: 0,
    maxCombo: 0
  });

  // Mobile Movement Controls
  const [moveLeft, setMoveLeft] = useState(false);
  const [moveRight, setMoveRight] = useState(false);

  // Load High Score on initial mount
  useEffect(() => {
    try {
      const savedHighScore = localStorage.getItem('catch_hearts_highscore');
      if (savedHighScore !== null) {
        setHighScore(parseInt(savedHighScore, 10) || 0);
      }
    } catch (e) {
      console.warn('Could not load high score from localStorage', e);
    }
  }, []);

  // Sync mute state changes
  const handleToggleMute = useCallback(() => {
    const nextMute = sound.toggleMute();
    setIsMuted(nextMute);
  }, []);

  // Start / Restart a fresh game session
  const startGame = useCallback(() => {
    setScore(0);
    setTimeLeft(30);
    setCombo(0);
    setIsNewHighScore(false);
    setStats({
      heartsCaught: 0,
      goldCaught: 0,
      bombsHit: 0,
      maxCombo: 0
    });
    setGameState('playing');
    sound.startBGM();
  }, []);

  // Pause & Resume
  const pauseGame = useCallback(() => {
    if (gameState === 'playing') {
      setGameState('paused');
    }
  }, [gameState]);

  const resumeGame = useCallback(() => {
    if (gameState === 'paused') {
      setGameState('playing');
    }
  }, [gameState]);

  // Return to Home
  const returnToHome = useCallback(() => {
    setGameState('start');
    setIsHowToPlayOpen(false);
    sound.stopBGM();
  }, []);

  // 30-Second Countdown Timer Loop
  useEffect(() => {
    let timerId = null;

    if (gameState === 'playing' && timeLeft > 0) {
      timerId = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerId);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [gameState, timeLeft]);

  // Handle Game Over when Timer reaches 0
  useEffect(() => {
    if (gameState === 'playing' && timeLeft === 0) {
      setGameState('gameover');
      sound.stopBGM();

      // Check if new high score
      if (score > highScore) {
        setHighScore(score);
        setIsNewHighScore(true);
        try {
          localStorage.setItem('catch_hearts_highscore', score.toString());
        } catch (e) {}
        sound.playGameOver(true);
      } else {
        setIsNewHighScore(false);
        sound.playGameOver(false);
      }
    }
  }, [gameState, timeLeft, score, highScore]);

  // Score & Item Catch handler
  const handleScoreUpdate = useCallback((points, itemType) => {
    setScore((prev) => Math.max(0, prev + points));

    setCombo((prevCombo) => {
      const nextCombo = prevCombo + 1;
      // Trigger combo activation fanfare at 5 consecutive catches
      if (nextCombo === 5) {
        sound.playComboFanfare();
      }
      return nextCombo;
    });

    setStats((prevStats) => {
      const newMaxCombo = Math.max(prevStats.maxCombo, combo + 1);
      return {
        ...prevStats,
        heartsCaught: itemType === 'heart' ? prevStats.heartsCaught + 1 : prevStats.heartsCaught,
        goldCaught: itemType === 'golden_heart' ? prevStats.goldCaught + 1 : prevStats.goldCaught,
        maxCombo: newMaxCombo
      };
    });
  }, [combo]);

  // Bomb hit handler
  const handleBombHit = useCallback(() => {
    setScore((prev) => Math.max(0, prev - 2));
    setCombo(0); // Reset combo
    setStats((prevStats) => ({
      ...prevStats,
      bombsHit: prevStats.bombsHit + 1
    }));
  }, []);

  const isComboActive = combo >= 5;

  return (
    <main className="relative w-full h-screen h-[100dvh] flex flex-col items-center justify-between overflow-hidden bg-pastel-gradient">
      
      {/* Subtle Background Decorative Animated Shapes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-40">
        <div className="absolute top-10 left-6 text-3xl animate-float">☁️</div>
        <div className="absolute top-24 right-10 text-2xl animate-float" style={{ animationDelay: '1.2s' }}>☁️</div>
        <div className="absolute top-1/3 left-1/4 text-xl animate-float" style={{ animationDelay: '2.4s' }}>✨</div>
        <div className="absolute bottom-24 right-8 text-2xl animate-float" style={{ animationDelay: '0.8s' }}>🌸</div>
        <div className="absolute bottom-1/3 left-10 text-2xl animate-float" style={{ animationDelay: '1.8s' }}>💗</div>
      </div>

      {/* VIEW: START SCREEN */}
      {gameState === 'start' && (
        <StartScreen
          onPlay={startGame}
          onHowToPlay={() => setIsHowToPlayOpen(true)}
          highScore={highScore}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
        />
      )}

      {/* VIEW: ACTIVE GAMEPLAY (or PAUSED / GAMEOVER overlay over canvas) */}
      {gameState !== 'start' && (
        <div className="relative w-full h-full flex flex-col items-center justify-between max-w-lg mx-auto z-10">
          
          {/* Top HUD */}
          <GameHUD
            score={score}
            timeLeft={timeLeft}
            highScore={highScore}
            combo={combo}
            isComboActive={isComboActive}
            onPause={pauseGame}
            onRestart={startGame}
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
          />

          {/* Interactive Game Canvas Area */}
          <GameCanvas
            isPaused={gameState === 'paused'}
            isGameOver={gameState === 'gameover'}
            onScoreUpdate={handleScoreUpdate}
            onBombHit={handleBombHit}
            comboCount={combo}
            isComboActive={isComboActive}
            moveLeft={moveLeft}
            moveRight={moveRight}
          />

          {/* Bottom Mobile On-Screen Touch Controls */}
          <MobileControls
            onMoveLeftStart={() => setMoveLeft(true)}
            onMoveLeftEnd={() => setMoveLeft(false)}
            onMoveRightStart={() => setMoveRight(true)}
            onMoveRightEnd={() => setMoveRight(false)}
          />
        </div>
      )}

      {/* MODAL: HOW TO PLAY */}
      {isHowToPlayOpen && (
        <HowToPlayModal
          onClose={() => setIsHowToPlayOpen(false)}
          onPlay={() => {
            setIsHowToPlayOpen(false);
            startGame();
          }}
        />
      )}

      {/* MODAL: PAUSE */}
      {gameState === 'paused' && (
        <PauseModal
          onResume={resumeGame}
          onRestart={startGame}
          onHome={returnToHome}
        />
      )}

      {/* MODAL: GAME OVER */}
      {gameState === 'gameover' && (
        <GameOverModal
          score={score}
          highScore={highScore}
          isNewHighScore={isNewHighScore}
          stats={stats}
          onPlayAgain={startGame}
          onHome={returnToHome}
        />
      )}

    </main>
  );
}
