import { useState, useEffect } from 'react'
import { mockData } from '../data/mockData'

/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

const RMTable = ({ rms, onRMSummaryClick }) => {
  const [isMobile, setIsMobile] = useState(false)
  const [expandedRM, setExpandedRM] = useState(null)

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const formatRupees = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const getStatusColor = (status) => {
    if (!status) return 'white'
    switch(status) {
      case 'green': return '#e6ffe6'
      case 'yellow': return '#fff3e6'
      case 'red': return '#ffe6e6'
      default: return 'white'
    }
  }

  const getEscalationBadge = (level) => {
    if (!level) return null
    const colors = {
      medium: '#ffc107',
      high: '#fd7e14',
      critical: '#dc3545'
    }
    return {
      background: colors[level],
      color: 'white',
      padding: '2px 8px',
      borderRadius: '4px',
      fontSize: '12px',
      marginLeft: '8px'
    }
  }

  const getActivationColor = (rate) => {
    if (rate >= 70) return '#28a745'
    if (rate >= 40) return '#ffc107'
    return '#dc3545'
  }

  const getStatusIcon = (status) => {
    switch(status) {
      case 'green': return '🟢'
      case 'yellow': return '🟡'
      case 'red': return '🔴'
      default: return '⚪'
    }
  }

  // Mobile card styles
  const mobileStyles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      marginBottom: '20px'
    },
    card: {
      background: 'white',
      borderRadius: '12px',
      padding: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      borderLeft: '4px solid',
      transition: 'all 0.3s ease'
    },
    cardHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '10px',
      flexWrap: 'wrap',
      gap: '8px'
    },
    nameSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      flexWrap: 'wrap'
    },
    name: {
      fontSize: '16px',
      fontWeight: 'bold',
      color: '#333'
    },
    statusIcon: {
      fontSize: '14px'
    },
    escalationBadge: {
      padding: '2px 8px',
      borderRadius: '12px',
      fontSize: '10px',
      fontWeight: 'bold'
    },
    metricsRow: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '10px',
      marginBottom: '10px',
      paddingBottom: '10px',
      borderBottom: '1px solid #f0f0f0'
    },
    metricItem: {
      textAlign: 'center'
    },
    metricLabel: {
      fontSize: '11px',
      color: '#666',
      marginBottom: '4px'
    },
    metricValue: {
      fontSize: '14px',
      fontWeight: 'bold',
      color: '#333'
    },
    cpRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '8px',
      fontSize: '13px'
    },
    cpLabel: {
      color: '#666'
    },
    cpValue: {
      fontWeight: '500'
    },
    activationBadge: {
      display: 'inline-block',
      padding: '2px 8px',
      borderRadius: '12px',
      fontSize: '11px',
      fontWeight: 'bold'
    },
    button: {
      width: '100%',
      background: '#2196f3',
      color: 'white',
      border: 'none',
      padding: '10px',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '13px',
      fontWeight: 'bold',
      marginTop: '8px',
      transition: 'all 0.3s ease'
    },
    expandButton: {
      background: 'none',
      border: 'none',
      fontSize: '12px',
      color: '#2196f3',
      cursor: 'pointer',
      marginTop: '8px',
      padding: '5px',
      width: '100%',
      textAlign: 'center'
    },
    expandedContent: {
      marginTop: '10px',
      paddingTop: '10px',
      borderTop: '1px solid #f0f0f0'
    },
    detailRow: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '8px',
      fontSize: '12px'
    },
    detailLabel: {
      color: '#666'
    },
    detailValue: {
      fontWeight: '500',
      color: '#333'
    }
  }

  // Desktop table styles
  const desktopStyles = {
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginBottom: '30px',
      overflowX: 'auto',
      display: 'block'
    },
    th: {
      border: '1px solid #ddd',
      padding: '12px',
      background: '#f8f9fa',
      textAlign: 'left',
      fontWeight: 'bold',
      fontSize: '14px'
    },
    td: {
      border: '1px solid #ddd',
      padding: '10px',
      textAlign: 'left',
      fontSize: '14px'
    }
  }

  if (!rms || rms.length === 0) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading RM data...</div>
  }

  // Mobile Card View
  if (isMobile) {
    return (
      <div style={mobileStyles.container}>
        {rms.map(rm => {
          const status = rm.status || (rm.monthlyAchievement >= 60 ? 'green' : rm.monthlyAchievement >= 40 ? 'yellow' : 'red')
          const statusColor = getStatusColor(status)
          const activationColor = getActivationColor(rm.cpActivationRate || 0)
          const isExpanded = expandedRM === rm.id
          
          // Border color based on status
          let borderColor = '#28a745'
          if (status === 'yellow') borderColor = '#ffc107'
          if (status === 'red') borderColor = '#dc3545'
          
          return (
            <div key={rm.id} style={{ ...mobileStyles.card, borderLeftColor: borderColor, backgroundColor: getStatusColor(status) }}>
              {/* Card Header */}
              <div style={mobileStyles.cardHeader}>
                <div style={mobileStyles.nameSection}>
                  <span style={mobileStyles.statusIcon}>{getStatusIcon(status)}</span>
                  <span style={mobileStyles.name}>{rm.name}</span>
                  {rm.escalationLevel && (
                    <span style={{
                      ...mobileStyles.escalationBadge,
                      background: rm.escalationLevel === 'critical' ? '#dc3545' : rm.escalationLevel === 'high' ? '#fd7e14' : '#ffc107',
                      color: 'white'
                    }}>
                      {rm.escalationLevel.toUpperCase()}
                    </span>
                  )}
                </div>
              </div>

              {/* Main Metrics */}
              <div style={mobileStyles.metricsRow}>
                <div style={mobileStyles.metricItem}>
                  <div style={mobileStyles.metricLabel}>Target</div>
                  <div style={mobileStyles.metricValue}>{formatRupees(rm.monthlyTarget)}</div>
                </div>
                <div style={mobileStyles.metricItem}>
                  <div style={mobileStyles.metricLabel}>Achieved</div>
                  <div style={mobileStyles.metricValue}>{formatRupees(rm.monthlyAchieved)}</div>
                </div>
                <div style={mobileStyles.metricItem}>
                  <div style={mobileStyles.metricLabel}>Gap</div>
                  <div style={mobileStyles.metricValue}>{formatRupees(rm.monthlyGap)}</div>
                </div>
                <div style={mobileStyles.metricItem}>
                  <div style={mobileStyles.metricLabel}>Achievement</div>
                  <div style={mobileStyles.metricValue}>{(rm.monthlyAchievement || 0).toFixed(1)}%</div>
                </div>
              </div>

              {/* CP Metrics */}
              <div style={mobileStyles.cpRow}>
                <span style={mobileStyles.cpLabel}>CP Onboarded:</span>
                <span style={mobileStyles.cpValue}>{rm.cpOnboarded || 0} / {rm.cpTarget || 0}</span>
              </div>
              <div style={mobileStyles.cpRow}>
                <span style={mobileStyles.cpLabel}>Active CP:</span>
                <span style={mobileStyles.cpValue}>{rm.activeCP || 0} / {rm.activeCPTarget || 0}</span>
              </div>
              <div style={mobileStyles.cpRow}>
                <span style={mobileStyles.cpLabel}>CP Activation:</span>
                <span>
                  <span style={{
                    ...mobileStyles.activationBadge,
                    background: activationColor,
                    color: 'white'
                  }}>
                    {(rm.cpActivationRate || 0).toFixed(1)}%
                  </span>
                </span>
              </div>

              {/* Expand/Collapse Button */}
              <button 
                style={mobileStyles.expandButton}
                onClick={() => setExpandedRM(isExpanded ? null : rm.id)}
              >
                {isExpanded ? '▲ Show Less' : '▼ Show More Details'}
              </button>

              {/* Expanded Details */}
              {isExpanded && (
                <div style={mobileStyles.expandedContent}>
                  <div style={mobileStyles.detailRow}>
                    <span style={mobileStyles.detailLabel}>Monthly Target:</span>
                    <span style={mobileStyles.detailValue}>{formatRupees(rm.monthlyTarget)}</span>
                  </div>
                  <div style={mobileStyles.detailRow}>
                    <span style={mobileStyles.detailLabel}>Monthly Achieved:</span>
                    <span style={mobileStyles.detailValue}>{formatRupees(rm.monthlyAchieved)}</span>
                  </div>
                  <div style={mobileStyles.detailRow}>
                    <span style={mobileStyles.detailLabel}>Monthly Gap:</span>
                    <span style={mobileStyles.detailValue}>{formatRupees(rm.monthlyGap)}</span>
                  </div>
                  <div style={mobileStyles.detailRow}>
                    <span style={mobileStyles.detailLabel}>CP Target:</span>
                    <span style={mobileStyles.detailValue}>{rm.cpTarget}</span>
                  </div>
                  <div style={mobileStyles.detailRow}>
                    <span style={mobileStyles.detailLabel}>Active CP Target:</span>
                    <span style={mobileStyles.detailValue}>{rm.activeCPTarget}</span>
                  </div>
                  <div style={mobileStyles.detailRow}>
                    <span style={mobileStyles.detailLabel}>Last Activity:</span>
                    <span style={mobileStyles.detailValue}>{rm.lastActivity || 'N/A'}</span>
                  </div>
                  {rm.recommendation && (
                    <div style={{ ...mobileStyles.detailRow, marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #f0f0f0' }}>
                      <span style={mobileStyles.detailLabel}>💡 Recommendation:</span>
                      <span style={mobileStyles.detailValue}>{rm.recommendation}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Action Button */}
              <button 
                style={mobileStyles.button}
                onClick={() => onRMSummaryClick && onRMSummaryClick(rm)}
              >
                📊 Week {mockData.currentWeek} Progress
              </button>
            </div>
          )
        })}
      </div>
    )
  }

  // Desktop Table View
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={desktopStyles.table}>
        <thead>
          <tr>
            <th style={desktopStyles.th}>RM Name</th>
            <th style={desktopStyles.th}>Target (₹)</th>
            <th style={desktopStyles.th}>Achieved (₹)</th>
            <th style={desktopStyles.th}>Gap (₹)</th>
            <th style={desktopStyles.th}>Achievement %</th>
            <th style={desktopStyles.th}>CP Onboarded</th>
            <th style={desktopStyles.th}>Active CP</th>
            <th style={desktopStyles.th}>CP Activation %</th>
            <th style={desktopStyles.th}>Status</th>
            <th style={desktopStyles.th}>Weekly Data</th>
          </tr>
        </thead>
        <tbody>
          {rms.map(rm => {
            const status = rm.status || (rm.monthlyAchievement >= 60 ? 'green' : rm.monthlyAchievement >= 40 ? 'yellow' : 'red')
            const statusColor = getStatusColor(status)
            const activationColor = getActivationColor(rm.cpActivationRate || 0)
            
            return (
              <tr key={rm.id} style={{ backgroundColor: statusColor }}>
                <td style={desktopStyles.td}>
                  {rm.name}
                  {rm.escalationLevel && (
                    <span style={getEscalationBadge(rm.escalationLevel)}>
                      {rm.escalationLevel.toUpperCase()}
                    </span>
                  )}
                </td>
                <td style={desktopStyles.td}>{formatRupees(rm.monthlyTarget || 0)}</td>
                <td style={desktopStyles.td}>{formatRupees(rm.monthlyAchieved || 0)}</td>
                <td style={desktopStyles.td}>{formatRupees(rm.monthlyGap || 0)}</td>
                <td style={desktopStyles.td}>
                  <strong>{(rm.monthlyAchievement || 0).toFixed(1)}%</strong>
                </td>
                <td style={desktopStyles.td}>{rm.cpOnboarded || 0}</td>
                <td style={desktopStyles.td}>
                  {rm.activeCP || 0}
                  <span style={{ fontSize: '11px', color: '#666', marginLeft: '5px' }}>
                    / {rm.cpTarget || 0}
                  </span>
                </td>
                <td style={desktopStyles.td}>
                  <span style={{
                    display: 'inline-block',
                    padding: '3px 8px',
                    borderRadius: '12px',
                    background: activationColor,
                    color: 'white',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    {(rm.cpActivationRate || 0).toFixed(1)}%
                  </span>
                </td>
                <td style={desktopStyles.td}>
                  <span style={{
                    display: 'inline-block',
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: status === 'green' ? '#28a745' : status === 'yellow' ? '#ffc107' : '#dc3545',
                    marginRight: '8px'
                  }}></span>
                  {status.toUpperCase()}
                </td>
                <td style={desktopStyles.td}>
                  <button
                    onClick={() => onRMSummaryClick && onRMSummaryClick(rm)}
                    style={{
                      background: '#2196f3',
                      color: 'white',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}
                    onMouseEnter={(e) => e.target.style.opacity = '0.9'}
                    onMouseLeave={(e) => e.target.style.opacity = '1'}
                  >
                    📊 Week {mockData.currentWeek} Progress
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default RMTable
