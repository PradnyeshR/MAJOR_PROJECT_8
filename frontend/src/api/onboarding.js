/**
 * API utility for onboarding endpoints.
 * Communicates with the FastAPI backend via Vite proxy.
 */

import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

/**
 * Fetch the onboarding progress and role for a user.
 * @param {number} userId
 * @returns {Promise<Object>} OnboardingProgressOut
 */
export async function fetchProgress(userId) {
  const { data } = await api.get(`/onboarding/${userId}`);
  return data;
}

/**
 * Update the current step and mark a step as completed.
 * @param {number} userId
 * @param {number} currentStep
 * @param {string} completedStep
 * @returns {Promise<Object>}
 */
export async function updateStep(userId, currentStep, completedStep) {
  const { data } = await api.post(`/onboarding/${userId}/update`, {
    current_step: currentStep,
    completed_step: completedStep,
  });
  return data;
}

/**
 * Mark the onboarding tour as complete (or skipped).
 * @param {number} userId
 * @param {boolean} skipped
 * @returns {Promise<Object>}
 */
export async function completeTour(userId, skipped = false) {
  const { data } = await api.post(`/onboarding/${userId}/complete`, {
    skipped,
  });
  return data;
}

/**
 * Reset onboarding progress so the tour can restart.
 * @param {number} userId
 * @returns {Promise<Object>}
 */
export async function resetTourApi(userId) {
  const { data } = await api.post(`/onboarding/${userId}/reset`);
  return data;
}

/**
 * Fetch all users (for the user selector dropdown).
 * @returns {Promise<Array>}
 */
export async function fetchUsers() {
  const { data } = await api.get('/users');
  return data;
}
