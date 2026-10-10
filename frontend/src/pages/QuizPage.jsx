import React from 'react';
import Quiz from '../components/Quiz';
import { HelpCircle, Award, Sparkles, ArrowLeft } from 'lucide-react';

export default function QuizPage({
  student,
  onQuizCompleted,
  onNavigateTutor,
  initialTopic,
  onNavigate,
}) {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Info */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-7 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            {onNavigate && (
              <button
                onClick={() => onNavigate('dashboard')}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition-all border border-white/20 shadow-2xs group"
                title="Return to Dashboard"
              >
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                <span>Dashboard</span>
              </button>
            )}
            <span className="text-xs font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2.5 py-1 rounded-full">
              Interactive Quiz Challenge
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Interactive Python Knowledge Check
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl">
            Each answer is directly checked and evaluated by the Python Buddy backend. Earn XP, reinforce concepts, and shape your personalized learning path!
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-900 flex items-center justify-center font-bold text-lg shadow-xs">
            🏆
          </div>
          <div>
            <p className="text-[11px] text-slate-300 font-semibold uppercase tracking-wider">
              Earn Rewards
            </p>
            <p className="text-xs font-bold text-white">
              +25 XP per correct answer
            </p>
            <p className="text-[10px] text-amber-300">
              +5 XP for great attempts
            </p>
          </div>
        </div>
      </div>

      {/* Quiz Interface */}
      <Quiz
        student={student}
        onQuizCompleted={onQuizCompleted}
        onNavigateTutor={onNavigateTutor}
        initialTopic={initialTopic}
        onNavigate={onNavigate}
      />
    </div>
  );
}
