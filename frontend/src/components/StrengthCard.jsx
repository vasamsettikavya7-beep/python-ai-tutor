import React from 'react';
import { CheckCircle2, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';

export default function StrengthCard({
  type = 'strength', // 'strength' | 'weakness'
  items = [],
  onTopicAction,
}) {
  const isStrength = type === 'strength';

  const config = isStrength
    ? {
        title: 'Your Strengths',
        emoji: '💪',
        bg: 'bg-emerald-50/60',
        border: 'border-emerald-200/80',
        badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        icon: CheckCircle2,
        iconColor: 'text-emerald-600',
        emptyText: 'Answer questions in the Quiz with ≥ 70% accuracy to unlock your strengths.',
        subtext: 'Topics you have mastered (≥ 70% accuracy)',
        actionLabel: 'Review',
      }
    : {
        title: 'Needs Practice',
        emoji: '📚',
        bg: 'bg-amber-50/60',
        border: 'border-amber-200/80',
        badgeBg: 'bg-amber-100 text-amber-800 border-amber-200',
        icon: AlertCircle,
        iconColor: 'text-amber-600',
        emptyText: 'No critical weaknesses detected! Keep challenging yourself.',
        subtext: 'Topics requiring further review (< 70% accuracy)',
        actionLabel: 'Practice Now',
      };

  const Icon = config.icon;

  return (
    <div className={`sparkle-card relative overflow-hidden group rounded-2xl border ${config.border} ${config.bg} p-6 shadow-xs h-full flex flex-col justify-between`}>
      {/* Corner magical stardust sparkle */}
      <span className="absolute top-2.5 right-2.5 text-xs opacity-40 group-hover:opacity-100 group-hover:scale-125 transition-all select-none pointer-events-none">
        ✨
      </span>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">{config.emoji}</span>
            <h3 className="font-extrabold text-slate-800 text-lg">
              {config.title}
            </h3>
          </div>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white text-slate-600 border border-slate-200">
            {items.length} {items.length === 1 ? 'Topic' : 'Topics'}
          </span>
        </div>

        <p className="text-xs text-slate-500 mb-4 font-medium">
          {config.subtext}
        </p>

        {items && items.length > 0 ? (
          <div className="space-y-2.5">
            {items.map((topic, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-3 border border-slate-200/80 shadow-xs flex items-center justify-between group hover:border-slate-300 transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${config.iconColor} shrink-0`} />
                  <span className="font-bold text-sm text-slate-800">
                    {topic}
                  </span>
                </div>

                {onTopicAction && (
                  <button
                    onClick={() => onTopicAction(topic, isStrength ? 'Review' : 'Practice')}
                    className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 group-hover:translate-x-0.5 transition-all"
                  >
                    <span>{config.actionLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white/70 rounded-xl p-4 border border-dashed border-slate-300 text-center py-6">
            <p className="text-xs text-slate-500 leading-relaxed">
              {config.emptyText}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
