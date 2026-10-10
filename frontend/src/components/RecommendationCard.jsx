import React, { useState } from 'react';
import {
  Compass,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Zap,
  ArrowRight,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Filter,
  Check,
  Bot,
  Lock,
  Play,
  RotateCcw,
} from 'lucide-react';
import LessonModal from './LessonModal';

// Complete 34 sequential Python topics mapped to curriculum categories
export const CURRICULUM_TOPICS = [
  // 1. Core Fundamentals
  {
    topic: 'Variables',
    title: 'Variables & Assignment',
    category: 'Core Fundamentals',
    categoryIcon: '🌱',
    level: 'Beginner',
    difficulty: 'Easy',
    xpReward: 25,
    summary: 'Master dynamic typing, variable assignment, and PEP 8 naming conventions.',
  },
  {
    topic: 'Data Types',
    title: 'Data Types & Type Casting',
    category: 'Core Fundamentals',
    categoryIcon: '🌱',
    level: 'Beginner',
    difficulty: 'Easy',
    xpReward: 25,
    summary: 'Built-in numeric, boolean, and sequence types with explicit type conversions.',
  },
  {
    topic: 'Strings',
    title: 'String Operations & Formatting',
    category: 'Core Fundamentals',
    categoryIcon: '🌱',
    level: 'Beginner',
    difficulty: 'Easy',
    xpReward: 25,
    summary: 'String immutability, slicing, methods, and modern f-string interpolation.',
  },
  {
    topic: 'Operators',
    title: 'Operators & Expressions',
    category: 'Core Fundamentals',
    categoryIcon: '🌱',
    level: 'Beginner',
    difficulty: 'Easy',
    xpReward: 25,
    summary: 'Arithmetic, comparison, logical, identity (is), and membership (in) operators.',
  },
  {
    topic: 'Conditions',
    title: 'Conditional Branching (if / elif / else)',
    category: 'Core Fundamentals',
    categoryIcon: '🌱',
    level: 'Beginner',
    difficulty: 'Easy',
    xpReward: 25,
    summary: 'Execution flow control, truthy/falsy evaluation, and nested conditions.',
  },
  {
    topic: 'Loops',
    title: 'Loops (for & while)',
    category: 'Core Fundamentals',
    categoryIcon: '🌱',
    level: 'Beginner',
    difficulty: 'Easy',
    xpReward: 25,
    summary: 'Iteration with range(), break, continue, and the Python loop else clause.',
  },
  {
    topic: 'Functions',
    title: 'Functions & Return Values',
    category: 'Core Fundamentals',
    categoryIcon: '🌱',
    level: 'Beginner',
    difficulty: 'Easy',
    xpReward: 25,
    summary: 'Defining reusable functions with parameters, default arguments, and return values.',
  },
  {
    topic: 'Scope',
    title: 'Variable Scope & LEGB Rule',
    category: 'Core Fundamentals',
    categoryIcon: '🌱',
    level: 'Beginner',
    difficulty: 'Medium',
    xpReward: 30,
    summary: 'Understand Local, Enclosing, Global, and Built-in namespaces.',
  },

  // 2. Data Structures
  {
    topic: 'Lists',
    title: 'Lists: Dynamic Arrays',
    category: 'Data Structures',
    categoryIcon: '📦',
    level: 'Beginner',
    difficulty: 'Easy',
    xpReward: 25,
    summary: 'Mutable sequences, index lookup, slicing, sorting, and in-place mutations.',
  },
  {
    topic: 'Tuples',
    title: 'Tuples: Immutable Sequences',
    category: 'Data Structures',
    categoryIcon: '📦',
    level: 'Beginner',
    difficulty: 'Easy',
    xpReward: 25,
    summary: 'Immutable ordered collections, tuple packing, unpacking, and hashability.',
  },
  {
    topic: 'Dictionaries',
    title: 'Dictionaries: Key-Value Hash Maps',
    category: 'Data Structures',
    categoryIcon: '📦',
    level: 'Beginner',
    difficulty: 'Easy',
    xpReward: 25,
    summary: 'Fast hash map lookups, key-value iteration, and safe dict.get() defaults.',
  },
  {
    topic: 'Sets',
    title: 'Sets: Unique Collections',
    category: 'Data Structures',
    categoryIcon: '📦',
    level: 'Intermediate',
    difficulty: 'Medium',
    xpReward: 30,
    summary: 'Enforce uniqueness and execute high-speed mathematical set operations.',
  },
  {
    topic: 'List Comprehensions',
    title: 'List & Dict Comprehensions',
    category: 'Data Structures',
    categoryIcon: '📦',
    level: 'Intermediate',
    difficulty: 'Medium',
    xpReward: 30,
    summary: 'Expressive one-line mapping and filtering syntax for clean transformations.',
  },

  // 3. Intermediate Python
  {
    topic: 'Lambda Functions',
    title: 'Lambda Functions (Anonymous)',
    category: 'Intermediate Python',
    categoryIcon: '⚙️',
    level: 'Intermediate',
    difficulty: 'Medium',
    xpReward: 30,
    summary: 'Single-expression anonymous functions paired with map(), filter(), and sorted().',
  },
  {
    topic: 'Exception Handling',
    title: 'Exception Handling (try / except)',
    category: 'Intermediate Python',
    categoryIcon: '⚙️',
    level: 'Intermediate',
    difficulty: 'Medium',
    xpReward: 30,
    summary: 'Catch errors gracefully with try, except, else, and cleanup in finally blocks.',
  },
  {
    topic: 'File I/O',
    title: 'File Input & Output Operations',
    category: 'Intermediate Python',
    categoryIcon: '⚙️',
    level: 'Intermediate',
    difficulty: 'Medium',
    xpReward: 30,
    summary: 'Safely read and write text and binary files using context managers.',
  },
  {
    topic: 'Modules & Imports',
    title: 'Modules, Packages & __name__',
    category: 'Intermediate Python',
    categoryIcon: '⚙️',
    level: 'Intermediate',
    difficulty: 'Medium',
    xpReward: 30,
    summary: 'Package organization, namespace imports, and execution entry points.',
  },
  {
    topic: 'Closures',
    title: 'Closures & Lexical Scopes',
    category: 'Intermediate Python',
    categoryIcon: '⚙️',
    level: 'Intermediate',
    difficulty: 'Medium',
    xpReward: 35,
    summary: 'Nested functions retaining access to enclosing non-local variables.',
  },
  {
    topic: 'Built-in Functions',
    title: 'Core Python Built-in Utilities',
    category: 'Intermediate Python',
    categoryIcon: '⚙️',
    level: 'Intermediate',
    difficulty: 'Medium',
    xpReward: 30,
    summary: 'Maximize efficiency with zip(), enumerate(), any(), all(), and reversed().',
  },
  {
    topic: 'Functional Programming',
    title: 'Functional Patterns & Itertools',
    category: 'Intermediate Python',
    categoryIcon: '⚙️',
    level: 'Intermediate',
    difficulty: 'Medium',
    xpReward: 35,
    summary: 'Pure functions, lazy itertools streams, and functools (partial, reduce).',
  },
  {
    topic: 'Regular Expressions (Regex)',
    title: 'Regular Expressions (re module)',
    category: 'Intermediate Python',
    categoryIcon: '⚙️',
    level: 'Intermediate',
    difficulty: 'Medium',
    xpReward: 35,
    summary: 'Pattern search, extraction, and text replacement with the standard re library.',
  },

  // 4. Object-Oriented Programming
  {
    topic: 'OOP',
    title: 'OOP Foundations (4 Pillars)',
    category: 'OOP',
    categoryIcon: '🏛️',
    level: 'Intermediate',
    difficulty: 'Medium',
    xpReward: 35,
    summary: 'Encapsulation, abstraction, inheritance, and polymorphism explained.',
  },
  {
    topic: 'Classes & Objects',
    title: 'Classes, Instances & Methods',
    category: 'OOP',
    categoryIcon: '🏛️',
    level: 'Intermediate',
    difficulty: 'Medium',
    xpReward: 35,
    summary: 'Class blueprints, instance instantiation, self parameter, and class methods.',
  },
  {
    topic: 'Inheritance & Polymorphism',
    title: 'Inheritance, super() & MRO',
    category: 'OOP',
    categoryIcon: '🏛️',
    level: 'Advanced',
    difficulty: 'Hard',
    xpReward: 40,
    summary: 'Subclassing, method overriding, super() delegates, and method resolution order.',
  },
  {
    topic: 'OOP / Dunder Methods',
    title: 'Special / Dunder Methods',
    category: 'OOP',
    categoryIcon: '🏛️',
    level: 'Advanced',
    difficulty: 'Hard',
    xpReward: 40,
    summary: 'Overload operators, object representations (__repr__, __str__), and indexing.',
  },
  {
    topic: 'OOP / Optimization',
    title: 'OOP Optimization & __slots__',
    category: 'OOP',
    categoryIcon: '🏛️',
    level: 'Advanced',
    difficulty: 'Hard',
    xpReward: 40,
    summary: 'Eliminate instance __dict__ memory overhead and boost attribute speed with __slots__.',
  },

  // 5. Advanced Python
  {
    topic: 'Decorators',
    title: 'Decorators & Wrappers',
    category: 'Advanced Python',
    categoryIcon: '🚀',
    level: 'Advanced',
    difficulty: 'Hard',
    xpReward: 45,
    summary: 'Wrap functions dynamically to add logging, caching, authentication, or timing.',
  },
  {
    topic: 'Generators',
    title: 'Generators & yield Keyword',
    category: 'Advanced Python',
    categoryIcon: '🚀',
    level: 'Advanced',
    difficulty: 'Hard',
    xpReward: 45,
    summary: 'Memory-efficient lazy streaming iterators that yield values on demand.',
  },
  {
    topic: 'Context Managers',
    title: 'Context Managers & with Statement',
    category: 'Advanced Python',
    categoryIcon: '🚀',
    level: 'Advanced',
    difficulty: 'Hard',
    xpReward: 45,
    summary: 'Deterministic resource setup and teardown with __enter__, __exit__, and contextlib.',
  },
  {
    topic: 'Async / Await',
    title: 'Asynchronous Programming (asyncio)',
    category: 'Advanced Python',
    categoryIcon: '🚀',
    level: 'Advanced',
    difficulty: 'Hard',
    xpReward: 50,
    summary: 'Concurrent non-blocking event loops, coroutines, and task scheduling with asyncio.',
  },
  {
    topic: 'Concurrency',
    title: 'Concurrency: Threads vs Processes',
    category: 'Advanced Python',
    categoryIcon: '🚀',
    level: 'Advanced',
    difficulty: 'Hard',
    xpReward: 50,
    summary: 'Understand Python GIL, threading for I/O bounds, and multiprocessing for CPU bounds.',
  },
  {
    topic: 'Memory Management',
    title: 'Memory Management & Garbage Collector',
    category: 'Advanced Python',
    categoryIcon: '🚀',
    level: 'Advanced',
    difficulty: 'Hard',
    xpReward: 50,
    summary: 'Reference counting internals, generational garbage collection, and object memory.',
  },
  {
    topic: 'Metaclasses',
    title: 'Metaclasses: The Classes of Classes',
    category: 'Advanced Python',
    categoryIcon: '🚀',
    level: 'Advanced',
    difficulty: 'Hard',
    xpReward: 50,
    summary: 'Inspect how types create classes and intercept class construction with metaclasses.',
  },
  {
    topic: 'Standard Library',
    title: 'Python Standard Library Powerhouses',
    category: 'Advanced Python',
    categoryIcon: '🚀',
    level: 'Advanced',
    difficulty: 'Medium',
    xpReward: 40,
    summary: 'Built-in power tools: collections (deque, Counter), itertools, pathlib, and functools.',
  },
];

