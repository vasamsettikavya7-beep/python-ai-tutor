import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { X, Sparkles, CheckCircle2, RotateCcw, AlertTriangle, Play, Lightbulb, HelpCircle } from 'lucide-react';
import magicalAudio from '../services/magicalAudio';

const POTION_RECIPES = [
  {
    id: 'potion-1',
    name: 'Felix Felicis (Liquid Luck)',
    difficulty: 'Apprentice Level',
    goal: 'Compute sum of powers: sum([x**2 for x in [1, 2, 3]])',
    hint: 'Combine all 3 valid lines together: 1) define numbers, 2) compute squares with list comprehension [x**2 for x in numbers], and 3) luck = sum(squares). Do NOT add "numbers * 2" (in Python that duplicates the list instead of squaring)!',
    ingredients: [
      { id: 'ing-1', label: 'numbers = [1, 2, 3]', correct: true, stepOrder: 1 },
      { id: 'ing-2', label: 'squares = [x**2 for x in numbers]', correct: true, stepOrder: 2 },
      { id: 'ing-3', label: 'luck = sum(squares)', correct: true, stepOrder: 3 },
      { id: 'ing-bad-1', label: 'squares = numbers * 2  # Volatile slug slime', correct: false, stepOrder: 99 },
    ],
    expectedOutput: 'luck = 14',
    effect: 'Grants boundless good fortune and +25 House Points!',
  },
  {
    id: 'potion-2',
    name: 'Draught of Peace (String Calming)',
    difficulty: 'Novice Level',
    goal: 'Strip chaotic whitespace and uppercase an incantation: "  lumos  ".strip().upper()',
    hint: 'Combine both valid lines: 1) spell = "  lumos  " and 2) pure_spell = spell.strip().upper(). Avoid spell.delete(" ") because Python strings have no delete() method!',
    ingredients: [
      { id: 'ing-2-1', label: 'spell = "  lumos  "', correct: true, stepOrder: 1 },
      { id: 'ing-2-2', label: 'pure_spell = spell.strip().upper()', correct: true, stepOrder: 2 },
      { id: 'ing-2-bad', label: 'pure_spell = spell.delete(" ")  # Mismatched essence', correct: false, stepOrder: 99 },
    ],
    expectedOutput: 'pure_spell = "LUMOS"',
    effect: 'Calms anxiety and brings crystalline syntax harmony!',
  },
  {
    id: 'potion-3',
    name: 'Polyjuice Potion (Dictionary Metamorphosis)',
    difficulty: 'Adept Level',
    goal: 'Transform dictionary keys to uppercase: [k.upper() for k in wizard.keys()]',
    hint: 'Combine both valid lines: 1) wizard dictionary definition and 2) keys_upper with list comprehension. Avoid .toUpper() because Python uses .upper()!',
    ingredients: [
      { id: 'ing-3-1', label: 'wizard = {"name": "harry", "house": "gryffindor"}', correct: true, stepOrder: 1 },
      { id: 'ing-3-2', label: 'keys_upper = [k.upper() for k in wizard.keys()]', correct: true, stepOrder: 2 },
      { id: 'ing-3-bad', label: 'keys_upper = wizard.keys().toUpper()  # Invalid spell', correct: false, stepOrder: 99 },
    ],
    expectedOutput: 'keys_upper = ["NAME", "HOUSE"]',
    effect: 'Unlocks advanced shape-shifting and +25 House Points!',
  },
];

