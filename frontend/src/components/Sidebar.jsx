/**
 * Sidebar — Main navigation sidebar with tour-targetable elements.
 */

import { useOnboarding } from '../context/OnboardingContext';

const navItems = [
  { icon: '📊', label: 'Dashboard', id: 'nav-dashboard', active: true },
  { icon: '📈', label: 'Analytics', id: 'nav-analytics' },
  { icon: '⚙️', label: 'Settings', id: 'nav-settings' },
  { icon: '👥', label: 'Team Members', id: 'nav-team', adminOnly: true },
  { icon: '📋', label: 'Reports', id: 'nav-reports' },
  { icon: '🔔', label: 'Notifications', id: 'nav-notifications' },
];

export default function Sidebar() {
  const { role } = useOnboarding();

  const visibleItems = navItems.filter(
    (item) => !item.adminOnly || role === 'admin'
  );

  return (
    <aside className="sidebar" id="tour-step-sidebar">
      {/* Logo */}
      <div style={{ padding: '24px 20px', borderBottom: '1px solid var(--color-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'linear-gradient(135deg, var(--color-accent-start), var(--color-accent-pink))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
              fontWeight: 800,
              color: '#fff',
            }}
          >
            S
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--color-text-primary)' }}>
              SmartBoard
            </div>
            <div style={{ fontSize: 11, color: 'var(--color-text-muted)', fontWeight: 500 }}>
              Onboarding System
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav style={{ padding: '16px 0', flex: 1 }}>
        <div style={{ padding: '0 20px', marginBottom: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Menu
          </span>
        </div>
        {visibleItems.map((item) => (
          <a
            key={item.id}
            id={item.id}
            className={`sidebar-link ${item.active ? 'active' : ''}`}
            href="#"
            onClick={(e) => e.preventDefault()}
          >
            <span style={{ fontSize: 18 }}>{item.icon}</span>
            <span>{item.label}</span>
            {item.active && (
              <span
                style={{
                  marginLeft: 'auto',
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: 'var(--color-accent-start)',
                }}
              />
            )}
          </a>
        ))}
      </nav>

      {/* Footer */}
      <div style={{ padding: '16px 20px', borderTop: '1px solid var(--color-border)' }}>
        <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
          © 2026 SmartBoard
        </div>
      </div>
    </aside>
  );
}
