import React from 'react';
import {
  Sparkles,
  Zap,
  Target,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  TrendingUp,
  BrainCircuit,
  GraduationCap,
} from 'lucide-react';
import StatCard from '../components/StatCard';
import StrengthCard from '../components/StrengthCard';
import RecommendationCard from '../components/RecommendationCard';

export default function Dashboard({
  student,
  recommendation,
  onNavigate,
  onStartPractice,
  onStartLesson,
  onStartQuiz,
  onStartFresh,
  loading,
}) {
  const totalQuestions = recommendation?.total_questions ?? (student?.sessions_completed ?? 0);
  const xp = student?.xp ?? recommendation?.total_xp ?? 0;
  const isNewStudent = totalQuestions === 0 && xp === 0;
  const score = isNewStudent ? 0 : (recommendation?.score_percentage ?? (totalQuestions > 0 ? 100 : 0));
  const correctAnswers = isNewStudent ? 0 : (recommendation?.correct_answers ?? totalQuestions);
  const strengths = recommendation?.strengths ?? [];
  const weaknesses = recommendation?.weaknesses ?? [];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Hero Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-sky-600 to-indigo-800 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-blue-900/10 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute top-2 right-12 text-7xl opacity-20 select-none">
          🐍
        </div>

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Python Buddy AI Tutor</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Hello, {student?.name || 'Student'}! 👋
          </h1>
          <p className="text-blue-100 text-sm sm:text-base mt-2 leading-relaxed">
            Welcome to your personalized Python journey. Here is an adaptive breakdown of your current mastery and today's recommendations.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onStartQuiz ? onStartQuiz('All') : onNavigate('quiz')}
              className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-900 font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-2"
            >
              <BrainCircuit className="w-4 h-4 text-slate-900" />
              <span>{isNewStudent ? 'Start First Quiz' : 'Take a Quiz'}</span>
            </button>

            <button
              onClick={() => onNavigate('tutor')}
              className="px-5 py-2.5 bg-white/15 hover:bg-white/25 text-white font-bold text-xs sm:text-sm rounded-xl backdrop-blur-xs transition-all flex items-center gap-2"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Ask Python Buddy</span>
            </button>
          </div>
        </div>
      </div>

      {/* TODAY'S PERFORMANCE / KEY METRICS */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
          <div>
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-500">
              Today's Performance
            </h2>
            <p className="text-xl font-extrabold text-slate-900">
              Learning Metrics & Mastery
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
              Student #{student?.id || 1} • {student?.name || 'Student'} • {student?.level || 'Beginner'}
            </span>
          </div>
        </div>

        {/* New student onboarding callout */}
        {isNewStudent && (
          <div className="mb-4 p-4 rounded-2xl bg-sky-50 border border-sky-200 text-sky-900 text-xs sm:text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">🎯</span>
              <div>
                <p className="font-bold text-slate-900">
                  Welcome to Python Buddy! Your starting score is 0%.
                </p>
                <p className="text-xs text-sky-800">
                  Answer your first quiz question to start tracking accuracy, earn XP, and unlock tailored AI recommendations.
                </p>
              </div>
            </div>
            <button
              onClick={() => onStartQuiz ? onStartQuiz('All') : onNavigate('quiz')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shrink-0 shadow-xs transition-colors self-start sm:self-auto"
            >
              Take First Quiz
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Quiz Score"
            value={isNewStudent ? '0%' : `${score}%`}
            subtitle={
              isNewStudent
                ? 'No quizzes taken yet'
                : `${correctAnswers} of ${totalQuestions} correct`
            }
            icon={Target}
            color="blue"
            badge={isNewStudent ? 'New Learner' : score >= 70 ? 'On Track' : 'Needs Review'}
          />

          <StatCard
            title="Total XP"
            value={xp}
            subtitle={xp === 0 ? 'Solve quizzes to earn XP' : 'Earned from lessons & quizzes'}
            icon={Zap}
            color="amber"
            badge={xp === 0 ? 'Tier 1' : `+${totalQuestions * 25} Potential`}
          />

          <StatCard
            title="Questions Solved"
            value={totalQuestions}
            subtitle={totalQuestions === 0 ? '0 quizzes completed' : `${correctAnswers} of ${totalQuestions} correct`}
            icon={CheckCircle2}
            color="emerald"
          />

          <StatCard
            title="Current Level"
            value={student?.level || 'Beginner'}
            subtitle={`Difficulty: ${student?.difficulty || 'Easy'}`}
            icon={TrendingUp}
            color="purple"
          />
        </div>
      </div>

      {/* ADAPTIVE STRENGTHS & NEEDS PRACTICE */}
      <div className="grid md:grid-cols-2 gap-6">
        <StrengthCard
          type="strength"
          items={strengths}
          onTopicAction={(topic) => {
            onStartPractice && onStartPractice(topic, 'Review');
          }}
        />

        <StrengthCard
          type="weakness"
          items={weaknesses}
          onTopicAction={(topic) => {
            onStartPractice && onStartPractice(topic, 'Practice');
          }}
        />
      </div>

      {/* PERSONALIZED RECOMMENDATION & NEXT LESSON (Very Important) */}
      <div>
        <div className="mb-4">
          <span className="text-xs font-extrabold uppercase tracking-widest text-amber-700 bg-amber-100 px-2.5 py-1 rounded-md">
            Personalized Learning Engine
          </span>
          <h2 className="text-xl font-extrabold text-slate-900 mt-1">
            Tailored Path for {student?.name || 'You'}
          </h2>
        </div>

        <RecommendationCard
          student={student}
          recommendation={recommendation}
          nextLesson={recommendation?.next_lesson}
          strengths={strengths}
          weaknesses={weaknesses}
          onStartQuiz={onStartQuiz}
          onStartLesson={onStartLesson}
          onStartPractice={onStartPractice}
          onNavigate={onNavigate}
        />
      </div>
    </div>
  );
}
