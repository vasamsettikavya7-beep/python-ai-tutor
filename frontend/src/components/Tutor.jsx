import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  User,
  Copy,
  Check,
  RefreshCw,
  Lightbulb,
  BookOpen,
  Code2,
  AlertCircle,
  Volume2,
  Wand2,
} from 'lucide-react';
import { askTutor } from '../services/api';
import { getTopicGuide } from '../data/topicKnowledgeBase';
import { PROFESSOR_PERSONAS } from '../data/hogwartsLore';
import magicalAudio from '../services/magicalAudio';

export const TOPIC_GROUPS = [
  {
    category: '🌱 Core Fundamentals',
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
    category: '📦 Data Structures',
    topics: [
      'Lists',
      'Tuples',
      'Dictionaries',
      'Sets',
      'List Comprehensions',
    ],
  },
  {
    category: '⚙️ Intermediate Python',
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
    category: '🏛️ Object-Oriented Programming (OOP)',
    topics: [
      'OOP',
      'Classes & Objects',
      'Inheritance & Polymorphism',
      'OOP / Dunder Methods',
      'OOP / Optimization',
    ],
  },
  {
    category: '🚀 Advanced Python',
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

export const TOPIC_PRESETS = TOPIC_GROUPS.flatMap((group) => group.topics);

const SUGGESTED_PROMPTS = [
  { topic: 'Variables', q: 'What is a variable and how does assignment work in Python?' },
  { topic: 'Loops', q: 'How does a Python for loop work with range()?' },
  { topic: 'Conditions', q: 'Explain if, elif, and else with an example.' },
  { topic: 'Functions', q: 'How do I define a function and return values in Python?' },
  { topic: 'Lists', q: 'How do I add, remove, and slice elements in a list?' },
  { topic: 'Dictionaries', q: 'How do key-value pairs and .get() work in Python dictionaries?' },
  { topic: 'OOP', q: 'What is the difference between a class and an object in Python?' },
  { topic: 'List Comprehensions', q: 'How do I write a list comprehension with an if condition?' },
  { topic: 'Exception Handling', q: 'How do try, except, and finally handle errors in Python?' },
  { topic: 'Decorators', q: 'What is a Python decorator and when should I use one?' },
  { topic: 'Generators', q: 'How does the yield keyword work in Python generators?' },
  { topic: 'Async / Await', q: 'What is async/await in Python and how does concurrency work?' },
];

export default function Tutor({
  student,
  initialTopic = 'Variables',
  initialMode = 'Tutor',
}) {
  const [topic, setTopic] = useState(initialTopic);
  const [customTopic, setCustomTopic] = useState('');
  const [mode, setMode] = useState(initialMode);
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);

  // Chat message history
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: `Hello ${
        student?.name || 'there'
      }! 👋 I'm Python Buddy, your AI programming tutor. Choose a topic and ask me anything about Python—from basic variables to functions and loops!`,
      topic: 'Welcome',
      time: 'Just now',
    },
  ]);

  const messagesEndRef = useRef(null);

  const [selectedProfessor, setSelectedProfessor] = useState('pythondore');

  const handleRequestSocraticHint = () => {
    const prof = PROFESSOR_PERSONAS[selectedProfessor] || PROFESSOR_PERSONAS.pythondore;
    const baseQuestion = question.trim() || `How does ${activeTopic} work in Python?`;
    const hintPrompt = `[HINT ONLY - DO NOT REVEAL DIRECT CODE ANSWER] As ${prof.name}, give me a Socratic wand hint for this question: "${baseQuestion}". Guide my thinking with a riddle or clue so I can solve it myself!`;
    magicalAudio.playSpell('wand');
    handleSubmit(null, hintPrompt, activeTopic);
  };

  useEffect(() => {
    if (initialTopic) {
      setTopic(initialTopic);
    }
  }, [initialTopic]);

  useEffect(() => {
    if (initialMode) {
      setMode(initialMode);
    }
  }, [initialMode]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const activeTopic = topic === 'Custom' ? customTopic || 'General Python' : topic;

  const handleSubmit = async (e, directQuestion, directTopic) => {
    if (e) e.preventDefault();
    const query = directQuestion || question;
    const queryTopic = directTopic || activeTopic;

    if (!query.trim()) return;
    if (!student?.id) {
      setError('Please select or register a student first.');
      return;
    }

    const userMessage = {
      role: 'user',
      text: query.trim(),
      topic: queryTopic,
      mode: mode,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setQuestion('');
    setLoading(true);
    setError(null);

    try {
      // Calls actual POST /tutor endpoint on FastAPI backend
      const response = await askTutor({
        student_id: student.id,
        mode: mode,
        topic: queryTopic,
        question: query.trim(),
      });

      const assistantMessage = {
        role: 'assistant',
        text: response.answer,
        topic: response.topic,
        mode: response.mode,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      if (err.message && err.message.includes('Unable to connect')) {
        const guide = getTopicGuide(queryTopic, query.trim());
        const fallbackAnswer = `### 📚 Python Guide: ${guide.title}\n\n*${guide.summary}*\n\n${guide.explanation}`;

        const assistantMessage = {
          role: 'assistant',
          text: fallbackAnswer,
          topic: queryTopic,
          mode: mode,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages((prev) => [...prev, assistantMessage]);
        setError(null);
      } else {
        setError(err.message || 'Error communicating with AI Tutor.');
        setQuestion(query.trim());
        setMessages((prev) => [
          ...prev,
          {
            role: 'system-error',
            text: err.message || 'Unable to receive response from backend.',
            query: query.trim(),
            topic: queryTopic,
            mode: mode,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = (retryQuestion, retryTopic, retryMode) => {
    if (retryTopic) setTopic(retryTopic);
    if (retryMode) setMode(retryMode);
    handleSubmit(null, retryQuestion, retryTopic);
  };

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handlePromptClick = (promptItem) => {
    setTopic(promptItem.topic);
    setQuestion(promptItem.q);
    handleSubmit(null, promptItem.q, promptItem.topic);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Controls Bar: Topic, Mode, & Professor Selector */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
          {/* Professor Persona Select */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-amber-700 mb-1.5">
              🧙‍♂️ Hogwarts Professor
            </label>
            <select
              value={selectedProfessor}
              onChange={(e) => {
                setSelectedProfessor(e.target.value);
                const prof = PROFESSOR_PERSONAS[e.target.value];
                magicalAudio.playSpell('wand');
                magicalAudio.speak(`Greetings! I am ${prof.name}. ${prof.quote}`, e.target.value);
              }}
              className="w-full px-3.5 py-2.5 rounded-xl border border-amber-300 text-sm font-semibold text-amber-950 bg-amber-50/80 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xs"
            >
              {Object.values(PROFESSOR_PERSONAS).map((p) => (
                <option key={p.id} value={p.id}>
                  {p.avatar} {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Topic Select */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                Topic
              </label>
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                {TOPIC_PRESETS.length} Topics
              </span>
            </div>
            <div className="flex gap-2">
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
              >
                {TOPIC_GROUPS.map((group) => (
                  <optgroup key={group.category} label={group.category}>
                    {group.topics.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </optgroup>
                ))}
                {!TOPIC_PRESETS.includes(topic) && topic !== 'Custom' && (
                  <optgroup label="📍 Custom / Active">
                    <option value={topic}>{topic}</option>
                  </optgroup>
                )}
                <optgroup label="✨ Custom">
                  <option value="Custom">+ Custom Topic...</option>
                </optgroup>
              </select>
            </div>
            {topic === 'Custom' && (
              <input
                type="text"
                placeholder="Enter custom topic..."
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                className="mt-2 w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-blue-500"
              />
            )}
          </div>

          {/* Mode Select */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Learning Mode
            </label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Tutor">AI Tutor (Ask Doubts)</option>
              <option value="Learn">Learn (Concept + Common Mistakes)</option>
              <option value="Practice">Practice (Interactive Problem)</option>
            </select>
          </div>

          {/* Student Status Box */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-3 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
                Active Student
              </p>
              <p className="font-extrabold text-sm text-slate-900">
                {student?.name || 'Not logged in'}
              </p>
              <p className="text-[11px] text-slate-500">
                House: <span className="font-bold text-amber-700">{student?.house || 'Gryffindor'}</span> • {student?.level || 'Beginner'}
              </p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              {student?.name ? student.name.charAt(0).toUpperCase() : 'S'}
            </div>
          </div>
        </div>

        {/* Suggested Quick Prompts */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              Quick questions to ask Python Buddy:
            </p>
            <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
              Click any question to ask instantly
            </span>
          </div>
          <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto pr-1">
            {SUGGESTED_PROMPTS.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handlePromptClick(item)}
                className="text-xs bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 px-3 py-1.5 rounded-xl border border-slate-200/80 transition-all font-medium text-left prompt-pill"
              >
                <span className="font-bold text-blue-600 mr-1 prompt-tag">[{item.topic}]</span>
                <span className="prompt-text">{item.q}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col h-[560px] overflow-hidden">
        {/* Chat History Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg, index) => {
            const isUser = msg.role === 'user';
            const isError = msg.role === 'system-error';

            if (isError) {
              return (
                <div key={index} className="flex justify-center my-3 animate-in fade-in duration-200">
                  <div className="bg-rose-50 border border-rose-200 text-rose-900 text-xs p-3.5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 max-w-lg w-full shadow-xs">
                    <div className="flex items-start gap-2.5">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                      <div>
                        <p className="font-bold text-rose-800">
                          {msg.text}
                        </p>
                        <p className="text-[11px] text-rose-600 mt-0.5">
                          Google's Gemini API was momentarily busy (503). You can click Retry to resend.
                        </p>
                      </div>
                    </div>
                    {msg.query && (
                      <button
                        onClick={() => handleRetry(msg.query, msg.topic, msg.mode)}
                        disabled={loading}
                        className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shrink-0 transition-all shadow-xs cursor-pointer disabled:opacity-50"
                        title="Retry sending this question to AI Tutor"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                        <span>Retry</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            }

            return (
              <div
                key={index}
                className={`flex items-start gap-3 ${
                  isUser ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 shadow-xs text-sm font-bold ${
                    isUser
                      ? 'bg-slate-900 text-white'
                      : 'bg-gradient-to-tr from-amber-600 to-purple-800 text-white text-base'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <span>{PROFESSOR_PERSONAS[selectedProfessor]?.avatar || '🧙‍♂️'}</span>}
                </div>

                {/* Bubble */}
                <div
                  className={`max-w-[85%] sm:max-w-[78%] rounded-3xl p-4 sm:p-5 relative ${
                    isUser
                      ? 'bg-blue-600 text-white rounded-tr-xs'
                      : 'bg-slate-100/90 text-slate-800 border border-slate-200/80 rounded-tl-xs shadow-2xs chat-bubble-assistant'
                  }`}
                >
                  {/* Topic tag & Professor title */}
                  <div className="flex items-center justify-between gap-4 mb-2 pb-1.5 border-b border-black/10 text-[11px] font-semibold opacity-80 bubble-header">
                    <span>
                      {isUser ? `Topic: ${msg.topic}` : PROFESSOR_PERSONAS[selectedProfessor]?.name || 'Hogwarts Professor'}
                    </span>
                    {msg.topic && isUser && <span>Mode: {msg.mode}</span>}
                  </div>

                  {/* Message Content */}
                  <div className="text-sm whitespace-pre-wrap leading-relaxed space-y-2 bubble-content">
                    {msg.text}
                  </div>

                  {/* Actions / Timestamp */}
                  <div
                    className={`mt-2 flex items-center justify-between text-[10px] bubble-meta ${
                      isUser ? 'text-blue-100' : 'text-slate-500'
                    }`}
                  >
                    <span>{msg.time}</span>
                    {!isUser && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => magicalAudio.speak(msg.text, selectedProfessor)}
                          className="hover:text-amber-700 flex items-center gap-1 font-semibold px-1.5 py-0.5 rounded hover:bg-black/5 transition-colors"
                          title="Hear Professor speak this advice"
                        >
                          <Volume2 className="w-3 h-3 text-amber-600" />
                          <span>Voice 🪄</span>
                        </button>

                        <button
                          onClick={() => handleCopy(msg.text, index)}
                          className="hover:text-slate-800 flex items-center gap-1 font-medium px-1 py-0.5 rounded transition-colors"
                          title="Copy Answer"
                        >
                          {copiedIndex === index ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span className="text-emerald-700">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Loading Indicator */}
          {loading && (
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-2xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-xs text-base">
                {PROFESSOR_PERSONAS[selectedProfessor]?.avatar || '🧙‍♂️'}
              </div>
              <div className="bg-slate-100 border border-slate-200 text-slate-700 rounded-3xl rounded-tl-xs px-5 py-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-600 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-purple-500 animate-bounce delay-100" />
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce delay-200" />
                <span className="text-xs font-semibold text-slate-600 ml-1">
                  {PROFESSOR_PERSONAS[selectedProfessor]?.name} is formulating guidance...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 chat-input-bar">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={`Ask ${PROFESSOR_PERSONAS[selectedProfessor]?.name || 'Professor'} about ${activeTopic}...`}
              disabled={loading}
              className="flex-1 px-4 py-3 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm font-medium disabled:opacity-60 chat-text-input"
            />

            <button
              type="button"
              onClick={handleRequestSocraticHint}
              disabled={loading}
              className="px-4 py-3 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 font-extrabold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer active:scale-95 wand-hint-btn"
              title="Request a Socratic hint without spoiling the direct solution"
            >
              <Wand2 className="w-4 h-4 text-amber-700 wand-hint-icon" />
              <span>Ask for Wand Hint 🪄</span>
            </button>

            <button
              type="submit"
              disabled={loading || !question.trim()}
              className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Ask Professor</span>
            </button>
          </form>
          {error && (
            <p className="text-xs text-rose-600 mt-2 font-medium">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}
