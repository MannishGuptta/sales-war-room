const InterventionFeed = ({ interventions }) => {
    const getLevelColor = (level) => {
      switch(level) {
        case 'critical': 
          return { bg: '#f8d7da', border: '#dc3545', text: '#721c24', icon: '🔴' }
        case 'high': 
          return { bg: '#fff3cd', border: '#fd7e14', text: '#856404', icon: '🟠' }
        case 'medium': 
          return { bg: '#d1ecf1', border: '#17a2b8', text: '#0c5460', icon: '🟡' }
        default: 
          return { bg: '#e2e3e5', border: '#6c757d', text: '#383d41', icon: '⚪' }
      }
    }
  
    const styles = {
      container: {
        marginTop: '20px'
      },
      title: {
        fontSize: '20px',
        fontWeight: 'bold',
        marginBottom: '20px',
        paddingBottom: '10px',
        borderBottom: '2px solid #f0f0f0'
      },
      feedItem: {
        padding: '15px',
        marginBottom: '12px',
        borderRadius: '8px',
        transition: 'all 0.3s ease'
      },
      rmName: {
        fontSize: '16px',
        fontWeight: 'bold',
        marginBottom: '8px'
      },
      message: {
        fontSize: '14px',
        marginBottom: '8px'
      },
      recommendation: {
        fontSize: '13px',
        fontStyle: 'italic',
        marginTop: '8px',
        paddingTop: '8px',
        borderTop: '1px dashed rgba(0,0,0,0.1)'
      },
      emptyState: {
        padding: '40px',
        textAlign: 'center',
        background: '#f8f9fa',
        borderRadius: '8px',
        color: '#666'
      }
    }
  
    if (!interventions || interventions.length === 0) {
      return (
        <div style={styles.container}>
          <h3 style={styles.title}>Intervention Feed</h3>
          <div style={styles.emptyState}>
            ✅ All RMs are meeting targets! No interventions needed.
          </div>
        </div>
      )
    }
  
    return (
      <div style={styles.container}>
        <h3 style={styles.title}>
          Intervention Feed 
          <span style={{ fontSize: '14px', fontWeight: 'normal', marginLeft: '10px', color: '#666' }}>
            ({interventions.length} active {interventions.length === 1 ? 'alert' : 'alerts'})
          </span>
        </h3>
        {interventions.map(intervention => {
          const colors = getLevelColor(intervention.level)
          return (
            <div 
              key={intervention.id} 
              style={{
                ...styles.feedItem,
                backgroundColor: colors.bg,
                borderLeft: `4px solid ${colors.border}`,
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}
            >
              <div style={styles.rmName}>
                {colors.icon} {intervention.rm}
                <span style={{ 
                  float: 'right', 
                  fontSize: '12px', 
                  fontWeight: 'normal',
                  background: 'rgba(0,0,0,0.05)',
                  padding: '2px 8px',
                  borderRadius: '12px'
                }}>
                  {intervention.level.toUpperCase()}
                </span>
              </div>
              <div style={styles.message}>{intervention.message}</div>
              {intervention.recommendation && (
                <div style={styles.recommendation}>
                  💡 <strong>Action Required:</strong> {intervention.recommendation}
                </div>
              )}
              {intervention.daysInactive > 0 && (
                <div style={{ fontSize: '12px', marginTop: '5px', opacity: 0.7 }}>
                  ⏰ {intervention.daysInactive} day{intervention.daysInactive !== 1 ? 's' : ''} without activity
                </div>
              )}
            </div>
          )
        })}
      </div>
    )
  }
  
  export default InterventionFeed