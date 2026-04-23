/**
 * TopNav — Top navigation bar with user selector and profile area.
 */

import { useOnboarding } from '../context/OnboardingContext';
import ProgressBar from './ProgressBar';

export default function TopNav({ users, selectedUserId, onUserChange, onResetTour }) {
  const { username, role, isCompleted } = useOnboarding();

  return (
    <header className="top-nav">
      {/* Left: Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <span style={{ fontSize: 14, color: 'var(--color-text-muted)' }}>
          Home
        </span>
        <span style={{ color: 'var(--color-text-muted)', fontSize: 12 }}>/</span>
        <span style={{ fontSize: 14, fontWeight: 600 }}>
          Dashboard
        </span>
      </div>

      {/* Center: Progress Bar (if tour is active) */}
      <div style={{ flex: 1, maxWidth: 300, margin: '0 24px' }}>
        <ProgressBar />
      </div>

      {/* Right: User controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }} id="tour-step-profile">
        {/* User selector */}
        <select
          className="user-selector"
          value={selectedUserId || ''}
          onChange={(e) => onUserChange(Number(e.target.value))}
        >
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.username} ({u.role})
            </option>
          ))}
        </select>

        {/* Reset tour button */}
        {isCompleted && (
          <button
            onClick={onResetTour}
            style={{
              background: 'var(--color-bg-glass)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-secondary)',
              padding: '8px 14px',
              borderRadius: 10,
              fontSize: 12,
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontFamily: 'var(--font-sans)',
            }}
            onMouseOver={(e) => {
              e.target.style.borderColor = 'var(--color-accent-start)';
              e.target.style.color = 'var(--color-text-primary)';
            }}
            onMouseOut={(e) => {
              e.target.style.borderColor = 'var(--color-border)';
              e.target.style.color = 'var(--color-text-secondary)';
            }}
          >
            🔄 Restart Tour
          </button>
        )}

        {/* Avatar */}
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: role === 'admin'
              ? 'linear-gradient(135deg, var(--color-accent-start), var(--color-accent-pink))'
              : 'linear-gradient(135deg, #22c55e, #14b8a6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 14,
            fontWeight: 700,
            color: '#fff',
            cursor: 'pointer',
          }}
          title={`${username} (${role})`}
        >
          {username ? username.charAt(0).toUpperCase() : '?'}
        </div>
      </div>
    </header>
  );
}
