import React from 'react';
import { Trophy, Sparkles, TrendingUp, Award } from 'lucide-react';
import { HOGWARTS_HOUSES } from '../data/hogwartsLore';

export default function HouseCupScoreboard({ student, onOpenSorting }) {
  const studentHouse = student?.house || 'Gryffindor';
  const studentXp = student?.xp || 0;

  // Calculate live house cup points including student's earned XP
  const housesWithScores = Object.values(HOGWARTS_HOUSES).map((h) => {
    const isStudentHouse = h.id === studentHouse;
    const points = h.basePoints + (isStudentHouse ? studentXp : 0);
    return { ...h, points, isStudentHouse };
  }).sort((a, b) => b.points - a.points);

  const maxPoints = Math.max(...housesWithScores.map((h) => h.points), 300);

  return (
    <div className="sparkle-card bg-slate-900 border border-amber-400/40 rounded-3xl p-5 sm:p-6 text-amber-100 shadow-lg relative overflow-hidden">
      {/* Background magical glow */}
      <div className="absolute -top-16 -right-16 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-3 border-b border-amber-400/20">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-600 text-slate-950 flex items-center justify-center text-2xl shadow-md border border-amber-300">
            🏆
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-400/30">
                The Hogwarts House Cup 🏆
              </span>
              <span className="text-[10px] font-bold text-amber-200/70">
                Live Standings
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-extrabold text-white mt-0.5">
              House Cup Standings & Points
            </h3>
          </div>
        </div>

        <button
          onClick={onOpenSorting}
          className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-amber-300 border border-amber-400/30 text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
          title="Change or re-sort your Hogwarts House"
        >
          <span>Change House ({studentHouse})</span>
          <span>🪄</span>
        </button>
      </div>

      {/* Standings Grid / Bars */}
      <div className="space-y-3">
        {housesWithScores.map((house, idx) => {
          const percent = Math.min(100, Math.round((house.points / maxPoints) * 100));
          return (
            <div
              key={house.id}
              className={`p-3 rounded-2xl border transition-all ${
                house.isStudentHouse
                  ? 'bg-amber-400/15 border-amber-400/70 shadow-md ring-1 ring-amber-400/30'
                  : 'bg-slate-950/60 border-white/5'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-amber-400 text-sm">
                    #{idx + 1}
                  </span>
                  <span className="text-lg">{house.crest}</span>
                  <span className="font-extrabold text-white">
                    {house.name}
                  </span>
                  {house.isStudentHouse && (
                    <span className="text-[10px] font-extrabold bg-amber-400 text-slate-950 px-2 py-0.2 rounded-full">
                      Your House
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {house.isStudentHouse && studentXp > 0 && (
                    <span className="text-[10px] text-emerald-400 font-bold">
                      +{studentXp} from you
                    </span>
                  )}
                  <span className="font-extrabold text-amber-300 text-sm">
                    {house.points} pts
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-white/10">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${house.colors.accent} transition-all duration-500`}
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
