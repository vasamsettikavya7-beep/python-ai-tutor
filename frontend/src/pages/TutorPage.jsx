import React from 'react';
import Tutor from '../components/Tutor';
import { Bot, Lightbulb, BookOpen, Sparkles, ArrowLeft } from 'lucide-react';

export default function TutorPage({
  student,
  initialTopic,
  initialMode,
  onNavigate,
}) {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Tutor Page Header */}
      <div className="bg-gradient-to-r from-blue-700 via-sky-600 to-indigo-700 text-white rounded-3xl p-6 sm:p-7 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            {onNavigate && (
              <button
                onClick={() => onNavigate('dashboard')}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-all border border-white/25 shadow-2xs group"
                title="Return to Dashboard"
              >
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                <span>Dashboard</span>
              </button>
            )}
            <span className="text-xs font-bold uppercase tracking-wider bg-white/20 text-white px-2.5 py-1 rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-300" />
              AI Learning Companion
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Learn with Python Buddy
          </h1>
          <p className="text-blue-100 text-xs sm:text-sm mt-1 max-w-xl">
            Ask any Python question or clear doubts in real time. Python Buddy adjusts explanations specifically for{' '}
            <span className="font-bold underline decoration-amber-300 underline-offset-2">
              {student?.level || 'Beginner'}
            </span>{' '}
            level learners.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-black/15 p-3 rounded-2xl border border-white/10 shrink-0 text-xs">
          <BookOpen className="w-5 h-5 text-amber-300" />
          <div>
            <p className="font-bold text-white">Modes Available</p>
            <p className="text-[11px] text-blue-100">
              Tutor • Learn • Practice
            </p>
          </div>
        </div>
      </div>

      {/* Tutor Component */}
      <Tutor
        student={student}
        initialTopic={initialTopic || 'Variables'}
        initialMode={initialMode || 'Tutor'}
      />
    </div>
  );
}
