import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

const RMLogin = ({ onLogin }) => {
  const [selectedRM, setSelectedRM] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [rmsList, setRmsList] = useState([])
  const [loadingRMs, setLoadingRMs] = useState(true)

  // Load RMs from Supabase on component mount
  useEffect(() => {
    loadRMs()
  }, [])

  const loadRMs = async () => {
    try {
      setLoadingRMs(true)
      const { data, error } = await supabase
        .from('rms')
        .select('id, name, email')
        .order('name')
      
      if (error) throw error
      
      setRmsList(data || [])
    } catch (err) {
      console.error('Error loading RMs:', err)
      setError('Failed to load RMs. Please refresh the page.')
    } finally {
      setLoadingRMs(false)
    }
  }

  const handleLogin = async () => {
    if (!selectedRM) {
      setError('Please select an RM')
      return
    }
    
    setLoading(true)
    setError('')
    
    try {
      // For demo purposes, accept 'rm123' as password
      // In production, you should verify against database
      if (password === 'rm123') {
        onLogin(selectedRM)
      } else {
        setError('Invalid password')
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
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
      fontSize: '14px',
      backgroundColor: 'white'
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
    buttonDisabled: {
      background: '#ccc',
      cursor: 'not-allowed'
    },
    error: {
      background: '#f8d7da',
      color: '#721c24',
      padding: '10px',
      borderRadius: '4px',
      marginBottom: '20px',
      fontSize: '14px'
    },
    loadingText: {
      textAlign: 'center',
      color: '#666',
      padding: '20px'
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

  if (loadingRMs) {
    return (
      <div style={styles.container}>
        <div style={styles.loginBox}>
          <h1 style={styles.title}>👤 RM Portal</h1>
          <div style={styles.loadingText}>Loading RMs...</div>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <div style={styles.loginBox}>
        <h1 style={styles.title}>👤 RM Portal</h1>
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
            {rmsList.map(rm => (
              <option key={rm.id} value={rm.id}>{rm.name} - {rm.email}</option>
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
        
        <button 
          style={{
            ...styles.button,
            ...(loading ? styles.buttonDisabled : {})
          }}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login to Dashboard'}
        </button>
        
        <div style={styles.demoNote}>
          🔐 Demo Password: <strong>rm123</strong> (for all RMs)<br />
          You can change your password after login
        </div>
      </div>
    </div>
  )
}

export default RMLogin
