import React from 'react';
import {
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Target,
  Award,
  Layers,
  ArrowRight,
  ArrowLeft,
  TrendingUp,
  LayoutDashboard,
} from 'lucide-react';
import StatCard from '../components/StatCard';

export default function ProgressPage({
  student,
  recommendation,
  onNavigate,
  onStartPractice,
  onStartQuiz,
}) {
  const isNewStudent = (recommendation?.total_questions ?? 0) === 0;
  const score = isNewStudent ? 0 : (recommendation?.score_percentage ?? 0);
  const totalQuestions = isNewStudent ? 0 : (recommendation?.total_questions ?? 0);
  const correctAnswers = isNewStudent ? 0 : (recommendation?.correct_answers ?? 0);
  const incorrectAnswers = totalQuestions - correctAnswers;
  const totalXp = isNewStudent ? 0 : (student?.xp ?? recommendation?.total_xp ?? 0);
  const strengths = recommendation?.strengths ?? [];
  const weaknesses = recommendation?.weaknesses ?? [];

  // Calculate Next Level progress based on XP (e.g. 100 XP per level milestone)
  const xpCurrentLevel = totalXp % 100;
  const xpNeeded = 100 - xpCurrentLevel;
  const levelNumber = Math.floor(totalXp / 100) + 1;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 mb-2">
            <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
            <span>Academic Performance Tracker</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Learning Progress & Analytics
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Real-time analytics for{' '}
            <span className="font-bold text-slate-800">
              {student?.name || 'Student'} (ID #{student?.id})
            </span>{' '}
            queried directly from backend database.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {onNavigate && (
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 text-xs sm:text-sm font-bold rounded-xl border border-slate-200 transition-all flex items-center gap-2 group"
              title="Return to Student Dashboard"
            >
              <ArrowLeft className="w-4 h-4 text-slate-500 group-hover:-translate-x-0.5 transition-transform" />
              <span>Back to Dashboard</span>
            </button>
          )}

          <button
            onClick={() => onStartQuiz ? onStartQuiz('All') : onNavigate('quiz')}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-blue-500/25 transition-all flex items-center gap-2"
          >
            <span>Take More Quizzes</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Overall Accuracy"
          value={`${score}%`}
          subtitle={`${correctAnswers} / ${totalQuestions} Questions Correct`}
          icon={Target}
          color="blue"
          badge={score >= 70 ? 'Proficient' : 'In Progress'}
        />

        <StatCard
          title="Total Questions"
          value={totalQuestions}
          subtitle={`${incorrectAnswers} need review`}
          icon={Layers}
          color="purple"
        />

        <StatCard
          title="Correct Answers"
          value={correctAnswers}
          subtitle={`+${correctAnswers * 25} XP gained`}
          icon={CheckCircle2}
          color="emerald"
        />

        <StatCard
          title="Total XP Earned"
          value={totalXp}
          subtitle={`Rank Tier: ${student?.level || 'Beginner'}`}
          icon={Zap}
          color="amber"
        />
      </div>

      {/* Level Milestone Progress & Accuracy Bar */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Level Progression Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    Level Milestone: Tier {levelNumber}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Difficulty preset: {student?.difficulty || 'Easy'}
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                {totalXp} Total XP
              </span>
            </div>

            <p className="text-xs text-slate-600 mb-2 font-medium">
              Progress to next level milestone:
            </p>
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200 mb-2">
              <div
                className="bg-gradient-to-r from-amber-400 to-amber-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(5, xpCurrentLevel))}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-500 font-semibold">
              <span>{xpCurrentLevel} XP</span>
              <span>{xpNeeded} XP to next level</span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
            <span>Student Registered:</span>
            <span className="font-medium text-slate-700">
              {student?.created_at ? new Date(student.created_at).toLocaleDateString() : 'Active'}
            </span>
          </div>
        </div>

        {/* Overall Accuracy Breakdown */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    Quiz Accuracy Breakdown
                  </h3>
                  <p className="text-xs text-slate-500">
                    Calculated from all evaluated quiz sessions
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                {score}% Score
              </span>
            </div>

            <p className="text-xs text-slate-600 mb-2 font-medium">
              Ratio of Correct ({correctAnswers}) vs Incorrect ({incorrectAnswers}):
            </p>
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200 flex mb-2">
              <div
                className="bg-emerald-500 h-full transition-all duration-500"
                style={{
                  width: totalQuestions > 0 ? `${(correctAnswers / totalQuestions) * 100}%` : '0%',
                }}
                title={`Correct: ${correctAnswers}`}
              />
              <div
                className="bg-rose-400 h-full transition-all duration-500"
                style={{
                  width: totalQuestions > 0 ? `${(incorrectAnswers / totalQuestions) * 100}%` : '0%',
                }}
                title={`Incorrect: ${incorrectAnswers}`}
              />
            </div>
            <div className="flex justify-between text-[11px] font-semibold">
              <span className="text-emerald-700">✓ {correctAnswers} Correct</span>
              <span className="text-rose-600">✕ {incorrectAnswers} Incorrect</span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
            <span>Accuracy Threshold:</span>
            <span className="font-medium text-slate-700">70% for Mastery</span>
          </div>
        </div>
      </div>

      {/* Strengths & Weaknesses Detail */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Strengths Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">💪</span>
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg">
                Identified Strengths ({strengths.length})
              </h3>
              <p className="text-xs text-slate-500">
                Topics where your accuracy is at or above 70%
              </p>
            </div>
          </div>

          {strengths.length > 0 ? (
            <div className="space-y-3">
              {strengths.map((item, index) => (
                <div
                  key={index}
                  className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div>
                      <p className="text-sm font-extrabold text-emerald-950">
                        {item}
                      </p>
                      <p className="text-[11px] text-emerald-700">
                        Mastery achieved (≥ 70%)
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900">
                    Mastered
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <p className="text-xs text-slate-500">
                No strength topics yet. Score 70% or higher in a quiz topic to add it here.
              </p>
            </div>
          )}
        </div>

        {/* Needs Practice Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">📚</span>
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg">
                Needs Practice ({weaknesses.length})
              </h3>
              <p className="text-xs text-slate-500">
                Topics requiring reinforcement (&lt; 70% accuracy)
              </p>
            </div>
          </div>

          {weaknesses.length > 0 ? (
            <div className="space-y-3">
              {weaknesses.map((item, index) => (
                <div
                  key={index}
                  className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                    <div>
                      <p className="text-sm font-extrabold text-amber-950">
                        {item}
                      </p>
                      <p className="text-[11px] text-amber-700">
                        Needs reinforcement (&lt; 70%)
                      </p>
                    </div>
                  </div>
                  {onStartPractice && (
                    <button
                      onClick={() => onStartPractice(item, 'Practice')}
                      className="text-xs font-bold px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition-colors"
                    >
                      Practice
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <p className="text-xs text-slate-500">
                {totalQuestions === 0
                  ? 'Take your first quiz to identify any areas needing practice!'
                  : 'Zero weakness topics detected! Outstanding work.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
