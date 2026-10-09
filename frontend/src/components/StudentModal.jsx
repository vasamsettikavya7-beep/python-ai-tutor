import React, { useState } from 'react';
import { X, UserPlus, LogIn, Sparkles, Check, AlertCircle } from 'lucide-react';
import { registerStudent, getStudent } from '../services/api';

export default function StudentModal({
  isOpen,
  onClose,
  currentStudent,
  onSelectStudent,
}) {
  const [mode, setMode] = useState('register'); // 'register' | 'switch'
  const [name, setName] = useState('');
  const [level, setLevel] = useState('Beginner');
  const [difficulty, setDifficulty] = useState('Easy');
  const [switchId, setSwitchId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  if (!isOpen) return null;

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter the student name.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const result = await registerStudent({
        name: name.trim(),
        level,
        difficulty,
      });

      setSuccessMessage(result.message || 'Student registered successfully!');
      
      // Fetch full profile for newly created student
      const studentProfile = await getStudent(result.student_id);
      
      setTimeout(() => {
        onSelectStudent(studentProfile);
        onClose();
      }, 700);
    } catch (err) {
      if (err.message && err.message.includes('Unable to connect')) {
        const offlineProfile = {
          id: Math.floor(Math.random() * 900) + 100,
          name: name.trim() || 'Student',
          level,
          difficulty,
          xp: 0,
          streak: 1,
        };
        onSelectStudent(offlineProfile);
        onClose();
        return;
      }
      setError(err.message || 'Failed to register student.');
    } finally {
      setLoading(false);
    }
  };

  const handleSwitch = async (e) => {
    e.preventDefault();
    if (!switchId) {
      setError('Please enter a valid Student ID.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const studentProfile = await getStudent(Number(switchId));
      onSelectStudent(studentProfile);
      onClose();
    } catch (err) {
      if (err.message && err.message.includes('Unable to connect')) {
        const targetId = Number(switchId) || 1;
        const savedStudent = localStorage.getItem(`python_buddy_student_${targetId}`);
        let offlineProfile = null;
        if (savedStudent) {
          try { offlineProfile = JSON.parse(savedStudent); } catch {}
        }
        if (!offlineProfile) {
          offlineProfile = {
            id: targetId,
            name: `Student #${targetId}`,
            level: 'Beginner',
            difficulty: 'Easy',
            xp: 0,
            streak: 1,
            sessions_completed: 0,
          };
        }
        onSelectStudent(offlineProfile);
        onClose();
        return;
      }
      setError(err.message || 'Student ID not found.');
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    if (!currentStudent) {
      const fallbackProfile = {
        id: 1,
        name: 'Student',
        level: 'Beginner',
        difficulty: 'Easy',
        xp: 0,
      };
      onSelectStudent(fallbackProfile);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden relative">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-blue-600 via-sky-600 to-indigo-700 text-white relative">
          <button
            onClick={handleModalClose}
            className="absolute top-5 right-5 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🐍</span>
            <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full">
              Student Profile
            </span>
          </div>
          <h2 className="text-xl font-extrabold">
            {mode === 'register' ? 'Register New Student' : 'Switch Student ID'}
          </h2>
          <p className="text-blue-100 text-xs mt-1">
            {currentStudent
              ? `Currently active: ${currentStudent.name} (ID #${currentStudent.id})`
              : 'Set up your learning profile to track progress'}
          </p>

          {/* Mode Switch Tabs */}
          <div className="flex gap-2 mt-4 bg-black/15 p-1 rounded-xl">
            <button
              onClick={() => {
                setMode('register');
                setError(null);
              }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                mode === 'register'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              New Student
            </button>
            <button
              onClick={() => {
                setMode('switch');
                setError(null);
              }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                mode === 'switch'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              Existing Student ID
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {mode === 'register' ? (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Student Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name (e.g. Alex)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Level
                  </label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium bg-white"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Difficulty
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium bg-white"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Create & Start Learning</span>
                  </>
                )}
              </button>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  disabled={loading}
                  onClick={async () => {
                    setLoading(true);
                    setError(null);
                    try {
                      const result = await registerStudent({
                        name: 'Student',
                        level,
                        difficulty,
                      });
                      const profile = await getStudent(result.student_id);
                      onSelectStudent(profile);
                      onClose();
                    } catch (err) {
                      setError(err.message || 'Failed to create student.');
                    } finally {
                      setLoading(false);
                    }
                  }}
                  className="text-xs text-slate-500 hover:text-blue-600 font-semibold transition-colors"
                >
                  ⚡ Or Quick Start as "Student" (0% Score)
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSwitch} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Enter Student ID
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={switchId}
                  onChange={(e) => setSwitchId(e.target.value)}
                  placeholder="e.g. 1"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
                />
              </div>



              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-900 disabled:opacity-50 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 mt-4"
              >
                {loading ? (
                  <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Load Student Profile</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
