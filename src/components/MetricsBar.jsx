const MetricsBar = ({ metrics }) => {
    if (!metrics) {
      return <div style={{ padding: '20px', textAlign: 'center' }}>Loading metrics...</div>
    }
  
    const formatRupees = (amount) => {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(amount)
    }
  
    const styles = {
      container: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        padding: '20px',
        background: '#f5f5f5',
        borderRadius: '8px',
        marginBottom: '30px'
      },
      metric: {
        textAlign: 'center',
        padding: '15px',
        background: 'white',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        transition: 'transform 0.2s ease',
        cursor: 'pointer'
      },
      label: {
        fontSize: '13px',
        color: '#666',
        marginBottom: '8px',
        textTransform: 'uppercase',
        fontWeight: '500',
        letterSpacing: '0.5px'
      },
      value: {
        fontSize: '28px',
        fontWeight: 'bold',
        color: '#333'
      },
      subValue: {
        fontSize: '12px',
        color: '#999',
        marginTop: '5px'
      },
      gapValue: {
        fontSize: '14px',
        color: '#dc3545',
        marginTop: '5px'
      }
    }
  
    return (
      <div style={styles.container}>
        {/* Revenue Metrics */}
        <div style={styles.metric}>
          <div style={styles.label}>Revenue Target</div>
          <div style={styles.value}>{formatRupees(metrics.totalRevenueTarget)}</div>
          <div style={styles.subValue}>Monthly Target</div>
        </div>
        <div style={styles.metric}>
          <div style={styles.label}>Revenue Achieved</div>
          <div style={styles.value}>{formatRupees(metrics.totalRevenueAchieved)}</div>
          <div style={styles.subValue}>{metrics.revenueConversion || 0}% of target</div>
        </div>
        <div style={styles.metric}>
          <div style={styles.label}>Revenue Gap</div>
          <div style={styles.value}>{formatRupees(metrics.revenueGap)}</div>
          <div style={styles.gapValue}>Need to cover</div>
        </div>
  
        {/* CP Metrics */}
        <div style={styles.metric}>
          <div style={styles.label}>CP Target</div>
          <div style={styles.value}>{metrics.totalCPTarget}</div>
          <div style={styles.subValue}>Channel Partners to onboard</div>
        </div>
        <div style={styles.metric}>
          <div style={styles.label}>CP Onboarded</div>
          <div style={styles.value}>{metrics.totalCPOnboarded}</div>
          <div style={styles.subValue}>Gap: {metrics.cpGap}</div>
        </div>
        <div style={styles.metric}>
          <div style={styles.label}>Active CP Target</div>
          <div style={styles.value}>{metrics.totalActiveCPTarget}</div>
          <div style={styles.subValue}>Need ≥1 sale each</div>
        </div>
        <div style={styles.metric}>
          <div style={styles.label}>Active CP</div>
          <div style={styles.value}>{metrics.totalActiveCP}</div>
          <div style={styles.subValue}>Gap: {metrics.activeCPGap}</div>
        </div>
        <div style={styles.metric}>
          <div style={styles.label}>CP Activation Rate</div>
          <div style={styles.value}>{metrics.cpActivationRate || 0}%</div>
          <div style={styles.subValue}>Active / Total CP</div>
        </div>
      </div>
    )
  }
  
  export default MetricsBar
