/**
 * OnboardingContext — Global state for onboarding tour progress.
 *
 * Provides:
 *  - currentStep, completedSteps, isCompleted, role, username
 *  - advanceStep(stepId) — move forward and persist
 *  - skipTour() — skip and persist
 *  - resetTour() — restart the tour
 *  - loading, error states
 */

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchProgress, updateStep, completeTour, resetTourApi } from '../api/onboarding';

const OnboardingContext = createContext(null);

export function OnboardingProvider({ userId, children }) {
  const [state, setState] = useState({
    currentStep: 0,
    completedSteps: [],
    isCompleted: false,
    role: 'standard',
    username: '',
    loading: true,
    error: null,
  });

  // Load initial state from backend
  useEffect(() => {
    if (!userId) return;

    let cancelled = false;
    setState((prev) => ({ ...prev, loading: true, error: null }));

    fetchProgress(userId)
      .then((data) => {
        if (cancelled) return;
        setState({
          currentStep: data.current_step,
          completedSteps: data.completed_steps || [],
          isCompleted: data.is_completed,
          role: data.role,
          username: data.username,
          loading: false,
          error: null,
        });
      })
      .catch((err) => {
        if (cancelled) return;
        setState((prev) => ({
          ...prev,
          loading: false,
          error: err.message || 'Failed to load onboarding progress',
        }));
      });

    return () => {
      cancelled = true;
    };
  }, [userId]);

  // Advance to next step
  const advanceStep = useCallback(
    async (stepId) => {
      if (!userId) return;
      try {
        const nextStep = state.currentStep + 1;
        const data = await updateStep(userId, nextStep, stepId);
        setState((prev) => ({
          ...prev,
          currentStep: data.current_step,
          completedSteps: data.completed_steps || [],
        }));
      } catch (err) {
        console.error('Failed to update step:', err);
      }
    },
    [userId, state.currentStep]
  );

  // Skip tour
  const skipTour = useCallback(async () => {
    if (!userId) return;
    try {
      await completeTour(userId, true);
      setState((prev) => ({ ...prev, isCompleted: true }));
    } catch (err) {
      console.error('Failed to skip tour:', err);
    }
  }, [userId]);

  // Complete tour
  const finishTour = useCallback(async () => {
    if (!userId) return;
    try {
      await completeTour(userId, false);
      setState((prev) => ({ ...prev, isCompleted: true }));
    } catch (err) {
      console.error('Failed to complete tour:', err);
    }
  }, [userId]);

  // Reset tour — calls backend to clear DB state, then resets local
  const resetTour = useCallback(async () => {
    if (!userId) return;
    try {
      await resetTourApi(userId);
      setState((prev) => ({
        ...prev,
        currentStep: 0,
        completedSteps: [],
        isCompleted: false,
      }));
    } catch (err) {
      console.error('Failed to reset tour:', err);
    }
  }, [userId]);

  return (
    <OnboardingContext.Provider
      value={{ ...state, advanceStep, skipTour, finishTour, resetTour }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}

export default OnboardingContext;
