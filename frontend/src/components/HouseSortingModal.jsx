import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { X, Sparkles, Wand2, Shield, Check, Volume2 } from 'lucide-react';
import { HOGWARTS_HOUSES } from '../data/hogwartsLore';
import magicalAudio from '../services/magicalAudio';

export default function HouseSortingModal({
  isOpen,
  onClose,
  currentHouse = 'Gryffindor',
  onSelectHouse,
}) {
  const [selectedHouse, setSelectedHouse] = useState(currentHouse || 'Gryffindor');
  const [isSorting, setIsSorting] = useState(false);
  const [sortingDialogue, setSortingDialogue] = useState('');

  if (!isOpen) return null;

  const houses = Object.values(HOGWARTS_HOUSES);

  const handlePickHouse = (houseId) => {
    setSelectedHouse(houseId);
    const house = HOGWARTS_HOUSES[houseId];
    magicalAudio.playTriumph();
    magicalAudio.speak(`${house.name}! A splendid choice for your magical journey!`, 'sortinghat');
    
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        colors: houseId === 'Gryffindor' ? ['#740001', '#D3A625'] :
                houseId === 'Slytherin' ? ['#1a472a', '#aaaaaa'] :
                houseId === 'Ravenclaw' ? ['#0e1a40', '#946b2d'] :
                ['#ecb939', '#372e29'],
      });
    } catch {}
  };

  const handleCeremony = () => {
    setIsSorting(true);
    setSortingDialogue('The Sorting Hat is pondering your mind...');
    magicalAudio.playWand();

    const hatSpeech = "Ah! What have we here? Courage, intellect, loyalty, and ambition... Where shall I put you?";
    magicalAudio.speak(hatSpeech, 'sortinghat', () => {
      // Pick random or keep current
      const randomHouse = houses[Math.floor(Math.random() * houses.length)];
      setSelectedHouse(randomHouse.id);
      setIsSorting(false);
      setSortingDialogue(`"BETTER BE... ${randomHouse.name.toUpperCase()}!"`);
      magicalAudio.playTriumph();
      magicalAudio.speak(`Better be... ${randomHouse.name}!`, 'sortinghat');

      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {}
    });
  };

  const handleConfirm = () => {
    if (onSelectHouse) {
      onSelectHouse(selectedHouse);
    }
    magicalAudio.stop();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="sparkle-card bg-slate-900 border-2 border-amber-400/50 rounded-3xl max-w-xl w-full text-amber-100 overflow-hidden shadow-2xl relative">
        {/* Top Header */}
        <div className="p-6 bg-gradient-to-r from-purple-950 via-slate-950 to-indigo-950 border-b border-amber-400/30 relative">
          <button
            onClick={() => {
              magicalAudio.stop();
              onClose();
            }}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-amber-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-600 to-purple-800 border border-amber-300 flex items-center justify-center text-3xl shadow-lg">
              🎩
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-400/30">
                  Sorting Ceremony 🪄
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-0.5">
                Choose Your Hogwarts House
              </h3>
              <p className="text-xs text-amber-200/70">
                Your House earns all House Points awarded from quizzes, lessons, and challenges.
              </p>
            </div>
          </div>
        </div>

        {/* Hat Dialogue / Ceremony Trigger */}
        <div className="p-5 sm:p-6 space-y-4">
          <div className="bg-slate-950/80 p-4 rounded-2xl border border-amber-400/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div>
              <p className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-0.5">
                The Sorting Hat’s Proclamation
              </p>
              <p className="text-xs text-amber-100/90 italic">
                {sortingDialogue || '"There is nothing hidden in your head the Sorting Hat cannot see..."'}
              </p>
            </div>
            <button
              onClick={handleCeremony}
              disabled={isSorting}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-amber-600 hover:from-purple-500 hover:to-amber-500 text-white font-extrabold text-xs shadow-md transition-all shrink-0 flex items-center gap-1.5 active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>{isSorting ? 'Sorting...' : 'Put On Sorting Hat 🎩'}</span>
            </button>
          </div>

          {/* 4 Houses Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {houses.map((house) => {
              const isSelected = selectedHouse === house.id;
              return (
                <div
                  key={house.id}
                  onClick={() => handlePickHouse(house.id)}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden ${
                    isSelected
                      ? 'bg-amber-400/15 border-amber-300 shadow-lg shadow-amber-500/20 ring-2 ring-amber-400/40'
                      : 'bg-slate-950/50 border-white/10 hover:border-amber-400/40 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="text-3xl">{house.crest}</span>
                      <div>
                        <h4 className="font-extrabold text-white text-base">
                          {house.name}
                        </h4>
                        <span className="text-[10px] text-amber-300 font-mono">
                          {house.element} Element
                        </span>
                      </div>
                    </div>

                    {isSelected && (
                      <span className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-xs shadow-xs">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-300 mt-2 font-medium">
                    {house.trait}
                  </p>
                  <p className="text-[10px] text-amber-200/60 mt-1 italic line-clamp-1">
                    {house.motto}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-950 border-t border-amber-400/20 flex items-center justify-between">
          <span className="text-xs text-amber-200/80">
            Selected: <strong className="text-amber-300">{selectedHouse}</strong>
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                magicalAudio.stop();
                onClose();
              }}
              className="px-4 py-2 rounded-xl border border-white/20 text-slate-300 text-xs font-bold hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-extrabold text-xs shadow-md shadow-amber-500/20 transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
            >
              <span>Confirm House & Enter 🏰</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
