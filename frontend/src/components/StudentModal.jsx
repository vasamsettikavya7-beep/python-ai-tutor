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
  GraduationCap,
} from 'lucide-react';
import { registerStudent, getStudent } from '../services/api';

const STORAGE_ALL_STUDENTS_KEY = 'python_buddy_all_students';

// Seeded known students from the database to display even on a fresh browser
const INITIAL_REGISTERED_STUDENTS = [
  { id: 1, name: 'Iya', level: 'Beginner', difficulty: 'Easy', xp: 105, streak: 1 },
  { id: 2, name: 'Rahul', level: 'Beginner', difficulty: 'Easy', xp: 80, streak: 1 },
  { id: 3, name: 'NewStudent', level: 'Beginner', difficulty: 'Easy', xp: 165, streak: 1 },
  { id: 4, name: 'Rahul', level: 'Beginner', difficulty: 'Easy', xp: 80, streak: 1 },
  { id: 6, name: 'Jam', level: 'Advanced', difficulty: 'Hard', xp: 0, streak: 0 },
  { id: 7, name: 'Student', level: 'Beginner', difficulty: 'Easy', xp: 0, streak: 0 },
];

function getStoredStudents() {
  try {
    const raw = localStorage.getItem(STORAGE_ALL_STUDENTS_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_ALL_STUDENTS_KEY, JSON.stringify(INITIAL_REGISTERED_STUDENTS));
      return INITIAL_REGISTERED_STUDENTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_REGISTERED_STUDENTS;
  } catch {
    return INITIAL_REGISTERED_STUDENTS;
  }
}

function saveStudentToDirectory(newStudent) {
  if (!newStudent || !newStudent.id) return;
  try {
    const existing = getStoredStudents();
    const updated = [
      newStudent,
      ...existing.filter((s) => s.id !== newStudent.id),
    ];
    localStorage.setItem(STORAGE_ALL_STUDENTS_KEY, JSON.stringify(updated));
    localStorage.setItem(`python_buddy_student_${newStudent.id}`, JSON.stringify(newStudent));
  } catch {}
}

