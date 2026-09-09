// Web Audio API procedural sound synthesizer & music engine
// Guaranteed 100% offline, zero network requests, zero broken assets!

class SoundManager {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.bgmPlaying = false;
    this.bgmTimer = null;
    this.bgmGainNode = null;
    this.sfxGainNode = null;
    
    // Load persisted mute preference
    try {
      const saved = localStorage.getItem('catch_hearts_muted');
      if (saved !== null) {
        this.isMuted = JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Could not read audio preference', e);
    }
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
        
        // Master gain for SFX
        this.sfxGainNode = this.ctx.createGain();
        this.sfxGainNode.gain.setValueAtTime(this.isMuted ? 0 : 0.6, this.ctx.currentTime);
        this.sfxGainNode.connect(this.ctx.destination);

        // Master gain for BGM
        this.bgmGainNode = this.ctx.createGain();
        this.bgmGainNode.gain.setValueAtTime(this.isMuted ? 0 : 0.15, this.ctx.currentTime);
        this.bgmGainNode.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setMuted(muted) {
    this.isMuted = muted;
    try {
      localStorage.setItem('catch_hearts_muted', JSON.stringify(muted));
    } catch (e) {}

    if (this.ctx) {
      const now = this.ctx.currentTime;
      if (this.sfxGainNode) {
        this.sfxGainNode.gain.cancelScheduledValues(now);
        this.sfxGainNode.gain.setValueAtTime(muted ? 0 : 0.6, now);
      }
      if (this.bgmGainNode) {
        this.bgmGainNode.gain.cancelScheduledValues(now);
        this.bgmGainNode.gain.setValueAtTime(muted ? 0 : 0.15, now);
      }
    }
  }

  toggleMute() {
    this.init();
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  // Play a soft UI pop
  playClick() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(900, now + 0.05);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(this.sfxGainNode);

    osc.start(now);
    osc.stop(now + 0.05);
  }

  // Catch normal heart (+1) -> Cute Marimba / Bell
  playCatchHeart(combo = 0) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // Pentatonic scale base pitches: C5, D5, E5, G5, A5, C6, D6, E6
    const baseFreqs = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50, 1174.66, 1318.51];
    const pitchIndex = Math.min(combo, baseFreqs.length - 1);
    const freq = baseFreqs[pitchIndex];

    const osc = this.ctx.createOscillator();
    const oscHarmonic = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.1, now + 0.12);

    oscHarmonic.type = 'triangle';
    oscHarmonic.frequency.setValueAtTime(freq * 2, now);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc.connect(gain);
    oscHarmonic.connect(gain);
    gain.connect(this.sfxGainNode);

    osc.start(now);
    oscHarmonic.start(now);
    osc.stop(now + 0.22);
    oscHarmonic.stop(now + 0.22);
  }

  // Catch golden heart (+5) -> Sparkly Arpeggio
  playCatchGolden() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const freqs = [783.99, 1046.50, 1318.51, 1567.98, 2093.00]; // G5, C6, E6, G6, C7

    freqs.forEach((freq, idx) => {
      const noteTime = now + idx * 0.045;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.35, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.2);

      osc.connect(gain);
      gain.connect(this.sfxGainNode);

      osc.start(noteTime);
      osc.stop(noteTime + 0.2);
    });
  }

  // Bomb hit (-2) -> Soft funny thud & wobble
  playHitBomb() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.3);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(gain);
    gain.connect(this.sfxGainNode);

    osc.start(now);
    osc.stop(now + 0.3);
  }

  // Combo x2 activation fanfare
  playComboFanfare() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [
      { freq: 523.25, time: 0 },    // C5
      { freq: 659.25, time: 0.08 }, // E5
      { freq: 783.99, time: 0.16 }, // G5
      { freq: 1046.50, time: 0.24 } // C6
    ];

    notes.forEach(note => {
      const noteTime = now + note.time;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(note.freq, noteTime);

      gain.gain.setValueAtTime(0.4, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.25);

      osc.connect(gain);
      gain.connect(this.sfxGainNode);

      osc.start(noteTime);
      osc.stop(noteTime + 0.25);
    });
  }

  // Game over sweet melody
  playGameOver(isHighScore = false) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = isHighScore
      ? [
          { freq: 523.25, t: 0.0, d: 0.15 },
          { freq: 659.25, t: 0.12, d: 0.15 },
          { freq: 783.99, t: 0.24, d: 0.18 },
          { freq: 1046.50, t: 0.38, d: 0.4 },
        ]
      : [
          { freq: 659.25, t: 0.0, d: 0.15 },
          { freq: 587.33, t: 0.15, d: 0.15 },
          { freq: 523.25, t: 0.3, d: 0.3 },
        ];

    notes.forEach(note => {
      const noteTime = now + note.t;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.freq, noteTime);

      gain.gain.setValueAtTime(0.35, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + note.d);

      osc.connect(gain);
      gain.connect(this.sfxGainNode);

      osc.start(noteTime);
      osc.stop(noteTime + note.d);
    });
  }

  // Procedural cute pastel background melody loop
  startBGM() {
    this.init();
    if (this.bgmPlaying) return;
    this.bgmPlaying = true;

    const melody = [
      // Bar 1 (C Major vibe)
      { f: 523.25, dur: 0.2 }, { f: 659.25, dur: 0.2 }, { f: 783.99, dur: 0.2 }, { f: 659.25, dur: 0.2 },
      // Bar 2 (A Minor vibe)
      { f: 440.00, dur: 0.2 }, { f: 523.25, dur: 0.2 }, { f: 659.25, dur: 0.2 }, { f: 523.25, dur: 0.2 },
      // Bar 3 (F Major vibe)
      { f: 349.23, dur: 0.2 }, { f: 440.00, dur: 0.2 }, { f: 523.25, dur: 0.2 }, { f: 659.25, dur: 0.2 },
      // Bar 4 (G Major vibe)
      { f: 392.00, dur: 0.2 }, { f: 493.88, dur: 0.2 }, { f: 587.33, dur: 0.2 }, { f: 783.99, dur: 0.2 },
    ];

    let noteIdx = 0;
    const stepTime = 300; // ms per beat

    const playNextNote = () => {
      if (!this.bgmPlaying || !this.ctx) return;
      if (!this.isMuted) {
        const item = melody[noteIdx];
        const now = this.ctx.currentTime;
        
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(item.f, now);

        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + item.dur);

        osc.connect(gain);
        gain.connect(this.bgmGainNode);

        osc.start(now);
        osc.stop(now + item.dur);
      }

      noteIdx = (noteIdx + 1) % melody.length;
      this.bgmTimer = setTimeout(playNextNote, stepTime);
    };

    playNextNote();
  }

  stopBGM() {
    this.bgmPlaying = false;
    if (this.bgmTimer) {
      clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
  }
}

export const sound = new SoundManager();
