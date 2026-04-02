const PerformanceChart = ({ rms }) => {
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
        background: 'white',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '30px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      },
      title: {
        fontSize: '18px',
        fontWeight: 'bold',
        marginBottom: '15px',
        color: '#333'
      },
      barContainer: {
        marginBottom: '15px'
      },
      barLabel: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '5px',
        fontSize: '14px',
        fontWeight: '500'
      },
      barBackground: {
        background: '#e0e0e0',
        borderRadius: '4px',
        overflow: 'hidden'
      },
      barFill: {
        height: '30px',
        borderRadius: '4px',
        transition: 'width 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingRight: '10px',
        color: 'white',
        fontSize: '12px',
        fontWeight: 'bold'
      },
      legend: {
        display: 'flex',
        gap: '20px',
        marginTop: '15px',
        paddingTop: '15px',
        borderTop: '1px solid #e0e0e0',
        fontSize: '12px'
      },
      legendItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '5px'
      },
      legendColor: {
        width: '12px',
        height: '12px',
        borderRadius: '3px'
      }
    }
  
    if (!rms || rms.length === 0) {
      return <div>Loading chart...</div>
    }
  
    // Sort RMs by monthly achievement percentage (highest first)
    const sortedRMs = [...rms].sort((a, b) => b.monthlyAchievement - a.monthlyAchievement)
  
    return (
      <div style={styles.container}>
        <h3 style={styles.title}>📊 Monthly Achievement Chart</h3>
        {sortedRMs.map(rm => {
          let barColor = '#28a745' // green
          if (rm.monthlyAchievement < 40) barColor = '#dc3545' // red
          else if (rm.monthlyAchievement < 60) barColor = '#ffc107' // yellow
          
          return (
            <div key={rm.id} style={styles.barContainer}>
              <div style={styles.barLabel}>
                <span>{rm.name}</span>
                <span style={{ fontWeight: 'bold' }}>
                  {formatRupees(rm.monthlyAchieved)} / {formatRupees(rm.monthlyTarget)}
                </span>
              </div>
              <div style={styles.barBackground}>
                <div 
                  style={{
                    ...styles.barFill,
                    width: `${Math.min(rm.monthlyAchievement, 100)}%`,
                    background: barColor
                  }}
                >
                  {rm.monthlyAchievement > 30 && `${rm.monthlyAchievement.toFixed(0)}%`}
                </div>
              </div>
            </div>
          )
        })}
        
        <div style={styles.legend}>
          <div style={styles.legendItem}>
            <div style={{ ...styles.legendColor, background: '#28a745' }}></div>
            <span>On Track (≥60%)</span>
          </div>
          <div style={styles.legendItem}>
            <div style={{ ...styles.legendColor, background: '#ffc107' }}></div>
            <span>Warning (40-59%)</span>
          </div>
          <div style={styles.legendItem}>
            <div style={{ ...styles.legendColor, background: '#dc3545' }}></div>
            <span>Critical (&lt;40%)</span>
          </div>
        </div>
      </div>
    )
  }
  
  export default PerformanceChart