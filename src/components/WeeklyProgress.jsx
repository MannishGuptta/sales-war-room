import { mockData } from '../data/mockData'

const WeeklyProgress = ({ rm, onClose }) => {
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
      borderRadius: '12px',
      marginBottom: '15px',
      border: '1px solid #e0e0e0',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      maxWidth: '500px',
      minWidth: '300px'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '15px',
      paddingBottom: '10px',
      borderBottom: '2px solid #f0f0f0'
    },
    title: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#333'
    },
    closeBtn: {
      background: 'none',
      border: 'none',
      fontSize: '20px',
      cursor: 'pointer',
      color: '#999'
    },
    weekContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '10px',
      marginBottom: '10px'
    },
    weekCard: {
      padding: '10px',
      background: '#f8f9fa',
      borderRadius: '8px',
      textAlign: 'center'
    },
    weekLabel: {
      fontSize: '12px',
      fontWeight: 'bold',
      marginBottom: '8px',
      color: '#666'
    },
    revenue: {
      fontSize: '14px',
      fontWeight: 'bold',
      color: '#28a745',
      marginBottom: '4px'
    },
    cpText: {
      fontSize: '11px',
      color: '#666'
    },
    progressBar: {
      height: '4px',
      background: '#e0e0e0',
      borderRadius: '2px',
      marginTop: '8px',
      overflow: 'hidden'
    },
    progressFill: {
      height: '100%',
      background: '#28a745',
      borderRadius: '2px',
      transition: 'width 0.3s ease'
    },
    summary: {
      marginTop: '15px',
      paddingTop: '10px',
      borderTop: '1px solid #e0e0e0',
      fontSize: '13px',
      color: '#666'
    }
  }

  const weeklyTargetRevenue = rm.monthlyTarget / 4
  const weeklyTargetCP = Math.ceil(rm.cpTarget / 4)
  const weeklyTargetActive = Math.ceil(rm.activeCPTarget / 4)

  const weeks = ['week1', 'week2', 'week3', 'week4']
  const weekNames = ['Week 1', 'Week 2', 'Week 3', 'Week 4']

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.title}>
          📊 {rm.name} - Weekly Progress
          <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
            Current Week: {mockData.currentWeek} of 4
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} style={styles.closeBtn}>✕</button>
        )}
      </div>
      <div style={styles.weekContainer}>
        {weeks.map((week, index) => {
          const progress = rm.weeklyProgress[week]
          const revenuePercent = (progress.revenue / weeklyTargetRevenue) * 100
          const isCurrentWeek = index + 1 === mockData.currentWeek
          
          return (
            <div key={week} style={{
              ...styles.weekCard,
              background: isCurrentWeek ? '#e3f2fd' : '#f8f9fa',
              border: isCurrentWeek ? '2px solid #2196f3' : '1px solid #e0e0e0'
            }}>
              <div style={styles.weekLabel}>
                {weekNames[index]}
                {isCurrentWeek && <span style={{ marginLeft: '5px', fontSize: '10px' }}>📍</span>}
              </div>
              <div style={styles.revenue}>{formatRupees(progress.revenue)}</div>
              <div style={styles.cpText}>CP: {progress.cpOnboarded} / {weeklyTargetCP}</div>
              <div style={styles.cpText}>Active: {progress.activeCP} / {weeklyTargetActive}</div>
              <div style={styles.progressBar}>
                <div style={{ ...styles.progressFill, width: `${Math.min(revenuePercent, 100)}%` }} />
              </div>
            </div>
          )
        })}
      </div>
      <div style={styles.summary}>
        <strong>Monthly Summary:</strong> {formatRupees(rm.monthlyAchieved)} / {formatRupees(rm.monthlyTarget)} achieved 
        ({rm.monthlyAchievement.toFixed(1)}%)
      </div>
    </div>
  )
}

export default WeeklyProgress