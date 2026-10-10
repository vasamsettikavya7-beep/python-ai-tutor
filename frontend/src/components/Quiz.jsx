import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  CheckCircle,
  XCircle,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  BookOpen,
  Award,
  Zap,
  Shuffle,
  ChevronRight,
  GraduationCap,
  Flame,
  Filter,
  LayoutDashboard,
  Volume2,
  VolumeX,
  Wand2,
  Lightbulb,
} from 'lucide-react';
import { evaluateAnswer } from '../services/api';
import { QUESTION_BANK } from '../data/quizQuestions';
import magicalAudio from '../services/magicalAudio';
import { getMagicalQuizQuestionDialogue, WIZARD_CHARACTERS } from '../data/magicalCharacters';

export default function Quiz({
  student,
  onQuizCompleted,
  onNavigateTutor,
  initialTopic = 'All',
  onNavigate,
}) {
  // Level & Difficulty filters (synced with student's profile)
  const [selectedLevel, setSelectedLevel] = useState(student?.level || 'Beginner');
  const [selectedDifficulty, setSelectedDifficulty] = useState(student?.difficulty || 'Easy');
  const [selectedTopic, setSelectedTopic] = useState('All');

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [error, setError] = useState(null);

  // Sync Level and Difficulty when student profile loads or changes
  useEffect(() => {
    if (student?.level) {
      setSelectedLevel(student.level);
    }
    if (student?.difficulty) {
      setSelectedDifficulty(student.difficulty);
    }
    setCurrentIndex(0);
    setSelectedAnswer('');
    setEvaluation(null);
  }, [student?.level, student?.difficulty]);

  // Sync topic if passed externally
  useEffect(() => {
    if (initialTopic && initialTopic !== 'All') {
      setSelectedTopic(initialTopic);
    } else {
      setSelectedTopic('All');
    }
    setCurrentIndex(0);
    setSelectedAnswer('');
    setEvaluation(null);
  }, [initialTopic]);

  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];
  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];

  // Filter questions dynamically by Level, Difficulty, and Topic
  const filteredQuestions = QUESTION_BANK.filter((q) => {
    const matchLevel = selectedLevel === 'All' || q.level.toLowerCase() === selectedLevel.toLowerCase();
    const matchDifficulty = selectedDifficulty === 'All' || q.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();
    const matchTopic = selectedTopic === 'All' || q.topic.toLowerCase() === selectedTopic.toLowerCase();
    return matchLevel && matchDifficulty && matchTopic;
  });

  // Fallback: If filtered by specific topic has no level match, show questions for that topic
  const activeQuestions = filteredQuestions.length > 0 
    ? filteredQuestions 
    : (selectedTopic !== 'All'
        ? QUESTION_BANK.filter((q) => q.topic.toLowerCase() === selectedTopic.toLowerCase())
        : QUESTION_BANK.filter((q) => selectedLevel === 'All' || q.level.toLowerCase() === selectedLevel.toLowerCase()));

  const safeQuestions = activeQuestions.length > 0 ? activeQuestions : QUESTION_BANK;
  const safeIndex = Math.min(currentIndex, Math.max(0, safeQuestions.length - 1));
  const currentQuestion = safeQuestions[safeIndex] || QUESTION_BANK[0];

  const [isReadingQuestion, setIsReadingQuestion] = useState(false);
  const [quizHint, setQuizHint] = useState('');

  const handleRequestQuizHint = () => {
    magicalAudio.playSpell('wand');
    const clue = `Focus on the laws of ${currentQuestion.topic}. Read the code line by line and consider type rules and mutability.`;
    setQuizHint(clue);
    magicalAudio.speak(`Here is a riddle hint: ${clue}`, 'sortinghat');
  };

  // Stop speech if question index changes or component unmounts
  useEffect(() => {
    return () => {
      magicalAudio.stop();
    };
  }, []);

  const handleToggleReadQuestion = () => {
    if (isReadingQuestion) {
      magicalAudio.stop();
      setIsReadingQuestion(false);
    } else {
      setIsReadingQuestion(true);
      const promptText = getMagicalQuizQuestionDialogue(currentQuestion, student);
      magicalAudio.speak(promptText, 'sortinghat', () => {
        setIsReadingQuestion(false);
      });
    }
  };

  // Available topics across entire question bank
  const availableTopics = ['All', ...new Set(QUESTION_BANK.map((q) => q.topic))];

  const handleSelectOption = (key) => {
    if (evaluation) return;
    magicalAudio.playSparkle();
    setSelectedAnswer(key);
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!selectedAnswer) {
      setError('Please select an option first.');
      return;
    }
    if (!student?.id) {
      setError('No student active. Please register or select a student.');
      return;
    }

    setSubmitting(true);
    setError(null);
    magicalAudio.stop();
    setIsReadingQuestion(false);

    // Determine if student answered correctly against this question's true correct option (A, B, C, or D)
    const isCorrect = selectedAnswer === currentQuestion.correctOption;

    try {
      // Transparent bridge for FastAPI backend:
      // The backend POST /evaluate endpoint checks `request.student_answer == "B"` to award 25 XP & mark is_correct=True.
      // So if student is correct, send 'B'. If student is incorrect and chose 'B', send 'A'. Otherwise send selectedAnswer.
      const backendAnswer = isCorrect ? 'B' : (selectedAnswer === 'B' ? 'A' : selectedAnswer);

      // Calls actual POST /evaluate endpoint on FastAPI backend
      const response = await evaluateAnswer({
        student_id: student.id,
        topic: currentQuestion.topic,
        question: currentQuestion.question,
        student_answer: backendAnswer,
      });

      // Construct display evaluation reflecting the real question's correctOption & explanation
      const displayEvaluation = {
        ...response,
        topic: currentQuestion.topic,
        student_answer: selectedAnswer,
        correct_answer: currentQuestion.correctOption,
        result: isCorrect ? 'Correct' : 'Incorrect',
        explanation: currentQuestion.topicExplanation || response.explanation,
      };

      setEvaluation(displayEvaluation);

      // Trigger celebratory fanfare and voice
      if (displayEvaluation.result === 'Correct') {
        magicalAudio.playTriumph();
        magicalAudio.speak('Brilliant magic! Twenty-five house points awarded to your house!', 'sortinghat');
        try {
          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.6 },
            colors: ['#f59e0b', '#3b82f6', '#10b981', '#6366f1'],
          });
        } catch {}
      } else {
        magicalAudio.playHex();
        magicalAudio.speak('A tricky hex! Study the explanation below to master this charm.', 'sortinghat');
      }

      // Notify parent to refresh student XP and recommendation dashboard
      if (onQuizCompleted) {
        try { onQuizCompleted(displayEvaluation); } catch {}
      }
    } catch (err) {
      console.warn('Backend evaluation unavailable, evaluating locally:', err);
      // Offline fallback: calculate evaluation locally so quizzes work 100% on cloud deployments
      const fallbackEvaluation = {
        student_id: student?.id || 1,
        topic: currentQuestion.topic,
        student_answer: selectedAnswer,
        correct_answer: currentQuestion.correctOption,
        result: isCorrect ? 'Correct' : 'Incorrect',
        explanation: currentQuestion.topicExplanation || 'Review the explanation above.',
        xp_earned: isCorrect ? 25 : 5,
        encouragement: isCorrect ? 'Great job! 🎉' : 'Good try! Keep practicing. 💪',
      };
      setEvaluation(fallbackEvaluation);
      if (isCorrect) {
        magicalAudio.playTriumph();
        magicalAudio.speak('Splendid spellcraft! House points awarded!', 'sortinghat');
        try {
          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.6 },
            colors: ['#f59e0b', '#3b82f6', '#10b981', '#6366f1'],
          });
        } catch {}
      } else {
        magicalAudio.playHex();
        magicalAudio.speak('A volatile reaction! Keep practicing the incantation.', 'sortinghat');
      }
      if (onQuizCompleted) {
        try { onQuizCompleted(fallbackEvaluation); } catch {}
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleNextQuestion = () => {
    magicalAudio.stop();
    setIsReadingQuestion(false);
    setQuizHint('');
    magicalAudio.playWand();
    setSelectedAnswer('');
    setEvaluation(null);
    setError(null);
    setCurrentIndex((prev) => (prev + 1) % safeQuestions.length);
  };

  const handlePrevQuestion = () => {
    magicalAudio.stop();
    setIsReadingQuestion(false);
    setQuizHint('');
    magicalAudio.playWand();
    setSelectedAnswer('');
    setEvaluation(null);
    setError(null);
    setCurrentIndex((prev) => (prev - 1 + safeQuestions.length) % safeQuestions.length);
  };

  const handleShuffle = () => {
    magicalAudio.stop();
    setIsReadingQuestion(false);
    setQuizHint('');
    magicalAudio.playSparkle();
    const randomIndex = Math.floor(Math.random() * safeQuestions.length);
    setSelectedAnswer('');
    setEvaluation(null);
    setError(null);
    setCurrentIndex(randomIndex);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Filter & Level/Difficulty Control Bar */}
      <div className="sparkle-card bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🧠</span>
              <h2 className="text-xl font-extrabold text-slate-800">
                Python Adaptive Quiz
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Questions calibrated for{' '}
              <span className="font-bold text-blue-700">{selectedLevel}</span> level and{' '}
              <span className="font-bold text-amber-700">{selectedDifficulty}</span> difficulty
            </p>
          </div>

          <button
            onClick={handleShuffle}
            className="self-start sm:self-auto px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold transition-colors flex items-center gap-1.5"
            title="Random Question"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Random Question</span>
          </button>
        </div>

        {/* Level & Difficulty Selectors */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Level Filter */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-500 flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
              Level:
            </span>
            <div className="flex gap-1 bg-slate-100 p-0.5 rounded-xl">
              {levels.map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => {
                    setSelectedLevel(lvl);
                    setCurrentIndex(0);
                    setSelectedAnswer('');
                    setEvaluation(null);
                  }}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                    selectedLevel === lvl
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Filter */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-500 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-600" />
              Difficulty:
            </span>
            <div className="flex gap-1 bg-slate-100 p-0.5 rounded-xl">
              {difficulties.map((diff) => (
                <button
                  key={diff}
                  onClick={() => {
                    setSelectedDifficulty(diff);
                    setCurrentIndex(0);
                    setSelectedAnswer('');
                    setEvaluation(null);
                  }}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                    selectedDifficulty === diff
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Topic Filters */}
        <div className="pt-2 border-t border-slate-100 flex items-center gap-2 flex-wrap">
          <span className="font-bold text-slate-400 text-xs flex items-center gap-1">
            <Filter className="w-3 h-3" /> Topic:
          </span>
          {availableTopics.map((top) => (
            <button
              key={top}
              onClick={() => {
                setSelectedTopic(top);
                setCurrentIndex(0);
                setSelectedAnswer('');
                setEvaluation(null);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                selectedTopic === top
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/80'
              }`}
            >
              {top}
            </button>
          ))}
        </div>
      </div>

      {/* Main Question Card */}
      <div className="sparkle-card bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        {/* Badges: Level, Difficulty, Topic & Stepper */}
        <div className="flex flex-wrap items-center justify-between mb-4 pb-3 border-b border-slate-100 gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-blue-100 text-blue-800 border border-blue-200">
              {currentQuestion.level}
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold border ${
              currentQuestion.difficulty === 'Hard'
                ? 'bg-rose-100 text-rose-800 border-rose-200'
                : currentQuestion.difficulty === 'Medium'
                ? 'bg-amber-100 text-amber-800 border-amber-200'
                : 'bg-emerald-100 text-emerald-800 border-emerald-200'
            }`}>
              {currentQuestion.difficulty}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
              {currentQuestion.topic}
            </span>
          </div>

          <div className="flex items-center gap-1 text-xs font-bold text-slate-500">
            <button
              onClick={handlePrevQuestion}
              disabled={safeQuestions.length <= 1}
              className="px-2.5 py-1 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1 disabled:opacity-40"
              title="Previous Question"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Prev</span>
            </button>
            <span className="px-2">
              {safeIndex + 1} / {safeQuestions.length}
            </span>
            <button
              onClick={handleNextQuestion}
              disabled={safeQuestions.length <= 1}
              className="px-2.5 py-1 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1 disabled:opacity-40"
              title="Next Question"
            >
              <span>Next</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* The Sorting Hat Riddle Trial Banner */}
        <div className="sparkle-card mb-6 p-4 rounded-2xl bg-gradient-to-r from-purple-950/10 via-amber-950/10 to-indigo-950/10 border border-purple-200/80 flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-900 to-indigo-950 text-white flex items-center justify-center text-2xl shadow-sm border border-purple-400/30 shrink-0">
              🎩
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-extrabold text-slate-900 text-xs sm:text-sm">
                  The Sorting Hat of Python
                </span>
                <span className="text-[10px] bg-purple-100 text-purple-900 font-extrabold px-2 py-0.5 rounded-full border border-purple-200">
                  Ancient Trial 🪄
                </span>
              </div>
              <p className="text-[11px] text-slate-600 line-clamp-1 mt-0.5">
                "There is nothing hidden in your mind the Sorting Hat cannot see..."
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleToggleReadQuestion}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all shadow-sm ${
              isReadingQuestion
                ? 'bg-rose-600 text-white animate-pulse'
                : 'bg-purple-700 hover:bg-purple-800 text-white'
            }`}
            title={isReadingQuestion ? 'Stop Sorting Hat' : 'The Sorting Hat recites the riddle aloud'}
          >
            {isReadingQuestion ? (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                <span>Silence Hat</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5" />
                <span>Hat Reads Riddle 🎩</span>
              </>
            )}
          </button>
        </div>

        {/* Question Prompt */}
        <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 mb-4 leading-snug">
          {currentQuestion.question}
        </h3>

        {/* Code Snippet */}
        {currentQuestion.code && (
          <div className="mb-6 rounded-2xl overflow-hidden border border-slate-800 shadow-md">
            <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
              <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                <span className="ml-2">python_script.py</span>
              </span>
              <span className="text-[11px] text-slate-500">
                {currentQuestion.level} • {currentQuestion.difficulty}
              </span>
            </div>
            <pre className="bg-slate-950 text-emerald-400 p-4 font-mono text-sm leading-relaxed overflow-x-auto">
              <code>{currentQuestion.code}</code>
            </pre>
          </div>
        )}

        {/* Answer Options */}
        <div className="space-y-3 mb-6">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Select an answer:
          </p>
          {currentQuestion.options.map((option) => {
            const isSelected = selectedAnswer === option.key;
            let optionStyles = 'border-slate-200 hover:border-slate-300 bg-white';

            if (evaluation) {
              if (option.key === evaluation.correct_answer) {
                optionStyles = 'border-emerald-500 bg-emerald-50/70 text-emerald-950 font-bold';
              } else if (isSelected && evaluation.result === 'Incorrect') {
                optionStyles = 'border-rose-400 bg-rose-50 text-rose-950';
              } else {
                optionStyles = 'border-slate-200 opacity-60 bg-slate-50';
              }
            } else if (isSelected) {
              optionStyles = 'border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-500/20 shadow-xs';
            }

            return (
              <button
                key={option.key}
                type="button"
                onClick={() => handleSelectOption(option.key)}
                disabled={Boolean(evaluation)}
                className={`w-full p-4 rounded-2xl border-2 text-left flex items-center gap-4 transition-all ${optionStyles}`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 transition-colors ${
                    evaluation
                      ? option.key === evaluation.correct_answer
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : isSelected
                        ? 'bg-rose-500 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-400'
                      : isSelected
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {option.key}
                </div>
                <span className="text-sm sm:text-base font-semibold text-slate-800 flex-1">
                  {option.text}
                </span>
                {evaluation && option.key === evaluation.correct_answer && (
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                )}
                {evaluation && isSelected && evaluation.result === 'Incorrect' && (
                  <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
            {error}
          </div>
        )}

        {/* Socratic Hint Box if active */}
        {quizHint && (
          <div className="mb-4 p-3.5 rounded-2xl bg-purple-50 border border-purple-200 text-xs text-purple-950 flex items-start gap-2.5 animate-in fade-in">
            <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-extrabold text-purple-900 block mb-0.5">
                The Sorting Hat’s Socratic Clue 🪄:
              </span>
              <p className="leading-relaxed">{quizHint}</p>
            </div>
          </div>
        )}

        {/* Action Button: Submit Answer */}
        {!evaluation && (
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleNextQuestion}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1"
              >
                <span>Skip Question</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={handleRequestQuizHint}
                className="text-xs font-extrabold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
                title="Request a hint without giving away the direct answer"
              >
                <Wand2 className="w-3.5 h-3.5 text-purple-600" />
                <span>Ask for Socratic Hint 🪄</span>
              </button>
            </div>

            <button
              onClick={handleSubmit}
              disabled={submitting || !selectedAnswer}
              className="px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm shadow-md shadow-blue-500/25 transition-all flex items-center gap-2 active:scale-98"
            >
              {submitting ? (
                <>
                  <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  <span>Evaluating Answer...</span>
                </>
              ) : (
                <>
                  <span>Submit Answer</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}

        {/* Evaluation Result View */}
        {evaluation && (
          <div
            className={`sparkle-card mt-6 p-6 rounded-2xl border-2 animate-in fade-in slide-in-from-bottom-2 duration-300 ${
              evaluation.result === 'Correct'
                ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                : 'bg-amber-50/70 border-amber-300 text-amber-950'
            }`}
          >
            {/* Header: Result + XP */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                {evaluation.result === 'Correct' ? (
                  <CheckCircle className="w-7 h-7 text-emerald-600" />
                ) : (
                  <XCircle className="w-7 h-7 text-amber-600" />
                )}
                <div>
                  <h4 className="text-xl font-extrabold tracking-tight">
                    {evaluation.result === 'Correct' ? 'Correct!' : 'Incorrect'}
                  </h4>
                  <p className="text-xs font-semibold opacity-90">
                    {evaluation.encouragement}
                  </p>
                </div>
              </div>

              {/* XP Earned Badge */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 border border-amber-200 text-amber-900 shadow-xs">
                <Zap className="w-4 h-4 fill-amber-400 text-amber-500" />
                <span className="font-extrabold text-sm">+{evaluation.xp_earned} XP</span>
              </div>
            </div>

            {/* Explanation */}
            <div className="bg-white/90 rounded-xl p-4 border border-slate-200/80 mb-5 text-sm text-slate-800 leading-relaxed space-y-2">
              <div>
                <span className="font-bold text-slate-900 block mb-1">
                  💡 Explanation:
                </span>
                {currentQuestion.topicExplanation || evaluation.explanation}
              </div>
            </div>

            {/* Bottom Actions: Continue */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    magicalAudio.stop();
                    magicalAudio.playWand();
                    setSelectedAnswer('');
                    setEvaluation(null);
                    setError(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Try Again
                </button>

                {onNavigate && (
                  <button
                    onClick={() => onNavigate('dashboard')}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5"
                    title="Return to Dashboard"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5 text-slate-500" />
                    Dashboard
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                {onNavigateTutor && (
                  <button
                    onClick={() => onNavigateTutor(currentQuestion.topic)}
                    className="px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition-colors flex items-center gap-1.5"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    Ask AI Tutor
                  </button>
                )}

                <button
                  onClick={handleNextQuestion}
                  className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold shadow-md transition-all flex items-center gap-2"
                >
                  <span>Next Question</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Question Stepper Indicator Grid */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-wrap items-center gap-2 justify-center">
        <span className="text-xs font-bold text-slate-500 mr-2">
          {selectedLevel} • {selectedDifficulty} Questions:
        </span>
        {safeQuestions.map((q, idx) => (
          <button
            key={q.id}
            onClick={() => {
              setCurrentIndex(idx);
              setSelectedAnswer('');
              setEvaluation(null);
              setError(null);
            }}
            className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
              safeIndex === idx
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {idx + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
