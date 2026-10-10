/**
 * Magical Audio & Voice Synthesis Service for Python Buddy
 * Inspired by the Wizarding World / Hogwarts School of Witchcraft & Wizardry!
 * Powered by Web Audio API (sound fx) and Web Speech API (character voices).
 */

class MagicalAudioService {
  constructor() {
    this.audioCtx = null;
    this.speechSynth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.currentUtterance = null;
    this.isMuted = false;
    this.isSpeaking = false;
    this.listeners = new Set();

    // Check mute preference in localStorage
    if (typeof window !== 'undefined') {
      try {
        this.isMuted = localStorage.getItem('python_wizard_muted') === 'true';
      } catch {}
    }
  }

  // Initialize Web Audio Context lazily on user interaction
  getAudioContext() {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  // Toggle global mute
  toggleMute() {
    this.isMuted = !this.isMuted;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('python_wizard_muted', String(this.isMuted));
      } catch {}
    }
    if (this.isMuted) {
      this.stopSpeech();
    }
    this.notify();
    return this.isMuted;
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.listeners.forEach((fn) => fn({ isSpeaking: this.isSpeaking, isMuted: this.isMuted }));
  }

  // -------------------------------------------------------------
  // 1. SYNTHESIZED MAGICAL SPELL SOUND EFFECTS (Zero file dependencies!)
  // -------------------------------------------------------------
  playSpell(spellName = 'wand') {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    switch (spellName) {
      // Lumos / Light Spell: High ringing crystalline chime
      case 'lumos': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(1760, now + 0.3);
        osc.frequency.exponentialRampToValueAtTime(2640, now + 0.8);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.25, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 1.2);
        break;
      }

      // Alohomora / Unlocking Charm: Mechanical click followed by celestial shimmer
      case 'alohomora': {
        // Click 1 & 2
        [0, 0.08].forEach((delay) => {
          const clickOsc = ctx.createOscillator();
          const clickGain = ctx.createGain();
          clickOsc.type = 'triangle';
          clickOsc.frequency.setValueAtTime(320, now + delay);
          clickOsc.frequency.exponentialRampToValueAtTime(120, now + delay + 0.04);
          clickGain.gain.setValueAtTime(0.3, now + delay);
          clickGain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.05);
          clickOsc.connect(clickGain);
          clickGain.connect(ctx.destination);
          clickOsc.start(now + delay);
          clickOsc.stop(now + delay + 0.05);
        });

        // Golden unlock chime
        const chime = ctx.createOscillator();
        const chimeGain = ctx.createGain();
        chime.type = 'sine';
        chime.frequency.setValueAtTime(1046.5, now + 0.12); // C6
        chime.frequency.exponentialRampToValueAtTime(1318.5, now + 0.35); // E6
        chimeGain.gain.setValueAtTime(0.2, now + 0.12);
        chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);
        chime.connect(chimeGain);
        chimeGain.connect(ctx.destination);
        chime.start(now + 0.12);
        chime.stop(now + 1.4);
        break;
      }

      // Wand Swish: Air whoosh with frequency sweep
      case 'wand': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(659, now + 0.15);
        osc.frequency.exponentialRampToValueAtTime(330, now + 0.35);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.18, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.4);
        break;
      }

      // Sparkles / Pixie Dust: Fast arpeggio
      case 'sparkle': {
        const freqs = [1046.5, 1318.5, 1567.98, 2093.0, 2637.0];
        freqs.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const t = now + idx * 0.05;
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, t);
          gain.gain.setValueAtTime(0.12, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(t);
          osc.stop(t + 0.3);
        });
        break;
      }

      // Correct Spell Cast / Triumph (10 Points to Gryffindor)
      case 'triumph': {
        const chord = [523.25, 659.25, 783.99, 1046.5]; // C major triumph
        chord.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const t = now + idx * 0.06;
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, t);
          gain.gain.setValueAtTime(0.2, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 1.0);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(t);
          osc.stop(t + 1.0);
        });
        break;
      }

      // Potion Bubble / Miscast Hex
      case 'potion':
      case 'hex': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(260, now);
        osc.frequency.linearRampToValueAtTime(140, now + 0.3);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.35);
        break;
      }

      default:
        break;
    }
  }

  // Spell shortcut methods
  playLumos() { this.playSpell('lumos'); }
  playAlohomora() { this.playSpell('alohomora'); }
  playWand() { this.playSpell('wand'); }
  playSparkle() { this.playSpell('sparkle'); }
  playTriumph() { this.playSpell('triumph'); }
  playHex() { this.playSpell('hex'); }
  playPotion() { this.playSpell('potion'); }

  // -------------------------------------------------------------
  // 2. CHARACTER VOICE SYNTHESIS (Web Speech API)
  // -------------------------------------------------------------
  getCharacterSettings(character) {
    switch (character?.toLowerCase()) {
      // Albus Pythondore: Grand, deep, wise, calm, dignified
      case 'pythondore':
        return {
          pitch: 0.88,
          rate: 0.92,
          langFilter: ['en-GB', 'en-UK', 'en'],
          prefix: 'Archmage Pythondore: ',
        };

      // Hermione Codegranger: Articulate, clear, brilliant, swift
      case 'hermione':
        return {
          pitch: 1.15,
          rate: 1.02,
          langFilter: ['en-GB', 'en-UK', 'en'],
          prefix: 'Hermione Code-Granger: ',
        };

      // Professor Severus Code: Deep, drawling, serious, mysterious
      case 'snape':
        return {
          pitch: 0.72,
          rate: 0.82,
          langFilter: ['en-GB', 'en-UK', 'en'],
          prefix: 'Professor Snape: ',
        };

      // The Sorting Hat of Python: Theatrical, charismatic, booming
      case 'sortinghat':
      default:
        return {
          pitch: 0.82,
          rate: 0.95,
          langFilter: ['en-GB', 'en-US', 'en'],
          prefix: 'The Sorting Hat: ',
        };
    }
  }

  // Speak with selected character voice
  speak(text, character = 'pythondore', onEndCallback = null) {
    if (typeof window === 'undefined' || !this.speechSynth) return;
    if (this.isMuted || !text) return;

    // Cancel any ongoing speech
    this.speechSynth.cancel();

    // Clean text of markdown backticks, asterisks, and code blocks for speech
    const cleanText = text
      .replace(/```[\s\S]*?```/g, 'Check the code snippet inscribed below.')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/[*#_~]/g, '')
      .replace(/https?:\/\/\S+/g, '')
      .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    const settings = this.getCharacterSettings(character);

    utterance.pitch = settings.pitch;
    utterance.rate = settings.rate;
    utterance.volume = 1;

    // Pick a natural British/English voice if available
    const voices = this.speechSynth.getVoices ? this.speechSynth.getVoices() : [];
    if (voices.length > 0) {
      let chosenVoice = null;

      // Try matching British English first for authentic Hogwarts feel
      chosenVoice = voices.find(
        (v) => (v.lang.includes('en-GB') || v.lang.includes('en_GB')) && !v.name.includes('Google')
      );

      // Fallback to any British English voice
      if (!chosenVoice) {
        chosenVoice = voices.find((v) => v.lang.includes('en-GB') || v.lang.includes('en_GB'));
      }

      // Fallback to high quality English voice
      if (!chosenVoice) {
        chosenVoice = voices.find(
          (v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Online'))
        );
      }

      // Default English fallback
      if (!chosenVoice) {
        chosenVoice = voices.find((v) => v.lang.startsWith('en'));
      }

      if (chosenVoice) {
        utterance.voice = chosenVoice;
      }
    }

    this.isSpeaking = true;
    this.currentUtterance = utterance;
    this.notify();

    // Play a gentle wand shimmer before speaking
    this.playSpell('wand');

    utterance.onend = () => {
      this.isSpeaking = false;
      this.currentUtterance = null;
      this.notify();
      if (onEndCallback) onEndCallback();
    };

    utterance.onerror = () => {
      this.isSpeaking = false;
      this.currentUtterance = null;
      this.notify();
    };

    this.speechSynth.speak(utterance);
  }

  stopSpeech() {
    if (this.speechSynth) {
      this.speechSynth.cancel();
    }
    this.isSpeaking = false;
    this.currentUtterance = null;
    this.notify();
  }

  stop() {
    this.stopSpeech();
  }
}

export const magicalAudio = new MagicalAudioService();
export default magicalAudio;
