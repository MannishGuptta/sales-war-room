import { useState } from 'react'

const TeamLeaderLogin = ({ onLogin }) => {
  const [selectedTL, setSelectedTL] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const teamLeaders = [
    { id: 1, name: 'Rajesh Kumar', region: 'North Zone', teamSize: 2 },
    { id: 2, name: 'Priya Sharma', region: 'South Zone', teamSize: 3 }
  ]

  const handleLogin = () => {
    if (!selectedTL) {
      setError('Please select a Team Leader')
      return
    }
    
    if (password !== 'tl123') {
      setError('Invalid password. Use "tl123" for demo.')
      return
    }
    
    onLogin(selectedTL)
  }

  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
      fontFamily: 'Arial, sans-serif'
    },
    loginBox: {
      background: 'white',
      padding: '40px',
      borderRadius: '12px',
      boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
      width: '100%',
      maxWidth: '400px'
    },
    title: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: '#333',
      marginBottom: '10px',
      textAlign: 'center'
    },
    subtitle: {
      fontSize: '14px',
      color: '#666',
      textAlign: 'center',
      marginBottom: '30px'
    },
    formGroup: {
      marginBottom: '20px'
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      fontWeight: '500',
      color: '#333'
    },
    select: {
      width: '100%',
      padding: '10px',
      border: '1px solid #ddd',
      borderRadius: '6px',
      fontSize: '14px'
    },
    input: {
      width: '100%',
      padding: '10px',
      border: '1px solid #ddd',
      borderRadius: '6px',
      fontSize: '14px'
    },
    button: {
      width: '100%',
      padding: '12px',
      background: '#ff9800',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    error: {
      background: '#f8d7da',
      color: '#721c24',
      padding: '10px',
      borderRadius: '4px',
      marginBottom: '20px',
      fontSize: '14px'
    },
    demoNote: {
      marginTop: '20px',
      padding: '10px',
      background: '#fff3e0',
      borderRadius: '6px',
      fontSize: '12px',
      color: '#666',
      textAlign: 'center'
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.loginBox}>
        <h1 style={styles.title}>👥 Team Leader Portal</h1>
        <p style={styles.subtitle}>Login to manage your team</p>
        
        {error && <div style={styles.error}>{error}</div>}
        
        <div style={styles.formGroup}>
          <label style={styles.label}>Select Team Leader</label>
          <select
            style={styles.select}
            value={selectedTL}
            onChange={(e) => setSelectedTL(e.target.value)}
          >
            <option value="">Select your profile</option>
            {teamLeaders.map(tl => (
              <option key={tl.id} value={tl.id}>{tl.name} - {tl.region} ({tl.teamSize} RMs)</option>
            ))}
          </select>
        </div>
        
        <div style={styles.formGroup}>
          <label style={styles.label}>Password</label>
          <input
            type="password"
            style={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
          />
        </div>
        
        <button style={styles.button} onClick={handleLogin}>
          Login to Team Dashboard
        </button>
        
        <div style={styles.demoNote}>
          🔐 Demo Password: <strong>tl123</strong> (for all Team Leaders)
        </div>
      </div>
    </div>
  )
}

export default TeamLeaderLogin