import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

const TeamLeaderLogin = ({ onLogin }) => {
  const [selectedTL, setSelectedTL] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [tlList, setTlList] = useState([])
  const [loadingTLs, setLoadingTLs] = useState(true)

  // Load Team Leaders from Supabase on component mount
  useEffect(() => {
    loadTeamLeaders()
  }, [])

  const loadTeamLeaders = async () => {
    try {
      setLoadingTLs(true)
      const { data, error } = await supabase
        .from('team_leaders')
        .select('id, name, email, region, team_size')
        .order('name')
      
      if (error) throw error
      
      // Get team size for each TL (count of RMs assigned)
      const tlWithTeamSize = await Promise.all((data || []).map(async (tl) => {
        const { count, error: countError } = await supabase
          .from('rm_tl_assignments')
          .select('*', { count: 'exact', head: true })
          .eq('tl_id', tl.id)
        
        return {
          ...tl,
          team_size: count || 0
        }
      }))
      
      setTlList(tlWithTeamSize || [])
    } catch (err) {
      console.error('Error loading Team Leaders:', err)
      setError('Failed to load Team Leaders. Please refresh the page.')
    } finally {
      setLoadingTLs(false)
    }
  }

  const handleLogin = async () => {
    if (!selectedTL) {
      setError('Please select a Team Leader')
      return
    }
    
    setLoading(true)
    setError('')
    
    try {
      // Query Supabase for the selected Team Leader
      const { data, error } = await supabase
        .from('team_leaders')
        .select('id, name, email, password_hash')
        .eq('id', parseInt(selectedTL))
        .single()
      
      if (error) throw error
      
      // For demo, using plain text comparison
      // In production, use proper password hashing
      const storedPassword = data.password_hash || 'tl123'
      
      if (password === storedPassword) {
        onLogin(selectedTL)
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
      background: '#ff9800',
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
      background: '#fff3e0',
      borderRadius: '6px',
      fontSize: '12px',
      color: '#666',
      textAlign: 'center'
    }
  }

  if (loadingTLs) {
    return (
      <div style={styles.container}>
        <div style={styles.loginBox}>
          <h1 style={styles.title}>👥 Team Leader Portal</h1>
          <div style={styles.loadingText}>Loading Team Leaders...</div>
        </div>
      </div>
    )
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
            {tlList.map(tl => (
              <option key={tl.id} value={tl.id}>
                {tl.name} - {tl.region} ({tl.team_size || 0} RMs)
              </option>
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
          {loading ? 'Logging in...' : 'Login to Team Dashboard'}
        </button>
        
        <div style={styles.demoNote}>
          🔐 Demo Password: <strong>tl123</strong> (for all Team Leaders)<br />
          You can change your password after login
        </div>
      </div>
    </div>
  )
}

export default TeamLeaderLogin