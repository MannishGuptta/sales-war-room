import { useState } from 'react'
import WarRoom from './pages/WarRoom'
import RMLogin from './components/RMLogin'
import RMDashboard from './components/RMDashboard'
import TeamLeaderLogin from './components/TeamLeaderLogin'
import TeamLeaderDashboard from './components/TeamLeaderDashboard'
import LandingPage from './components/LandingPage'
import AdminLogin from './components/AdminLogin'

function App() {
  const [appState, setAppState] = useState({
    currentView: 'landing', // landing, admin, rm, tl, warroom, rmDashboard, tlDashboard
    isAdminLoggedIn: false,
    isRMLoggedIn: false,
    isTLLoggedIn: false,
    currentRMId: null,
    currentTLId: null
  })

  const handlePortalSelect = (portal) => {
    if (portal === 'admin') {
      setAppState({ ...appState, currentView: 'admin' })
    } else if (portal === 'rm') {
      setAppState({ ...appState, currentView: 'rm' })
    } else if (portal === 'tl') {
      setAppState({ ...appState, currentView: 'tl' })
    }
  }

  const handleAdminLogin = () => {
    setAppState({ ...appState, isAdminLoggedIn: true, currentView: 'warroom' })
  }

  const handleRMLogin = (rmId) => {
    setAppState({ ...appState, isRMLoggedIn: true, currentRMId: rmId, currentView: 'rmDashboard' })
  }

  const handleTLLogin = (tlId) => {
    setAppState({ ...appState, isTLLoggedIn: true, currentTLId: tlId, currentView: 'tlDashboard' })
  }

  const handleLogout = () => {
    setAppState({
      currentView: 'landing',
      isAdminLoggedIn: false,
      isRMLoggedIn: false,
      isTLLoggedIn: false,
      currentRMId: null,
      currentTLId: null
    })
  }

  // Landing Page
  if (appState.currentView === 'landing') {
    return <LandingPage onSelectPortal={handlePortalSelect} />
  }

  // Admin Login Page
  if (appState.currentView === 'admin') {
    return <AdminLogin onLogin={handleAdminLogin} />
  }

  // Admin War Room
  if (appState.currentView === 'warroom' && appState.isAdminLoggedIn) {
    return (
      <div>
        <div style={{
          position: 'fixed',
          top: '10px',
          right: '20px',
          zIndex: 1000,
          display: 'flex',
          gap: '10px'
        }}>
          <button
            onClick={handleLogout}
            style={{
              padding: '8px 16px',
              background: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            🚪 Logout
          </button>
        </div>
        <WarRoom onLogout={handleLogout} />
      </div>
    )
  }

  // RM Portal - Login
  if (appState.currentView === 'rm') {
    return <RMLogin onLogin={handleRMLogin} />
  }

  // RM Dashboard
  if (appState.currentView === 'rmDashboard' && appState.isRMLoggedIn) {
    return (
      <RMDashboard rmId={appState.currentRMId} onLogout={handleLogout} />
    )
  }

  // Team Leader Portal - Login
  if (appState.currentView === 'tl') {
    return <TeamLeaderLogin onLogin={handleTLLogin} />
  }

  // Team Leader Dashboard
  if (appState.currentView === 'tlDashboard' && appState.isTLLoggedIn) {
    return (
      <TeamLeaderDashboard tlId={appState.currentTLId} onLogout={handleLogout} />
    )
  }

  // Fallback to landing
  return <LandingPage onSelectPortal={handlePortalSelect} />
}

export default App