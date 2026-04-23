/**
 * ProgressBar — Visual onboarding progress indicator.
 * Reads from OnboardingContext and shows "Step X of Y".
 */

import { useOnboarding } from '../context/OnboardingContext';

// Total steps per role
const TOTAL_STEPS = { admin: 5, standard: 4 };

export default function ProgressBar() {
  const { currentStep, isCompleted, role, loading } = useOnboarding();

  if (loading || isCompleted) return null;

  const total = TOTAL_STEPS[role] || 4;
  const step = Math.min(currentStep + 1, total); // +1 for 1-indexed display
  const percentage = (step / total) * 100;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%' }}>
      <div className="progress-track" style={{ flex: 1 }}>
        <div className="progress-fill" style={{ width: `${percentage}%` }} />
      </div>
      <span
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: 'var(--color-text-muted)',
          whiteSpace: 'nowrap',
          minWidth: 72,
        }}
      >
        Step {step} of {total}
      </span>
    </div>
  );
}
