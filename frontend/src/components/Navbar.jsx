import React, { useState } from 'react';
import {
  LayoutDashboard,
  GraduationCap,
  Sparkles,
  BarChart3,
  User,
  Zap,
  Menu,
  X,
  Server,
  RefreshCw,
  Palette,
  Check,
  ArrowLeft,
  Home,
} from 'lucide-react';

export default function Navbar({
  activeTab,
  setActiveTab,
  student,
  xp,
  isBackendHealthy,
  onOpenStudentModal,
  onStartFresh,
  onRefresh,
  currentTheme = 'ambient',
  onThemeChange,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);

  const THEMES = [
    { id: 'ambient', name: 'Warm Sky & Amber', badge: 'Default', icon: '☀️', desc: 'Friendly, warm gradient' },
    { id: 'mint', name: 'Eye Comfort Mint', badge: 'Ergonomic', icon: '🌿', desc: 'Calming, reduces eye strain' },
    { id: 'clean', name: 'Clean Modern Slate', badge: 'Minimal', icon: '⚪', desc: 'Crisp & distraction-free' },
    { id: 'dark', name: 'Dark Academy', badge: 'Night', icon: '🌙', desc: 'Deep focus for late hours' },
  ];

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tutor', label: 'Learn / AI Tutor', icon: GraduationCap },
    { id: 'quiz', label: 'Quiz', icon: Sparkles },
    { id: 'progress', label: 'Progress', icon: BarChart3 },
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleNavClick('dashboard')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 via-blue-600 to-amber-500 p-0.5 shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center text-xl">
                  🐍
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-blue-700 via-sky-600 to-amber-600 bg-clip-text text-transparent">
                    Python Buddy
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 uppercase tracking-wider">
                    AI Tutor
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 -mt-0.5 hidden sm:block">
                  Personalized Learning Engine
                </p>
              </div>
            </button>

            {/* Quick Home / Return to Dashboard button when navigating other pages */}
            {activeTab !== 'dashboard' && (
              <button
                onClick={() => handleNavClick('dashboard')}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold transition-all shadow-2xs group"
                title="Return to Student Dashboard"
              >
                <Home className="w-3.5 h-3.5 text-blue-600 group-hover:scale-110 transition-transform" />
                <span>Home</span>
              </button>
            )}
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-white text-blue-700 shadow-sm shadow-slate-200 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-blue-600' : 'text-slate-400'
                    }`}
                  />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Area: Student Profile & Backend Status */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Backend status indicator */}
            <div
              className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                isBackendHealthy
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse'
              }`}
              title={
                isBackendHealthy
                  ? 'FastAPI Backend Online (127.0.0.1:8000)'
                  : 'Backend Offline'
              }
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isBackendHealthy ? 'bg-emerald-500' : 'bg-rose-500'
                }`}
              />
              <span className="text-[11px]">
                {isBackendHealthy ? 'API Active' : 'API Offline'}
              </span>
            </div>

            {/* XP Pill */}
            <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200/80 text-amber-900 px-3 py-1.5 rounded-full shadow-xs">
              <Zap className="w-4 h-4 fill-amber-400 text-amber-500 animate-bounce" />
              <span className="text-xs font-extrabold tracking-tight">
                {xp ?? 0}
              </span>
              <span className="text-[10px] font-semibold text-amber-700">XP</span>
            </div>

            {/* Student Switcher / Profile Button */}
            <button
              onClick={onOpenStudentModal}
              className="flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 px-3 py-1.5 rounded-xl transition-all shadow-xs hover:border-slate-300 text-left group"
              title="Switch or Register Student"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-xs">
                {student?.name ? student.name.charAt(0).toUpperCase() : 'S'}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-bold leading-tight text-slate-800 group-hover:text-blue-600 transition-colors">
                  {student?.name || 'Select Student'}
                </div>
                <div className="text-[10px] text-slate-500 leading-tight">
                  {student?.level || 'Beginner'} • ID #{student?.id || '-'}
                </div>
              </div>
            </button>

            {/* Quick New Student (0% Score) button */}
            {onStartFresh && (
              <button
                onClick={onStartFresh}
                className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 text-blue-700 border border-blue-200 text-xs font-bold transition-all shadow-2xs"
                title="Create a fresh student profile starting at 0% score and 0 XP"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>+ Fresh Student (0%)</span>
              </button>
            )}

            {/* Theme Selector Popover */}
            <div className="relative">
              <button
                onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
                className="flex items-center gap-1.5 p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors border border-transparent hover:border-slate-200"
                title="Change Background Theme & Eye Comfort"
              >
                <Palette className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-semibold hidden xl:inline">Theme</span>
              </button>

              {themeDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setThemeDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-2 border-b border-slate-100">
                      <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <Palette className="w-3.5 h-3.5 text-blue-600" />
                        <span>Theme & Background</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Optimized for readability and eye comfort
                      </p>
                    </div>

                    <div className="py-1 space-y-1">
                      {THEMES.map((t) => {
                        const isSelected = currentTheme === t.id;
                        return (
                          <button
                            key={t.id}
                            onClick={() => {
                              onThemeChange?.(t.id);
                              setThemeDropdownOpen(false);
                            }}
                            className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all ${
                              isSelected
                                ? 'bg-blue-50 text-blue-900 ring-1 ring-blue-300 font-bold'
                                : 'hover:bg-slate-50 text-slate-700'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="text-lg">{t.icon}</span>
                              <div>
                                <div className="text-xs font-bold flex items-center gap-1.5">
                                  <span>{t.name}</span>
                                  {t.badge && (
                                    <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600 border border-slate-200 uppercase font-semibold">
                                      {t.badge}
                                    </span>
                                  )}
                                </div>
                                <div className="text-[10px] text-slate-500 font-normal">
                                  {t.desc}
                                </div>
                              </div>
                            </div>
                            {isSelected && (
                              <Check className="w-4 h-4 text-blue-600 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Refresh button */}
            <button
              onClick={onRefresh}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-2">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-bold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-blue-600' : 'text-slate-400'
                    }`}
                  />
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Theme selector in mobile menu */}
          <div className="pt-2 border-t border-slate-100">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              Background Theme
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    onThemeChange?.(t.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 p-2 rounded-xl text-xs font-semibold text-left border ${
                    currentTheme === t.id
                      ? 'bg-blue-50 text-blue-800 border-blue-300 font-bold'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span>{t.icon}</span>
                  <span className="truncate">{t.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
