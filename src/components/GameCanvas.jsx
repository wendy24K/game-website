import React, { useRef, useEffect } from 'react';
import { sound } from '../audio/soundManager';

export default function GameCanvas({
  isPaused,
  isGameOver,
  onScoreUpdate,
  onBombHit,
  onComboUpdate,
  comboCount,
  isComboActive,
  moveLeft,
  moveRight
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  // Mutable Game State Reference (persists across requestAnimationFrame loops without React rerender lag)
  const stateRef = useRef({
    width: 400,
    height: 600,
    dpr: 1,
    elapsedTime: 0,
    lastTime: 0,
    shakeTime: 0,
    
    // Basket
    basket: {
      x: 200,
      y: 520,
      width: 86,
      height: 48,
      speed: 460, // px per sec
      targetX: 200,
      tilt: 0,
      squishX: 1,
      squishY: 1,
    },

    // Arrays
    items: [],
    particles: [],
    floatingTexts: [],

    // Spawning timers
    spawnTimer: 0,
    spawnInterval: 0.75, // in seconds

    // Input state
    keys: {
      left: false,
      right: false
    },
    touchTargetX: null
  });

  // Track keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        stateRef.current.keys.left = true;
      }
      if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        stateRef.current.keys.right = true;
      }
    };

    const handleKeyUp = (e) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        stateRef.current.keys.left = false;
      }
      if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        stateRef.current.keys.right = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Update touch/mobile button move states from props
  useEffect(() => {
    stateRef.current.keys.mobileLeft = moveLeft;
  }, [moveLeft]);

  useEffect(() => {
    stateRef.current.keys.mobileRight = moveRight;
  }, [moveRight]);

  // Canvas Resize Handler
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current || !canvasRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      
      const width = rect.width;
      const height = rect.height;

      stateRef.current.width = width;
      stateRef.current.height = height;
      stateRef.current.dpr = dpr;

      const canvas = canvasRef.current;
      canvas.width = width * dpr;
      canvas.height = height * dpr;

      // Adjust basket position
      stateRef.current.basket.y = height - stateRef.current.basket.height - 18;
      if (stateRef.current.basket.x > width - stateRef.current.basket.width / 2) {
        stateRef.current.basket.x = width / 2;
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Pointer / Touch direct drag handlers on Canvas
  const handlePointerDown = (e) => {
    if (isPaused || isGameOver) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const touchX = e.clientX - rect.left;
    stateRef.current.touchTargetX = touchX;
  };

  const handlePointerMove = (e) => {
    if (isPaused || isGameOver || stateRef.current.touchTargetX === null) return;
    const rect = canvasRef.current.getBoundingClientRect();
    stateRef.current.touchTargetX = e.clientX - rect.left;
  };

  const handlePointerUp = () => {
    stateRef.current.touchTargetX = null;
  };

  // Helper: Create burst particles
  const spawnParticles = (x, y, type) => {
    const particles = stateRef.current.particles;
    let count = 12;
    let colors = ['#FF6584', '#FFB7D5', '#FFF'];
    let shape = 'heart';

    if (type === 'golden_heart') {
      count = 18;
      colors = ['#FFD166', '#FFF2B2', '#FFAA00', '#FFF'];
      shape = 'star';
    } else if (type === 'bomb') {
      count = 16;
      colors = ['#4A5568', '#718096', '#FF6584', '#CBD5E0'];
      shape = 'smoke';
    }

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const speed = 80 + Math.random() * 160;
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 50,
        size: shape === 'heart' ? 12 + Math.random() * 8 : 8 + Math.random() * 8,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 0,
        maxLife: 0.5 + Math.random() * 0.4,
        shape,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 6
      });
    }
  };

  // Helper: Create Floating Score Popup
  const spawnFloatingText = (x, y, text, color) => {
    stateRef.current.floatingTexts.push({
      x,
      y,
      text,
      color,
      alpha: 1,
      scale: 1.3,
      vy: -70
    });
  };

  // Main 60 FPS Game Loop
  useEffect(() => {
    let animationFrameId;

    const render = (time) => {
      if (!stateRef.current.lastTime) {
        stateRef.current.lastTime = time;
      }
      const dt = Math.min((time - stateRef.current.lastTime) / 1000, 0.1); // clamp delta time
      stateRef.current.lastTime = time;

      if (!isPaused && !isGameOver) {
        stateRef.current.elapsedTime += dt;
        updateGame(dt);
      }

      drawGame();
      animationFrameId = requestAnimationFrame(render);
    };

    const updateGame = (dt) => {
      const state = stateRef.current;
      const { basket, width, height } = state;

      // Screen Shake update
      if (state.shakeTime > 0) {
        state.shakeTime = Math.max(0, state.shakeTime - dt);
      }

      // Basket Movement logic
      let movingLeft = state.keys.left || state.keys.mobileLeft;
      let movingRight = state.keys.right || state.keys.mobileRight;

      if (state.touchTargetX !== null) {
        const dx = state.touchTargetX - basket.x;
        if (Math.abs(dx) > 6) {
          basket.x += Math.sign(dx) * Math.min(Math.abs(dx) * 12 * dt, basket.speed * dt);
          basket.tilt = (dx > 0 ? 0.08 : -0.08);
        } else {
          basket.x = state.touchTargetX;
          basket.tilt = 0;
        }
      } else {
        if (movingLeft && !movingRight) {
          basket.x -= basket.speed * dt;
          basket.tilt = -0.1;
        } else if (movingRight && !movingLeft) {
          basket.x += basket.speed * dt;
          basket.tilt = 0.1;
        } else {
          basket.tilt *= 0.8;
        }
      }

      // Clamp basket to screen bounds
      const halfW = basket.width / 2;
      if (basket.x < halfW) basket.x = halfW;
      if (basket.x > width - halfW) basket.x = width - halfW;

      // Squish spring return animation
      basket.squishX += (1 - basket.squishX) * 10 * dt;
      basket.squishY += (1 - basket.squishY) * 10 * dt;

      // Dynamic Difficulty scaling over the 30s
      const progress = Math.min(state.elapsedTime / 30, 1);
      const currentSpawnInterval = Math.max(0.38, 0.75 - progress * 0.32);
      const currentSpeedMult = 1 + progress * 0.45;

      // Spawning
      state.spawnTimer += dt;
      if (state.spawnTimer >= currentSpawnInterval) {
        state.spawnTimer = 0;

        // Choose item type
        const rand = Math.random();
        let type = 'heart';
        if (rand < 0.18) {
          type = 'bomb';
        } else if (rand < 0.35) {
          type = 'golden_heart';
        }

        const size = type === 'golden_heart' ? 34 : type === 'bomb' ? 32 : 30;
        const itemX = size + Math.random() * (width - size * 2);

        state.items.push({
          id: Math.random(),
          type,
          x: itemX,
          y: -size,
          size,
          speed: (220 + Math.random() * 90) * currentSpeedMult,
          wobbleOffset: Math.random() * Math.PI * 2,
          wobbleSpeed: 2 + Math.random() * 2,
          wobbleAmp: 18 + Math.random() * 15,
          rotation: (Math.random() - 0.5) * 0.3,
          fuseSparkTimer: 0
        });
      }

      // Update Items & Check Collisions
      const remainingItems = [];
      const basketTop = basket.y - 12;
      const basketBottom = basket.y + basket.height;
      const basketLeft = basket.x - basket.width * 0.48;
      const basketRight = basket.x + basket.width * 0.48;

      for (let i = 0; i < state.items.length; i++) {
        const item = state.items[i];
        item.y += item.speed * dt;
        item.wobbleOffset += item.wobbleSpeed * dt;
        const wobbleX = Math.sin(item.wobbleOffset) * item.wobbleAmp * dt;
        item.x += wobbleX;

        // Fuse spark particles for bombs
        if (item.type === 'bomb') {
          item.fuseSparkTimer += dt;
          if (item.fuseSparkTimer > 0.08) {
            item.fuseSparkTimer = 0;
            state.particles.push({
              x: item.x + Math.sin(item.rotation) * 14,
              y: item.y - item.size / 2 - 4,
              vx: (Math.random() - 0.5) * 40,
              vy: -20 - Math.random() * 30,
              size: 4,
              color: '#FFD166',
              life: 0,
              maxLife: 0.2,
              shape: 'sparkle',
              rotation: 0,
              vRot: 0
            });
          }
        }

        // Check Collision with Basket Catch Area
        const itemRadius = item.size * 0.45;
        const isCaught = (
          item.y + itemRadius >= basketTop &&
          item.y - itemRadius <= basketBottom &&
          item.x >= basketLeft &&
          item.x <= basketRight
        );

        if (isCaught) {
          // Trigger Catch Action!
          spawnParticles(item.x, item.y, item.type);
          
          // Basket squish bounce effect
          basket.squishX = 1.25;
          basket.squishY = 0.75;

          if (item.type === 'heart') {
            const addedPoints = isComboActive ? 2 : 1;
            onScoreUpdate(addedPoints, 'heart');
            sound.playCatchHeart(comboCount);
            spawnFloatingText(
              item.x,
              item.y - 10,
              isComboActive ? '+2 COMBO!' : '+1',
              isComboActive ? '#FF6584' : '#E84A7F'
            );
          } else if (item.type === 'golden_heart') {
            const addedPoints = isComboActive ? 10 : 5;
            onScoreUpdate(addedPoints, 'golden_heart');
            sound.playCatchGolden();
            spawnFloatingText(
              item.x,
              item.y - 10,
              isComboActive ? '+10 GOLD!' : '+5',
              '#D97706'
            );
          } else if (item.type === 'bomb') {
            onBombHit();
            sound.playHitBomb();
            state.shakeTime = 0.3; // Screen shake
            spawnFloatingText(item.x, item.y - 10, '-2 💥', '#EF4444');
          }
        } else if (item.y > height + item.size + 10) {
          // Item fell off screen (missed)
          // As per game rules: missing does not lose score, but let's reset combo or keep?
          // Per requirements: "Missing a heart does not affect the score"
        } else {
          remainingItems.push(item);
        }
      }
      state.items = remainingItems;

      // Update Particles
      const remainingParticles = [];
      for (let i = 0; i < state.particles.length; i++) {
        const p = state.particles[i];
        p.life += dt;
        if (p.life < p.maxLife) {
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.vy += 120 * dt; // gravity
          p.rotation += p.vRot * dt;
          remainingParticles.push(p);
        }
      }
      state.particles = remainingParticles;

      // Update Floating Texts
      const remainingTexts = [];
      for (let i = 0; i < state.floatingTexts.length; i++) {
        const ft = state.floatingTexts[i];
        ft.y += ft.vy * dt;
        ft.alpha -= 1.4 * dt;
        ft.scale = Math.max(1, ft.scale - 0.6 * dt);
        if (ft.alpha > 0) {
          remainingTexts.push(ft);
        }
      }
      state.floatingTexts = remainingTexts;
    };

    // Helper: Draw cute heart on canvas
    const drawHeart = (ctx, x, y, size, fillGradient, strokeColor = null) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.beginPath();
      const topCurveHeight = size * 0.3;
      ctx.moveTo(0, topCurveHeight);
      
      // Top left curve
      ctx.bezierCurveTo(
        -size / 2, -topCurveHeight,
        -size, size / 3,
        0, size
      );
      // Top right curve
      ctx.bezierCurveTo(
        size, size / 3,
        size / 2, -topCurveHeight,
        0, topCurveHeight
      );
      ctx.closePath();

      ctx.fillStyle = fillGradient;
      ctx.fill();

      if (strokeColor) {
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Shiny reflection highlight on upper left
      ctx.beginPath();
      ctx.ellipse(-size * 0.28, size * 0.1, size * 0.12, size * 0.22, -Math.PI / 4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
      ctx.fill();

      ctx.restore();
    };

    // Helper: Draw Cute Bomb
    const drawBomb = (ctx, x, y, size) => {
      ctx.save();
      ctx.translate(x, y);
      
      const r = size * 0.45;

      // Fuse string
      ctx.beginPath();
      ctx.moveTo(0, -r);
      ctx.quadraticCurveTo(8, -r - 10, 12, -r - 12);
      ctx.strokeStyle = '#D97706';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Bomb Cap
      ctx.fillStyle = '#4B5563';
      ctx.fillRect(-r * 0.35, -r - 3, r * 0.7, 5);

      // Bomb body circle with cute gradient
      const grad = ctx.createRadialGradient(-r * 0.3, -r * 0.3, 2, 0, 0, r);
      grad.addColorStop(0, '#6B7280');
      grad.addColorStop(0.5, '#374151');
      grad.addColorStop(1, '#1F2937');

      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      // Bomb highlight
      ctx.beginPath();
      ctx.ellipse(-r * 0.35, -r * 0.35, r * 0.25, r * 0.15, -Math.PI / 4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.fill();

      // Cute playful angry eyes (X X or • •)
      ctx.fillStyle = '#FFF';
      ctx.beginPath();
      ctx.arc(-r * 0.3, 0, 3, 0, Math.PI * 2);
      ctx.arc(r * 0.3, 0, 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#EF4444';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-r * 0.15, 6);
      ctx.quadraticCurveTo(0, 3, r * 0.15, 6);
      ctx.stroke();

      ctx.restore();
    };

    // Helper: Draw Cute Basket
    const drawBasket = (ctx, basket) => {
      ctx.save();
      ctx.translate(basket.x, basket.y + basket.height / 2);
      ctx.rotate(basket.tilt);
      ctx.scale(basket.squishX, basket.squishY);

      const w = basket.width;
      const h = basket.height;
      const r = 16;

      // Glow under basket if combo active
      if (isComboActive) {
        ctx.save();
        ctx.shadowColor = '#FF6584';
        ctx.shadowBlur = 18;
        ctx.fillStyle = 'rgba(255, 101, 132, 0.35)';
        ctx.beginPath();
        ctx.ellipse(0, h * 0.4, w * 0.55, 12, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Basket Body (Rounded trapezoid/bowl)
      const bGrad = ctx.createLinearGradient(0, -h / 2, 0, h / 2);
      bGrad.addColorStop(0, '#FFE4EC');
      bGrad.addColorStop(1, '#FFB7D5');

      ctx.beginPath();
      ctx.moveTo(-w / 2 + 6, -h / 2);
      ctx.lineTo(w / 2 - 6, -h / 2);
      ctx.quadraticCurveTo(w / 2, h / 2, w / 2 - 14, h / 2);
      ctx.lineTo(-w / 2 + 14, h / 2);
      ctx.quadraticCurveTo(-w / 2, h / 2, -w / 2 + 6, -h / 2);
      ctx.closePath();

      ctx.fillStyle = bGrad;
      ctx.fill();
      ctx.strokeStyle = '#E84A7F';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Cute Woven Lines
      ctx.strokeStyle = 'rgba(232, 74, 127, 0.3)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-w * 0.25, -h * 0.2);
      ctx.lineTo(-w * 0.15, h * 0.35);
      ctx.moveTo(0, -h * 0.25);
      ctx.lineTo(0, h * 0.38);
      ctx.moveTo(w * 0.25, -h * 0.2);
      ctx.lineTo(w * 0.15, h * 0.35);
      ctx.stroke();

      // Basket Rim
      ctx.fillStyle = '#FFF0F5';
      ctx.beginPath();
      ctx.roundRect(-w / 2 - 2, -h / 2 - 4, w + 4, 10, [6]);
      ctx.fill();
      ctx.strokeStyle = '#E84A7F';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Cute Kawaii Face in center of basket
      // Eyes
      ctx.fillStyle = '#6B21A8';
      ctx.beginPath();
      ctx.arc(-14, 2, 2.5, 0, Math.PI * 2);
      ctx.arc(14, 2, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Eye sparkles
      ctx.fillStyle = '#FFF';
      ctx.beginPath();
      ctx.arc(-15, 1, 1, 0, Math.PI * 2);
      ctx.arc(13, 1, 1, 0, Math.PI * 2);
      ctx.fill();

      // Rosy Blushes
      ctx.fillStyle = 'rgba(255, 105, 180, 0.6)';
      ctx.beginPath();
      ctx.ellipse(-20, 6, 4, 2.5, 0, 0, Math.PI * 2);
      ctx.ellipse(20, 6, 4, 2.5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Smile mouth: ◡
      ctx.strokeStyle = '#6B21A8';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.arc(0, 3, 4, 0.2, Math.PI - 0.2);
      ctx.stroke();

      // Ribbon / Bow in center of the Rim
      ctx.fillStyle = '#FF6584';
      ctx.beginPath();
      // Left bow loop
      ctx.ellipse(-6, -h / 2, 5, 3.5, -0.2, 0, Math.PI * 2);
      // Right bow loop
      ctx.ellipse(6, -h / 2, 5, 3.5, 0.2, 0, Math.PI * 2);
      ctx.fill();
      // Center knot
      ctx.fillStyle = '#E84A7F';
      ctx.beginPath();
      ctx.arc(0, -h / 2, 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    // Draw Complete Frame
    const drawGame = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const state = stateRef.current;
      const { width, height, dpr } = state;

      ctx.save();
      ctx.scale(dpr, dpr);

      // Clear Canvas
      ctx.clearRect(0, 0, width, height);

      // Handle Screen Shake
      if (state.shakeTime > 0) {
        const shakeMag = state.shakeTime * 14;
        const sx = (Math.random() - 0.5) * shakeMag;
        const sy = (Math.random() - 0.5) * shakeMag;
        ctx.translate(sx, sy);
      }

      // Draw subtle background floating clouds / light gradients
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, 'rgba(255, 240, 245, 0.5)');
      bgGrad.addColorStop(1, 'rgba(226, 212, 240, 0.4)');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Draw Falling Items
      state.items.forEach(item => {
        if (item.type === 'heart') {
          const heartGrad = ctx.createLinearGradient(item.x, item.y - item.size / 2, item.x, item.y + item.size / 2);
          heartGrad.addColorStop(0, '#FF80A0');
          heartGrad.addColorStop(1, '#FF477E');
          drawHeart(ctx, item.x, item.y - item.size * 0.4, item.size, heartGrad, '#E84A7F');
        } else if (item.type === 'golden_heart') {
          // Golden Sparkle Aura
          ctx.save();
          ctx.shadowColor = '#FFD166';
          ctx.shadowBlur = 14;
          const goldGrad = ctx.createLinearGradient(item.x, item.y - item.size / 2, item.x, item.y + item.size / 2);
          goldGrad.addColorStop(0, '#FFF59D');
          goldGrad.addColorStop(0.5, '#FFD54F');
          goldGrad.addColorStop(1, '#FFA000');
          drawHeart(ctx, item.x, item.y - item.size * 0.4, item.size, goldGrad, '#D97706');
          ctx.restore();
        } else if (item.type === 'bomb') {
          drawBomb(ctx, item.x, item.y, item.size);
        }
      });

      // Draw Particles
      state.particles.forEach(p => {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        const progress = p.life / p.maxLife;
        ctx.globalAlpha = 1 - progress;

        if (p.shape === 'heart') {
          drawHeart(ctx, 0, -p.size * 0.4, p.size, p.color);
        } else if (p.shape === 'star') {
          // Draw 4-point star / sparkle
          ctx.fillStyle = p.color;
          ctx.beginPath();
          const s = p.size * (1 - progress * 0.4);
          ctx.moveTo(0, -s);
          ctx.quadraticCurveTo(0, 0, s, 0);
          ctx.quadraticCurveTo(0, 0, 0, s);
          ctx.quadraticCurveTo(0, 0, -s, 0);
          ctx.quadraticCurveTo(0, 0, 0, -s);
          ctx.fill();
        } else {
          // Smoke circle
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(0, 0, p.size * (1 + progress * 0.8), 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });

      // Draw Basket
      drawBasket(ctx, state.basket);

      // Draw Floating Texts
      state.floatingTexts.forEach(ft => {
        ctx.save();
        ctx.globalAlpha = Math.max(0, ft.alpha);
        ctx.font = `900 ${Math.round(18 * ft.scale)}px "Nunito", "Fredoka", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Text glow / outline
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 4;
        ctx.strokeText(ft.text, ft.x, ft.y);

        ctx.fillStyle = ft.color;
        ctx.fillText(ft.text, ft.x, ft.y);
        ctx.restore();
      });

      ctx.restore();
    };

    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPaused, isGameOver, isComboActive, comboCount]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex-1 touch-none select-none overflow-hidden cursor-pointer"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
      />
    </div>
  );
}