export default function RecommendationCard({
  student,
  recommendation,
  nextLesson,
  strengths = [],
  weaknesses = [],
  onStartQuiz,
  onStartLesson,
  onStartPractice,
  onNavigate,
}) {
  const [selectedLessonTopic, setSelectedLessonTopic] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [showAllLessons, setShowAllLessons] = useState(false);

  // Determine topic stats from recommendation or localStorage
  const topicBreakdown = recommendation?.topic_breakdown || (() => {
    if (!student?.id) return {};
    try {
      const cached = localStorage.getItem(`python_buddy_rec_${student.id}`);
      return cached ? (JSON.parse(cached).topic_breakdown || {}) : {};
    } catch {
      return {};
    }
  })();

  // 1. Compute Learned Topics from Quiz Attempts
  const learnedTopics = Object.keys(topicBreakdown).map((topicName) => {
    const stats = topicBreakdown[topicName];
    const curriculumItem = CURRICULUM_TOPICS.find(
      (c) => c.topic.toLowerCase() === topicName.toLowerCase()
    ) || {
      topic: topicName,
      title: topicName,
      category: 'Curriculum Topic',
      categoryIcon: '🐍',
      level: 'Learned',
      difficulty: 'Standard',
      xpReward: 25,
      summary: `Practice questions completed on ${topicName}.`,
    };

    const accuracy = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
    const isMastered = accuracy >= 70;

    return {
      ...curriculumItem,
      total: stats.total,
      correct: stats.correct,
      accuracy,
      isMastered,
      xpEarned: stats.correct * 25,
    };
  });

  // Sort learned topics: Mastered first, then by accuracy descending
  learnedTopics.sort((a, b) => b.accuracy - a.accuracy);

  const masteredCount = learnedTopics.filter((t) => t.isMastered).length;
  const totalTopics = CURRICULUM_TOPICS.length;
  const progressPercent = Math.min(100, Math.round((masteredCount / totalTopics) * 100));

  // 2. Compute Next Lessons to Learn
  // Prioritize topics with < 70% accuracy (needs review), followed by unattempted sequential curriculum topics
  const needsReviewTopics = learnedTopics.filter((t) => !t.isMastered);
  const masteredNames = new Set(learnedTopics.filter((t) => t.isMastered).map((t) => t.topic.toLowerCase()));
  const needsReviewNames = new Set(needsReviewTopics.map((t) => t.topic.toLowerCase()));

  const upcomingUnattempted = CURRICULUM_TOPICS.filter(
    (t) => !masteredNames.has(t.topic.toLowerCase()) && !needsReviewNames.has(t.topic.toLowerCase())
  );

  // Combined Next Lessons List
  const allNextLessons = [
    ...needsReviewTopics.map((t) => ({ ...t, isReview: true })),
    ...upcomingUnattempted.map((t) => ({ ...t, isReview: false })),
  ];

  // Filter next lessons by selected category if any
  const filteredNextLessons = categoryFilter === 'All'
    ? allNextLessons
    : allNextLessons.filter((t) => t.category === categoryFilter);

  // Visible next lessons slice
  const visibleNextLessons = showAllLessons
    ? filteredNextLessons
    : filteredNextLessons.slice(0, 5);

  const categories = [
    'All',
    'Core Fundamentals',
    'Data Structures',
    'Intermediate Python',
    'OOP',
    'Advanced Python',
  ];

  return (
    <div className="space-y-6">
      {/* Top Learning Engine Header & Mastery Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white rounded-3xl p-6 sm:p-7 shadow-md border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-[11px] font-bold uppercase tracking-wider bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                <Sparkles className="w-3 h-3" />
                Adaptive Learning Engine
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wider bg-white/15 text-blue-200 px-2.5 py-0.5 rounded-full">
                Phase: {student?.level || 'Beginner'} Track
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Tailored Roadmap for {student?.name || 'New Student'}
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              {learnedTopics.length === 0
                ? 'Welcome! As you solve quiz questions and explore lessons, your skills roadmap lights up with mastery percentages and XP.'
                : typeof recommendation === 'string'
                ? recommendation
                : recommendation?.recommendation || `You have mastered ${masteredCount} topic${masteredCount !== 1 ? 's' : ''}. Follow the sequential lesson list below to continue advancing.`}
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 shrink-0 self-start md:self-auto">
            <div className="w-10 h-10 rounded-xl bg-blue-500/30 border border-blue-400/40 flex items-center justify-center text-lg">
              🎯
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-300">
                Curriculum Progress
              </p>
              <p className="text-base font-extrabold text-white">
                {masteredCount} / {totalTopics} Mastered
              </p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2 relative z-10">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
            <span>Mastery Milestone</span>
            <span className="text-amber-300 font-bold">{progressPercent}% Completed</span>
          </div>
          <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/80">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-400 via-blue-500 to-emerald-400 transition-all duration-500"
              style={{ width: `${Math.max(5, progressPercent)}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
              <span>{masteredCount} Mastered (≥ 70%)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
              <span>{needsReviewTopics.length} Review Priority</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-400 inline-block" />
              <span>{upcomingUnattempted.length} Topics Upcoming</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Skills Learned Roadmap & Next Lessons List */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* ============================================================== */}
        {/* LEFT COLUMN: 🗺️ SKILLS LEARNED ROADMAP */}
        {/* ============================================================== */}
        <div className="lg:col-span-5 bg-gradient-to-br from-white to-slate-50 rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700 shadow-2xs">
                  <Compass className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-base sm:text-lg">
                    Skills Roadmap
                  </h4>
                  <span className="text-[11px] font-bold text-slate-500">
                    What {student?.name || 'you'} have learned
                  </span>
                </div>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                {learnedTopics.length} {learnedTopics.length === 1 ? 'Skill' : 'Skills'} Tracked
              </span>
            </div>

            {/* If Student Has Learned Skills */}
            {learnedTopics.length > 0 ? (
              <div className="space-y-3">
                {learnedTopics.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 shadow-2xs transition-all space-y-2.5 group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {item.isMastered ? (
                          <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                            <RotateCcw className="w-3 h-3 stroke-[2.5]" />
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-slate-900 text-sm leading-snug">
                            {item.title || item.topic}
                          </p>
                          <span className="text-[11px] text-slate-400 font-medium">
                            {item.categoryIcon} {item.category}
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wide border ${
                            item.isMastered
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}
                        >
                          {item.isMastered ? 'Mastered' : 'Needs Review'}
                        </span>
                        <p className="text-[11px] font-bold text-slate-700 mt-0.5">
                          {item.accuracy}% Accuracy
                        </p>
                      </div>
                    </div>

                    {/* Accuracy meter bar */}
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          item.isMastered ? 'bg-emerald-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${item.accuracy}%` }}
                      />
                    </div>

                    {/* Stats & Actions */}
                    <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-50">
                      <span className="text-slate-500 font-medium text-[11px]">
                        {item.correct}/{item.total} correct • +{item.xpEarned} XP
                      </span>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setSelectedLessonTopic(item.topic)}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold transition-colors flex items-center gap-1"
                          title="Read concept guide"
                        >
                          <BookOpen className="w-3 h-3 text-blue-600" />
                          <span>Review</span>
                        </button>

                        <button
                          onClick={() => onStartQuiz && onStartQuiz(item.topic)}
                          className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-[11px] font-bold transition-colors flex items-center gap-1"
                          title="Take quiz to boost score"
                        >
                          <Zap className="w-3 h-3 text-amber-500" />
                          <span>Quiz</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Starter Roadmap for New Students */
              <div className="space-y-4">
                <div className="bg-sky-50/80 border border-sky-200 rounded-2xl p-4 text-xs text-sky-900 space-y-1.5">
                  <p className="font-extrabold text-sm text-sky-950 flex items-center gap-1.5">
                    <span>🚀</span> Your Journey Starts Here
                  </p>
                  <p className="leading-relaxed">
                    You haven't attempted any quizzes yet. Complete your first lesson and quiz to unlock mastery badges and XP on this roadmap!
                  </p>
                </div>

                {/* Milestone Stepper */}
                <div className="relative pl-6 space-y-4 border-l-2 border-dashed border-slate-200 ml-3 py-1">
                  {/* Step 1: Ready to Start */}
                  <div className="relative">
                    <div className="absolute -left-[31px] top-0.5 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs ring-4 ring-emerald-100">
                      1
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-emerald-300 shadow-2xs">
                      <div className="flex items-center justify-between">
                        <p className="font-extrabold text-slate-900 text-xs">
                          Variables & Assignment
                        </p>
                        <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                          Ready to Start
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        First step in your Python mastery journey.
                      </p>
                      <button
                        onClick={() => setSelectedLessonTopic('Variables')}
                        className="mt-2 text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                      >
                        <span>Start Lesson</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Step 2: Up Next */}
                  <div className="relative">
                    <div className="absolute -left-[31px] top-0.5 w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-xs">
                      2
                    </div>
                    <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-200">
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-slate-700 text-xs">
                          Data Types & Casting
                        </p>
                        <span className="text-[10px] font-bold text-slate-400">
                          Up Next
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Integers, strings, booleans, and floats.
                      </p>
                    </div>
                  </div>

                  {/* Step 3: Up Next */}
                  <div className="relative">
                    <div className="absolute -left-[31px] top-0.5 w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-xs">
                      3
                    </div>
                    <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-200">
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-slate-700 text-xs">
                          Conditionals & Logic
                        </p>
                        <span className="text-[10px] font-bold text-slate-400">
                          Upcoming
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Branching logic with if, elif, and else.
                      </p>
                    </div>
                  </div>

                  {/* Step 4: Up Next */}
                  <div className="relative">
                    <div className="absolute -left-[31px] top-0.5 w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-xs">
                      4
                    </div>
                    <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-200">
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-slate-700 text-xs">
                          Loops & Iterations
                        </p>
                        <span className="text-[10px] font-bold text-slate-400">
                          Upcoming
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Roadmap Action */}
          <div className="mt-5 pt-4 border-t border-slate-100">
            {learnedTopics.length === 0 ? (
              <button
                onClick={() => setSelectedLessonTopic('Variables')}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Begin Lesson 1: Variables</span>
              </button>
            ) : (
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>Total XP Earned:</span>
                <span className="font-extrabold text-amber-600 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 fill-amber-400" />
                  {student?.xp ?? 0} XP
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ============================================================== */}
        {/* RIGHT COLUMN: 📚 NEXT LESSONS TO LEARN (TOPIC LIST) */}
        {/* ============================================================== */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            {/* Header & Filter Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 shadow-2xs">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-base sm:text-lg">
                    Next Lessons to Learn
                  </h4>
                  <span className="text-[11px] font-bold text-slate-500">
                    Sequential Python Curriculum ({allNextLessons.length} Remaining)
                  </span>
                </div>
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                <span className="text-xs font-bold text-slate-400 shrink-0 flex items-center gap-1 mr-1">
                  <Filter className="w-3 h-3" />
                </span>
                {['All', 'Core Fundamentals', 'Data Structures'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold shrink-0 transition-all ${
                      categoryFilter === cat
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* List of Next Lessons */}
            <div className="space-y-3">
              {visibleNextLessons.map((lesson, idx) => (
                <div
                  key={lesson.topic}
                  className={`rounded-2xl p-4 border transition-all ${
                    lesson.isReview
                      ? 'bg-amber-50/50 border-amber-200/90 hover:border-amber-300'
                      : 'bg-slate-50/70 border-slate-200 hover:border-blue-300 hover:bg-white'
                  } shadow-2xs`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-7 h-7 rounded-xl font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5 ${
                          lesson.isReview
                            ? 'bg-amber-200 text-amber-900'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {idx + 1}
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h5 className="font-extrabold text-slate-900 text-sm">
                            {lesson.title || lesson.topic}
                          </h5>

                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-slate-600 border border-slate-200">
                            {lesson.categoryIcon} {lesson.category}
                          </span>

                          {lesson.isReview ? (
                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
                              🔥 Review Priority
                            </span>
                          ) : (
                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                              +{lesson.xpReward || 25} XP
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed font-normal">
                          {lesson.summary}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons: Learn Lesson & Practice Quiz */}
                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <button
                        onClick={() => setSelectedLessonTopic(lesson.topic)}
                        className="px-3.5 py-2 rounded-xl bg-white hover:bg-blue-50 text-blue-700 border border-blue-200 font-extrabold text-xs shadow-2xs transition-all flex items-center gap-1.5 active:scale-95"
                        title="Read lesson notes & runnable code"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Learn</span>
                      </button>

                      <button
                        onClick={() => onStartQuiz && onStartQuiz(lesson.topic)}
                        className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs shadow-xs transition-all flex items-center gap-1.5 active:scale-95"
                        title="Take quiz on this topic"
                      >
                        <Zap className="w-3.5 h-3.5 text-amber-300" />
                        <span>Quiz</span>
                      </button>

                      {onStartLesson && (
                        <button
                          onClick={() => onStartLesson(lesson.topic, 'Learn')}
                          className="p-2 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-slate-100 transition-colors"
                          title="Ask AI Tutor about this topic"
                        >
                          <Bot className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State if filter yields none */}
            {visibleNextLessons.length === 0 && (
              <div className="text-center py-8 text-slate-400 text-xs">
                No upcoming topics in this category. You may have mastered them all!
              </div>
            )}
          </div>

          {/* Show More / Show Less Toggle Button */}
          {filteredNextLessons.length > 5 && (
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">
                Showing {visibleNextLessons.length} of {filteredNextLessons.length} lessons
              </span>
              <button
                onClick={() => setShowAllLessons(!showAllLessons)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
              >
                <span>{showAllLessons ? 'Show Fewer Lessons' : `View All ${filteredNextLessons.length} Topics`}</span>
                {showAllLessons ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Lesson Modal */}
      <LessonModal
        topic={selectedLessonTopic}
        isOpen={Boolean(selectedLessonTopic)}
        onClose={() => setSelectedLessonTopic(null)}
        onStartQuiz={(topic) => {
          setSelectedLessonTopic(null);
          onStartQuiz && onStartQuiz(topic);
        }}
        onAskTutor={(topic) => {
          setSelectedLessonTopic(null);
          onStartLesson && onStartLesson(topic, 'Learn');
        }}
      />
    </div>
  );
}
