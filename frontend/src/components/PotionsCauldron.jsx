import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { X, Sparkles, CheckCircle2, RotateCcw, AlertTriangle, Play, Zap } from 'lucide-react';
import magicalAudio from '../services/magicalAudio';

const POTION_RECIPES = [
  {
    id: 'potion-1',
    name: 'Felix Felicis (Liquid Luck)',
    difficulty: 'Apprentice Level',
    goal: 'Compute sum of powers: sum([x**2 for x in [1, 2, 3]])',
    ingredients: [
      { id: 'ing-1', label: 'numbers = [1, 2, 3]', correct: true },
      { id: 'ing-2', label: 'squares = [x**2 for x in numbers]', correct: true },
      { id: 'ing-3', label: 'luck = sum(squares)', correct: true },
      { id: 'ing-bad-1', label: 'squares = numbers * 2  # Volatile slug slime', correct: false },
    ],
    expectedOutput: 'luck = 14',
    effect: 'Grants boundless good fortune and +25 House Points!',
  },
  {
    id: 'potion-2',
    name: 'Draught of Peace (String Calming)',
    difficulty: 'Novice Level',
    goal: 'Strip chaotic whitespace and uppercase an incantation: "  lumos  ".strip().upper()',
    ingredients: [
      { id: 'ing-2-1', label: 'spell = "  lumos  "', correct: true },
      { id: 'ing-2-2', label: 'pure_spell = spell.strip().upper()', correct: true },
      { id: 'ing-2-bad', label: 'pure_spell = spell.delete(" ")  # Mismatched essence', correct: false },
    ],
    expectedOutput: 'pure_spell = "LUMOS"',
    effect: 'Calms anxiety and brings crystalline syntax harmony!',
  },
];

