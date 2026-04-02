import { useState, useEffect } from 'react'
import { mockData } from '../data/mockData'
import { calculateMetrics } from '../utils/kpiEngine'
import { processAllRMs, generateInterventions } from '../engines/escalationEngine'
import MeetingScheduler from './MeetingScheduler'
import CPOnboardingForm from './CPOnboardingForm'
import AddSaleForm from './AddSaleForm'
import SalesDatabase from './SalesDatabase'
import MeetingDatabase from './MeetingDatabase'

const RMDashboard = ({ rmId, onLogout }) => {
  const [rmData, setRmData] = useState(null)
  const [metrics, setMetrics] = useState(null)
  const [interventions, setInterventions] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [showAddCP, setShowAddCP] = useState(false)
  const [showAddSale, setShowAddSale] = useState(false)
  const [showCheckIn, setShowCheckIn] = useState(false)
  const [showMeetingScheduler, setShowMeetingScheduler] = useState(false)
  const [showCPForm, setShowCPForm] = useState(false)
  const [showSaleForm, setShowSaleForm] = useState(false)
  const [showSalesDB, setShowSalesDB] = useState(false)
  const [showMeetingDB, setShowMeetingDB] = useState(false)
  const [newCP, setNewCP] = useState({ name: '', status: 'active' })
  const [newSale, setNewSale] = useState({ cpId: '', amount: '', date: new Date().toISOString().split('T')[0] })
  const [checkIn, setCheckIn] = useState({ location: '', notes: '' })
  const [cps, setCps] = useState([])
  const [sales, setSales] = useState([])
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [currentLocation, setCurrentLocation] = useState(null)
  const [attendance, setAttendance] = useState(null)
  const [meetingStats, setMeetingStats] = useState({ total: 0, upcoming: 0, completed: 0 })

  useEffect(() => {
    loadRMData()
    getCurrentLocation()
    loadMeetingStats()
  }, [rmId])

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        (error) => {
          console.log('Location error:', error)
        }
      )
    }
  }

  const loadMeetingStats = () => {
    const storedMeetings = localStorage.getItem(`meetings_${rmId}`)
    if (storedMeetings) {
      const meetings = JSON.parse(storedMeetings)
      const today = new Date().toISOString().split('T')[0]
      setMeetingStats({
        total: meetings.length,
        upcoming: meetings.filter(m => m.status === 'scheduled' && m.date >= today).length,
        completed: meetings.filter(m => m.status === 'completed').length
      })
    }
  }

  const loadRMData = () => {
    try {
      const rm = mockData.rms.find(r => r.id === parseInt(rmId))
      if (!rm) {
        setErrorMessage('RM not found')
        setLoading(false)
        return
      }
      
      const processedRM = processAllRMs([rm], mockData.currentWeek)[0]
      setRmData(processedRM)
      
      const storedAttendance = localStorage.getItem(`attendance_${rmId}`)
      if (storedAttendance) {
        setAttendance(JSON.parse(storedAttendance))
      } else {
        setAttendance(rm.attendance || {
          totalDays: 22,
          presentDays: 0,
          absentDays: 0,
          lateDays: 0,
          lastLogin: new Date().toISOString(),
          loginHistory: []
        })
      }
      
      const rmMetrics = calculateMetrics([processedRM])
      setMetrics(rmMetrics)
      
      const rmInterventions = generateInterventions([processedRM])
      setInterventions(rmInterventions)
      
      const storedCPs = localStorage.getItem(`cps_${rmId}`)
      const storedSales = localStorage.getItem(`sales_${rmId}`)
      
      if (storedCPs) {
        setCps(JSON.parse(storedCPs))
      } else {
        const mockCPs = [
          { id: 1, name: 'Tech Solutions', rmId: rm.id, rmName: rm.name, status: 'active', onboardedDate: '2024-03-01', salesCount: 5 },
          { id: 2, name: 'Digital Innovations', rmId: rm.id, rmName: rm.name, status: 'active', onboardedDate: '2024-03-05', salesCount: 3 }
        ]
        setCps(mockCPs)
        localStorage.setItem(`cps_${rmId}`, JSON.stringify(mockCPs))
      }
      
      if (storedSales) {
        setSales(JSON.parse(storedSales))
      } else {
        const mockSales = [
          { id: 1, rmId: rm.id, rmName: rm.name, cpId: 1, cpName: 'Tech Solutions', amount: 50000, date: '2024-03-15', status: 'completed' },
          { id: 2, rmId: rm.id, rmName: rm.name, cpId: 2, cpName: 'Digital Innovations', amount: 35000, date: '2024-03-18', status: 'completed' }
        ]
        setSales(mockSales)
        localStorage.setItem(`sales_${rmId}`, JSON.stringify(mockSales))
      }
      
      setLoading(false)
    } catch (error) {
      console.error('Error loading RM data:', error)
      setLoading(false)
    }
  }

  const formatRupees = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const handleCheckIn = () => {
    if (!checkIn.location) {
      setErrorMessage('Please enter your location')
      return
    }
    
    const now = new Date()
    const today = now.toISOString().split('T')[0]
    const currentTime = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    
    const newAttendance = { ...attendance }
    const existingEntry = newAttendance.loginHistory?.find(h => h.date === today)
    
    if (!existingEntry) {
      if (!newAttendance.loginHistory) newAttendance.loginHistory = []
      newAttendance.loginHistory.push({
        date: today,
        loginTime: currentTime,
        logoutTime: '',
        location: checkIn.location,
        status: 'present',
        notes: checkIn.notes
      })
      newAttendance.presentDays = (newAttendance.presentDays || 0) + 1
      newAttendance.lastLogin = now.toISOString()
    } else if (existingEntry.loginTime && !existingEntry.logoutTime) {
      existingEntry.logoutTime = currentTime
      const loginHour = parseInt(existingEntry.loginTime.split(':')[0])
      if (loginHour > 10) {
        existingEntry.status = 'late'
        newAttendance.lateDays = (newAttendance.lateDays || 0) + 1
      }
    } else {
      setErrorMessage('Already checked in today')
      return
    }
    
    setAttendance(newAttendance)
    localStorage.setItem(`attendance_${rmId}`, JSON.stringify(newAttendance))
    setShowCheckIn(false)
    setCheckIn({ location: '', notes: '' })
    setSuccessMessage('Attendance recorded successfully!')
    setTimeout(() => setSuccessMessage(''), 3000)
  }

  const handleMeetingAdded = () => {
    loadMeetingStats()
    setSuccessMessage('Meeting scheduled successfully!')
    setTimeout(() => setSuccessMessage(''), 3000)
  }

  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    },
    header: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '20px',
      borderRadius: '12px',
      marginBottom: '20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap'
    },
    headerTitle: { fontSize: '24px', fontWeight: 'bold', margin: 0 },
    headerSubtitle: { fontSize: '14px', opacity: 0.9, marginTop: '5px' },
    checkInBtn: { background: '#28a745', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' },
    logoutBtn: { background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', marginLeft: '10px' },
    tabs: { display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '2px solid #f0f0f0', flexWrap: 'wrap' },
    tab: { padding: '10px 20px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', fontWeight: '500', color: '#666', transition: 'all 0.3s ease' },
    activeTab: { color: '#2196f3', borderBottom: '3px solid #2196f3', marginBottom: '-2px' },
    metricsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' },
    metricCard: { background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', textAlign: 'center' },
    metricLabel: { fontSize: '13px', color: '#666', marginBottom: '8px', textTransform: 'uppercase' },
    metricValue: { fontSize: '28px', fontWeight: 'bold', color: '#333' },
    metricSub: { fontSize: '12px', color: '#999', marginTop: '5px' },
    targetRow: { display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #eee' },
    table: { width: '100%', borderCollapse: 'collapse', marginBottom: '20px', overflowX: 'auto', display: 'block' },
    th: { border: '1px solid #ddd', padding: '12px', background: '#f8f9fa', textAlign: 'left', fontWeight: 'bold' },
    td: { border: '1px solid #ddd', padding: '10px', textAlign: 'left' },
    addBtn: { background: '#28a745', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold', marginBottom: '20px' },
    formContainer: { background: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '20px' },
    formGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '15px' },
    formLabel: { fontSize: '14px', fontWeight: '500', marginBottom: '5px', display: 'block' },
    formInput: { width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' },
    formSelect: { width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' },
    submitBtn: { background: '#28a745', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', marginRight: '10px' },
    cancelBtn: { background: '#6c757d', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' },
    successMessage: { background: '#d4edda', color: '#155724', padding: '10px', borderRadius: '4px', marginBottom: '20px' },
    errorMessage: { background: '#f8d7da', color: '#721c24', padding: '10px', borderRadius: '4px', marginBottom: '20px' },
    progressBar: { height: '8px', background: '#e0e0e0', borderRadius: '4px', overflow: 'hidden', marginTop: '8px' },
    progressFill: { height: '100%', borderRadius: '4px', transition: 'width 0.3s ease' },
    statusBadge: { display: 'inline-block', padding: '3px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' },
    activeBadge: { background: '#d4edda', color: '#155724' },
    presentBadge: { background: '#d4edda', color: '#155724' },
    absentBadge: { background: '#f8d7da', color: '#721c24' },
    lateBadge: { background: '#fff3cd', color: '#856404' },
    locationInfo: { fontSize: '12px', color: '#666', marginTop: '5px' },
    meetingStatsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginBottom: '20px' },
    meetingStatCard: { background: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)', color: 'white', padding: '15px', borderRadius: '8px', textAlign: 'center' },
    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
    modalContent: { background: 'white', borderRadius: '12px', padding: '0', maxWidth: '90vw', maxHeight: '90vh', overflow: 'auto' }
  }

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Loading your dashboard...</div>
  }

  if (!rmData) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Error loading data. Please contact support.</div>
  }

  const achievementPercent = rmData.monthlyAchievement || 0
  const barColor = achievementPercent >= 60 ? '#28a745' : achievementPercent >= 40 ? '#ffc107' : '#dc3545'
  const attendanceRate = attendance ? ((attendance.presentDays / attendance.totalDays) * 100).toFixed(1) : 0

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.headerTitle}>👋 Welcome, {rmData.name}</h1>
          <p style={styles.headerSubtitle}>Your Personal Sales Dashboard</p>
        </div>
        <div>
          <button style={styles.checkInBtn} onClick={() => setShowCheckIn(!showCheckIn)}>
            📍 {attendance?.loginHistory?.find(h => h.date === new Date().toISOString().split('T')[0])?.logoutTime ? '✅ Checked Out' : 'Check In'}
          </button>
          <button onClick={onLogout} style={styles.logoutBtn}>🚪 Logout</button>
        </div>
      </div>

      {showCheckIn && (
        <div style={styles.formContainer}>
          <h3 style={{ marginBottom: '15px' }}>📍 Daily Check In</h3>
          <div style={styles.formGrid}>
            <div>
              <label style={styles.formLabel}>Location</label>
              <input type="text" style={styles.formInput} value={checkIn.location} onChange={(e) => setCheckIn({ ...checkIn, location: e.target.value })} placeholder="e.g., Mumbai Office, Remote, Client Visit" />
              {currentLocation && <div style={styles.locationInfo}>📡 Live location: {currentLocation.lat.toFixed(4)}, {currentLocation.lng.toFixed(4)}</div>}
            </div>
            <div>
              <label style={styles.formLabel}>Notes</label>
              <input type="text" style={styles.formInput} value={checkIn.notes} onChange={(e) => setCheckIn({ ...checkIn, notes: e.target.value })} placeholder="Any additional notes" />
            </div>
          </div>
          <div><button onClick={handleCheckIn} style={styles.submitBtn}>Submit Check In</button><button onClick={() => setShowCheckIn(false)} style={styles.cancelBtn}>Cancel</button></div>
        </div>
      )}

      {successMessage && <div style={styles.successMessage}>{successMessage}</div>}
      {errorMessage && <div style={styles.errorMessage}>{errorMessage}</div>}

      <div style={styles.tabs}>
        <button style={{ ...styles.tab, ...(activeTab === 'overview' ? styles.activeTab : {}) }} onClick={() => setActiveTab('overview')}>📊 Overview</button>
        <button style={{ ...styles.tab, ...(activeTab === 'cps' ? styles.activeTab : {}) }} onClick={() => setActiveTab('cps')}>🤝 My Channel Partners</button>
        <button style={{ ...styles.tab, ...(activeTab === 'sales' ? styles.activeTab : {}) }} onClick={() => setActiveTab('sales')}>💰 My Sales</button>
        <button style={{ ...styles.tab, ...(activeTab === 'attendance' ? styles.activeTab : {}) }} onClick={() => setActiveTab('attendance')}>📅 Attendance</button>
        <button style={{ ...styles.tab, ...(activeTab === 'meetings' ? styles.activeTab : {}) }} onClick={() => setActiveTab('meetings')}>📅 Meetings ({meetingStats.upcoming})</button>
      </div>

      {activeTab === 'overview' && (
        <>
          <div style={styles.meetingStatsGrid}>
            <div style={styles.meetingStatCard}><div style={{ fontSize: '24px', fontWeight: 'bold' }}>{meetingStats.total}</div><div>Total Meetings</div></div>
            <div style={styles.meetingStatCard}><div style={{ fontSize: '24px', fontWeight: 'bold' }}>{meetingStats.upcoming}</div><div>Upcoming</div></div>
            <div style={styles.meetingStatCard}><div style={{ fontSize: '24px', fontWeight: 'bold' }}>{meetingStats.completed}</div><div>Completed</div></div>
          </div>

          <div style={styles.metricsGrid}>
            <div style={styles.metricCard}><div style={styles.metricLabel}>Monthly Revenue Target</div><div style={styles.metricValue}>{formatRupees(rmData.monthlyTarget)}</div><div style={styles.metricSub}>Target for the month</div></div>
            <div style={styles.metricCard}><div style={styles.metricLabel}>Revenue Achieved</div><div style={styles.metricValue}>{formatRupees(rmData.monthlyAchieved)}</div><div style={styles.metricSub}>{achievementPercent.toFixed(1)}% of target</div><div style={styles.progressBar}><div style={{ ...styles.progressFill, width: `${Math.min(achievementPercent, 100)}%`, background: barColor }} /></div></div>
            <div style={styles.metricCard}><div style={styles.metricLabel}>Revenue Gap</div><div style={styles.metricValue}>{formatRupees(rmData.monthlyGap)}</div><div style={styles.metricSub}>Remaining to achieve</div></div>
            <div style={styles.metricCard}><div style={styles.metricLabel}>CP Onboarded</div><div style={styles.metricValue}>{rmData.cpOnboarded} / {rmData.cpTarget}</div><div style={styles.metricSub}>Channel Partners onboarded</div><div style={styles.targetRow}><span>Target: {rmData.cpTarget}</span><span>Remaining: {rmData.cpTarget - rmData.cpOnboarded}</span></div></div>
            <div style={styles.metricCard}><div style={styles.metricLabel}>Active CP</div><div style={styles.metricValue}>{rmData.activeCP} / {rmData.activeCPTarget}</div><div style={styles.metricSub}>CPs with ≥1 sale</div><div style={styles.targetRow}><span>Target: {rmData.activeCPTarget}</span><span>Remaining: {rmData.activeCPTarget - rmData.activeCP}</span></div></div>
            <div style={styles.metricCard}><div style={styles.metricLabel}>CP Activation Rate</div><div style={styles.metricValue}>{rmData.cpActivationRate?.toFixed(1) || 0}%</div><div style={styles.metricSub}>Active / Total CP</div></div>
          </div>

          {interventions.length > 0 && (
            <div style={{ marginTop: '20px' }}><h3>⚠️ Attention Needed</h3>
              {interventions.map(intervention => (
                <div key={intervention.id} style={{ background: '#fff3cd', borderLeft: `4px solid ${intervention.level === 'critical' ? '#dc3545' : intervention.level === 'high' ? '#fd7e14' : '#ffc107'}`, padding: '15px', marginBottom: '10px', borderRadius: '4px' }}>
                  <strong>{intervention.level?.toUpperCase()}</strong>: {intervention.message}
                  {intervention.recommendation && <div style={{ marginTop: '8px', fontSize: '13px' }}>💡 {intervention.recommendation}</div>}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {activeTab === 'cps' && (
        <div>
          <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button style={styles.addBtn} onClick={() => setShowCPForm(true)}>+ Onboard New CP</button>
          </div>

          {showCPForm && (
            <div style={styles.modalOverlay} onClick={() => setShowCPForm(false)}>
              <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <CPOnboardingForm rmId={rmId} rmName={rmData.name} onClose={() => setShowCPForm(false)} onSuccess={() => { loadRMData(); setShowCPForm(false); }} />
              </div>
            </div>
          )}

          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead><tr><th style={styles.th}>CP Name</th><th style={styles.th}>Onboarded Date</th><th style={styles.th}>Sales Count</th><th style={styles.th}>Status</th></tr></thead>
              <tbody>
                {cps.map(cp => (<tr key={cp.id}><td style={styles.td}>{cp.name}</td><td style={styles.td}>{cp.onboardedDate}</td><td style={styles.td}>{cp.salesCount}</td><td style={styles.td}><span style={{...styles.statusBadge, ...(cp.status === 'active' ? styles.activeBadge : {})}}>{cp.status}</span></td></tr>))}
                {cps.length === 0 && <tr><td colSpan="4" style={{ textAlign: 'center', padding: '40px' }}>No channel partners yet. Click "Onboard New CP" to get started.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'sales' && (
        <div>
          <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button style={styles.addBtn} onClick={() => setShowSaleForm(true)}>+ Add New Sale</button>
            <button style={styles.addBtn} onClick={() => setShowSalesDB(true)}>📊 View Sales Database</button>
          </div>

          {showSaleForm && (
            <div style={styles.modalOverlay} onClick={() => setShowSaleForm(false)}>
              <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <AddSaleForm rmId={rmId} rmName={rmData.name} cps={cps} onClose={() => setShowSaleForm(false)} onSuccess={() => { loadRMData(); setShowSaleForm(false); }} />
              </div>
            </div>
          )}

          {showSalesDB && (
            <div style={styles.modalOverlay} onClick={() => setShowSalesDB(false)}>
              <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <SalesDatabase rmId={rmId} rmName={rmData.name} onClose={() => setShowSalesDB(false)} />
              </div>
            </div>
          )}

          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead><tr><th style={styles.th}>CP Name</th><th style={styles.th}>Amount (₹)</th><th style={styles.th}>Date</th><th style={styles.th}>Status</th></tr></thead>
              <tbody>
                {sales.map(sale => (<tr key={sale.id}><td style={styles.td}>{sale.cpName}</td><td style={styles.td}>{formatRupees(sale.amount)}</td><td style={styles.td}>{sale.date}</td><td style={styles.td}><span style={{...styles.statusBadge, ...styles.activeBadge}}>{sale.status}</span></td></tr>))}
                {sales.length === 0 && <tr><td colSpan="4" style={{ textAlign: 'center', padding: '40px' }}>No sales yet. Click "Add New Sale" to record your first sale.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'attendance' && attendance && (
        <>
          <div style={styles.metricsGrid}>
            <div style={styles.metricCard}><div style={styles.metricLabel}>Attendance Rate</div><div style={styles.metricValue}>{attendanceRate}%</div><div style={styles.metricSub}>{attendance.presentDays} / {attendance.totalDays} days</div></div>
            <div style={styles.metricCard}><div style={styles.metricLabel}>Present Days</div><div style={styles.metricValue}>{attendance.presentDays}</div></div>
            <div style={styles.metricCard}><div style={styles.metricLabel}>Absent Days</div><div style={styles.metricValue}>{attendance.absentDays || 0}</div></div>
            <div style={styles.metricCard}><div style={styles.metricLabel}>Late Arrivals</div><div style={styles.metricValue}>{attendance.lateDays || 0}</div></div>
          </div>
          <h3>📅 Daily Login History</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead><tr><th style={styles.th}>Date</th><th style={styles.th}>Login Time</th><th style={styles.th}>Logout Time</th><th style={styles.th}>Location</th><th style={styles.th}>Status</th><th style={styles.th}>Notes</th></tr></thead>
              <tbody>
                {attendance.loginHistory?.slice().reverse().map((day, idx) => (
                  <tr key={idx}><td style={styles.td}>{day.date}</td><td style={styles.td}>{day.loginTime || '-'}</td><td style={styles.td}>{day.logoutTime || '-'}</td><td style={styles.td}>{day.location || '-'}</td><td style={styles.td}><span style={{...styles.statusBadge, ...(day.status === 'present' ? styles.presentBadge : day.status === 'absent' ? styles.absentBadge : styles.lateBadge)}}>{day.status || 'present'}</span></td><td style={styles.td}>{day.notes || '-'}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {activeTab === 'meetings' && (
        <div>
          <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button style={styles.addBtn} onClick={() => setShowMeetingScheduler(true)}>+ Schedule Meeting</button>
            <button style={styles.addBtn} onClick={() => setShowMeetingDB(true)}>📋 View All Meetings</button>
          </div>

          {showMeetingScheduler && (
            <div style={styles.modalOverlay} onClick={() => setShowMeetingScheduler(false)}>
              <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <MeetingScheduler rmId={rmId} rmName={rmData.name} onClose={() => setShowMeetingScheduler(false)} onMeetingAdded={handleMeetingAdded} />
              </div>
            </div>
          )}

          {showMeetingDB && (
            <div style={styles.modalOverlay} onClick={() => setShowMeetingDB(false)}>
              <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <MeetingDatabase rmId={rmId} onClose={() => setShowMeetingDB(false)} />
              </div>
            </div>
          )}

          <div>
            {meetingStats.total === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', background: 'white', borderRadius: '8px' }}>No meetings scheduled. Click "Schedule Meeting" to add one.</div>
            ) : (
              <div>You have {meetingStats.upcoming} upcoming meetings and {meetingStats.completed} completed meetings.</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default RMDashboard