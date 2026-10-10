import React, { useState } from 'react';
import {
  Compass,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Zap,
  ArrowRight,
  ArrowDown,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Filter,
  Check,
  Bot,
  Lock,
  Play,
  RotateCcw,
  GitBranch,
  Layers,
  Award,
  Flame,
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

// Flowchart Stage Definitions
export const FLOWCHART_STAGES = [
  {
    id: 'fundamentals',
    name: 'Fundamentals',
    fullName: 'Core Fundamentals',
    icon: '🌱',
    topics: [
      'Variables',
      'Data Types',
      'Strings',
      'Operators',
      'Conditions',
      'Loops',
      'Functions',
      'Scope',
    ],
  },
  {
    id: 'datastructures',
    name: 'Data Structures',
    fullName: 'Data Structures',
    icon: '📦',
    topics: [
      'Lists',
      'Tuples',
      'Dictionaries',
      'Sets',
      'List Comprehensions',
    ],
  },
  {
    id: 'intermediate',
    name: 'Intermediate',
    fullName: 'Intermediate Python',
    icon: '⚙️',
    topics: [
      'Lambda Functions',
      'Exception Handling',
      'File I/O',
      'Modules & Imports',
      'Closures',
      'Built-in Functions',
      'Functional Programming',
      'Regular Expressions (Regex)',
    ],
  },
  {
    id: 'oop',
    name: 'OOP',
    fullName: 'Object-Oriented Programming',
    icon: '🏛️',
    topics: [
      'OOP',
      'Classes & Objects',
      'Inheritance & Polymorphism',
      'OOP / Dunder Methods',
      'OOP / Optimization',
    ],
  },
  {
    id: 'advanced',
    name: 'Advanced',
    fullName: 'Advanced Python',
    icon: '🚀',
    topics: [
      'Decorators',
      'Generators',
      'Context Managers',
      'Async / Await',
      'Concurrency',
      'Memory Management',
      'Metaclasses',
      'Standard Library',
    ],
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
  const [activeStageId, setActiveStageId] = useState('fundamentals');
  const [currentSlide, setCurrentSlide] = useState(1);

  const ITEMS_PER_SLIDE = 5;

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
  const learnedMap = {};
  Object.keys(topicBreakdown).forEach((topicName) => {
    const stats = topicBreakdown[topicName];
    const acc = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
    learnedMap[topicName.toLowerCase()] = {
      total: stats.total,
      correct: stats.correct,
      accuracy: acc,
      isMastered: acc >= 70,
      xpEarned: stats.correct * 25,
    };
  });

  const learnedTopicsList = Object.keys(topicBreakdown).map((topicName) => {
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
    return {
      ...curriculumItem,
      total: stats.total,
      correct: stats.correct,
      accuracy,
      isMastered: accuracy >= 70,
      xpEarned: stats.correct * 25,
    };
  });

  const masteredCount = learnedTopicsList.filter((t) => t.isMastered).length;
  const totalTopics = CURRICULUM_TOPICS.length;
  const progressPercent = Math.min(100, Math.round((masteredCount / totalTopics) * 100));

  // 2. Compute Next Lessons to Learn
  const needsReviewTopics = learnedTopicsList.filter((t) => !t.isMastered);
  const masteredNames = new Set(learnedTopicsList.filter((t) => t.isMastered).map((t) => t.topic.toLowerCase()));
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

  // 3. 5-Topic Slide Navigation Calculation
  const totalSlides = Math.ceil(filteredNextLessons.length / ITEMS_PER_SLIDE) || 1;
  const safeSlide = Math.min(Math.max(1, currentSlide), totalSlides);
  const startIdx = (safeSlide - 1) * ITEMS_PER_SLIDE;
  const endIdx = Math.min(startIdx + ITEMS_PER_SLIDE, filteredNextLessons.length);
  const visibleLessons = filteredNextLessons.slice(startIdx, endIdx);

  // When changing category, reset to slide 1
  const handleCategoryChange = (cat) => {
    setCategoryFilter(cat);
    setCurrentSlide(1);
  };

  // 4. Flowchart Active Stage Data
  const currentFlowStage = FLOWCHART_STAGES.find((s) => s.id === activeStageId) || FLOWCHART_STAGES[0];
  const stageTopicsData = currentFlowStage.topics.map((tName, index) => {
    const cItem = CURRICULUM_TOPICS.find((c) => c.topic.toLowerCase() === tName.toLowerCase()) || {
      topic: tName,
      title: tName,
      summary: '',
      category: currentFlowStage.fullName,
      xpReward: 25,
    };

    const userStats = learnedMap[tName.toLowerCase()];
    let status = 'upcoming'; // 'mastered' | 'needs_review' | 'active' | 'upcoming'

    if (userStats) {
      status = userStats.isMastered ? 'mastered' : 'needs_review';
    } else {
      // If it's the very first unattempted topic across the sequence, mark as active
      const firstUnattempted = CURRICULUM_TOPICS.find(
        (c) => !learnedMap[c.topic.toLowerCase()]
      );
      if (firstUnattempted && firstUnattempted.topic.toLowerCase() === tName.toLowerCase()) {
        status = 'active';
      }
    }

    return {
      ...cItem,
      stepNumber: index + 1,
      stats: userStats,
      status,
    };
  });

  const stageMasteredCount = stageTopicsData.filter((t) => t.status === 'mastered').length;

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
              {learnedTopicsList.length === 0
                ? 'Welcome! Follow the flowchart on the left to complete your skills sequentially, and use the 5-topic slide navigator on the right.'
                : typeof recommendation === 'string'
                ? recommendation
                : recommendation?.recommendation || `You have mastered ${masteredCount} of ${totalTopics} curriculum topics. Continue advancing along the flowchart.`}
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

      {/* Main Grid: Skills Flowchart Roadmap & Next Lessons List */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* ============================================================== */}
        {/* LEFT COLUMN: 🗺️ SKILLS ROADMAP FLOWCHART */}
        {/* ============================================================== */}
        <div className="lg:col-span-5 bg-gradient-to-br from-white to-slate-50 rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            {/* Flowchart Header */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700 shadow-2xs">
                  <GitBranch className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-base sm:text-lg flex items-center gap-1.5">
                    <span>Skills Flowchart</span>
                    <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      Live Diagram
                    </span>
                  </h4>
                  <span className="text-[11px] font-bold text-slate-500">
                    Visual milestone track for {student?.name || 'You'}
                  </span>
                </div>
              </div>

              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                {stageMasteredCount}/{currentFlowStage.topics.length} Stage Done
              </span>
            </div>

            {/* Stage Selector Pills */}
            <div className="mb-5 overflow-x-auto pb-1 scrollbar-none">
              <div className="flex items-center gap-1.5 min-w-max">
                {FLOWCHART_STAGES.map((stg) => {
                  const isActive = stg.id === activeStageId;
                  const stgMastered = stg.topics.filter(
                    (t) => learnedMap[t.toLowerCase()]?.isMastered
                  ).length;

                  return (
                    <button
                      key={stg.id}
                      onClick={() => setActiveStageId(stg.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span>{stg.icon}</span>
                      <span>{stg.name}</span>
                      <span
                        className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-full ${
                          isActive
                            ? 'bg-emerald-700/80 text-white'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {stgMastered}/{stg.topics.length}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* FLOWCHART DIAGRAM CANVAS */}
            <div className="bg-slate-50/70 rounded-2xl border border-slate-200 p-4 space-y-0 relative">
              {/* Terminal Start Node */}
              <div className="flex justify-center mb-1">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 text-white text-xs font-extrabold shadow-sm border border-slate-700">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>START: {currentFlowStage.fullName}</span>
                </div>
              </div>

              {/* Connecting line to first node */}
              <div className="flex flex-col items-center my-0.5 select-none">
                <div className="w-0.5 h-3 bg-slate-300" />
                <ArrowDown className="w-3.5 h-3.5 text-slate-400 -mt-1" />
              </div>

              {/* Sequential Flowchart Nodes */}
              <div className="space-y-0">
                {stageTopicsData.map((node, index) => {
                  const isLast = index === stageTopicsData.length - 1;

                  return (
                    <div key={node.topic} className="flex flex-col items-center">
                      {/* Flowchart Node Box */}
                      <div
                        className={`w-full rounded-2xl p-3.5 border transition-all ${
                          node.status === 'mastered'
                            ? 'bg-emerald-50/70 border-emerald-300 shadow-2xs'
                            : node.status === 'needs_review'
                            ? 'bg-amber-50/70 border-amber-300 shadow-2xs'
                            : node.status === 'active'
                            ? 'bg-blue-50 border-2 border-blue-500 shadow-md ring-2 ring-blue-100'
                            : 'bg-white border-slate-200 opacity-80'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2.5">
                            {/* Step Badge */}
                            <div
                              className={`w-7 h-7 rounded-xl font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5 ${
                                node.status === 'mastered'
                                  ? 'bg-emerald-500 text-white shadow-2xs'
                                  : node.status === 'needs_review'
                                  ? 'bg-amber-400 text-slate-950 shadow-2xs'
                                  : node.status === 'active'
                                  ? 'bg-blue-600 text-white shadow-2xs animate-pulse'
                                  : 'bg-slate-100 text-slate-400 border border-slate-200'
                              }`}
                            >
                              {node.status === 'mastered' ? (
                                <Check className="w-4 h-4 stroke-[3]" />
                              ) : node.status === 'needs_review' ? (
                                <RotateCcw className="w-3.5 h-3.5 stroke-[2.5]" />
                              ) : node.status === 'active' ? (
                                <Play className="w-3 h-3 fill-white" />
                              ) : (
                                node.stepNumber
                              )}
                            </div>

                            <div>
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-extrabold text-slate-900 text-xs sm:text-sm">
                                  {node.title || node.topic}
                                </span>
                                {node.status === 'active' && (
                                  <span className="text-[10px] font-extrabold bg-blue-600 text-white px-2 py-0.2 rounded-full uppercase tracking-wider animate-pulse">
                                    Current Focus
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-500 font-medium">
                                {node.summary || `${node.category} topic`}
                              </p>
                            </div>
                          </div>

                          {/* Node Status Badge */}
                          <div className="text-right shrink-0">
                            {node.status === 'mastered' ? (
                              <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                ✅ Mastered ({node.stats?.accuracy}%)
                              </span>
                            ) : node.status === 'needs_review' ? (
                              <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-amber-100 text-amber-900 border border-amber-200">
                                ⚠️ Review ({node.stats?.accuracy}%)
                              </span>
                            ) : node.status === 'active' ? (
                              <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-blue-100 text-blue-800 border border-blue-200">
                                🚀 Start Here
                              </span>
                            ) : (
                              <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-500 border border-slate-200 flex items-center gap-1">
                                <Lock className="w-2.5 h-2.5" />
                                <span>Upcoming</span>
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Decision Loop for Review items */}
                        {node.status === 'needs_review' && (
                          <div className="mt-2.5 p-2 rounded-xl bg-amber-100/70 border border-amber-200 flex items-center justify-between text-[11px] text-amber-900">
                            <span className="font-semibold flex items-center gap-1">
                              <RotateCcw className="w-3 h-3 text-amber-700" />
                              <span>Practice Loop: Needs accuracy ≥ 70%</span>
                            </span>
                            <button
                              onClick={() => onStartQuiz && onStartQuiz(node.topic)}
                              className="px-2 py-0.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-[10px] transition-colors"
                            >
                              Re-test Quiz
                            </button>
                          </div>
                        )}

                        {/* Interactive Node Action Buttons */}
                        <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-[11px] text-slate-400 font-medium">
                            {node.stats
                              ? `${node.stats.correct}/${node.stats.total} correct • +${node.stats.xpEarned} XP`
                              : `+${node.xpReward || 25} XP potential`}
                          </span>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => setSelectedLessonTopic(node.topic)}
                              className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-[11px] font-bold transition-colors flex items-center gap-1 shadow-2xs"
                              title="Read lesson notes"
                            >
                              <BookOpen className="w-3 h-3 text-blue-600" />
                              <span>Learn</span>
                            </button>

                            <button
                              onClick={() => onStartQuiz && onStartQuiz(node.topic)}
                              className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-[11px] font-bold transition-colors flex items-center gap-1 shadow-2xs"
                              title="Take quiz on this topic"
                            >
                              <Zap className="w-3 h-3 text-amber-300" />
                              <span>Quiz</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Directional Connector Arrow between flowchart nodes */}
                      {!isLast && (
                        <div className="flex flex-col items-center my-0.5 select-none">
                          <div className="w-0.5 h-3 bg-slate-300" />
                          <div className="flex items-center gap-1 px-1.5 py-0.2 rounded-full bg-white text-[9px] font-bold text-slate-400 border border-slate-200 shadow-2xs">
                            <span>↓ step {index + 2}</span>
                          </div>
                          <div className="w-0.5 h-2.5 bg-slate-300" />
                          <ArrowDown className="w-3.5 h-3.5 text-slate-400 -mt-1" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Connecting line to Milestone */}
              <div className="flex flex-col items-center my-1 select-none">
                <div className="w-0.5 h-3 bg-slate-300" />
                <ArrowDown className="w-3.5 h-3.5 text-slate-400 -mt-1" />
              </div>

              {/* Milestone Checkpoint at End of Stage */}
              <div className="rounded-2xl p-3 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-sm font-bold">
                    🏆
                  </div>
                  <div>
                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-200">
                      Stage Checkpoint
                    </p>
                    <p className="text-xs font-bold text-white">
                      {currentFlowStage.fullName} Complete
                    </p>
                  </div>
                </div>

                <span className="text-xs font-extrabold px-2.5 py-1 rounded-xl bg-white/20 text-white border border-white/20">
                  {stageMasteredCount}/{currentFlowStage.topics.length} Mastered
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Roadmap Action */}
          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Overall Python XP:</span>
            <span className="font-extrabold text-amber-600 flex items-center gap-1 text-sm">
              <Zap className="w-4 h-4 fill-amber-400" />
              {student?.xp ?? 0} XP
            </span>
          </div>
        </div>

        {/* ============================================================== */}
        {/* RIGHT COLUMN: 📚 NEXT LESSONS TO LEARN (5 TOPICS PER SLIDE) */}
        {/* ============================================================== */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            {/* Header & Category Filters */}
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
                    Sequential Python Curriculum ({filteredNextLessons.length} Remaining)
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
                    onClick={() => handleCategoryChange(cat)}
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

            {/* Slide Header Indicator */}
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-3 px-1">
              <span className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-blue-600" />
                <span>
                  Slide <strong className="text-slate-900">{safeSlide}</strong> of{' '}
                  <strong className="text-slate-900">{totalSlides}</strong> (5 Topics per Slide)
                </span>
              </span>

              <span className="text-[11px] text-slate-400 font-medium">
                Topics {startIdx + 1}–{endIdx} of {filteredNextLessons.length}
              </span>
            </div>

            {/* List of 5 Lessons for the Current Slide */}
            <div className="space-y-3">
              {visibleLessons.map((lesson, idx) => {
                const globalIndex = startIdx + idx + 1;

                return (
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
                          {globalIndex}
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
                );
              })}
            </div>

            {/* Empty State if filter yields none */}
            {visibleLessons.length === 0 && (
              <div className="text-center py-8 text-slate-400 text-xs">
                No upcoming topics in this category. You may have mastered them all!
              </div>
            )}
          </div>

          {/* ============================================================== */}
          {/* SLIDE / PAGE NAVIGATOR (5 Topics per Slide) */}
          {/* ============================================================== */}
          <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-slate-500 font-medium">
              Showing <span className="font-bold text-slate-800">{startIdx + 1}–{endIdx}</span> of{' '}
              <span className="font-bold text-slate-800">{filteredNextLessons.length}</span> lessons
              <span className="hidden sm:inline text-slate-400 ml-1.5">• 5 topics per slide</span>
            </div>

            {/* Navigator Buttons & Slide Pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => setCurrentSlide((s) => Math.max(1, s - 1))}
                disabled={safeSlide === 1}
                className="px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed bg-white border-slate-200 text-slate-700 hover:bg-slate-50 active:scale-95 shadow-2xs"
                title="Previous 5 topics"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Prev</span>
              </button>

              {/* Numbered Slide Pills */}
              <div className="flex items-center gap-1">
                {Array.from({ length: totalSlides }, (_, i) => i + 1).map((slideNum) => (
                  <button
                    key={slideNum}
                    onClick={() => setCurrentSlide(slideNum)}
                    className={`w-8 h-8 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center ${
                      safeSlide === slideNum
                        ? 'bg-blue-600 text-white shadow-xs scale-105'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                    title={`Go to slide ${slideNum} (topics ${(slideNum - 1) * ITEMS_PER_SLIDE + 1}–${Math.min(
                      slideNum * ITEMS_PER_SLIDE,
                      filteredNextLessons.length
                    )})`}
                  >
                    {slideNum}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentSlide((s) => Math.min(totalSlides, s + 1))}
                disabled={safeSlide === totalSlides}
                className="px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed bg-white border-slate-200 text-slate-700 hover:bg-slate-50 active:scale-95 shadow-2xs"
                title="Next 5 topics"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
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