export default function PotionsCauldron({ isOpen, onClose, onAwardPoints }) {
  const [activeRecipeIdx, setActiveRecipeIdx] = useState(0);
  const [cauldronIngredients, setCauldronIngredients] = useState([]);
  const [brewing, setBrewing] = useState(false);
  const [brewResult, setBrewResult] = useState(null); // 'success' | 'exploded' | null

  if (!isOpen) return null;

  const recipe = POTION_RECIPES[activeRecipeIdx] || POTION_RECIPES[0];

  const handleToggleIngredient = (ing) => {
    if (brewResult) setBrewResult(null);
    setCauldronIngredients((prev) =>
      prev.some((item) => item.id === ing.id)
        ? prev.filter((item) => item.id !== ing.id)
        : [...prev, ing]
    );
    magicalAudio.playSpell('potion');
  };

  const handleStirCauldron = () => {
    setBrewing(true);
    setBrewResult(null);
    magicalAudio.playPotion();

    setTimeout(() => {
      setBrewing(false);
      // Check if all correct ingredients are present and no bad ingredients
      const hasBad = cauldronIngredients.some((i) => !i.correct);
      const neededCorrect = recipe.ingredients.filter((i) => i.correct);
      const hasAllCorrect = neededCorrect.every((needed) =>
        cauldronIngredients.some((i) => i.id === needed.id)
      );

      if (!hasBad && hasAllCorrect) {
        setBrewResult('success');
        magicalAudio.playTriumph();
        magicalAudio.speak(`Superb brewing! ${recipe.name} is bubbling with golden radiance! Twenty-five House Points awarded!`, 'snape');

        if (onAwardPoints) {
          onAwardPoints(25);
        }

        try {
          confetti({
            particleCount: 80,
            spread: 60,
            colors: ['#10b981', '#3b82f6', '#f59e0b'],
          });
        } catch {}
      } else {
        setBrewResult('exploded');
        magicalAudio.playHex();
        magicalAudio.speak('Your cauldron is smoking violently! Check your ingredients and stir again!', 'snape');
      }
    }, 1200);
  };

  const handleResetCauldron = () => {
    setCauldronIngredients([]);
    setBrewResult(null);
    magicalAudio.playSpell('wand');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="sparkle-card bg-slate-900 border-2 border-emerald-400/50 rounded-3xl max-w-2xl w-full text-slate-100 overflow-hidden shadow-2xl relative">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-emerald-950 via-slate-950 to-teal-950 border-b border-emerald-400/30 relative">
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
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-800 border border-emerald-300 flex items-center justify-center text-3xl shadow-lg">
              ⚗️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest bg-emerald-400/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-400/30">
                  Potions Dungeon Cauldron ⚗️
                </span>
                <span className="text-[10px] font-bold text-emerald-200/70">
                  Coding Exercises as Potions
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-0.5">
                {recipe.name}
              </h3>
              <p className="text-xs text-emerald-200/70">
                Goal: {recipe.goal}
              </p>
            </div>
          </div>
        </div>

        {/* Cauldron Workbench */}
        <div className="p-5 sm:p-6 space-y-4">
          {/* Potion Recipe Tabs */}
          <div className="flex items-center gap-2">
            {POTION_RECIPES.map((r, i) => (
              <button
                key={r.id}
                onClick={() => {
                  setActiveRecipeIdx(i);
                  handleResetCauldron();
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                  activeRecipeIdx === i
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400 shadow-sm'
                    : 'bg-slate-950/40 text-slate-400 border-white/5 hover:border-white/20'
                }`}
              >
                {r.name}
              </button>
            ))}
          </div>

          {/* Cauldron Chamber */}
          <div className="bg-slate-950/80 rounded-2xl p-4 sm:p-5 border border-emerald-400/30 text-center relative overflow-hidden">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-4xl animate-bounce">⚗️</span>
              <span className="text-2xl animate-pulse">✨</span>
            </div>
            <h4 className="font-extrabold text-white text-base">
              The Bubbling Cauldron
            </h4>
            <p className="text-xs text-slate-400 mb-3">
              Add code ingredients below to assemble the formula, then stir!
            </p>

            {/* In-Cauldron Ingredients list */}
            <div className="min-h-14 p-2.5 rounded-xl bg-slate-900/90 border border-white/10 flex flex-wrap gap-2 items-center justify-center">
              {cauldronIngredients.length === 0 ? (
                <span className="text-xs text-slate-500 italic">
                  Cauldron is empty. Select code ingredients below.
                </span>
              ) : (
                cauldronIngredients.map((item) => (
                  <span
                    key={item.id}
                    className="text-xs font-mono font-bold bg-emerald-950 text-emerald-200 border border-emerald-400/40 px-2.5 py-1 rounded-lg flex items-center gap-1.5"
                  >
                    <span>{item.label}</span>
                    <button
                      onClick={() => handleToggleIngredient(item)}
                      className="text-rose-400 hover:text-rose-200 font-sans"
                    >
                      ×
                    </button>
                  </span>
                ))
              )}
            </div>
          </div>

          {/* Ingredients Shelf */}
          <div>
            <span className="text-xs font-extrabold text-emerald-300 uppercase tracking-wider block mb-2">
              Ingredients Shelf (Click to Add/Remove):
            </span>
            <div className="grid sm:grid-cols-2 gap-2">
              {recipe.ingredients.map((ing) => {
                const inCauldron = cauldronIngredients.some((i) => i.id === ing.id);
                return (
                  <button
                    key={ing.id}
                    onClick={() => handleToggleIngredient(ing)}
                    className={`p-3 rounded-xl border text-left font-mono text-xs transition-all flex items-center justify-between gap-2 cursor-pointer ${
                      inCauldron
                        ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200 shadow-xs'
                        : 'bg-slate-950/40 border-white/10 text-slate-300 hover:bg-white/5 hover:border-emerald-400/30'
                    }`}
                  >
                    <code>{ing.label}</code>
                    <span className="text-xs shrink-0">
                      {inCauldron ? '✓ Added' : '+ Add'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Brewing Result Feedback */}
          {brewResult === 'success' && (
            <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-400 text-emerald-200 text-xs flex items-center justify-between gap-3 animate-in fade-in">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <span className="font-extrabold block text-emerald-100">
                    Magnificent Brew! {recipe.effect}
                  </span>
                  <span>Expected Output: {recipe.expectedOutput}</span>
                </div>
              </div>
              <span className="font-extrabold text-amber-300 bg-black/40 px-2.5 py-1 rounded-lg border border-amber-400/40 shrink-0">
                +25 House Points!
              </span>
            </div>
          )}

          {brewResult === 'exploded' && (
            <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-400 text-rose-200 text-xs flex items-center gap-2 animate-in fade-in">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
              <div>
                <span className="font-extrabold block text-rose-100">
                  Volatile Reaction! The potion exploded into purple smoke!
                </span>
                <span>Remove incompatible ingredients or include missing steps.</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-950 border-t border-emerald-400/20 flex items-center justify-between">
          <button
            onClick={handleResetCauldron}
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white border border-white/10 flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Empty Cauldron</span>
          </button>

          <button
            onClick={handleStirCauldron}
            disabled={brewing || cauldronIngredients.length === 0}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 text-slate-950 font-extrabold text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer disabled:opacity-40"
          >
            <Play className="w-3.5 h-3.5" />
            <span>{brewing ? 'Brewing...' : 'Stir Cauldron & Test Potion ⚗️'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
