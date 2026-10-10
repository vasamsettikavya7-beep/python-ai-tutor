import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Mail, Sparkles, Wand2, Lightbulb, CheckCircle2, ChevronDown, ChevronUp, Copy, Check, Volume2 } from 'lucide-react';
import { OWL_POST_CHALLENGES } from '../data/hogwartsLore';
import magicalAudio from '../services/magicalAudio';

export default function OwlPostDailyChallenge({ student, onAwardPoints }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isUnsealed, setIsUnsealed] = useState(false);
  const [hintTier, setHintTier] = useState(0); // 0 = none, 1 = riddle hint, 2 = syntax blueprint
  const [showSolution, setShowSolution] = useState(false);
  const [isSolved, setIsSolved] = useState(false);
  const [copied, setCopied] = useState(false);

  const challenge = OWL_POST_CHALLENGES[currentIdx] || OWL_POST_CHALLENGES[0];

  const handleUnseal = () => {
    magicalAudio.playAlohomora();
    setIsUnsealed(true);
    magicalAudio.speak(`An owl post delivery from ${challenge.parchmentSender}! ${challenge.title}: ${challenge.riddle}`, 'hermione');
  };

  const handleRequestHint = () => {
    magicalAudio.playSpell('wand');
    if (hintTier === 0) {
      setHintTier(1);
      magicalAudio.speak(`Hint 1: ${challenge.hintTier1}`, 'pythondore');
    } else if (hintTier === 1) {
      setHintTier(2);
      magicalAudio.speak(`Hint 2: ${challenge.hintTier2}`, 'hermione');
    } else {
      setShowSolution(true);
    }
  };

  const handleCompleteChallenge = () => {
    if (isSolved) return;
    setIsSolved(true);
    magicalAudio.playTriumph();
    magicalAudio.speak(`Brilliant spellcraft! Thirty-five House Points awarded to your House for solving the Owl Post riddle!`, 'pythondore');

    if (onAwardPoints) {
      onAwardPoints(challenge.rewardPoints);
    }

    try {
      confetti({
        particleCount: 80,
        spread: 60,
        colors: ['#D3A625', '#740001', '#1a472a', '#0e1a40'],
      });
    } catch {}
  };

  const handleCopyCode = (code) => {
    navigator.clipboard?.writeText(code);
    magicalAudio.playSparkle();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="sparkle-card bg-gradient-to-br from-amber-950/70 via-slate-900 to-amber-950/90 border-2 border-amber-400/40 rounded-3xl p-5 sm:p-6 text-amber-100 shadow-xl relative overflow-hidden">
      {/* Decorative starry shimmer background */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-amber-400/20">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-3xl shadow-sm">
            🦉
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full shadow-2xs">
                Owl Post Delivery ✉️
              </span>
              <span className="text-[10px] font-bold text-amber-300/80">
                Daily Hogwarts Challenge
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-extrabold text-white mt-0.5">
              {challenge.title}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-extrabold text-amber-300 bg-black/40 px-3 py-1 rounded-full border border-amber-400/30">
            +{challenge.rewardPoints} House Points
          </span>
        </div>
      </div>

      {/* Sealed or Unsealed State */}
      {!isUnsealed ? (
        <div className="text-center py-6 px-4 bg-slate-950/60 rounded-2xl border border-amber-400/20 space-y-3">
          <p className="text-xs text-amber-200/80 max-w-md mx-auto">
            An owl tapped on the window with an enchanted wax-sealed parchment from{' '}
            <strong className="text-amber-300">{challenge.parchmentSender}</strong>.
          </p>
          <button
            onClick={handleUnseal}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-extrabold text-xs shadow-md shadow-amber-500/30 transition-all flex items-center gap-2 mx-auto active:scale-95 cursor-pointer"
          >
            <Mail className="w-4 h-4" />
            <span>Alohomora! Break Wax Seal & Read 🗝️</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Parchment Scroll Box */}
          <div className="bg-[#fcf6e5] text-slate-900 p-4 sm:p-5 rounded-2xl border-2 border-amber-300 shadow-md font-serif relative">
            <span className="absolute top-3 right-3 text-2xl opacity-30 select-none">
              📜
            </span>
            <div className="flex items-center gap-1.5 text-xs text-amber-900 font-bold mb-2">
              <span>From:</span>
              <span className="font-extrabold text-amber-950">{challenge.parchmentSender}</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-sans mb-3">
              "{challenge.riddle}"
            </p>

            <div className="bg-amber-100/70 p-2.5 rounded-xl border border-amber-200/80 text-[11px] font-mono text-amber-950 space-y-1">
              <span className="font-bold text-amber-900 block font-sans text-[10px] uppercase tracking-wider">
                Cauldron Ingredients:
              </span>
              {challenge.potionIngredients.map((ing, i) => (
                <div key={i} className="text-xs font-semibold">
                  • <code>{ing}</code>
                </div>
              ))}
            </div>
          </div>

          {/* Socratic Hint Progression */}
          {hintTier > 0 && (
            <div className="space-y-2">
              <div className="bg-purple-950/60 border border-purple-400/40 p-3 rounded-xl text-xs text-purple-200 flex items-start gap-2.5">
                <Lightbulb className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-amber-300">Wand Hint 1 (Whisper):</span>{' '}
                  {challenge.hintTier1}
                </div>
              </div>

              {hintTier >= 2 && (
                <div className="bg-indigo-950/60 border border-indigo-400/40 p-3 rounded-xl text-xs text-indigo-200 flex items-start gap-2.5">
                  <Wand2 className="w-4 h-4 text-indigo-300 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-indigo-300">Wand Hint 2 (Blueprint):</span>{' '}
                    {challenge.hintTier2}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Reveal Solution (Only after hints or if requested) */}
          {showSolution && (
            <div className="bg-slate-950 rounded-xl p-3 border border-slate-700 font-mono text-xs text-emerald-300">
              <div className="flex items-center justify-between text-[11px] text-slate-400 pb-1 mb-1 border-b border-slate-800 font-sans">
                <span>The Master Incantation</span>
                <button
                  onClick={() => handleCopyCode(challenge.solutionSnippet)}
                  className="flex items-center gap-1 hover:text-white"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="overflow-x-auto">{challenge.solutionSnippet}</pre>
            </div>
          )}

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <button
              onClick={handleRequestHint}
              className="text-xs font-bold text-amber-300 hover:text-amber-200 bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded-xl border border-amber-400/30 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>
                {hintTier === 0
                  ? 'Request Professor’s Hint 1 🪄'
                  : hintTier === 1
                  ? 'Request Blueprint Hint 2 🪄'
                  : showSolution
                  ? 'Hints Active'
                  : 'Reveal Incantation'}
              </span>
            </button>

            <button
              onClick={handleCompleteChallenge}
              disabled={isSolved}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold shadow-md flex items-center gap-1.5 transition-all cursor-pointer ${
                isSolved
                  ? 'bg-emerald-600 text-white cursor-default'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 text-slate-950 active:scale-95'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSolved ? 'Challenge Mastered (+35 Pts) ✨' : 'Cast Spell & Claim Points!'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
