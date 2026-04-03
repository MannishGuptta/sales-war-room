import { useState } from 'react'

const LandingPage = ({ onSelectPortal }) => {
  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
      fontFamily: 'Arial, sans-serif'
    },
    card: {
      background: 'white',
      borderRadius: '16px',
      padding: '40px',
      maxWidth: '500px',
      width: '90%',
      textAlign: 'center',
      boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
    },
    title: {
      fontSize: '32px',
      fontWeight: 'bold',
      color: '#333',
      marginBottom: '10px'
    },
    subtitle: {
      fontSize: '16px',
      color: '#666',
      marginBottom: '40px'
    },
    portalGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '20px',
      marginBottom: '30px'
    },
    portalCard: {
      padding: '30px 20px',
      borderRadius: '12px',
      cursor: 'pointer',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      textAlign: 'center'
    },
    portalIcon: {
      fontSize: '48px',
      marginBottom: '15px'
    },
    portalTitle: {
      fontSize: '20px',
      fontWeight: 'bold',
      marginBottom: '8px'
    },
    portalDesc: {
      fontSize: '13px',
      color: '#666'
    },
    adminCard: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white'
    },
    rmCard: {
      background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
      color: 'white'
    },
    tlCard: {
      background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
      color: 'white'
    },
    footer: {
      marginTop: '20px',
      fontSize: '12px',
      color: '#999'
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>🏆 Sales War Room</h1>
        <p style={styles.subtitle}>Select your portal to continue</p>

        <div style={styles.portalGrid}>
          {/* Admin Portal */}
          <div
            style={{ ...styles.portalCard, ...styles.adminCard }}
            onClick={() => onSelectPortal('admin')}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <div style={styles.portalIcon}>🔐</div>
            <div style={styles.portalTitle}>Admin War Room</div>
            <div style={styles.portalDesc}>Full access to all RMs and TLs</div>
          </div>

          {/* RM Portal */}
          <div
            style={{ ...styles.portalCard, ...styles.rmCard }}
            onClick={() => onSelectPortal('rm')}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <div style={styles.portalIcon}>👤</div>
            <div style={styles.portalTitle}>RM Portal</div>
            <div style={styles.portalDesc}>Your personal sales dashboard</div>
          </div>

          {/* Team Leader Portal */}
          <div
            style={{ ...styles.portalCard, ...styles.tlCard }}
            onClick={() => onSelectPortal('tl')}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <div style={styles.portalIcon}>👥</div>
            <div style={styles.portalTitle}>Team Leader Portal</div>
            <div style={styles.portalDesc}>Manage your team's performance</div>
          </div>
        </div>

        <div style={styles.footer}>
          © 2024 Sales War Room | Enterprise Sales Management
        </div>
      </div>
    </div>
  )
}

export default LandingPage