import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Volume2,
  VolumeX,
  Square,
  Wand2,
  BookOpen,
  ChevronUp,
  ChevronDown,
  X,
  RotateCcw,
  Star,
  GraduationCap,
} from 'lucide-react';
import magicalAudio from '../services/magicalAudio';
import { WIZARD_CHARACTERS } from '../data/magicalCharacters';

export default function MagicalCompanion({ student, activeTab = 'dashboard' }) {
  const [audioState, setAudioState] = useState({
    isSpeaking: false,
    isMuted: magicalAudio.isMuted,
  });
  const [activeCharacter, setActiveCharacter] = useState('pythondore');
  const [expanded, setExpanded] = useState(false);
  const [lastSpeechSnippet, setLastSpeechSnippet] = useState('');
  const [wandEnabled, setWandEnabled] = useState(true);

  useEffect(() => {
    const unsubscribe = magicalAudio.subscribe((state) => {
      setAudioState({ ...state });
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('python_wizard_wand_enabled');
      if (saved !== null) setWandEnabled(saved === 'true');
    } catch {}
  }, []);

  const char = WIZARD_CHARACTERS[activeCharacter] || WIZARD_CHARACTERS.pythondore;

  const handleToggleMute = () => {
    const muted = magicalAudio.toggleMute();
    setAudioState((prev) => ({ ...prev, isMuted: muted }));
    if (!muted) {
      magicalAudio.playSpell('lumos');
    }
  };

  const handleStopSpeech = () => {
    magicalAudio.stopSpeech();
  };

  const handleCastLumos = () => {
    magicalAudio.playSpell('lumos');
    const msg = `Lumos Maxima! The light of Python illumination shines upon your path, ${student?.name || 'young sorcerer'}!`;
    setLastSpeechSnippet(msg);
    magicalAudio.speak(msg, 'pythondore');
  };

  const handleSwitchChar = (charKey) => {
    setActiveCharacter(charKey);
    const chosen = WIZARD_CHARACTERS[charKey];
    magicalAudio.playSpell(chosen.sound || 'wand');
    const intro = `I am ${chosen.name}. Ready your wand and study your charms!`;
    setLastSpeechSnippet(intro);
    magicalAudio.speak(intro, charKey);
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 select-none animate-in fade-in duration-300">
      {/* Floating Orb or Expanded Wizard Panel */}
      {!expanded ? (
        <div className="flex items-center gap-2">
          {/* Active Speaking Indicator Pill */}
          {audioState.isSpeaking && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/95 text-amber-200 border border-amber-400/40 shadow-lg text-xs font-semibold backdrop-blur-md animate-pulse">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span className="truncate max-w-[150px]">{char.name} speaking...</span>
              <button
                onClick={handleStopSpeech}
                className="p-1 hover:bg-white/10 rounded-full text-slate-300 hover:text-white"
                title="Stop Speech"
              >
                <Square className="w-3 h-3 fill-current" />
              </button>
            </div>
          )}

          {/* Magical Floating Orb */}
          <button
            onClick={() => {
              setExpanded(true);
              magicalAudio.playSpell('sparkle');
            }}
            className="group relative p-1 rounded-2xl bg-gradient-to-tr from-amber-600 via-purple-600 to-indigo-600 shadow-xl shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer border border-amber-300/40"
            title="Hogwarts Magical Companion & Voice Guide"
          >
            {/* Spinning glowing aura */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-amber-400 to-purple-500 opacity-40 blur-md group-hover:opacity-75 transition-opacity pointer-events-none" />

            <div className="relative bg-slate-950/90 text-white w-12 h-12 rounded-[14px] flex items-center justify-center text-2xl border border-amber-400/30">
              <span>{char.avatar}</span>
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 text-slate-950 rounded-full text-[9px] font-extrabold flex items-center justify-center">
                ✨
              </span>
            </div>
          </button>
        </div>
      ) : (
        /* Expanded Wizard Companion Desk */
        <div className="bg-slate-950/95 border-2 border-amber-400/60 rounded-3xl p-5 shadow-2xl shadow-amber-900/40 text-amber-100 max-w-sm w-[90vw] sm:w-88 backdrop-blur-lg animate-in zoom-in-95 duration-200 relative overflow-hidden">
          {/* Subtle starry background shimmer */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

          {/* Top Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-amber-400/20 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">{char.avatar}</span>
              <div>
                <h4 className="font-extrabold text-amber-300 text-sm tracking-wide">
                  Hogwarts Companion
                </h4>
                <p className="text-[10px] text-amber-200/70 font-mono">
                  {char.title}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleToggleMute}
                className={`p-1.5 rounded-lg border transition-all ${
                  audioState.isMuted
                    ? 'bg-rose-500/20 text-rose-300 border-rose-400/40'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
                }`}
                title={audioState.isMuted ? 'Unmute Voices & Spells' : 'Mute Voices & Spells'}
              >
                {audioState.isMuted ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>

              <button
                onClick={() => setExpanded(false)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-amber-200 transition-colors"
                title="Minimize"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Active Speaking Status or Last Quote */}
          <div className="bg-slate-900/80 rounded-2xl p-3 border border-amber-400/20 mb-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-300" />
                {audioState.isSpeaking ? 'Now Chanting Incantation...' : 'Magical Whispers'}
              </span>

              {audioState.isSpeaking && (
                <button
                  onClick={handleStopSpeech}
                  className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-rose-500/30 text-rose-300 border border-rose-400/30 hover:bg-rose-500/40 flex items-center gap-1 transition-colors"
                >
                  <Square className="w-2.5 h-2.5 fill-current" />
                  <span>Silence</span>
                </button>
              )}
            </div>

            <p className="text-xs text-amber-100/90 leading-relaxed italic line-clamp-3">
              "{lastSpeechSnippet ||
                `Welcome, ${student?.name || 'apprentice'}. Wave your wand, explore the enchanted roadmap, or cast spells in the quiz!`}"
            </p>
          </div>

          {/* Switch Character Guide */}
          <div className="space-y-1.5 mb-3">
            <p className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">
              Summon Character Guide:
            </p>
            <div className="grid grid-cols-4 gap-1.5">
              {Object.entries(WIZARD_CHARACTERS).map(([key, c]) => (
                <button
                  key={key}
                  onClick={() => handleSwitchChar(key)}
                  className={`p-2 rounded-xl text-center border transition-all flex flex-col items-center gap-0.5 ${
                    activeCharacter === key
                      ? 'bg-amber-400/20 border-amber-300 text-amber-200 font-extrabold shadow-sm'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                  }`}
                  title={`${c.name} (${c.title})`}
                >
                  <span className="text-lg">{c.avatar}</span>
                  <span className="text-[9px] font-semibold truncate w-full">
                    {c.name.split(' ')[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Spell Buttons */}
          <div className="pt-2 border-t border-amber-400/20 grid grid-cols-2 gap-2">
            <button
              onClick={handleCastLumos}
              className="py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-slate-950 font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>Cast Lumos ✨</span>
            </button>

            <button
              onClick={() => {
                magicalAudio.playSpell('alohomora');
                const quote = `Alohomora! May the hidden secrets of Python transfigure into crystal-clear understanding!`;
                setLastSpeechSnippet(quote);
                magicalAudio.speak(quote, 'hermione');
              }}
              className="py-2 px-3 rounded-xl bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-amber-100 font-extrabold text-xs border border-purple-400/30 transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
            >
              <span>Alohomora 🗝️</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
