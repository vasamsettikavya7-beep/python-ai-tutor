/**
 * Magical Audio & Voice Synthesis Service for Python Buddy
 * Inspired by the Wizarding World / Hogwarts School of Witchcraft & Wizardry!
 * Powered by Web Audio API (sound fx) and Web Speech API (character voices).
 * 
 * Features:
 * - Zero external audio file dependencies (100% synthesized Web Audio)
 * - Multi-character voice profiles (Pythondore, Hermione, Snape, Sorting Hat)
 * - Chrome / Edge / Safari / Firefox production HTTPS speech synthesis fixes:
 *   - Voice pre-warming & async voice loading (onvoiceschanged)
 *   - Utterance chunking to prevent Chromium's 15-second speech freeze bug
 *   - V8 Garbage Collection prevention via window anchor
 *   - Autoplay / AudioContext suspended state auto-resume
 *   - SpeechSynthesis paused state keep-alive heartbeat
 *   - Asynchronous cancel-to-speak race condition delay
 *   - Fallback audio chime if speech synthesis is unavailable on device
 *   - Automatic watchdog timer so UI states never freeze
 */

class MagicalAudioService {
  constructor() {
    this.audioCtx = null;
    this.speechSynth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.currentUtterance = null;
    this.isMuted = false;
    this.isSpeaking = false;
    this.listeners = new Set();
    this.voices = [];
    this.heartbeatTimer = null;
    this.watchdogTimer = null;
    this.chunkQueue = [];
    this.currentChunkIndex = 0;
    this.activeOnEndCallback = null;

    // Check mute preference in localStorage
    if (typeof window !== 'undefined') {
      try {
        this.isMuted = localStorage.getItem('python_wizard_muted') === 'true';
      } catch {}
    }

    // Pre-warm voices
    this.initVoices();
  }

  // Pre-load and cache system speech voices
  initVoices() {
    if (typeof window === 'undefined' || !this.speechSynth) return;

    const loadVoices = () => {
      try {
        const list = this.speechSynth.getVoices();
        if (list && list.length > 0) {
          this.voices = list;
        }
      } catch {}
    };

    loadVoices();
    if (typeof this.speechSynth.onvoiceschanged !== 'undefined') {
      this.speechSynth.onvoiceschanged = loadVoices;
    }
  }

  // Get freshest list of voices
  getVoices() {
    if (this.voices && this.voices.length > 0) return this.voices;
    if (this.speechSynth && this.speechSynth.getVoices) {
      try {
        const list = this.speechSynth.getVoices();
        if (list && list.length > 0) {
          this.voices = list;
          return list;
        }
      } catch {}
    }
    return [];
  }

