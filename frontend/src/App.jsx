/**
 * App — Root application component.
 *
 * Manages user selection state and wires together:
 *  - OnboardingProvider (context)
 *  - Sidebar, TopNav, Dashboard (layout)
 *  - TourGuide (interactive tour)
 */

import { useState, useEffect } from 'react';
import { OnboardingProvider, useOnboarding } from './context/OnboardingContext';
import { fetchUsers } from './api/onboarding';
import Sidebar from './components/Sidebar';
import TopNav from './components/TopNav';
import Dashboard from './components/Dashboard';
import TourGuide from './components/TourGuide';

function AppContent({ users, selectedUserId, onUserChange, onResetTour }) {
  const { resetTour } = useOnboarding();

  const handleReset = async () => {
    await resetTour();   // clear DB state
    onResetTour();       // force remount to reload fresh state
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ flex: 1, marginLeft: 260 }}>
        <TopNav
          users={users}
          selectedUserId={selectedUserId}
          onUserChange={onUserChange}
          onResetTour={handleReset}
        />
        <main>
          <Dashboard />
        </main>
      </div>
      <TourGuide />
    </div>
  );
}

export default function App() {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [tourKey, setTourKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load users from backend
  useEffect(() => {
    fetchUsers()
      .then((data) => {
        setUsers(data);
        if (data.length > 0) {
          setSelectedUserId(data[0].id);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Failed to connect to backend');
        setLoading(false);
      });
  }, []);

  // Handle user switch
  const handleUserChange = (userId) => {
    setSelectedUserId(userId);
    setTourKey((prev) => prev + 1); // Force re-mount to reload state
  };

  // Handle tour reset
  const handleResetTour = () => {
    setTourKey((prev) => prev + 1); // Force re-mount
  };

  // Loading state
  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            border: '3px solid var(--color-border)',
            borderTopColor: 'var(--color-accent-start)',
            animation: 'spin 1s linear infinite',
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 14 }}>
          Connecting to SmartBoard...
        </p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          flexDirection: 'column',
          gap: 16,
          padding: 32,
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 48 }}>⚠️</div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-error)' }}>
          Connection Failed
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 14, maxWidth: 400 }}>
          {error}
        </p>
        <p style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>
          Make sure the FastAPI backend is running on <code>http://localhost:8000</code>
        </p>
        <button
          onClick={() => window.location.reload()}
          style={{
            marginTop: 8,
            background: 'linear-gradient(135deg, var(--color-accent-start), var(--color-accent-mid))',
            border: 'none',
            borderRadius: 10,
            padding: '10px 24px',
            color: '#fff',
            fontWeight: 600,
            fontSize: 14,
            cursor: 'pointer',
            fontFamily: 'var(--font-sans)',
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  if (!selectedUserId) return null;

  return (
    <OnboardingProvider key={tourKey} userId={selectedUserId}>
      <AppContent
        users={users}
        selectedUserId={selectedUserId}
        onUserChange={handleUserChange}
        onResetTour={handleResetTour}
      />
    </OnboardingProvider>
  );
}
