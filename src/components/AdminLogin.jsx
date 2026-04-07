import { useState } from 'react'

const AdminLogin = ({ onLogin }) => {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = () => {
    setLoading(true)
    setError('')
    
    // Simple password check for admin
    if (password === 'admin123') {
      onLogin()
    } else {
      setError('Invalid password')
    }
    setLoading(false)
  }

  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
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
      background: '#2a5298',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: 'pointer'
    },
    buttonDisabled: {
      background: '#ccc',
      cursor: 'not-allowed'
    },
    error: {
      background: '#f8d7da',
      color: '#721c24',
      padding: '10px',
      borderRadius: '4px',
      marginBottom: '20px'
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
        <h1 style={styles.title}>🔐 Admin War Room</h1>
        <p style={styles.subtitle}>Enter your password to access</p>
        
        {error && <div style={styles.error}>{error}</div>}
        
        <div style={styles.formGroup}>
          <label style={styles.label}>Password</label>
          <input
            type="password"
            style={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter admin password"
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
          />
        </div>
        
        <button 
          style={{
            ...styles.button,
            ...(loading ? styles.buttonDisabled : {})
          }}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login to Admin Dashboard'}
        </button>
        
        <div style={styles.demoNote}>
          🔐 Demo Password: <strong>admin123</strong>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin

