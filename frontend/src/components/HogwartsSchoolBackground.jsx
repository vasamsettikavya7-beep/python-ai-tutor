import React, { useMemo } from 'react';

/**
 * HogwartsSchoolBackground
 * Creates an authentic Harry Potter Great Hall / Hogwarts Castle atmospheric background:
 * - Floating candles drifting at staggered heights with warm golden flames
 * - Enchanted starry night ceiling with twinkling constellations
 * - Hogwarts Castle silhouette on the horizon with warm glowing dormitory & Great Hall windows
 * - Gothic stone cloister archways framing the view
 * - Gentle floating golden stardust / magical embers
 */
export default function HogwartsSchoolBackground({ isHogwartsTheme = true }) {
  // Generate floating candles with realistic staggered positions & float delays
  const candles = useMemo(() => [
    { id: 1, left: '6%', top: '7%', size: 'md', delay: '0s', duration: '6.2s', flameDelay: '0.2s' },
    { id: 2, left: '14%', top: '15%', size: 'sm', delay: '1.4s', duration: '5.5s', flameDelay: '0.7s' },
    { id: 3, left: '22%', top: '8%', size: 'lg', delay: '0.6s', duration: '6.8s', flameDelay: '0.1s' },
    { id: 4, left: '33%', top: '18%', size: 'sm', delay: '2.1s', duration: '5.8s', flameDelay: '1.2s' },
    { id: 5, left: '42%', top: '6%', size: 'md', delay: '1.8s', duration: '6.4s', flameDelay: '0.4s' },
    { id: 6, left: '54%', top: '14%', size: 'lg', delay: '0.3s', duration: '7.1s', flameDelay: '0.9s' },
    { id: 7, left: '63%', top: '8%', size: 'sm', delay: '2.5s', duration: '5.9s', flameDelay: '0.3s' },
    { id: 8, left: '74%', top: '16%', size: 'md', delay: '1.1s', duration: '6.5s', flameDelay: '1.4s' },
    { id: 9, left: '84%', top: '9%', size: 'lg', delay: '0.9s', duration: '6.9s', flameDelay: '0.5s' },
    { id: 10, left: '92%', top: '19%', size: 'sm', delay: '1.6s', duration: '5.6s', flameDelay: '1.1s' },
    { id: 11, left: '28%', top: '24%', size: 'xs', delay: '2.8s', duration: '6.1s', flameDelay: '0.8s' },
    { id: 12, left: '69%', top: '23%', size: 'xs', delay: '2.3s', duration: '6.3s', flameDelay: '0.6s' },
    { id: 13, left: '48%', top: '22%', size: 'xs', delay: '3.1s', duration: '5.7s', flameDelay: '1.3s' },
  ], []);

  // Twinkling stars scattered across the enchanted ceiling
  const stars = useMemo(() => [
    { top: '4%', left: '12%', size: 2, delay: '0.2s', dur: '3.1s' },
    { top: '9%', left: '28%', size: 2.5, delay: '1.1s', dur: '2.7s' },
    { top: '6%', left: '45%', size: 3, delay: '2.3s', dur: '3.8s' },
    { top: '12%', left: '59%', size: 2, delay: '0.7s', dur: '2.4s' },
    { top: '5%', left: '77%', size: 3.5, delay: '1.8s', dur: '4.2s' },
    { top: '10%', left: '88%', size: 2, delay: '0.4s', dur: '2.9s' },
    { top: '16%', left: '8%', size: 2.5, delay: '2.0s', dur: '3.4s' },
    { top: '22%', left: '38%', size: 2, delay: '1.4s', dur: '3.0s' },
    { top: '20%', left: '82%', size: 3, delay: '0.9s', dur: '4.0s' },
    { top: '15%', left: '95%', size: 2, delay: '1.6s', dur: '2.8s' },
    { top: '2%', left: '65%', size: 3, delay: '2.6s', dur: '3.6s' },
    { top: '8%', left: '3%', size: 2, delay: '0.8s', dur: '3.3s' },
  ], []);

  // Floating golden embers / stardust
  const embers = useMemo(() => [
    { left: '15%', bottom: '15%', delay: '0s', dur: '8s', size: 3 },
    { left: '30%', bottom: '25%', delay: '2.2s', dur: '9.5s', size: 2 },
    { left: '50%', bottom: '10%', delay: '4.1s', dur: '7.8s', size: 3.5 },
    { left: '72%', bottom: '30%', delay: '1.5s', dur: '8.8s', size: 2.5 },
    { left: '88%', bottom: '20%', delay: '3.3s', dur: '9.1s', size: 3 },
  ], []);

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden select-none z-0"
      aria-hidden="true"
    >
      {/* 1. Deep Celestial Sky Gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050814] via-[#091024] to-[#0d142b]" />

      {/* 2. Mystical Nebulae & Ambient Candle Halos */}
      <div className="absolute -top-32 left-1/4 w-[600px] h-[500px] bg-amber-500/10 rounded-full blur-[120px]" />
      <div className="absolute top-10 right-10 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[140px]" />
      <div className="absolute top-1/3 left-10 w-[450px] h-[450px] bg-indigo-600/10 rounded-full blur-[130px]" />
      <div className="absolute bottom-0 right-1/4 w-[700px] h-[350px] bg-amber-600/10 rounded-full blur-[140px]" />

      {/* 3. Enchanted Ceiling: Twinkling Stars */}
      {stars.map((star, idx) => (
        <div
          key={idx}
          className="absolute rounded-full bg-amber-100 shadow-[0_0_8px_rgba(254,240,138,0.9)] animate-pulse"
          style={{
            top: star.top,
            left: star.left,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: star.delay,
            animationDuration: star.dur,
          }}
        />
      ))}

      {/* 4. The Harvest Moon in upper-right sky */}
      <div className="absolute top-8 right-24 w-28 h-28 rounded-full bg-gradient-to-tr from-amber-100 via-amber-200 to-yellow-100 opacity-20 blur-[1px] shadow-[0_0_50px_rgba(254,240,138,0.25)] pointer-events-none">
        <div className="w-full h-full rounded-full bg-slate-950/20 mix-blend-overlay" />
      </div>

      {/* 5. Hogwarts Castle Horizon Silhouette (with warm glowing windows) */}
      <div className="absolute bottom-0 left-0 right-0 h-44 sm:h-56 pointer-events-none opacity-45">
        <svg
          viewBox="0 0 1440 320"
          className="w-full h-full preserve-3d"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Distant Castle Spire Silhouettes */}
          <path
            d="M0,320 L0,260 L90,260 L100,210 L110,210 L115,160 L120,210 L130,210 L140,260 L230,260 
               L250,220 L260,180 L270,120 L275,80 L280,120 L290,180 L300,220 L320,260 L410,260 
               L420,230 L440,230 L450,190 L460,190 L465,140 L470,190 L480,190 L490,230 L520,260 
               L600,260 L620,210 L640,170 L650,110 L655,70 L660,110 L670,170 L690,210 L710,260 
               L790,260 L810,240 L830,240 L850,200 L860,150 L865,100 L870,150 L880,200 L900,240 
               L920,260 L1020,260 L1040,210 L1050,170 L1060,130 L1065,90 L1070,130 L1080,170 
               L1090,210 L1110,260 L1210,260 L1220,230 L1240,230 L1250,180 L1255,140 L1260,180 
               L1270,230 L1290,260 L1440,260 L1440,320 Z"
            fill="#030611"
          />

          {/* Great Hall Pitch Roof & Main Battlements */}
          <path
            d="M320,260 L340,210 L370,180 L420,180 L440,150 L470,150 L490,180 L540,180 L570,210 
               L600,260 L710,260 L730,190 L760,160 L800,160 L820,130 L850,130 L870,160 L910,160 
               L930,190 L950,260 L1050,260 L1080,220 L1120,190 L1160,190 L1190,220 L1210,260 Z"
            fill="#050917"
            fillOpacity="0.9"
          />

          {/* Arched Viaduct Bridge */}
          <path
            d="M130,260 Q180,240 230,260 M230,260 Q280,240 330,260 M330,260 Q380,240 430,260 
               M800,260 Q850,240 900,260 M900,260 Q950,240 1000,260"
            stroke="#040714"
            strokeWidth="12"
            fill="none"
          />

          {/* Glowing Amber Windows of Great Hall & Dormitories */}
          <g fill="#f59e0b" opacity="0.85">
            {/* Great Hall Grand Windows */}
            <rect x="350" y="210" width="8" height="20" rx="4" />
            <rect x="370" y="205" width="8" height="25" rx="4" />
            <rect x="390" y="205" width="8" height="25" rx="4" />
            <rect x="410" y="210" width="8" height="20" rx="4" />
            <rect x="500" y="210" width="8" height="20" rx="4" />
            <rect x="520" y="205" width="8" height="25" rx="4" />
            <rect x="540" y="210" width="8" height="20" rx="4" />

            {/* Astronomy & Gryffindor Tower Windows */}
            <circle cx="275" cy="140" r="3.5" />
            <circle cx="275" cy="160" r="3.5" />
            <circle cx="275" cy="180" r="3.5" />
            <circle cx="655" cy="120" r="4" />
            <circle cx="655" cy="140" r="4" />
            <circle cx="655" cy="165" r="4" />
            <circle cx="865" cy="130" r="3.5" />
            <circle cx="865" cy="155" r="3.5" />
            <circle cx="1065" cy="125" r="3.5" />
            <circle cx="1065" cy="150" r="3.5" />
            <circle cx="1255" cy="170" r="3" />
          </g>
        </svg>
      </div>

      {/* 6. The Great Hall Floating Candles with Authentic Flame Halo */}
      {candles.map((c) => {
        const candleWidth = c.size === 'lg' ? 14 : c.size === 'md' ? 11 : c.size === 'sm' ? 8 : 6;
        const candleHeight = c.size === 'lg' ? 36 : c.size === 'md' ? 28 : c.size === 'sm' ? 22 : 16;
        const flameSize = c.size === 'lg' ? 16 : c.size === 'md' ? 12 : c.size === 'sm' ? 10 : 7;

        return (
          <div
            key={c.id}
            className="absolute flex flex-col items-center pointer-events-none"
            style={{
              left: c.left,
              top: c.top,
              animation: `hogwarts-float ${c.duration} ease-in-out infinite alternate`,
              animationDelay: c.delay,
            }}
          >
            {/* Candle Flame Aura Glow */}
            <div
              className="rounded-full bg-amber-400/30 blur-xs absolute -top-3"
              style={{
                width: `${flameSize * 2.2}px`,
                height: `${flameSize * 2.2}px`,
              }}
            />

            {/* Flickering Teardrop Flame */}
            <div
              className="relative flex items-center justify-center"
              style={{
                animation: `hogwarts-flicker 1.8s ease-in-out infinite alternate`,
                animationDelay: c.flameDelay,
              }}
            >
              {/* Outer Amber Flame */}
              <div
                className="rounded-full bg-gradient-to-t from-amber-500 via-yellow-400 to-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.9),0_0_24px_rgba(217,119,6,0.6)]"
                style={{
                  width: `${flameSize}px`,
                  height: `${flameSize * 1.5}px`,
                  borderRadius: '50% 50% 35% 35% / 60% 60% 40% 40%',
                }}
              >
                {/* Inner White-Hot Core */}
                <div
                  className="w-1.5 h-2 bg-white rounded-full mx-auto mt-1 blur-[0.5px]"
                />
              </div>
            </div>

            {/* Candle Wick */}
            <div className="w-[1.5px] h-1.5 bg-amber-950 -mt-0.5" />

            {/* Wax Candle Body */}
            <div
              className="rounded-xs bg-gradient-to-b from-[#fef3c7] via-[#fde68a] to-[#d97706]/70 shadow-[0_2px_8px_rgba(0,0,0,0.6)] border border-amber-200/40"
              style={{
                width: `${candleWidth}px`,
                height: `${candleHeight}px`,
              }}
            >
              {/* Wax drip highlight */}
              <div className="w-full h-1 bg-white/60 rounded-full" />
            </div>
          </div>
        );
      })}

      {/* 7. Gothic Cloister Arches Framing the View (Top Left & Top Right) */}
      <div className="absolute top-0 left-0 w-32 sm:w-48 h-40 pointer-events-none opacity-30">
        <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
          <path
            d="M0,0 L100,0 C60,0 20,40 0,100 Z"
            fill="#030611"
          />
          <path
            d="M0,0 L85,0 C50,5 15,45 0,90 Z"
            stroke="#1e293b"
            strokeWidth="2"
            fill="none"
          />
        </svg>
      </div>

      <div className="absolute top-0 right-0 w-32 sm:w-48 h-40 pointer-events-none opacity-30 scale-x-[-1]">
        <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
          <path
            d="M0,0 L100,0 C60,0 20,40 0,100 Z"
            fill="#030611"
          />
          <path
            d="M0,0 L85,0 C50,5 15,45 0,90 Z"
            stroke="#1e293b"
            strokeWidth="2"
            fill="none"
          />
        </svg>
      </div>

      {/* 8. Floating Golden Embers / Magical Stardust drifting upward */}
      {embers.map((em, idx) => (
        <div
          key={idx}
          className="absolute rounded-full bg-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.9)] opacity-70"
          style={{
            left: em.left,
            bottom: em.bottom,
            width: `${em.size}px`,
            height: `${em.size}px`,
            animation: `hogwarts-ember ${em.dur} linear infinite`,
            animationDelay: em.delay,
          }}
        />
      ))}
    </div>
  );
}