  // Initialize Web Audio Context lazily on user interaction
  getAudioContext() {
    if (typeof window === 'undefined') return null;
    try {
      if (!this.audioCtx) {
        const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
        if (AudioCtxClass) {
          this.audioCtx = new AudioCtxClass();
        }
      }
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume().catch(() => {});
      }
    } catch {}
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
    this.listeners.forEach((fn) => {
      try {
        fn({ isSpeaking: this.isSpeaking, isMuted: this.isMuted });
      } catch {}
    });
  }

  // -------------------------------------------------------------
  // 1. SYNTHESIZED MAGICAL SPELL SOUND EFFECTS (Zero file dependencies!)
  // -------------------------------------------------------------
  playSpell(spellName = 'wand') {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

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

      // Correct Spell Cast / Triumph
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
          pitch: 0.90,
          rate: 0.94,
          gender: 'male',
          lang: 'en-GB',
          prefix: 'Archmage Pythondore: ',
        };

      // Hermione Codegranger: Articulate, clear, brilliant, swift
      case 'hermione':
        return {
          pitch: 1.14,
          rate: 1.02,
          gender: 'female',
          lang: 'en-GB',
          prefix: 'Hermione Code-Granger: ',
        };

      // Professor Severus Code: Deep, drawling, serious, mysterious
      case 'snape':
        return {
          pitch: 0.72,
          rate: 0.82,
          gender: 'male',
          lang: 'en-GB',
          prefix: 'Professor Snape: ',
        };

      // The Sorting Hat of Python: Theatrical, charismatic, booming
      case 'sortinghat':
      default:
        return {
          pitch: 0.82,
          rate: 0.96,
          gender: 'male',
          lang: 'en-US',
          prefix: 'The Sorting Hat: ',
        };
    }
  }

  // Select the highest quality matching voice available on the user's OS
  selectVoice(character) {
    const voices = this.getVoices();
    if (!voices || voices.length === 0) return null;

    const settings = this.getCharacterSettings(character);
    const targetLang = settings.lang || 'en-GB';

    // 1. Try finding natural/online British English voice matching gender preference
    if (settings.gender === 'female') {
      const femaleGB = voices.find(
        (v) =>
          (v.lang.includes('en-GB') || v.lang.includes('en_GB')) &&
          (v.name.toLowerCase().includes('female') ||
           v.name.toLowerCase().includes('hazel') ||
           v.name.toLowerCase().includes('libby') ||
           v.name.toLowerCase().includes('sonia') ||
           v.name.toLowerCase().includes('susan'))
      );
      if (femaleGB) return femaleGB;
    } else {
      const maleGB = voices.find(
        (v) =>
          (v.lang.includes('en-GB') || v.lang.includes('en_GB')) &&
          (v.name.toLowerCase().includes('male') ||
           v.name.toLowerCase().includes('george') ||
           v.name.toLowerCase().includes('daniel') ||
           v.name.toLowerCase().includes('oliver') ||
           v.name.toLowerCase().includes('arthur') ||
           v.name.toLowerCase().includes('ryan'))
      );
      if (maleGB) return maleGB;
    }

    // 2. Any British English voice (Hogwarts authentic feel)
    const gbVoice = voices.find(
      (v) => (v.lang.includes('en-GB') || v.lang.includes('en_GB')) && !v.name.includes('Google')
    ) || voices.find((v) => v.lang.includes('en-GB') || v.lang.includes('en_GB'));
    if (gbVoice) return gbVoice;

    // 3. High quality natural English voice
    const naturalVoice = voices.find(
      (v) =>
        v.lang.startsWith('en') &&
        (v.name.toLowerCase().includes('natural') ||
         v.name.toLowerCase().includes('online') ||
         v.name.toLowerCase().includes('neural'))
    );
    if (naturalVoice) return naturalVoice;

    // 4. Any English voice (en-US, en-IN, en-AU, en-CA, etc.)
    const anyEnVoice = voices.find((v) => v.lang.toLowerCase().startsWith('en'));
    if (anyEnVoice) return anyEnVoice;

    // 5. System default
    return voices[0] || null;
  }

  // Split text into natural, digestible sentence chunks
  // This prevents Chrome's well-known 15-second speech freeze bug on long utterances
  splitIntoChunks(text, maxChunkLen = 140) {
    if (!text) return [];

    // Split on punctuation followed by space or end of string
    const rawSentences = text
      .split(/([.!?]+(?:\s+|$))/)
      .reduce((acc, cur, idx) => {
        if (idx % 2 === 0) {
          acc.push(cur);
        } else if (acc.length > 0) {
          acc[acc.length - 1] += cur;
        }
        return acc;
      }, [])
      .map((s) => s.trim())
      .filter(Boolean);

    const chunks = [];
    let current = '';

    for (const sentence of rawSentences) {
      if ((current + ' ' + sentence).trim().length <= maxChunkLen) {
        current = (current + ' ' + sentence).trim();
      } else {
        if (current) chunks.push(current);
        if (sentence.length > maxChunkLen) {
          // If a single sentence is very long, split by comma or clause
          const subParts = sentence.split(/([,;:]\s+)/);
          let subCurr = '';
          for (const sp of subParts) {
            if ((subCurr + sp).length <= maxChunkLen) {
              subCurr += sp;
            } else {
              if (subCurr.trim()) chunks.push(subCurr.trim());
              subCurr = sp;
            }
          }
          if (subCurr.trim()) current = subCurr.trim();
          else current = '';
        } else {
          current = sentence;
        }
      }
    }
    if (current.trim()) chunks.push(current.trim());

    return chunks.length > 0 ? chunks : [text];
  }

  // Speak with selected character voice
  speak(text, character = 'pythondore', onEndCallback = null, forceUnmute = true) {
    if (typeof window === 'undefined') return;

    // If user explicitly triggered a voice narration, automatically unmute so they hear it!
    if (this.isMuted && forceUnmute) {
      this.isMuted = false;
      try {
        localStorage.setItem('python_wizard_muted', 'false');
      } catch {}
      this.notify();
    } else if (this.isMuted) {
      if (onEndCallback) onEndCallback();
      return;
    }

    if (!text) {
      if (onEndCallback) onEndCallback();
      return;
    }

    // Unlock Web Audio context on user gesture
    this.getAudioContext();

    // Clean text of markdown backticks, asterisks, URLs, and code blocks for speech
    const cleanText = text
      .replace(/```[\s\S]*?```/g, 'Check the code snippet inscribed below.')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/[*#_~]/g, '')
      .replace(/https?:\/\/\S+/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) {
      if (onEndCallback) onEndCallback();
      return;
    }

    // Stop and clear any ongoing speech cleanly
    this.stopSpeech(false);

    // Check if SpeechSynthesis is supported in this browser
    if (!this.speechSynth || typeof window.SpeechSynthesisUtterance === 'undefined') {
      // Fallback: Play magical melodic chime so user has auditory confirmation
      this.playSpell('sparkle');
      if (onEndCallback) {
        setTimeout(onEndCallback, 1500);
      }
      return;
    }

    // Play a gentle wand shimmer spell sound before speaking
    this.playSpell('wand');

    // Split into natural sentence chunks to eliminate Chrome's 15-second speech freeze bug
    const chunks = this.splitIntoChunks(cleanText);
    this.chunkQueue = chunks;
    this.currentChunkIndex = 0;
    this.activeOnEndCallback = onEndCallback;

    this.isSpeaking = true;
    this.notify();

    // Watchdog timer: If browser stalls or fails to emit onend, recover cleanly after safety window
    const safetyDurationMs = Math.min(45000, Math.max(12000, cleanText.length * 90));
    this.watchdogTimer = setTimeout(() => {
      if (this.isSpeaking) {
        this.stopSpeech(true);
      }
    }, safetyDurationMs);

    // Keep-alive heartbeat: Chrome pauses speech if backgrounded or after idle ticks
    this.heartbeatTimer = setInterval(() => {
      if (!this.isSpeaking) {
        clearInterval(this.heartbeatTimer);
        this.heartbeatTimer = null;
        return;
      }
      if (this.speechSynth && this.speechSynth.paused) {
        try {
          this.speechSynth.resume();
        } catch {}
      }
    }, 3000);

    // Chromium fix: wait 40ms after cancel() to let the native speech service flush
    setTimeout(() => {
      if (!this.isSpeaking) return;
      this.speakNextChunk(character);
    }, 40);
  }

  // Sequentially speaks each sentence chunk
  speakNextChunk(character) {
    if (!this.isSpeaking || this.currentChunkIndex >= this.chunkQueue.length) {
      this.finishSpeech();
      return;
    }

    const chunkText = this.chunkQueue[this.currentChunkIndex];
    const settings = this.getCharacterSettings(character);
    const chosenVoice = this.selectVoice(character);

    try {
      const utterance = new window.SpeechSynthesisUtterance(chunkText);
      utterance.pitch = settings.pitch;
      utterance.rate = settings.rate;
      utterance.volume = 1;
      utterance.lang = chosenVoice ? chosenVoice.lang : settings.lang || 'en-US';

      if (chosenVoice) {
        utterance.voice = chosenVoice;
      }

      // CRITICAL CHROMIUM FIX: Anchor utterance on window object to prevent V8 Garbage Collection!
      if (typeof window !== 'undefined') {
        window._pb_active_utterance = utterance;
      }
      this.currentUtterance = utterance;

      utterance.onend = () => {
        if (!this.isSpeaking) return;
        this.currentChunkIndex += 1;
        if (this.currentChunkIndex < this.chunkQueue.length) {
          // Speak next sentence chunk
          this.speakNextChunk(character);
        } else {
          this.finishSpeech();
        }
      };

      utterance.onerror = (event) => {
        // If canceled or interrupted by user, do nothing special
        if (event?.error === 'canceled' || event?.error === 'interrupted') {
          return;
        }
        // If TTS engine errored on a chunk, attempt next or gracefully conclude
        this.currentChunkIndex += 1;
        if (this.currentChunkIndex < this.chunkQueue.length && this.isSpeaking) {
          this.speakNextChunk(character);
        } else {
          this.finishSpeech();
        }
      };

      // Ensure speech synthesis is resumed if paused
      if (this.speechSynth.paused) {
        this.speechSynth.resume();
      }

      this.speechSynth.speak(utterance);
    } catch {
      // If error creating utterance, conclude cleanly
      this.finishSpeech();
    }
  }

  // Conclude speech lifecycle cleanly
  finishSpeech() {
    this.cleanTimers();
    this.isSpeaking = false;
    this.currentUtterance = null;
    this.chunkQueue = [];
    this.currentChunkIndex = 0;
    if (typeof window !== 'undefined') {
      window._pb_active_utterance = null;
    }
    this.notify();

    if (this.activeOnEndCallback) {
      const cb = this.activeOnEndCallback;
      this.activeOnEndCallback = null;
      try {
        cb();
      } catch {}
    }
  }

  // Clear timers
  cleanTimers() {
    if (this.watchdogTimer) {
      clearTimeout(this.watchdogTimer);
      this.watchdogTimer = null;
    }
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  // Stop speech playback
  stopSpeech(triggerCallback = true) {
    this.cleanTimers();

    if (this.speechSynth) {
      try {
        if (this.speechSynth.speaking || this.speechSynth.pending) {
          this.speechSynth.cancel();
        }
      } catch {}
    }

    this.isSpeaking = false;
    this.currentUtterance = null;
    this.chunkQueue = [];
    this.currentChunkIndex = 0;

    if (typeof window !== 'undefined') {
      window._pb_active_utterance = null;
    }

    this.notify();

    if (triggerCallback && this.activeOnEndCallback) {
      const cb = this.activeOnEndCallback;
      this.activeOnEndCallback = null;
      try {
        cb();
      } catch {}
    } else {
      this.activeOnEndCallback = null;
    }
  }

  stop() {
    this.stopSpeech(true);
  }
}

export const magicalAudio = new MagicalAudioService();
export default magicalAudio;
