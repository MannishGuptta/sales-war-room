import { useState, useEffect } from 'react'
import { mockData } from '../data/mockData'
import HRAttendanceReport from './HRAttendanceReport'

const AttendanceMonitor = ({ onClose }) => {
  const [selectedRM, setSelectedRM] = useState(null)
  const [attendanceData, setAttendanceData] = useState([])
  const [liveLocations, setLiveLocations] = useState({})
  const [locationHistory, setLocationHistory] = useState({})
  const [dateRange, setDateRange] = useState({ start: '', end: '' })
  const [filterStatus, setFilterStatus] = useState('all')
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [showHRReport, setShowHRReport] = useState(false)

  useEffect(() => {
    loadAttendanceData()
    
    // Simulate live location updates every 10 seconds
    const interval = setInterval(() => {
      if (autoRefresh) {
        updateLiveLocations()
      }
    }, 10000)
    
    return () => clearInterval(interval)
  }, [autoRefresh, attendanceData])

  const loadAttendanceData = () => {
    const data = mockData.rms.map(rm => ({
      id: rm.id,
      name: rm.name,
      email: rm.email,
      phone: rm.phone,
      attendance: rm.attendance,
      currentStatus: getCurrentStatus(rm.attendance),
      lastLogin: rm.attendance.lastLogin,
      todayStatus: getTodayStatus(rm.attendance),
      loginTime: getTodayLoginTime(rm.attendance),
      logoutTime: getTodayLogoutTime(rm.attendance)
    }))
    setAttendanceData(data)
  }

  const getCurrentStatus = (attendance) => {
    const today = new Date().toISOString().split('T')[0]
    const todayRecord = attendance.loginHistory?.find(h => h.date === today)
    if (!todayRecord || !todayRecord.loginTime) return 'Not Checked In'
    if (todayRecord.loginTime && !todayRecord.logoutTime) return 'Working'
    if (todayRecord.logoutTime) return 'Logged Out'
    return 'Not Checked In'
  }

  const getTodayStatus = (attendance) => {
    const today = new Date().toISOString().split('T')[0]
    const todayRecord = attendance.loginHistory?.find(h => h.date === today)
    return todayRecord || { status: 'absent', location: 'Not recorded' }
  }

  const getTodayLoginTime = (attendance) => {
    const today = new Date().toISOString().split('T')[0]
    const todayRecord = attendance.loginHistory?.find(h => h.date === today)
    return todayRecord?.loginTime || null
  }

  const getTodayLogoutTime = (attendance) => {
    const today = new Date().toISOString().split('T')[0]
    const todayRecord = attendance.loginHistory?.find(h => h.date === today)
    return todayRecord?.logoutTime || null
  }

  const updateLiveLocations = () => {
    const newLocations = {}
    const newHistory = { ...locationHistory }
    
    attendanceData.forEach(rm => {
      if (rm.currentStatus === 'Working') {
        // Simulate realistic location changes
        const locations = [
          { name: 'Mumbai Office', lat: 19.0760, lng: 72.8777 },
          { name: 'Remote - Home', lat: 19.0820, lng: 72.8850 },
          { name: 'Client Visit - Andheri', lat: 19.1196, lng: 72.8469 },
          { name: 'Client Visit - BKC', lat: 19.0633, lng: 72.8657 },
          { name: 'In Transit', lat: 19.0900, lng: 72.8600 },
          { name: 'Client Visit - Thane', lat: 19.2183, lng: 72.9781 },
          { name: 'Sales Meeting - Vashi', lat: 19.0770, lng: 73.0000 }
        ]
        
        const randomLocation = locations[Math.floor(Math.random() * locations.length)]
        const timestamp = new Date().toLocaleTimeString()
        
        newLocations[rm.id] = {
          location: randomLocation.name,
          lastUpdate: timestamp,
          lat: randomLocation.lat,
          lng: randomLocation.lng,
          status: 'active'
        }
        
        // Store location history
        if (!newHistory[rm.id]) newHistory[rm.id] = []
        newHistory[rm.id].push({
          time: timestamp,
          location: randomLocation.name,
          lat: randomLocation.lat,
          lng: randomLocation.lng
        })
        
        // Keep only last 50 location points
        if (newHistory[rm.id].length > 50) {
          newHistory[rm.id] = newHistory[rm.id].slice(-50)
        }
      }
    })
    
    setLiveLocations(newLocations)
    setLocationHistory(newHistory)
  }

  const downloadAttendanceReport = () => {
    const reportData = selectedRM ? [selectedRM] : attendanceData
    
    const exportData = reportData.map(rm => {
      const attendance = rm.attendance || rm
      const history = attendance.loginHistory || []
      const liveLoc = liveLocations[rm.id]
      
      // Create rows for each day
      return history.map(day => ({
        'RM Name': rm.name,
        'Email': rm.email,
        'Phone': rm.phone,
        'Date': day.date,
        'Login Time': day.loginTime || '-',
        'Logout Time': day.logoutTime || '-',
        'Check-in Location': day.location || '-',
        'Status': day.status || 'absent',
        'Notes': day.notes || '-',
        'Live Location (if working)': liveLoc?.location || '-',
        'Last Location Update': liveLoc?.lastUpdate || '-',
        'Attendance Rate': `${((attendance.presentDays / attendance.totalDays) * 100).toFixed(1)}%`,
        'Total Present': attendance.presentDays,
        'Total Absent': attendance.absentDays || 0,
        'Total Late': attendance.lateDays || 0
      }))
    }).flat()

    const headers = Object.keys(exportData[0])
    const csvRows = [
      headers.join(','),
      ...exportData.map(row => headers.map(header => {
        const value = row[header] || ''
        return `"${String(value).replace(/"/g, '""')}"`
      }).join(','))
    ]
    const csvString = csvRows.join('\n')

    const blob = new Blob(['\uFEFF' + csvString], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `attendance-report-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const downloadLiveLocationReport = () => {
    const exportData = []
    
    Object.keys(liveLocations).forEach(rmId => {
      const rm = attendanceData.find(r => r.id === parseInt(rmId))
      const loc = liveLocations[rmId]
      const history = locationHistory[rmId] || []
      
      exportData.push({
        'RM Name': rm?.name || 'Unknown',
        'Current Location': loc.location,
        'Last Update': loc.lastUpdate,
        'Latitude': loc.lat,
        'Longitude': loc.lng,
        'Status': loc.status,
        'Login Time': rm?.loginTime || '-',
        'Working Hours': calculateWorkingHours(rm?.loginTime),
        'Location History': history.map(h => `${h.time}: ${h.location}`).join(' | ')
      })
    })

    const headers = Object.keys(exportData[0])
    const csvRows = [
      headers.join(','),
      ...exportData.map(row => headers.map(header => {
        const value = row[header] || ''
        return `"${String(value).replace(/"/g, '""')}"`
      }).join(','))
    ]
    const csvString = csvRows.join('\n')

    const blob = new Blob(['\uFEFF' + csvString], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `live-location-report-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const calculateWorkingHours = (loginTime) => {
    if (!loginTime) return 'N/A'
    const now = new Date()
    const login = new Date()
    const [hours, minutes] = loginTime.split(':')
    login.setHours(parseInt(hours), parseInt(minutes), 0)
    const diffMs = now - login
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60))
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
    return `${diffHrs}h ${diffMins}m`
  }

  const getDurationColor = (hours) => {
    if (hours >= 8) return '#28a745'
    if (hours >= 4) return '#ffc107'
    return '#dc3545'
  }

  const filterAttendance = () => {
    let filtered = [...attendanceData]
    
    if (filterStatus !== 'all') {
      filtered = filtered.filter(rm => rm.currentStatus.toLowerCase() === filterStatus.toLowerCase())
    }
    
    if (dateRange.start && dateRange.end) {
      // Filter logic for date range
    }
    
    return filtered
  }

  const styles = {
    container: {
      background: 'white',
      borderRadius: '12px',
      padding: '24px',
      maxWidth: '1400px',
      margin: '0 auto',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '24px',
      paddingBottom: '16px',
      borderBottom: '2px solid #f0f0f0',
      flexWrap: 'wrap',
      gap: '15px'
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#333',
      margin: 0
    },
    subtitle: {
      fontSize: '14px',
      color: '#666',
      marginTop: '5px'
    },
    closeBtn: {
      background: '#dc3545',
      color: 'white',
      border: 'none',
      padding: '8px 16px',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: 'bold'
    },
    hrReportBtn: {
      background: '#6f42c1',
      color: 'white',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: 'bold'
    },
    filters: {
      display: 'flex',
      gap: '15px',
      marginBottom: '20px',
      flexWrap: 'wrap',
      alignItems: 'center'
    },
    filterSelect: {
      padding: '8px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '14px'
    },
    filterInput: {
      padding: '8px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '14px'
    },
    autoRefreshBtn: {
      padding: '8px 16px',
      background: '#17a2b8',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '14px'
    },
    downloadBtn: {
      background: '#28a745',
      color: 'white',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: 'bold'
    },
    downloadLocationBtn: {
      background: '#17a2b8',
      color: 'white',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: 'bold'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginBottom: '20px',
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
    },
    statusBadge: {
      display: 'inline-block',
      padding: '4px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: 'bold'
    },
    workingBadge: {
      background: '#d4edda',
      color: '#155724'
    },
    loggedOutBadge: {
      background: '#e2e3e5',
      color: '#383d41'
    },
    notCheckedBadge: {
      background: '#fff3cd',
      color: '#856404'
    },
    liveLocation: {
      fontSize: '12px',
      color: '#28a745',
      marginTop: '4px'
    },
    locationDot: {
      width: '10px',
      height: '10px',
      borderRadius: '50%',
      background: '#28a745',
      display: 'inline-block',
      marginRight: '5px',
      animation: 'pulse 1.5s infinite'
    },
    viewBtn: {
      background: '#2196f3',
      color: 'white',
      border: 'none',
      padding: '5px 10px',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '12px',
      marginRight: '5px'
    },
    downloadRowBtn: {
      background: '#28a745',
      color: 'white',
      border: 'none',
      padding: '5px 10px',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '12px'
    },
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    },
    modalContent: {
      background: 'white',
      borderRadius: '12px',
      padding: '24px',
      maxWidth: '900px',
      width: '90%',
      maxHeight: '80vh',
      overflow: 'auto'
    },
    modalHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
      paddingBottom: '10px',
      borderBottom: '2px solid #f0f0f0'
    },
    modalTitle: {
      fontSize: '20px',
      fontWeight: 'bold'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
      gap: '15px',
      marginBottom: '20px'
    },
    statCard: {
      background: '#f8f9fa',
      padding: '15px',
      borderRadius: '8px',
      textAlign: 'center'
    },
    statValue: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#333'
    },
    statLabel: {
      fontSize: '12px',
      color: '#666',
      marginTop: '5px'
    },
    locationCard: {
      background: '#e3f2fd',
      padding: '15px',
      borderRadius: '8px',
      marginBottom: '15px'
    },
    locationHistory: {
      maxHeight: '200px',
      overflowY: 'auto',
      fontSize: '12px'
    },
    historyItem: {
      padding: '5px',
      borderBottom: '1px solid #e0e0e0'
    }
  }

  const filteredData = filterAttendance()

  // Add keyframes animation for pulse
  const styleSheet = document.createElement("style")
  styleSheet.textContent = `
    @keyframes pulse {
      0% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.5; transform: scale(1.2); }
      100% { opacity: 1; transform: scale(1); }
    }
  `
  document.head.appendChild(styleSheet)

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>📍 Live Attendance & Location Monitor</h2>
          <p style={styles.subtitle}>Real-time tracking of RM locations between login and logout</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button onClick={() => setShowHRReport(true)} style={styles.hrReportBtn}>
            📄 HR Attendance Report
          </button>
          <button onClick={downloadAttendanceReport} style={styles.downloadBtn}>
            📥 Download Attendance Report
          </button>
          <button onClick={downloadLiveLocationReport} style={styles.downloadLocationBtn}>
            📍 Download Live Location Report
          </button>
          <button onClick={onClose} style={styles.closeBtn}>Close</button>
        </div>
      </div>

      {/* Filters */}
      <div style={styles.filters}>
        <select 
          style={styles.filterSelect}
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="working">🟢 Working (Live Location)</option>
          <option value="logged out">⚫ Logged Out</option>
          <option value="not checked in">🟡 Not Checked In</option>
        </select>
        <input
          type="date"
          style={styles.filterInput}
          value={dateRange.start}
          onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
          placeholder="Start Date"
        />
        <input
          type="date"
          style={styles.filterInput}
          value={dateRange.end}
          onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
          placeholder="End Date"
        />
        <button 
          style={styles.autoRefreshBtn}
          onClick={() => setAutoRefresh(!autoRefresh)}
        >
          {autoRefresh ? '⏸️ Auto-Refresh On' : '▶️ Auto-Refresh Off'}
        </button>
      </div>

      {/* Attendance Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>RM Name</th>
              <th style={styles.th}>Today's Status</th>
              <th style={styles.th}>Login Time</th>
              <th style={styles.th}>Working Hours</th>
              <th style={styles.th}>Current Location</th>
              <th style={styles.th}>Last Location Update</th>
              <th style={styles.th}>Attendance Rate</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map(rm => {
              let statusBadgeStyle = {}
              let statusText = ''
              
              if (rm.currentStatus === 'Working') {
                statusBadgeStyle = { ...styles.statusBadge, ...styles.workingBadge }
                statusText = '🟢 Working'
              } else if (rm.currentStatus === 'Logged Out') {
                statusBadgeStyle = { ...styles.statusBadge, ...styles.loggedOutBadge }
                statusText = '⚫ Logged Out'
              } else {
                statusBadgeStyle = { ...styles.statusBadge, ...styles.notCheckedBadge }
                statusText = '🟡 Not Checked In'
              }
              
              const attendanceRate = ((rm.attendance.presentDays / rm.attendance.totalDays) * 100).toFixed(1)
              const liveLoc = liveLocations[rm.id]
              const workingHours = rm.currentStatus === 'Working' ? calculateWorkingHours(rm.loginTime) : 'N/A'
              
              return (
                <tr key={rm.id}>
                  <td style={styles.td}>
                    <strong>{rm.name}</strong>
                  </td>
                  <td style={styles.td}>
                    <span style={statusBadgeStyle}>{statusText}</span>
                  </td>
                  <td style={styles.td}>
                    {rm.loginTime || '-'}
                    {rm.logoutTime && <span style={{ fontSize: '11px', color: '#666', display: 'block' }}>Logout: {rm.logoutTime}</span>}
                  </td>
                  <td style={styles.td}>
                    {workingHours !== 'N/A' ? (
                      <span style={{ color: getDurationColor(parseInt(workingHours)) }}>
                        ⏱️ {workingHours}
                      </span>
                    ) : '-'}
                  </td>
                  <td style={styles.td}>
                    {liveLoc ? (
                      <>
                        <div>
                          <span style={styles.locationDot}></span>
                          <strong>{liveLoc.location}</strong>
                        </div>
                        <div style={styles.liveLocation}>
                          📍 {liveLoc.lat.toFixed(4)}, {liveLoc.lng.toFixed(4)}
                        </div>
                      </>
                    ) : (
                      rm.todayStatus.location || '-'
                    )}
                  </td>
                  <td style={styles.td}>
                    {liveLoc ? liveLoc.lastUpdate : '-'}
                  </td>
                  <td style={styles.td}>
                    <strong>{attendanceRate}%</strong>
                    <div style={{ fontSize: '11px', color: '#666' }}>
                      {rm.attendance.presentDays}/{rm.attendance.totalDays} days
                    </div>
                  </td>
                  <td style={styles.td}>
                    <button 
                      style={styles.viewBtn}
                      onClick={() => setSelectedRM(rm)}
                    >
                      📊 View Details
                    </button>
                    <button 
                      style={styles.downloadRowBtn}
                      onClick={() => {
                        setSelectedRM(rm)
                        setTimeout(() => downloadAttendanceReport(), 100)
                      }}
                    >
                      📥 Download
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* RM Details Modal */}
      {selectedRM && (
        <div style={styles.modalOverlay} onClick={() => setSelectedRM(null)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>📍 {selectedRM.name} - Live Location & Attendance</h3>
              <button onClick={() => setSelectedRM(null)} style={styles.closeBtn}>Close</button>
            </div>

            {/* Current Status */}
            <div style={styles.locationCard}>
              <h4>🟢 Current Status: {selectedRM.currentStatus}</h4>
              {liveLocations[selectedRM.id] ? (
                <>
                  <div><strong>Current Location:</strong> {liveLocations[selectedRM.id].location}</div>
                  <div><strong>Coordinates:</strong> {liveLocations[selectedRM.id].lat.toFixed(4)}, {liveLocations[selectedRM.id].lng.toFixed(4)}</div>
                  <div><strong>Last Update:</strong> {liveLocations[selectedRM.id].lastUpdate}</div>
                  <div><strong>Login Time:</strong> {selectedRM.loginTime || 'Not logged in'}</div>
                  <div><strong>Working Duration:</strong> {calculateWorkingHours(selectedRM.loginTime)}</div>
                </>
              ) : (
                <div>No live location data available. RM is {selectedRM.currentStatus.toLowerCase()}.</div>
              )}
            </div>

            {/* Statistics */}
            <div style={styles.statsGrid}>
              <div style={styles.statCard}>
                <div style={styles.statValue}>{selectedRM.attendance.presentDays}</div>
                <div style={styles.statLabel}>Present Days</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statValue}>{selectedRM.attendance.absentDays || 0}</div>
                <div style={styles.statLabel}>Absent Days</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statValue}>{selectedRM.attendance.lateDays || 0}</div>
                <div style={styles.statLabel}>Late Arrivals</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statValue}>
                  {((selectedRM.attendance.presentDays / selectedRM.attendance.totalDays) * 100).toFixed(1)}%
                </div>
                <div style={styles.statLabel}>Attendance Rate</div>
              </div>
            </div>

            {/* Location History */}
            {locationHistory[selectedRM.id] && locationHistory[selectedRM.id].length > 0 && (
              <>
                <h4>📍 Location Movement History (Today)</h4>
                <div style={styles.locationHistory}>
                  {locationHistory[selectedRM.id].map((loc, idx) => (
                    <div key={idx} style={styles.historyItem}>
                      {loc.time} - {loc.location} ({loc.lat.toFixed(4)}, {loc.lng.toFixed(4)})
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Daily Login History */}
            <h4>📅 Daily Login History</h4>
            <div style={{ overflowX: 'auto' }}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Date</th>
                    <th style={styles.th}>Login</th>
                    <th style={styles.th}>Logout</th>
                    <th style={styles.th}>Location</th>
                    <th style={styles.th}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedRM.attendance.loginHistory?.slice(0, 10).map((day, idx) => (
                    <tr key={idx}>
                      <td style={styles.td}>{day.date}</td>
                      <td style={styles.td}>{day.loginTime || '-'}</td>
                      <td style={styles.td}>{day.logoutTime || '-'}</td>
                      <td style={styles.td}>{day.location || '-'}</td>
                      <td style={styles.td}>{day.status || 'present'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* HR Attendance Report Modal */}
      {showHRReport && (
        <div style={styles.modalOverlay} onClick={() => setShowHRReport(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <HRAttendanceReport onClose={() => setShowHRReport(false)} />
          </div>
        </div>
      )}
    </div>
  )
}

export default AttendanceMonitor