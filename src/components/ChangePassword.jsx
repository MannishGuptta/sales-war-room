import { useState } from 'react'

const ChangePassword = ({ userType, userId, userName, onClose, onPasswordChanged }) => {
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const getCurrentPassword = () => {
    if (userType === 'admin') {
      return localStorage.getItem('admin_password') || 'admin123'
    } else if (userType === 'rm') {
      return localStorage.getItem(`rm_password_${userId}`) || 'rm123'
    } else if (userType === 'tl') {
      return localStorage.getItem(`tl_password_${userId}`) || 'tl123'
    }
    return ''
  }

  const handleChangePassword = () => {
    const currentPassword = getCurrentPassword()
    
    if (oldPassword !== currentPassword) {
      setError('Current password is incorrect')
      return
    }
    
    if (newPassword.length < 4) {
      setError('New password must be at least 4 characters')
      return
    }
    
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match')
      return
    }
    
    // Save new password
    if (userType === 'admin') {
      localStorage.setItem('admin_password', newPassword)
    } else if (userType === 'rm') {
      localStorage.setItem(`rm_password_${userId}`, newPassword)
    } else if (userType === 'tl') {
      localStorage.setItem(`tl_password_${userId}`, newPassword)
    }
    
    setSuccess('Password changed successfully!')
    setTimeout(() => {
      if (onPasswordChanged) onPasswordChanged()
      onClose()
    }, 1500)
  }

  const styles = {
    container: {
      background: 'white',
      borderRadius: '12px',
      padding: '24px',
      maxWidth: '400px',
      margin: '0 auto',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
      paddingBottom: '16px',
      borderBottom: '2px solid #f0f0f0'
    },
    title: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: '#333',
      margin: 0
    },
    closeBtn: {
      background: '#dc3545',
      color: 'white',
      border: 'none',
      padding: '6px 12px',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '12px'
    },
    formGroup: {
      marginBottom: '16px'
    },
    label: {
      display: 'block',
      marginBottom: '6px',
      fontWeight: '500',
      color: '#333',
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
      padding: '10px',
      background: '#28a745',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: 'bold'
    },
    error: {
      background: '#f8d7da',
      color: '#721c24',
      padding: '10px',
      borderRadius: '4px',
      marginBottom: '16px',
      fontSize: '14px'
    },
    success: {
      background: '#d4edda',
      color: '#155724',
      padding: '10px',
      borderRadius: '4px',
      marginBottom: '16px',
      fontSize: '14px'
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>Change Password - {userName}</h3>
        <button onClick={onClose} style={styles.closeBtn}>Close</button>
      </div>

      {error && <div style={styles.error}>{error}</div>}
      {success && <div style={styles.success}>{success}</div>}

      <div style={styles.formGroup}>
        <label style={styles.label}>Current Password</label>
        <input
          type="password"
          style={styles.input}
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          placeholder="Enter current password"
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>New Password</label>
        <input
          type="password"
          style={styles.input}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Enter new password (min 4 characters)"
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Confirm New Password</label>
        <input
          type="password"
          style={styles.input}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm new password"
        />
      </div>

      <button style={styles.button} onClick={handleChangePassword}>
        Change Password
      </button>
    </div>
  )
}

export default ChangePassword