export default function StudentModal({
  isOpen,
  onClose,
  currentStudent,
  onSelectStudent,
  initialMode = 'switch',
}) {
  const [mode, setMode] = useState(initialMode || (currentStudent ? 'switch' : 'register')); // 'switch' | 'register'
  const [registeredStudents, setRegisteredStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [name, setName] = useState('');
  const [level, setLevel] = useState('Beginner');
  const [difficulty, setDifficulty] = useState('Easy');
  const [switchId, setSwitchId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Sync mode whenever initialMode or isOpen changes
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode || 'switch');
      setError(null);
      setSuccessMessage(null);
      setSearchQuery('');

      // Load registered students list
      const stored = getStoredStudents();
      setRegisteredStudents(stored);

      // Try background sync with backend if online to get latest XP
      const syncWithBackend = async () => {
        try {
          const updated = await Promise.all(
            stored.slice(0, 10).map(async (st) => {
              try {
                const remote = await getStudent(st.id);
                return remote ? { ...st, ...remote } : st;
              } catch {
                return st;
              }
            })
          );
          setRegisteredStudents(updated);
          localStorage.setItem(STORAGE_ALL_STUDENTS_KEY, JSON.stringify(updated));
        } catch {}
      };

      syncWithBackend();
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  // Direct 1-click select & relogin
  const handleSelectProfile = async (selectedProfile) => {
    setLoading(true);
    setError(null);

    try {
      // If backend is active, fetch freshest remote state
      let profile = selectedProfile;
      try {
        const remote = await getStudent(selectedProfile.id);
        if (remote) profile = remote;
      } catch {}

      saveStudentToDirectory(profile);
      onSelectStudent(profile);
      onClose();
    } catch (err) {
      setError('Unable to load student profile.');
    } finally {
      setLoading(false);
    }
  };

  // Register a brand new student
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

      saveStudentToDirectory(studentProfile);

      setTimeout(() => {
        onSelectStudent(studentProfile);
        onClose();
      }, 600);
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
        saveStudentToDirectory(offlineProfile);
        onSelectStudent(offlineProfile);
        onClose();
        return;
      }
      setError(err.message || 'Failed to register student.');
    } finally {
      setLoading(false);
    }
  };

  // Manual ID switch handler
  const handleSwitchById = async (e) => {
    e.preventDefault();
    if (!switchId) {
      setError('Please enter a valid Student ID.');
      return;
    }

    const targetId = Number(switchId);
    // Check if this student is already in the list
    const foundInList = registeredStudents.find((s) => s.id === targetId);
    if (foundInList) {
      handleSelectProfile(foundInList);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const studentProfile = await getStudent(targetId);
      saveStudentToDirectory(studentProfile);
      onSelectStudent(studentProfile);
      onClose();
    } catch (err) {
      if (err.message && err.message.includes('Unable to connect')) {
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
        saveStudentToDirectory(offlineProfile);
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
      const fallbackProfile = registeredStudents[0] || {
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

  // Filter students based on search input
  const filteredStudents = registeredStudents.filter((s) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      s.name.toLowerCase().includes(q) ||
      String(s.id).includes(q) ||
      s.level.toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden relative">
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
              Student Directory
            </span>
          </div>

          <h2 className="text-xl font-extrabold">
            {mode === 'switch' ? 'Select Student / Relogin' : 'Register New Student'}
          </h2>
          <p className="text-blue-100 text-xs mt-1">
            {currentStudent
              ? `Currently active: ${currentStudent.name} (ID #${currentStudent.id})`
              : 'Choose a registered student or create a new profile'}
          </p>

          {/* Mode Switch Tabs */}
          <div className="flex gap-2 mt-4 bg-black/15 p-1 rounded-xl">
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
              Registered Students ({registeredStudents.length})
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
            /* RELOGIN / REGISTERED STUDENTS LIST VIEW */
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search student by name, level, or ID..."
                  className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
                />
              </div>

              {/* Scrollable Registered Students Cards */}
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Choose your account to login:
                </p>
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {filteredStudents.length === 0 ? (
                    <div className="text-center py-6 text-slate-400 text-xs">
                      No matching student profiles found.
                    </div>
                  ) : (
                    filteredStudents.map((st) => {
                      const isActive = currentStudent?.id === st.id;
                      return (
                        <div
                          key={st.id}
                          onClick={() => handleSelectProfile(st)}
                          className={`flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer ${
                            isActive
                              ? 'bg-blue-50/80 border-blue-300 ring-2 ring-blue-500/20'
                              : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-blue-200 shadow-xs'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-sm flex items-center justify-center shadow-xs">
                              {st.name ? st.name.charAt(0).toUpperCase() : 'S'}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-extrabold text-slate-900">
                                  {st.name}
                                </span>
                                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                                  ID #{st.id}
                                </span>
                              </div>
                              <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                                <span>{st.level}</span>
                                <span>•</span>
                                <span>{st.difficulty || 'Easy'}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* XP Badge */}
                            <span className="text-xs font-bold text-amber-900 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full flex items-center gap-1">
                              <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                              <span>{st.xp ?? 0} XP</span>
                            </span>

                            {isActive ? (
                              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200 flex items-center gap-1">
                                <ShieldCheck className="w-3.5 h-3.5" />
                                Active
                              </span>
                            ) : (
                              <button
                                type="button"
                                className="text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-xl transition-colors flex items-center gap-1"
                              >
                                Login <ArrowRight className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Manual ID fallback */}
              <div className="pt-3 border-t border-slate-100">
                <form onSubmit={handleSwitchById} className="flex gap-2 items-center">
                  <input
                    type="number"
                    min="1"
                    value={switchId}
                    onChange={(e) => setSwitchId(e.target.value)}
                    placeholder="Or enter any Student ID (e.g. 5)"
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    disabled={loading || !switchId}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50"
                  >
                    Load ID
                  </button>
                </form>
              </div>
            </div>
          ) : (
            /* REGISTER NEW STUDENT VIEW */
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