export default function PotionsCauldron({ isOpen, onClose, onAwardPoints }) {
  const [activeRecipeIdx, setActiveRecipeIdx] = useState(0);
  const [cauldronIngredients, setCauldronIngredients] = useState([]);
  const [brewing, setBrewing] = useState(false);
  const [brewResult, setBrewResult] = useState(null); // 'success' | 'exploded' | null
  const [showHint, setShowHint] = useState(false);
  const [failureDetails, setFailureDetails] = useState({ badList: [], missingCount: 0 });

  if (!isOpen) return null;

  const recipe = POTION_RECIPES[activeRecipeIdx] || POTION_RECIPES[0];
  const neededCorrect = recipe.ingredients.filter((i) => i.correct);
  const correctInCauldron = cauldronIngredients.filter((i) => i.correct);

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
      const badList = cauldronIngredients.filter((i) => !i.correct);
      const missingCount = neededCorrect.length - correctInCauldron.length;
      const hasAllCorrect = neededCorrect.every((needed) =>
        cauldronIngredients.some((i) => i.id === needed.id)
      );

      if (badList.length === 0 && hasAllCorrect) {
        setBrewResult('success');
        setFailureDetails({ badList: [], missingCount: 0 });
        magicalAudio.playTriumph();
        magicalAudio.speak(
          `Superb brewing! ${recipe.name} is bubbling with golden radiance! Twenty-five House Points awarded!`,
          'snape'
        );

        if (onAwardPoints) {
          onAwardPoints(25);
        }

        try {
          confetti({
            particleCount: 90,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#10b981', '#3b82f6', '#f59e0b', '#ec4899'],
          });
        } catch {}
      } else {
        setBrewResult('exploded');
        setFailureDetails({ badList, missingCount: Math.max(0, missingCount) });
        magicalAudio.playHex();
        magicalAudio.speak(
          'Your cauldron is smoking violently! Check the diagnostic feedback to fix your potion.',
          'snape'
        );
      }
    }, 1100);
  };

  const handleResetCauldron = () => {
    setCauldronIngredients([]);
    setBrewResult(null);
    setFailureDetails({ badList: [], missingCount: 0 });
    magicalAudio.playSpell('wand');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="sparkle-card bg-slate-900 border-2 border-emerald-400/50 rounded-3xl max-w-2xl w-full text-slate-100 overflow-hidden shadow-2xl relative">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-emerald-950 via-slate-950 to-teal-950 border-b border-emerald-400/30 relative">
          <button
            onClick={() => {
              magicalAudio.stop();
              onClose();
            }}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-emerald-200 transition-colors cursor-pointer"
            title="Close Cauldron"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-800 border border-emerald-300 flex items-center justify-center text-3xl shadow-lg shrink-0">
              ⚗️
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-extrabold uppercase tracking-widest bg-emerald-400/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-400/30">
                  Potions Dungeon Cauldron ⚗️
                </span>
                <span className="text-[10px] font-bold text-emerald-200/70">
                  Python Code Assembly Exercise
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-0.5">
                {recipe.name}
              </h3>
              <p className="text-xs text-emerald-200/80 mt-0.5">
                Target: <code className="bg-black/30 px-1.5 py-0.5 rounded text-amber-200 font-bold">{recipe.goal}</code>
              </p>
            </div>
          </div>
        </div>

        {/* Cauldron Workbench */}
        <div className="p-5 sm:p-6 space-y-4">
          {/* Potion Recipe Tabs */}
          <div className="flex items-center gap-2 flex-wrap">
            {POTION_RECIPES.map((r, i) => (
              <button
                key={r.id}
                onClick={() => {
                  setActiveRecipeIdx(i);
                  handleResetCauldron();
                  setShowHint(false);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                  activeRecipeIdx === i
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400 shadow-sm'
                    : 'bg-slate-950/40 text-slate-400 border-white/5 hover:border-white/20'
                }`}
              >
                {r.name}
              </button>
            ))}
          </div>

          {/* How It Works Guidance Banner */}
          <div className="bg-emerald-950/50 border border-emerald-400/30 rounded-2xl p-3 sm:p-3.5 flex items-start gap-2.5 text-xs text-emerald-200 leading-relaxed">
            <Lightbulb className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
            <div>
              <span className="font-extrabold text-amber-300 block mb-0.5">
                How to Brew (Multi-line Python Script Assembly):
              </span>
              <span>
                To brew this potion, select and combine <strong>ALL {neededCorrect.length} valid code steps</strong> into the cauldron to assemble the complete Python program. 
                <strong className="text-rose-300"> Avoid the 1 buggy/toxic distractor!</strong> This is not a 1-choice quiz — all valid steps must be combined together.
              </span>
            </div>
          </div>

          {/* Cauldron Chamber */}
          <div className="bg-slate-950/90 rounded-2xl p-4 sm:p-5 border border-emerald-400/30 relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl animate-bounce">⚗️</span>
                <div>
                  <h4 className="font-extrabold text-white text-sm">
                    The Bubbling Cauldron Chamber
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Assembled lines of Python code currently in the potion:
                  </p>
                </div>
              </div>

              {/* Progress counter pill */}
              <div className="flex items-center gap-1.5 bg-emerald-950/80 border border-emerald-400/40 px-3 py-1 rounded-full text-xs font-bold text-emerald-300">
                <span>{correctInCauldron.length}/{neededCorrect.length} valid steps</span>
              </div>
            </div>

            {/* Assembled Code Script Preview in Cauldron */}
            <div className="min-h-16 p-3 rounded-xl bg-slate-900 border border-white/10 text-left font-mono text-xs space-y-1.5">
              {cauldronIngredients.length === 0 ? (
                <div className="text-center py-4 text-slate-500 italic font-sans text-xs">
                  Cauldron is empty! Click "+ Add" on the ingredients shelf below to slot all {neededCorrect.length} valid lines into your code.
                </div>
              ) : (
                cauldronIngredients.map((item, idx) => {
                  const isBad = !item.correct && brewResult === 'exploded';
                  return (
                    <div
                      key={item.id}
                      className={`flex items-center justify-between px-3 py-1.5 rounded-lg border transition-all ${
                        isBad
                          ? 'bg-rose-950/70 border-rose-400/70 text-rose-200'
                          : 'bg-emerald-950/60 border-emerald-400/40 text-emerald-200'
                      }`}
                    >
                      <div className="flex items-center gap-2 overflow-x-auto">
                        <span className="text-slate-500 text-[10px] select-none font-bold">
                          Line {idx + 1}:
                        </span>
                        <code>{item.label}</code>
                        {isBad && (
                          <span className="text-[10px] bg-rose-500 text-white font-extrabold px-1.5 py-0.2 rounded font-sans uppercase">
                            Toxic Slug Distractor
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => handleToggleIngredient(item)}
                        className="text-rose-400 hover:text-rose-200 font-sans font-extrabold ml-2 text-sm cursor-pointer p-0.5"
                        title="Remove this line from cauldron"
                      >
                        ✕
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Ingredients Shelf */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-extrabold text-emerald-300 uppercase tracking-wider">
                Ingredients Shelf (Click to Add / Remove):
              </span>
              <button
                onClick={() => setShowHint(!showHint)}
                className="text-xs text-amber-300 hover:text-amber-200 flex items-center gap-1 font-bold underline cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>{showHint ? 'Hide Potion Clue' : 'Need a Clue?'}</span>
              </button>
            </div>

            {/* Hint Box */}
            {showHint && (
              <div className="mb-3 p-3 bg-amber-950/70 border border-amber-400/40 rounded-xl text-xs text-amber-200 animate-in fade-in leading-relaxed">
                <span className="font-extrabold text-amber-300 block mb-0.5">
                  🧪 Professor Snape's Master Clue:
                </span>
                <span>{recipe.hint}</span>
              </div>
            )}

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
                    <code className="truncate">{ing.label}</code>
                    <span className="text-xs shrink-0 font-sans font-bold">
                      {inCauldron ? '✓ Added' : '+ Add'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Brewing Result Feedback */}
          {brewResult === 'success' && (
            <div className="p-4 rounded-xl bg-emerald-950/70 border-2 border-emerald-400 text-emerald-200 text-xs flex items-center justify-between gap-3 animate-in fade-in">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                <div>
                  <span className="font-extrabold text-sm block text-emerald-100">
                    Magnificent Brew! {recipe.effect}
                  </span>
                  <span>Expected Output: <code className="bg-black/30 px-1 py-0.5 rounded text-amber-300 font-bold">{recipe.expectedOutput}</code></span>
                </div>
              </div>
              <span className="font-extrabold text-amber-300 bg-amber-950/80 px-3 py-1 rounded-xl border border-amber-400/40 shrink-0 text-xs">
                +25 House Points!
              </span>
            </div>
          )}

          {brewResult === 'exploded' && (
            <div className="p-4 rounded-xl bg-rose-950/80 border-2 border-rose-400 text-rose-200 text-xs space-y-2 animate-in fade-in">
              <div className="flex items-center gap-2 font-extrabold text-rose-100 text-sm">
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
                <span>Volatile Reaction! The potion exploded into purple smoke!</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-rose-200/95 text-[11px] leading-relaxed">
                {failureDetails.badList.length > 0 && (
                  <li>
                    <strong>Toxic Distractor in Cauldron:</strong> Remove <code className="bg-black/40 px-1 rounded text-rose-300">{failureDetails.badList[0].label}</code>! (Click ✕ in the cauldron). In Python, this step causes an incorrect result.
                  </li>
                )}
                {failureDetails.missingCount > 0 && (
                  <li>
                    <strong>Incomplete Code Formula:</strong> You currently have {correctInCauldron.length} of {neededCorrect.length} valid lines. You still need to click <strong>"+ Add"</strong> on the remaining {failureDetails.missingCount} correct line(s) below to complete the full script!
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-950 border-t border-emerald-400/20 flex items-center justify-between">
          <button
            onClick={handleResetCauldron}
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white border border-white/10 flex items-center gap-1.5 transition-colors cursor-pointer"
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
