/**
 * Dashboard — Main content area with widget cards.
 * Each widget has a specific ID for react-joyride targeting.
 */

import { useOnboarding } from '../context/OnboardingContext';

const widgets = [
  {
    id: 'tour-step-analytics',
    icon: '📈',
    iconBg: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    title: 'Analytics',
    stat: '24.8K',
    label: 'Total Views',
    change: '+12.5%',
    changePositive: true,
    description: 'Real-time analytics tracking across all your platforms.',
  },
  {
    id: 'tour-step-settings',
    icon: '⚙️',
    iconBg: 'linear-gradient(135deg, #f59e0b, #ef4444)',
    title: 'Settings',
    stat: '98%',
    label: 'System Health',
    change: 'All systems go',
    changePositive: true,
    description: 'Configure your workspace preferences and integrations.',
  },
  {
    id: 'tour-step-revenue',
    icon: '💰',
    iconBg: 'linear-gradient(135deg, #22c55e, #14b8a6)',
    title: 'Revenue',
    stat: '$12.4K',
    label: 'Monthly Revenue',
    change: '+8.2%',
    changePositive: true,
    description: 'Track revenue growth and financial performance.',
  },
  {
    id: 'tour-step-team',
    icon: '👥',
    iconBg: 'linear-gradient(135deg, #ec4899, #a855f7)',
    title: 'Team Members',
    stat: '12',
    label: 'Active Members',
    change: '3 online',
    changePositive: true,
    description: 'Manage team roles, permissions, and collaboration.',
    adminHighlight: true,
  },
];

export default function Dashboard() {
  const { role, username } = useOnboarding();

  return (
    <div style={{ padding: 32 }}>
      {/* Welcome Header */}
      <div className="animate-fade-in" style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>
          Welcome back,{' '}
          <span className="gradient-text">{username || 'User'}</span> 👋
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 15 }}>
          Here&apos;s what&apos;s happening with your projects today.
        </p>
      </div>

      {/* Widget Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 20,
        }}
      >
        {widgets.map((widget, idx) => (
          <div
            key={widget.id}
            id={widget.id}
            className={`glass-card gradient-border widget-card animate-fade-in animate-delay-${idx + 1}`}
          >
            {/* Icon + Title Row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div className="widget-icon" style={{ background: widget.iconBg }}>
                  {widget.icon}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>{widget.title}</div>
                  <div className="widget-label">{widget.label}</div>
                </div>
              </div>
              {widget.adminHighlight && role === 'admin' && (
                <span
                  style={{
                    padding: '4px 10px',
                    fontSize: 10,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.2), rgba(168, 85, 247, 0.2))',
                    color: '#ec4899',
                    borderRadius: 6,
                  }}
                >
                  Admin
                </span>
              )}
            </div>

            {/* Stat */}
            <div className="widget-stat">{widget.stat}</div>

            {/* Change indicator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: widget.changePositive ? 'var(--color-success)' : 'var(--color-error)',
                }}
              >
                {widget.changePositive ? '↑' : '↓'} {widget.change}
              </span>
              <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
                vs last month
              </span>
            </div>

            {/* Description */}
            <p style={{ fontSize: 13, color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
              {widget.description}
            </p>
          </div>
        ))}
      </div>

      {/* Activity Section */}
      <div
        className="glass-card animate-fade-in animate-delay-4"
        style={{ marginTop: 24, padding: 24 }}
      >
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>
          Recent Activity
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            { time: '2 min ago', text: 'New user signed up', icon: '🟢' },
            { time: '15 min ago', text: 'Revenue report generated', icon: '📊' },
            { time: '1 hr ago', text: 'Team settings updated', icon: '⚙️' },
            { time: '3 hrs ago', text: 'Analytics dashboard viewed', icon: '📈' },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 0',
                borderBottom: i < 3 ? '1px solid var(--color-border)' : 'none',
              }}
            >
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              <span style={{ flex: 1, fontSize: 14, color: 'var(--color-text-secondary)' }}>
                {item.text}
              </span>
              <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
