/**
 * API Service for Python Buddy AI Tutor
 * Connects to the FastAPI backend at http://127.0.0.1:8000
 */

// In development with Vite proxy, relative path '' is proxied to http://127.0.0.1:8000.
// If VITE_API_URL is specified (e.g. http://127.0.0.1:8000), it uses that.
const API_BASE = import.meta.env.VITE_API_URL || '';
export const BACKEND_URL = 'http://127.0.0.1:8000';

/**
 * Helper to handle fetch responses and handle connection errors uniformly
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      ...options,
    });

    if (!response.ok) {
      let errorMessage = `Server error: ${response.status} ${response.statusText}`;
      try {
        const errorJson = await response.json();
        if (errorJson.detail) {
          errorMessage = typeof errorJson.detail === 'string' 
            ? errorJson.detail 
            : JSON.stringify(errorJson.detail);
        }
      } catch {
        // use default error message if response isn't JSON
      }

      if (response.status === 500 && endpoint === '/tutor') {
        errorMessage = 'AI Tutor is temporarily unable to reach Gemini API. Please retry your question.';
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    // Detect typical network failure / backend down
    if (
      error.name === 'TypeError' && 
      (error.message.includes('fetch') || error.message.includes('Failed to fetch') || error.message.includes('NetworkError'))
    ) {
      throw new Error(
        `Unable to connect to Python Buddy backend. Make sure FastAPI is running on ${BACKEND_URL}.`
      );
    }
    throw error;
  }
}

/**
 * Check backend health
 * GET /health
 */
export async function checkBackendHealth() {
  return request('/health');
}

/**
 * Student Registration
 * POST /students
 * @param {Object} studentData - { name: string, level: string, difficulty: string }
 * @returns {Promise<{ student_id: number, message: string }>}
 */
export async function registerStudent(studentData) {
  return request('/students', {
    method: 'POST',
    body: JSON.stringify(studentData),
  });
}

/**
 * Get Student Profile
 * GET /students/{student_id}
 * @param {number} studentId
 * @returns {Promise<{ id: number, name: string, level: string, difficulty: string, xp: number, streak: number, created_at: string }>}
 */
export async function getStudent(studentId) {
  return request(`/students/${studentId}`);
}

/**
 * AI Tutor Query
 * POST /tutor
 * @param {Object} data - { student_id: number, mode: string, topic: string, question: string }
 * @returns {Promise<{ student_id: number, mode: string, topic: string, answer: string }>}
 */
export async function askTutor(data, retries = 1) {
  const payload = {
    method: 'POST',
    body: JSON.stringify({
      student_id: Number(data.student_id),
      mode: data.mode || 'Tutor',
      topic: data.topic,
      question: data.question,
    }),
  };

  try {
    return await request('/tutor', payload);
  } catch (err) {
    // If Gemini upstream had a transient 503 spike, wait 2 seconds and retry once
    if (retries > 0 && err.message && (err.message.includes('Gemini API') || err.message.includes('500'))) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return await request('/tutor', payload);
    }
    throw err;
  }
}

/**
 * Quiz Evaluation
 * POST /evaluate
 * @param {Object} data - { student_id: number, topic: string, question: string, student_answer: string }
 * @returns {Promise<{ student_id: number, result: string, student_answer: string, correct_answer: string, explanation: string, xp_earned: number, encouragement: string }>}
 */
export async function evaluateAnswer(data) {
  return request('/evaluate', {
    method: 'POST',
    body: JSON.stringify({
      student_id: Number(data.student_id),
      topic: data.topic,
      question: data.question,
      student_answer: data.student_answer,
    }),
  });
}

/**
 * Personalized Recommendation
 * GET /students/{student_id}/recommendation
 * @param {number} studentId
 * @returns {Promise<{ student_id: number, student_name: string, score_percentage: number, total_questions: number, correct_answers: number, strengths: string[], weaknesses: string[], total_xp: number, recommendation: string, next_lesson: string }>}
 */
export async function getRecommendation(studentId) {
  return request(`/students/${studentId}/recommendation`);
}
