import { useState } from 'react'
import { mockData } from '../data/mockData'

const RMLogin = ({ onLogin }) => {
  const [selectedRM, setSelectedRM] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = () => {
    if (!selectedRM) {
      setError('Please select an RM')
      return
    }
    
    // Simple password check (in production, use proper authentication)
    if (password !== 'rm123') {
      setError('Invalid password. Use "rm123" for demo.')
      return
    }
    
    onLogin(selectedRM)
  }

  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
      background: '#2196f3',
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
      background: '#e3f2fd',
      borderRadius: '6px',
      fontSize: '12px',
      color: '#666',
      textAlign: 'center'
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.loginBox}>
        <h1 style={styles.title}>🏆 RM Portal</h1>
        <p style={styles.subtitle}>Login to access your dashboard</p>
        
        {error && <div style={styles.error}>{error}</div>}
        
        <div style={styles.formGroup}>
          <label style={styles.label}>Select RM</label>
          <select
            style={styles.select}
            value={selectedRM}
            onChange={(e) => setSelectedRM(e.target.value)}
          >
            <option value="">Select your profile</option>
            {mockData.rms.map(rm => (
              <option key={rm.id} value={rm.id}>{rm.name}</option>
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
          Login to Dashboard
        </button>
        
        <div style={styles.demoNote}>
          🔐 Demo Password: <strong>rm123</strong> (for all RMs)
        </div>
      </div>
    </div>
  )
}

export default RMLogin