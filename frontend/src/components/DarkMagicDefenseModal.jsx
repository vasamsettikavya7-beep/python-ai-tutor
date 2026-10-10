import React, { useState } from 'react';
import { X, ShieldAlert, Sparkles, CheckCircle, Wand2, BookOpen, Volume2 } from 'lucide-react';
import { DARK_MAGIC_CURSES } from '../data/hogwartsLore';
import magicalAudio from '../services/magicalAudio';

export default function DarkMagicDefenseModal({ isOpen, onClose }) {
  const [selectedCurse, setSelectedCurse] = useState(DARK_MAGIC_CURSES[0]);

  if (!isOpen) return null;

  const handleSpeakCurse = (curse) => {
    magicalAudio.playSpell('potion');
    const text = `${curse.curseName}! Also known to Muggles as a ${curse.pythonError}. ${curse.description}. The counter-curse is: ${curse.counterCurse}`;
    magicalAudio.speak(text, 'snape');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="sparkle-card bg-slate-900 border-2 border-emerald-500/50 rounded-3xl max-w-2xl w-full text-slate-100 overflow-hidden shadow-2xl relative">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-emerald-950 via-slate-950 to-teal-950 border-b border-emerald-500/30 relative">
          <button
            onClick={() => {
              magicalAudio.stop();
              onClose();
            }}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-emerald-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-900/60 border border-emerald-400/50 flex items-center justify-center text-3xl shadow-lg">
              🐍
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest bg-emerald-400/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-400/30">
                  Defense Against Dark Magic 🛡️
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-0.5">
                Python Bugs & Counter-Curses
              </h3>
              <p className="text-xs text-emerald-200/70">
                Identify treacherous Python error curses and master the counter-curse incantations to dispel them.
              </p>
            </div>
          </div>
        </div>

        {/* Content Body: Curse Selector & Details */}
        <div className="p-5 sm:p-6 space-y-4">
          {/* Curse Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {DARK_MAGIC_CURSES.map((curse) => (
              <button
                key={curse.pythonError}
                onClick={() => setSelectedCurse(curse)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 border cursor-pointer ${
                  selectedCurse.pythonError === curse.pythonError
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400 shadow-sm'
                    : 'bg-slate-950/40 text-slate-400 border-white/5 hover:border-white/20'
                }`}
              >
                <span>{curse.icon}</span>
                <span>{curse.pythonError}</span>
              </button>
            ))}
          </div>

          {/* Selected Curse Card */}
          <div className="bg-slate-950/80 rounded-2xl p-4 sm:p-5 border border-emerald-500/30 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{selectedCurse.icon}</span>
                  <h4 className="text-base sm:text-lg font-extrabold text-emerald-300">
                    {selectedCurse.curseName}
                  </h4>
                </div>
                <span className="text-xs font-mono text-slate-400 ml-8 block">
                  Class: {selectedCurse.pythonError} • Danger: {selectedCurse.dangerLevel}
                </span>
              </div>

              <button
                onClick={() => handleSpeakCurse(selectedCurse)}
                className="self-start sm:self-auto px-3 py-1.5 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-400/40 text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Hear Snape’s Counter-Curse 🧪</span>
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {selectedCurse.description}
            </p>

            {/* Counter-Curse Solution Box */}
            <div className="bg-emerald-950/40 p-3.5 rounded-xl border border-emerald-400/30 space-y-2">
              <span className="text-xs font-extrabold text-emerald-300 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-emerald-400" />
                Counter-Curse Dispelling Guide:
              </span>
              <p className="text-xs text-emerald-100 font-medium leading-relaxed">
                {selectedCurse.counterCurse}
              </p>
            </div>

            {/* Code Examples Comparison */}
            <div className="grid sm:grid-cols-2 gap-3 text-xs font-mono">
              <div className="bg-rose-950/30 p-3 rounded-xl border border-rose-500/30 text-rose-300">
                <span className="font-bold text-rose-400 block mb-1 font-sans text-[11px]">
                  ☠️ Active Hex (Error Code):
                </span>
                <code>{selectedCurse.example}</code>
              </div>

              <div className="bg-emerald-950/30 p-3 rounded-xl border border-emerald-500/30 text-emerald-300">
                <span className="font-bold text-emerald-400 block mb-1 font-sans text-[11px]">
                  ✨ Dispelled Incantation (Fixed Code):
                </span>
                <code>{selectedCurse.cure}</code>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-emerald-500/20 flex justify-end">
          <button
            onClick={() => {
              magicalAudio.stop();
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
          >
            Understood, Professor 🧙‍♂️
          </button>
        </div>
      </div>
    </div>
  );
}
