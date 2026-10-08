import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Home } from 'lucide-react';
import Navbar from './components/Navbar';
import BackendStatusBanner from './components/BackendStatusBanner';
import StudentModal from './components/StudentModal';
import Dashboard from './pages/Dashboard';
import QuizPage from './pages/QuizPage';
import TutorPage from './pages/TutorPage';
import ProgressPage from './pages/ProgressPage';
import {
  getStudent,
  getRecommendation,
  checkBackendHealth,
  registerStudent,
} from './services/api';

const STORAGE_STUDENT_ID_KEY = 'python_buddy_student_id';
const STORAGE_THEME_KEY = 'python_buddy_theme';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'tutor' | 'quiz' | 'progress'
  const [student, setStudent] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [isBackendHealthy, setIsBackendHealthy] = useState(true);
  const [loading, setLoading] = useState(true);
  const [studentModalOpen, setStudentModalOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem(STORAGE_THEME_KEY) || 'ambient';
  });

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem(STORAGE_THEME_KEY, newTheme);
  };

  // Deep linking props for Tutor navigation
  const [tutorTopic, setTutorTopic] = useState('Variables');
  const [tutorMode, setTutorMode] = useState('Tutor');
  const [quizTopic, setQuizTopic] = useState('All');

  // Load student profile & recommendations
  const loadStudentData = useCallback(async (studentId) => {
    try {
      setLoading(true);

      // Check backend health
      try {
        await checkBackendHealth();
        setIsBackendHealthy(true);
      } catch (healthErr) {
        setIsBackendHealthy(false);
      }

      // Fetch student profile
      const studentData = await getStudent(studentId);
      setStudent(studentData);
      localStorage.setItem(STORAGE_STUDENT_ID_KEY, studentData.id);

      // Fetch personalized recommendation
      const recData = await getRecommendation(studentData.id);
      setRecommendation(recData);
    } catch (err) {
      console.error('Error loading student profile:', err);
      // If student not found or backend offline
      if (err.message && err.message.includes('Unable to connect')) {
        setIsBackendHealthy(false);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial bootstrap
  useEffect(() => {
    const initApp = async () => {
      // 1. Check if backend is reachable
      try {
        await checkBackendHealth();
        setIsBackendHealthy(true);
      } catch {
        setIsBackendHealthy(false);
      }

      // 2. Check localStorage for student ID
      const savedStudentId = localStorage.getItem(STORAGE_STUDENT_ID_KEY);

      if (savedStudentId) {
        await loadStudentData(Number(savedStudentId));
      } else {
        // Brand new joiner! Prompt registration modal so the new student enters their own name
        setLoading(false);
        setStudentModalOpen(true);
      }
    };

    initApp();
  }, [loadStudentData]);

  // Handle quiz answer submission & update
  const handleQuizCompleted = async (evalResult) => {
    if (!student?.id) return;
    // Re-fetch profile and recommendation to refresh dashboard metrics immediately
    try {
      const [updatedProfile, updatedRec] = await Promise.all([
        getStudent(student.id),
        getRecommendation(student.id),
      ]);
      setStudent(updatedProfile);
      setRecommendation(updatedRec);
    } catch (err) {
      console.error('Error updating stats after quiz:', err);
    }
  };

  // Switch student
  const handleSelectStudent = (newStudent) => {
    setStudent(newStudent);
    localStorage.setItem(STORAGE_STUDENT_ID_KEY, newStudent.id);
    loadStudentData(newStudent.id);
  };

  // Navigations with context
  const handleStartPractice = (topic = 'Variables', mode = 'Practice') => {
    setTutorTopic(topic);
    setTutorMode(mode);
    setActiveTab('tutor');
  };

  const handleStartLesson = (lessonName = 'Variables', mode = 'Learn') => {
    setTutorTopic(lessonName);
    setTutorMode(mode);
    setActiveTab('tutor');
  };

  const handleNavigateTutorFromQuiz = (topic = 'Variables') => {
    setTutorTopic(topic);
    setTutorMode('Tutor');
    setActiveTab('tutor');
  };

  const handleStartQuiz = (topic = 'All') => {
    setQuizTopic(topic);
    setActiveTab('quiz');
  };

  const handleStartFreshStudent = async (name = 'Student') => {
    try {
      setLoading(true);
      const cleanName = !name || name === 'Rahul' ? 'Student' : name;
      const reg = await registerStudent({
        name: cleanName,
        level: 'Beginner',
        difficulty: 'Easy',
      });
      localStorage.setItem(STORAGE_STUDENT_ID_KEY, reg.student_id);
      await loadStudentData(reg.student_id);
    } catch (err) {
      console.error('Failed to create fresh student:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleManualRefresh = () => {
    if (student?.id) {
      loadStudentData(student.id);
    } else {
      checkBackendHealth()
        .then(() => setIsBackendHealthy(true))
        .catch(() => setIsBackendHealthy(false));
    }
  };

  const themeClass =
    theme === 'mint'
      ? 'theme-mint'
      : theme === 'clean'
      ? 'theme-clean'
      : theme === 'dark'
      ? 'theme-dark'
      : 'theme-ambient';

  // Synchronize document.body with active theme so full page and scroll areas match
  useEffect(() => {
    document.body.className = `antialiased min-h-screen ${themeClass}`;
  }, [themeClass]);

  const textColorClass = theme === 'dark' ? 'text-slate-100' : 'text-slate-800';

  return (
    <div className={`min-h-screen ${themeClass} ${textColorClass} flex flex-col font-sans transition-colors duration-300`}>
      {/* Offline / Backend Error Banner if backend unreachable */}
      {!isBackendHealthy && (
        <BackendStatusBanner onRetry={handleManualRefresh} />
      )}

      {/* Main Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        student={student}
        xp={student?.xp ?? recommendation?.total_xp ?? 0}
        isBackendHealthy={isBackendHealthy}
        onOpenStudentModal={() => setStudentModalOpen(true)}
        onStartFresh={() => setStudentModalOpen(true)}
        onRefresh={handleManualRefresh}
        currentTheme={theme}
        onThemeChange={handleThemeChange}
      />

      {/* Main Page Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {loading && !student ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-amber-500 p-1 flex items-center justify-center text-3xl shadow-lg mb-4 animate-bounce">
              🐍
            </div>
            <h3 className="text-lg font-extrabold text-slate-800">
              Connecting to Python Buddy...
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">
              Loading your personalized profile and adaptive recommendations from FastAPI.
            </p>
          </div>
        ) : (
          <>
            {/* Prominent Back to Dashboard / Home Navigation Bar on all other pages */}
            {activeTab !== 'dashboard' && (
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3 animate-in fade-in duration-200">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/95 hover:bg-white text-slate-800 hover:text-blue-700 font-extrabold text-xs sm:text-sm border border-slate-200/90 shadow-xs hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group"
                  title="Return to Student Dashboard"
                >
                  <ArrowLeft className="w-4 h-4 text-blue-600 group-hover:-translate-x-1 transition-transform" />
                  <span>Back to Dashboard</span>
                </button>

                <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold bg-white/80 backdrop-blur-xs px-3.5 py-2 rounded-xl border border-slate-200/80 shadow-2xs">
                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className="flex items-center gap-1.5 text-slate-600 hover:text-blue-600 transition-colors font-bold"
                  >
                    <Home className="w-3.5 h-3.5 text-slate-400" />
                    <span>Home</span>
                  </button>
                  <span className="text-slate-300">/</span>
                  <span className="font-extrabold text-blue-700">
                    {activeTab === 'tutor'
                      ? 'Learn / AI Tutor'
                      : activeTab === 'quiz'
                      ? 'Quiz Evaluation'
                      : 'Learning Progress'}
                  </span>
                </div>
              </div>
            )}

            {activeTab === 'dashboard' && (
              <Dashboard
                student={student}
                recommendation={recommendation}
                onNavigate={setActiveTab}
                onStartPractice={handleStartPractice}
                onStartLesson={handleStartLesson}
                onStartQuiz={handleStartQuiz}
                onStartFresh={() => setStudentModalOpen(true)}
                loading={loading}
              />
            )}

            {activeTab === 'tutor' && (
              <TutorPage
                student={student}
                initialTopic={tutorTopic}
                initialMode={tutorMode}
                onNavigate={setActiveTab}
              />
            )}

            {activeTab === 'quiz' && (
              <QuizPage
                student={student}
                onQuizCompleted={handleQuizCompleted}
                onNavigateTutor={handleNavigateTutorFromQuiz}
                initialTopic={quizTopic}
                onNavigate={setActiveTab}
              />
            )}

            {activeTab === 'progress' && (
              <ProgressPage
                student={student}
                recommendation={recommendation}
                onNavigate={setActiveTab}
                onStartPractice={handleStartPractice}
                onStartQuiz={handleStartQuiz}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center sm:justify-start gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="text-base">🐍</span>
            <span className="font-bold text-slate-800">Python Buddy AI Tutor</span>
            <span>—</span>
            <span>FastAPI Powered Personalized Learning</span>
          </div>
        </div>
      </footer>

      {/* Student Profile Registration & Switcher Modal */}
      <StudentModal
        isOpen={studentModalOpen}
        onClose={() => setStudentModalOpen(false)}
        currentStudent={student}
        onSelectStudent={handleSelectStudent}
        onStartFresh={handleStartFreshStudent}
      />
    </div>
  );
}
