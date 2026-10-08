import React from 'react';
import { Lightbulb, Rocket, ArrowRight, Sparkles, BookOpen, Clock } from 'lucide-react';

export default function RecommendationCard({
  recommendation,
  nextLesson,
  onStartPractice,
  onStartLesson,
}) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Personalized Recommendation Card */}
      <div className="bg-gradient-to-br from-amber-500/10 via-amber-50/50 to-orange-500/5 rounded-3xl border-2 border-amber-200/90 p-6 sm:p-7 shadow-sm flex flex-col justify-between relative overflow-hidden">
        {/* Decorative corner glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-700 shadow-xs">
                <Lightbulb className="w-5 h-5 fill-amber-300 text-amber-600" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg">
                  Personalized Recommendation
                </h3>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Adaptive AI Advice
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-xs rounded-2xl p-4 sm:p-5 border border-amber-200/80 shadow-xs mb-5">
            <p className="text-slate-800 text-sm sm:text-base leading-relaxed font-semibold">
              {recommendation || 'Take a quick quiz to receive personalized AI recommendations.'}
            </p>
            <div className="mt-3 flex items-center gap-2 text-xs text-amber-800 font-medium">
              <Clock className="w-3.5 h-3.5" />
              <span>Recommended daily practice: 10–15 mins</span>
            </div>
          </div>
        </div>

        <div>
          <button
            onClick={onStartPractice}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-sm shadow-md shadow-amber-500/25 hover:shadow-lg transition-all active:scale-[0.98]"
          >
            <span>Start Practice</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Next Lesson Card */}
      <div className="bg-gradient-to-br from-blue-600/10 via-sky-50/50 to-indigo-500/5 rounded-3xl border-2 border-blue-200/90 p-6 sm:p-7 shadow-sm flex flex-col justify-between relative overflow-hidden">
        {/* Decorative corner glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/10 rounded-full blur-2xl pointer-events-none" />

        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 shadow-xs">
                <Rocket className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg">
                  Next Lesson
                </h3>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 flex items-center gap-1">
                  <BookOpen className="w-3 h-3" /> Recommended Curriculum
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-xs rounded-2xl p-4 sm:p-5 border border-blue-200/80 shadow-xs mb-5">
            <p className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">
              Curriculum Milestone
            </p>
            <p className="text-slate-900 text-lg sm:text-xl font-extrabold tracking-tight">
              {nextLesson || 'Variables'}
            </p>
            <p className="text-xs text-slate-500 mt-2 font-medium">
              Continue your sequential Python mastery path tailored to your recent progress.
            </p>
          </div>
        </div>

        <div>
          <button
            onClick={onStartLesson}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm shadow-md shadow-blue-500/25 hover:shadow-lg transition-all active:scale-[0.98]"
          >
            <span>Start Lesson</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
