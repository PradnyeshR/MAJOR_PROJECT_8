/**
 * TourGuide — Interactive onboarding tour using react-joyride v3.
 *
 * - Dynamically adjusts steps based on user role (admin gets extra Team step).
 * - Fires backend API on each step transition via onEvent callback.
 * - Supports skip and complete.
 */

import { useMemo, useCallback } from 'react';
import { Joyride, ACTIONS, EVENTS, STATUS } from 'react-joyride';
import { useOnboarding } from '../context/OnboardingContext';

// ── Step Definitions ─────────────────────────────────────────────────────────

const BASE_STEPS = [
  {
    target: '#tour-step-sidebar',
    title: '📍 Navigation Sidebar',
    content:
      'This is your main navigation hub. Access all features — Analytics, Settings, Reports, and more — from here.',
    skipBeacon: true,
    placement: 'right',
    id: 'tour-step-sidebar',
  },
  {
    target: '#tour-step-profile',
    title: '👤 Your Profile & Controls',
    content:
      'Switch between users, view your role, and restart the tour anytime from this area.',
    placement: 'bottom',
    id: 'tour-step-profile',
  },
  {
    target: '#tour-step-analytics',
    title: '📈 Analytics Dashboard',
    content:
      'Track real-time metrics, page views, and engagement data. Your performance insights live here.',
    placement: 'bottom',
    id: 'tour-step-analytics',
  },
  {
    target: '#tour-step-settings',
    title: '⚙️ Settings & Config',
    content:
      'Configure workspace preferences, integrations, and notification settings.',
    placement: 'bottom',
    id: 'tour-step-settings',
  },
];

const ADMIN_STEP = {
  target: '#tour-step-team',
  title: '👥 Team Management (Admin)',
  content:
    'As an admin, you can manage team members, roles, and permissions. Invite new members and control access levels.',
  placement: 'bottom',
  id: 'tour-step-team',
};

// ── Component ────────────────────────────────────────────────────────────────

export default function TourGuide() {
  const {
    role,
    isCompleted,
    loading,
    currentStep,
    advanceStep,
    skipTour,
    finishTour,
  } = useOnboarding();

  // Build steps array based on role
  const steps = useMemo(() => {
    const allSteps = [...BASE_STEPS];
    if (role === 'admin') {
      allSteps.push(ADMIN_STEP);
    }
    return allSteps;
  }, [role]);

  // Joyride v3 event handler (replaces v2's "callback")
  const handleEvent = useCallback(
    async (data) => {
      const { action, index, status, type } = data;

      // User clicked "Skip"
      if (action === ACTIONS.SKIP) {
        await skipTour();
        return;
      }

      // Tour finished (last step completed)
      if (status === STATUS.FINISHED) {
        const lastStep = steps[steps.length - 1];
        if (lastStep) {
          await advanceStep(lastStep.id);
        }
        await finishTour();
        return;
      }

      // User advanced to next step
      if (type === EVENTS.STEP_AFTER && action === ACTIONS.NEXT) {
        const completedStep = steps[index];
        if (completedStep) {
          await advanceStep(completedStep.id);
        }
      }
    },
    [steps, advanceStep, skipTour, finishTour]
  );

  // Don't show tour if loading, completed, or no steps
  if (loading || isCompleted || steps.length === 0) {
    return null;
  }

  return (
    <Joyride
      steps={steps}
      stepIndex={currentStep}
      run={!isCompleted}
      continuous
      onEvent={handleEvent}
      locale={{
        back: '← Back',
        close: 'Close',
        last: 'Finish Tour ✓',
        next: 'Next →',
        open: 'Open the dialog',
        skip: 'Skip Tour',
      }}
      options={{
        backgroundColor: '#111827',
        arrowColor: '#111827',
        overlayColor: 'rgba(0, 0, 0, 0.6)',
        primaryColor: '#6366f1',
        textColor: '#f1f5f9',
        zIndex: 10000,
        spotlightRadius: 16,
        overlayClickAction: false,
        showProgress: true,
        buttons: ['skip', 'back', 'close', 'primary'],
      }}
      styles={{
        tooltip: {
          borderRadius: 16,
          padding: 0,
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
        },
        tooltipContainer: {
          textAlign: 'left',
          padding: 24,
        },
        tooltipTitle: {
          fontWeight: 700,
          fontSize: 16,
          fontFamily: "'Inter', sans-serif",
        },
        tooltipContent: {
          fontSize: 14,
          lineHeight: 1.6,
          fontFamily: "'Inter', sans-serif",
        },
        buttonPrimary: {
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          borderRadius: 10,
          padding: '10px 22px',
          fontWeight: 600,
          fontSize: 13,
          fontFamily: "'Inter', sans-serif",
        },
        buttonBack: {
          color: '#94a3b8',
          fontWeight: 500,
          fontSize: 13,
          marginRight: 8,
          fontFamily: "'Inter', sans-serif",
        },
        buttonSkip: {
          color: '#64748b',
          fontSize: 12,
          fontFamily: "'Inter', sans-serif",
        },
        buttonClose: {
          color: '#64748b',
        },
        overlay: {
          cursor: 'default',
        },
      }}
    />
  );
}
