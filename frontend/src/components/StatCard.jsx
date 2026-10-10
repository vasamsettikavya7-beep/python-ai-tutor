import React from 'react';

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'blue',
  badge,
  onClick,
}) {
  const colorThemes = {
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-100',
      text: 'text-blue-700',
      iconBg: 'bg-blue-100 text-blue-700',
      valColor: 'text-blue-900',
    },
    amber: {
      bg: 'bg-amber-50',
      border: 'border-amber-100',
      text: 'text-amber-700',
      iconBg: 'bg-amber-100 text-amber-700',
      valColor: 'text-amber-900',
    },
    emerald: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-100',
      text: 'text-emerald-700',
      iconBg: 'bg-emerald-100 text-emerald-700',
      valColor: 'text-emerald-900',
    },
    purple: {
      bg: 'bg-purple-50',
      border: 'border-purple-100',
      text: 'text-purple-700',
      iconBg: 'bg-purple-100 text-purple-700',
      valColor: 'text-purple-900',
    },
  };

  const theme = colorThemes[color] || colorThemes.blue;

  return (
    <div
      onClick={onClick}
      className={`sparkle-card bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs transition-all relative ${
        onClick ? 'cursor-pointer hover:border-slate-300 hover:shadow-md' : ''
      }`}
    >
      {/* Decorative magical corner sparkle */}
      <span className="absolute top-2.5 right-2.5 text-[11px] opacity-40 group-hover:opacity-100 group-hover:scale-125 transition-all select-none pointer-events-none">
        ✨
      </span>
      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <span className={`text-3xl font-extrabold tracking-tight ${theme.valColor}`}>
              {value}
            </span>
            {badge && (
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${theme.bg} ${theme.text}`}>
                {badge}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-1.5 font-medium">
              {subtitle}
            </p>
          )}
        </div>

        {Icon && (
          <div className={`p-3 rounded-xl ${theme.iconBg} shadow-xs`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  );
}
