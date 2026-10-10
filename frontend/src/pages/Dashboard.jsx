import React, { useState, useEffect } from 'react';
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
  Wand2,
  Volume2,
  Scroll,
  Trophy,
  ShieldAlert,
  Flame,
} from 'lucide-react';
import StatCard from '../components/StatCard';
import StrengthCard from '../components/StrengthCard';
import RecommendationCard from '../components/RecommendationCard';
import HouseSortingModal from '../components/HouseSortingModal';
import HouseCupScoreboard from '../components/HouseCupScoreboard';
import OwlPostDailyChallenge from '../components/OwlPostDailyChallenge';
import DarkMagicDefenseModal from '../components/DarkMagicDefenseModal';
import PotionsCauldron from '../components/PotionsCauldron';
import magicalAudio from '../services/magicalAudio';
import {
  getMagicalWelcomeDialogue,
  getMagicalSnapeDialogue,
  WIZARD_CHARACTERS,
} from '../data/magicalCharacters';
import { getWizardRank, HOGWARTS_HOUSES } from '../data/hogwartsLore';

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
  const [speakingChar, setSpeakingChar] = useState(null);
  const [isSortingOpen, setIsSortingOpen] = useState(false);
  const [isDefenseOpen, setIsDefenseOpen] = useState(false);
  const [isCauldronOpen, setIsCauldronOpen] = useState(false);
  const [bonusHousePoints, setBonusHousePoints] = useState(0);

  const [currentHouse, setCurrentHouse] = useState(() => {
    return student?.house || localStorage.getItem(`python_wizard_house_${student?.id || 1}`) || 'Gryffindor';
  });

  useEffect(() => {
    if (student?.house) {
      setCurrentHouse(student.house);
    }
  }, [student?.house]);

  const handleSelectHouse = (houseId) => {
    setCurrentHouse(houseId);
    try {
      localStorage.setItem(`python_wizard_house_${student?.id || 1}`, houseId);
    } catch {}
  };

  const handleAwardHousePoints = (pts) => {
    setBonusHousePoints((prev) => prev + pts);
  };

  const totalQuestions = recommendation?.total_questions ?? (student?.sessions_completed ?? 0);
  const baseStudentXp = student?.xp ?? recommendation?.total_xp ?? 0;
  const xp = baseStudentXp + bonusHousePoints;
  const isNewStudent = totalQuestions === 0 && xp === 0;
  const score = isNewStudent ? 0 : (recommendation?.score_percentage ?? (totalQuestions > 0 ? 100 : 0));
  const correctAnswers = isNewStudent ? 0 : (recommendation?.correct_answers ?? totalQuestions);
  const strengths = recommendation?.strengths ?? [];
  const weaknesses = recommendation?.weaknesses ?? [];
  const wizardRank = getWizardRank(xp);
  const houseObj = HOGWARTS_HOUSES[currentHouse] || HOGWARTS_HOUSES.Gryffindor;

  // Voice narration triggers
  const handleHearPythondore = () => {
    const text = getMagicalWelcomeDialogue(student?.name, xp, wizardRank.name);
    magicalAudio.playSpell('lumos');
    setSpeakingChar('pythondore');
    magicalAudio.speak(text, 'pythondore', () => setSpeakingChar(null));
  };

  const handleHearSnape = () => {
    const text = getMagicalSnapeDialogue(strengths, weaknesses, score);
    magicalAudio.playSpell('potion');
    setSpeakingChar('snape');
    magicalAudio.speak(text, 'snape', () => setSpeakingChar(null));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Hogwarts Great Hall Hero Welcome Banner */}
      <div className="sparkle-card bg-gradient-to-r from-amber-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-amber-100 shadow-xl shadow-amber-950/20 border-2 border-amber-400/40 relative overflow-hidden">
        {/* Background decorative magical runes */}
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-3 right-10 text-7xl opacity-20 select-none animate-pulse">
          🏰
        </div>

        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <div className="inline-flex items-center gap-2 bg-amber-400/20 border border-amber-400/40 px-3 py-1 rounded-full text-xs font-extrabold tracking-wide uppercase text-amber-300 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
              <span>Hogwarts School of Pythoncraft</span>
            </div>

            {/* House Badge with Quick Sort Trigger */}
            <button
              onClick={() => setIsSortingOpen(true)}
              className="px-3 py-1 rounded-full text-xs font-extrabold bg-amber-400 text-slate-950 flex items-center gap-1.5 shadow-xs hover:bg-amber-300 transition-all cursor-pointer border border-amber-300"
              title="Click to change your Hogwarts House"
            >
              <span className="text-sm">{houseObj.crest}</span>
              <span>House {houseObj.name}</span>
              <span className="text-[10px] bg-slate-950/20 px-1 rounded font-mono">Sort 🎩</span>
            </button>

            {/* Wizard Rank Badge */}
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white flex items-center gap-1.5 border border-white/10">
              <span>{wizardRank.icon}</span>
              <span>{wizardRank.name}</span>
              <span className="text-[10px] bg-amber-400/30 text-amber-200 px-1.5 py-0.2 rounded font-extrabold">
                {wizardRank.badge}
              </span>
            </span>
          </div>

          <div className="flex items-start gap-3 sm:gap-4 mb-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-600 border-2 border-amber-300 p-0.5 shadow-lg shadow-amber-500/30 flex items-center justify-center text-3xl shrink-0">
              🧙‍♂️
            </div>
            <div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center gap-2">
                <span>Greetings, {student?.name || 'Young Sorcerer'}!</span>
                <span className="text-2xl">🪄</span>
              </h1>
              <p className="text-amber-200/80 text-xs sm:text-sm mt-1 leading-relaxed">
                Welcome to your magical Python sanctuary. Headmaster Pythondore and the Hogwarts faculty have aligned today's celestial recommendations.
              </p>
            </div>
          </div>

          {/* Action and Voice Buttons */}
          <div className="mt-6 flex flex-wrap items-center gap-2.5">
            {/* Pythondore Voice Button */}
            <button
              onClick={handleHearPythondore}
              className={`px-4 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 active:scale-95 cursor-pointer border ${
                speakingChar === 'pythondore'
                  ? 'bg-amber-400 text-slate-950 border-amber-300 ring-2 ring-amber-300/50 animate-pulse'
                  : 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 border-amber-300'
              }`}
              title="Listen to Headmaster Pythondore's welcoming speech"
            >
              <Volume2 className="w-4 h-4 text-slate-950" />
              <span>{speakingChar === 'pythondore' ? 'Pythondore Speaking...' : 'Hear Pythondore Welcome You 🪄'}</span>
            </button>

            {/* Choose House Button */}
            <button
              onClick={() => setIsSortingOpen(true)}
              className="px-3.5 py-2.5 bg-purple-900/80 hover:bg-purple-800 text-amber-200 font-extrabold text-xs sm:text-sm rounded-xl border border-purple-400/40 shadow-xs transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
              <span>🎩 Choose House</span>
            </button>

            {/* Potions Cauldron Button */}
            <button
              onClick={() => setIsCauldronOpen(true)}
              className="px-3.5 py-2.5 bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 font-extrabold text-xs sm:text-sm rounded-xl border border-emerald-400/40 shadow-xs transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
              <span>⚗️ Brew Potions</span>
            </button>

            {/* Dark Magic Defense Button */}
            <button
              onClick={() => setIsDefenseOpen(true)}
              className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-extrabold text-xs sm:text-sm rounded-xl border border-slate-600 shadow-xs transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
              <span>🛡️ Dark Magic Defense</span>
            </button>

            <button
              onClick={() => onStartQuiz ? onStartQuiz('All') : onNavigate('quiz')}
              className="px-3.5 py-2.5 bg-indigo-600/80 hover:bg-indigo-600 text-white font-bold text-xs sm:text-sm rounded-xl border border-indigo-400/40 shadow-xs transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <BrainCircuit className="w-4 h-4" />
              <span>{isNewStudent ? 'Sorting Hat Quiz' : 'Consult Quiz'}</span>
            </button>

            <button
              onClick={() => onNavigate('tutor')}
              className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-amber-200 font-bold text-xs sm:text-sm rounded-xl border border-white/10 backdrop-blur-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <Scroll className="w-4 h-4 text-amber-300" />
              <span>AI Professor Tutor</span>
            </button>
          </div>
        </div>
      </div>

      {/* TODAY'S PERFORMANCE / WIZARD SKILL PROFILE */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
          <div>
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-amber-600 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Wizard Skill Profile</span>
            </h2>
            <p className="text-xl font-extrabold text-slate-900">
              Incantation Mastery & House Points
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-amber-900 bg-amber-100 px-3 py-1 rounded-full border border-amber-200">
              {houseObj.crest} House {houseObj.name} • {wizardRank.name}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Incantation Accuracy"
            value={isNewStudent ? '0%' : `${score}%`}
            subtitle={
              isNewStudent
                ? 'No quizzes taken yet'
                : `${correctAnswers} of ${totalQuestions} correct`
            }
            icon={Target}
            color="blue"
            badge={isNewStudent ? 'New Novice' : score >= 70 ? 'Master Charm' : 'Volatile Spell'}
          />

          <StatCard
            title="House Points"
            value={`${xp} pts`}
            subtitle={`Awarded to House ${houseObj.name}`}
            icon={Zap}
            color="amber"
            badge={`House ${houseObj.name}`}
          />

          <StatCard
            title="Spells Mastered"
            value={correctAnswers}
            subtitle={totalQuestions === 0 ? '0 spells completed' : `${correctAnswers} of ${totalQuestions} cast`}
            icon={CheckCircle2}
            color="emerald"
          />

          <StatCard
            title="Wizard Rank"
            value={wizardRank.name}
            subtitle={`${wizardRank.title} • ${wizardRank.badge}`}
            icon={TrendingUp}
            color="purple"
            badge={wizardRank.badge}
          />
        </div>
      </div>

      {/* OWL POST & HOUSE CUP SCOREBOARD */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <OwlPostDailyChallenge
          student={student}
          onAwardPoints={handleAwardHousePoints}
        />

        <HouseCupScoreboard
          student={{ ...student, house: currentHouse, xp }}
          onOpenSorting={() => setIsSortingOpen(true)}
        />
      </div>

      {/* ADAPTIVE STRENGTHS & NEEDS PRACTICE WITH PROFESSOR SNAPE */}
      <div className="space-y-4">
        <div className="sparkle-card bg-gradient-to-r from-emerald-950/90 via-slate-900 to-teal-950 p-4 sm:p-5 rounded-2xl border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-900/60 border border-emerald-400/40 flex items-center justify-center text-2xl shadow-xs">
              🧪
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-emerald-300 text-sm sm:text-base">
                  Potions Dungeon & Charms Inspection
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  Prof. Severus Code
                </span>
              </div>
              <p className="text-xs text-emerald-200/70 mt-0.5">
                Strict evaluation of master charms (≥ 70% accuracy) and volatile spells requiring potion practice.
              </p>
            </div>
          </div>

          <button
            onClick={handleHearSnape}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold shadow-sm transition-all flex items-center gap-2 shrink-0 cursor-pointer border ${
              speakingChar === 'snape'
                ? 'bg-emerald-400 text-slate-950 border-emerald-300 ring-2 ring-emerald-300/50 animate-pulse'
                : 'bg-emerald-700/80 hover:bg-emerald-600 text-white border-emerald-500/40 hover:border-emerald-400'
            }`}
            title="Listen to Professor Snape analyze your strengths & weaknesses"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>{speakingChar === 'snape' ? 'Snape Speaking...' : 'Hear Snape Critique Potion Charms 🧪'}</span>
          </button>
        </div>

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

      {/* HOGWARTS MODALS */}
      <HouseSortingModal
        isOpen={isSortingOpen}
        onClose={() => setIsSortingOpen(false)}
        currentHouse={currentHouse}
        onSelectHouse={handleSelectHouse}
      />

      <PotionsCauldron
        isOpen={isCauldronOpen}
        onClose={() => setIsCauldronOpen(false)}
        onAwardPoints={handleAwardHousePoints}
      />

      <DarkMagicDefenseModal
        isOpen={isDefenseOpen}
        onClose={() => setIsDefenseOpen(false)}
      />
    </div>
  );
}
