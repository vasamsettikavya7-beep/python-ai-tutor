import React, { useState, useEffect } from 'react';
import {
  X,
  UserPlus,
  LogIn,
  Sparkles,
  Check,
  AlertCircle,
  Search,
  Zap,
  User,
  ArrowRight,
  ShieldCheck,
  KeyRound,
} from 'lucide-react';
import { registerStudent, getStudent } from '../services/api';

const STORAGE_STUDENT_ID_KEY = 'python_buddy_student_id';

export default function StudentModal({
  isOpen,
  onClose,
  currentStudent,
  onSelectStudent,
  initialMode = 'switch',
}) {
  const [mode, setMode] = useState(initialMode || (currentStudent ? 'switch' : 'register')); // 'switch' | 'register'
  const [switchId, setSwitchId] = useState('');
  const [foundProfile, setFoundProfile] = useState(null);
  const [name, setName] = useState('');
  const [level, setLevel] = useState('Beginner');
  const [difficulty, setDifficulty] = useState('Easy');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Sync state whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode || (currentStudent ? 'switch' : 'register'));
      setError(null);
      setSuccessMessage(null);
      setSwitchId('');
      setFoundProfile(null);
    }
  }, [isOpen, initialMode, currentStudent]);

  if (!isOpen) return null;

  // Retrieve saved profile for this specific browser/device
  const deviceSavedStudent = (() => {
    if (currentStudent) return currentStudent;
    try {
      const savedId = localStorage.getItem(STORAGE_STUDENT_ID_KEY);
      if (savedId) {
        const raw = localStorage.getItem(`python_buddy_student_${savedId}`);
        if (raw) return JSON.parse(raw);
      }
    } catch {}
    return null;
  })();

  // Lookup only the requested student ID
  const handleLookupStudent = async (e) => {
    e.preventDefault();
    if (!switchId.trim()) {
      setError('Please enter your Student ID.');
      return;
    }

    const targetId = Number(switchId.trim());
    if (isNaN(targetId) || targetId <= 0) {
      setError('Please enter a valid numeric Student ID.');
      return;
    }

    setLoading(true);
    setError(null);
    setFoundProfile(null);

    try {
      // 1. Try fetching from backend API
      let profile = null;
      try {
        profile = await getStudent(targetId);
      } catch (backendErr) {
        // 2. If backend offline, check local storage for this specific student
        const localRaw = localStorage.getItem(`python_buddy_student_${targetId}`);
        if (localRaw) {
          profile = JSON.parse(localRaw);
        }
      }

      if (profile && profile.name) {
        setFoundProfile(profile);
      } else {
        setError(`Student ID #${targetId} was not found. Please verify your ID or create a new student profile.`);
      }
    } catch (err) {
      setError('Unable to lookup student. Please check your ID number.');
    } finally {
      setLoading(false);
    }
  };

  // Confirm and log in as the verified student
  const handleConfirmLogin = (profile) => {
    if (!profile) return;
    try {
      localStorage.setItem(STORAGE_STUDENT_ID_KEY, profile.id);
      localStorage.setItem(`python_buddy_student_${profile.id}`, JSON.stringify(profile));
    } catch {}
    onSelectStudent(profile);
    onClose();
  };

  // Register a new student
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your name.');
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

      setSuccessMessage(result.message || 'Profile registered successfully!');

      let studentProfile;
      try {
        studentProfile = await getStudent(result.student_id);
      } catch {
        studentProfile = {
          id: result.student_id,
          name: name.trim(),
          level,
          difficulty,
          xp: 0,
          streak: 1,
        };
      }

      try {
        localStorage.setItem(STORAGE_STUDENT_ID_KEY, studentProfile.id);
        localStorage.setItem(`python_buddy_student_${studentProfile.id}`, JSON.stringify(studentProfile));
      } catch {}

      setTimeout(() => {
        onSelectStudent(studentProfile);
        onClose();
      }, 700);
    } catch (err) {
      if (err.message && err.message.includes('Unable to connect')) {
        const nextId = Math.floor(Math.random() * 900) + 100;
        const offlineProfile = {
          id: nextId,
          name: name.trim() || 'Student',
          level,
          difficulty,
          xp: 0,
          streak: 1,
          sessions_completed: 0,
        };
        try {
          localStorage.setItem(STORAGE_STUDENT_ID_KEY, offlineProfile.id);
          localStorage.setItem(`python_buddy_student_${offlineProfile.id}`, JSON.stringify(offlineProfile));
        } catch {}
        onSelectStudent(offlineProfile);
        onClose();
        return;
      }
      setError(err.message || 'Failed to register student.');
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    if (!currentStudent && deviceSavedStudent) {
      onSelectStudent(deviceSavedStudent);
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
            {mode === 'switch' ? 'Student Relogin' : 'Register New Student'}
          </h2>
          <p className="text-blue-100 text-xs mt-1">
            {mode === 'switch'
              ? 'Enter your Student ID to access your personal profile & progress'
              : 'Create your personal profile to track your Python learning journey'}
          </p>

          {/* Mode Tabs */}
          <div className="flex gap-2 mt-4 bg-black/15 p-1 rounded-xl">
            <button
              onClick={() => {
                setMode('switch');
                setError(null);
                setFoundProfile(null);
              }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                mode === 'switch'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              Relogin with ID
            </button>
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
          </div>
        </div>

        {/* Modal Body */}
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

          {mode === 'switch' ? (
            /* PRIVATE RELOGIN VIEW - NO PUBLIC DIRECTORY */
            <div className="space-y-4">
              {/* If this device has an active/saved profile, display ONLY this user's profile to resume */}
              {deviceSavedStudent && !foundProfile && (
                <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Your Saved Account on This Device
                    </span>
                    <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md font-bold">
                      ID #{deviceSavedStudent.id}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold text-sm flex items-center justify-center shadow-xs">
                        {deviceSavedStudent.name ? deviceSavedStudent.name.charAt(0).toUpperCase() : 'S'}
                      </div>
                      <div>
                        <div className="text-sm font-extrabold text-slate-900">
                          {deviceSavedStudent.name}
                        </div>
                        <div className="text-xs text-slate-500">
                          {deviceSavedStudent.level} • {deviceSavedStudent.difficulty || 'Easy'}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-amber-900 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full inline-flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                        <span>{deviceSavedStudent.xp ?? 0} XP</span>
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleConfirmLogin(deviceSavedStudent)}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <span>Continue as {deviceSavedStudent.name}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* ID Lookup Form */}
              <form onSubmit={handleLookupStudent} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1">
                    <KeyRound className="w-3.5 h-3.5 text-blue-600" />
                    <span>{deviceSavedStudent ? 'Or Login with Another Student ID' : 'Enter Your Student ID'}</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="1"
                      required
                      value={switchId}
                      onChange={(e) => {
                        setSwitchId(e.target.value);
                        setFoundProfile(null);
                        setError(null);
                      }}
                      placeholder="e.g. 1 or 2"
                      className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
                    />
                    <button
                      type="submit"
                      disabled={loading || !switchId.trim()}
                      className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                    >
                      {loading ? (
                        <span className="animate-spin inline-block w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full" />
                      ) : (
                        <>
                          <Search className="w-3.5 h-3.5" />
                          <span>Find Profile</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>

              {/* If a profile was found, display ONLY that specific user's details */}
              {foundProfile && (
                <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 animate-in fade-in duration-150 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-emerald-800 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      Profile Found for ID #{foundProfile.id}
                    </span>
                    <span className="text-xs font-bold text-amber-900 bg-amber-100/80 border border-amber-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <Zap className="w-3 h-3 fill-amber-400 text-amber-500" />
                      <span>{foundProfile.xp ?? 0} XP</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white font-bold text-sm flex items-center justify-center shadow-xs">
                      {foundProfile.name ? foundProfile.name.charAt(0).toUpperCase() : 'S'}
                    </div>
                    <div>
                      <div className="text-sm font-extrabold text-slate-900">
                        {foundProfile.name}
                      </div>
                      <div className="text-xs text-slate-500">
                        {foundProfile.level} • {foundProfile.difficulty || 'Easy'}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleConfirmLogin(foundProfile)}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <span>Confirm & Login as {foundProfile.name}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* REGISTER NEW STUDENT VIEW */
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Your Name
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
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium bg-white"
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
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium bg-white"
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
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
