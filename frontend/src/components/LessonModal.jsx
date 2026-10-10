import React, { useState, useEffect } from 'react';
import {
  X,
  BookOpen,
  Code2,
  Copy,
  Check,
  Zap,
  Bot,
  Sparkles,
  ArrowRight,
  GraduationCap,
  Volume2,
  VolumeX,
  Wand2,
} from 'lucide-react';
import { getTopicGuide } from '../data/topicKnowledgeBase';
import magicalAudio from '../services/magicalAudio';
import { PYTHON_SPELLS_MAP } from '../data/hogwartsLore';

export default function LessonModal({
  topic,
  isOpen,
  onClose,
  onStartQuiz,
  onAskTutor,
}) {
  const [copiedCode, setCopiedCode] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    if (isOpen) {
      magicalAudio.playAlohomora();
    } else {
      magicalAudio.stop();
      setIsSpeaking(false);
    }
    return () => {
      magicalAudio.stop();
    };
  }, [isOpen]);

  if (!isOpen || !topic) return null;

  const guide = getTopicGuide(topic);
  const spellInfo = PYTHON_SPELLS_MAP[topic] || Object.values(PYTHON_SPELLS_MAP).find(s => topic.toLowerCase().includes(s.spellName.toLowerCase()));

  const handleToggleSpeech = () => {
    if (isSpeaking) {
      magicalAudio.stop();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      const cleanExplanation = (guide.explanation || '')
        .replace(/```[\s\S]*?```/g, 'Check the Python code snippet inscribed below.')
        .replace(/[*_#`]/g, '');
      const spellSpeech = spellInfo ? ` In Hogwarts spellcraft, this is known as the ${spellInfo.spellName}, a ${spellInfo.type}. Its wand movement is: ${spellInfo.wandMovement}. ` : '';
      const fullText = `Lesson on ${guide.title || topic}. ${guide.summary || ''}.${spellSpeech} Let us study this incantation: ${cleanExplanation}`;
      
      magicalAudio.speak(fullText, 'hermione', () => {
        setIsSpeaking(false);
      });
    }
  };

  // Helper to split explanation into text and code blocks
  const parseExplanation = (text = '') => {
    const parts = [];
    const codeBlockRegex = /```(?:python)?([\s\S]*?)```/g;
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          content: text.slice(lastIndex, match.index),
        });
      }
      parts.push({
        type: 'code',
        content: match[1].trim(),
      });
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      parts.push({
        type: 'text',
        content: text.slice(lastIndex),
      });
    }

    return parts;
  };

  const explanationParts = parseExplanation(guide.explanation);

  const handleCopyCode = (code) => {
    navigator.clipboard?.writeText(code);
    magicalAudio.playSparkle();
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-sky-700 p-5 sm:p-6 text-white relative shrink-0">
          <button
            onClick={() => {
              magicalAudio.stop();
              onClose();
            }}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/15 hover:bg-white/25 text-white transition-colors"
            title="Close Lesson"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-[11px] font-bold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <BookOpen className="w-3 h-3 text-amber-300" />
              Lesson Guide
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Zap className="w-3 h-3" />
              +25 XP Potential
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            {guide.title || topic}
          </h2>
          <p className="text-blue-100 text-xs sm:text-sm mt-1 max-w-lg">
            {guide.summary}
          </p>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-slate-800 text-sm leading-relaxed">
          {/* Hermione Grimoire Companion Banner */}
          <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-100/70 border border-amber-300/80 rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-amber-800 text-white flex items-center justify-center text-xl shrink-0 shadow-sm">
                🦁
              </div>
              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-extrabold text-amber-950 text-xs sm:text-sm">Hermione Code-Granger</span>
                  <span className="text-[10px] bg-amber-200/80 text-amber-900 font-extrabold px-2 py-0.5 rounded-full border border-amber-300/60">
                    Spell Grimoire 📜
                  </span>
                </div>
                <p className="text-[11px] text-amber-800 line-clamp-1 mt-0.5">
                  "Swish and flick! Listen closely to the exact incantation rules."
                </p>
              </div>
            </div>

            <button
              onClick={handleToggleSpeech}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all shadow-sm ${
                isSpeaking
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'bg-amber-600 hover:bg-amber-700 text-white'
              }`}
              title={isSpeaking ? 'Stop Hermione' : 'Hermione reads lesson aloud'}
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="w-3.5 h-3.5" />
                  <span>Silence Grimoire</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Hermione Reads 🪄</span>
                </>
              )}
            </button>
          </div>

          {/* Hogwarts Spell Incantation Card */}
          {spellInfo && (
            <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-indigo-950 text-amber-100 p-4 rounded-2xl border border-amber-400/40 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>Hogwarts Spell: {spellInfo.spellName}</span>
                </span>
                <span className="text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full">
                  {spellInfo.type}
                </span>
              </div>
              <p className="text-xs text-amber-200/90 italic leading-relaxed">"{spellInfo.effect}"</p>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] pt-1 border-t border-amber-500/20 text-amber-300/80">
                <span>🪄 <strong>Wand Movement:</strong> {spellInfo.wandMovement}</span>
                <span className="font-mono bg-slate-950/70 border border-amber-500/20 px-2 py-0.5 rounded text-amber-200 text-xs">
                  {spellInfo.incantation}
                </span>
              </div>
            </div>
          )}

          {explanationParts.map((part, index) => {
            if (part.type === 'code') {
              return (
                <div key={index} className="rounded-2xl overflow-hidden border border-slate-800 shadow-md">
                  <div className="bg-slate-900 px-4 py-2 flex items-center justify-between text-xs text-slate-400 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <Code2 className="w-4 h-4 text-emerald-400" />
                      <span className="font-mono font-bold text-slate-200">python</span>
                    </div>
                    <button
                      onClick={() => handleCopyCode(part.content)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition-colors text-[11px]"
                    >
                      {copiedCode ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Code</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="bg-slate-950 p-4 overflow-x-auto text-xs sm:text-sm text-emerald-300 font-mono leading-relaxed">
                    <code>{part.content}</code>
                  </pre>
                </div>
              );
            }

            // Regular formatted text
            return (
              <div key={index} className="space-y-2 text-slate-700">
                {part.content
                  .split('\n\n')
                  .map((paragraph, pIdx) => {
                    const clean = paragraph.trim();
                    if (!clean) return null;

                    // Bullet points
                    if (clean.startsWith('- ') || clean.startsWith('* ')) {
                      const bullets = clean.split('\n').filter(Boolean);
                      return (
                        <ul key={pIdx} className="space-y-1.5 my-2">
                          {bullets.map((b, bIdx) => (
                            <li key={bIdx} className="flex items-start gap-2 text-xs sm:text-sm">
                              <span className="text-blue-600 font-bold mt-0.5">•</span>
                              <span
                                dangerouslySetInnerHTML={{
                                  __html: b
                                    .replace(/^[-*]\s*/, '')
                                    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-extrabold text-slate-900">$1</strong>')
                                    .replace(/`([^`]+)`/g, '<code class="bg-slate-100 text-pink-600 px-1 py-0.5 rounded text-[12px] font-mono">$1</code>'),
                                }}
                              />
                            </li>
                          ))}
                        </ul>
                      );
                    }

                    // Key Points Header
                    if (clean.includes('**Key Points:**')) {
                      return (
                        <div key={pIdx} className="font-extrabold text-slate-900 text-sm mt-3 mb-1">
                          Key Points & Best Practices:
                        </div>
                      );
                    }

                    return (
                      <p
                        key={pIdx}
                        className="text-xs sm:text-sm leading-relaxed text-slate-700"
                        dangerouslySetInnerHTML={{
                          __html: clean
                            .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900">$1</strong>')
                            .replace(/`([^`]+)`/g, '<code class="bg-slate-100 text-pink-600 px-1 py-0.5 rounded text-[12px] font-mono">$1</code>'),
                        }}
                      />
                    );
                  })}
              </div>
            );
          })}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            {onAskTutor && (
              <button
                onClick={() => {
                  onClose();
                  onAskTutor(topic);
                }}
                className="text-xs font-semibold text-slate-600 hover:text-blue-700 flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-slate-200/60 transition-colors"
              >
                <Bot className="w-4 h-4 text-blue-600" />
                <span>Ask AI Tutor</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => {
                magicalAudio.stop();
                onClose();
              }}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors"
            >
              Close
            </button>

            {onStartQuiz && (
              <button
                onClick={() => {
                  magicalAudio.stop();
                  magicalAudio.playWand();
                  onClose();
                  onStartQuiz(topic);
                }}
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs shadow-md shadow-blue-500/20 hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 text-amber-300" />
                <span>Practice Quiz (+25 XP)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
