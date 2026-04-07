import { useState, useEffect } from 'react'
import { mockData, teamLeaders } from '../data/mockData'
import { supabase } from '../supabaseClient'
import { calculateMetrics } from '../utils/kpiEngine'
import { processAllRMs, generateInterventions } from '../engines/escalationEngine'
import MeetingScheduler from './MeetingScheduler'
import CPOnboardingForm from './CPOnboardingForm'
import AddSaleForm from './AddSaleForm'
import SalesDatabase from './SalesDatabase'
import MeetingDatabase from './MeetingDatabase'
import ChangePassword from './ChangePassword'

const TeamLeaderDashboard = ({ tlId, onLogout }) => {
  const [tlData, setTlData] = useState(null)
  const [teamRMs, setTeamRMs] = useState([])
  const [teamMetrics, setTeamMetrics] = useState(null)
  const [teamInterventions, setTeamInterventions] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedRM, setSelectedRM] = useState(null)
  const [showRMDetails, setShowRMDetails] = useState(false)
  const [showMeetingScheduler, setShowMeetingScheduler] = useState(false)
  const [showCheckIn, setShowCheckIn] = useState(false)
  const [showCPForm, setShowCPForm] = useState(false)
  const [showSaleForm, setShowSaleForm] = useState(false)
  const [showSalesDB, setShowSalesDB] = useState(false)
  const [showMeetingDB, setShowMeetingDB] = useState(false)
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [checkIn, setCheckIn] = useState({ location: '', notes: '' })
  const [attendance, setAttendance] = useState(null)
  const [currentLocation, setCurrentLocation] = useState(null)
  const [meetingStats, setMeetingStats] = useState({})
  const [attendanceStats, setAttendanceStats] = useState({})
  const [tlMeetings, setTlMeetings] = useState([])
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [teamCPs, setTeamCPs] = useState([])
  const [teamSales, setTeamSales] = useState([])
  const [selectedRMForForm, setSelectedRMForForm] = useState(null)

  useEffect(() => {
    loadTeamData()
    loadMeetingStats()
    loadAttendanceStats()
    loadTLMeetings()
    loadTeamCPsAndSales()
    getCurrentLocation()
  }, [tlId])

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

  const loadTeamData = async () => {
    try {
      const tl = teamLeaders.find(l => l.id === parseInt(tlId))
      if (!tl) {
        setLoading(false)
        return
      }
      setTlData(tl)
      
      const storedAttendance = localStorage.getItem(`tl_attendance_${tlId}`)
      if (storedAttendance) {
        setAttendance(JSON.parse(storedAttendance))
      } else {
        setAttendance(tl.attendance)
      }

      const { data: teamMembersData, error } = await supabase
        .from('rms')
        .select('*')
        .in('id', tl.team)
      
      if (error) throw error
      
      const processedRMs = processAllRMs(teamMembersData || [], mockData.currentWeek)
      setTeamRMs(processedRMs)

      const metrics = calculateMetrics(processedRMs)
      setTeamMetrics(metrics)

      const interventions = generateInterventions(processedRMs)
      setTeamInterventions(interventions)

      setLoading(false)
    } catch (error) {
      console.error('Error loading team data:', error)
      setLoading(false)
    }
  }

  const loadTeamCPsAndSales = async () => {
    try {
      const teamRMIds = teamRMs.map(rm => rm.id)
      
      const { data: cpsData, error: cpsError } = await supabase
        .from('channel_partners')
        .select('*')
        .in('rm_id', teamRMIds)
      
      if (!cpsError && cpsData) {
        const mappedCPs = cpsData.map(cp => ({
          id: cp.id,
          name: cp.name,
          rmId: cp.rm_id,
          rmName: teamRMs.find(rm => rm.id === cp.rm_id)?.name || 'Unknown',
          status: cp.status,
          onboardedDate: cp.onboarded_date,
          salesCount: cp.sales_count || 0
        }))
        setTeamCPs(mappedCPs)
      }
      
      const { data: salesData, error: salesError } = await supabase
        .from('sales')
        .select('*, channel_partners(name)')
        .in('rm_id', teamRMIds)
      
      if (!salesError && salesData) {
        const mappedSales = salesData.map(sale => ({
          id: sale.id,
          rmId: sale.rm_id,
          rmName: teamRMs.find(rm => rm.id === sale.rm_id)?.name || 'Unknown',
          cpId: sale.cp_id,
          cpName: sale.channel_partners?.name || 'Unknown',
          amount: sale.amount,
          date: sale.sale_date,
          status: sale.status
        }))
        setTeamSales(mappedSales)
      }
    } catch (error) {
      console.error('Error loading team CPs and sales:', error)
    }
  }

  const loadTLMeetings = () => {
    const storedMeetings = localStorage.getItem(`tl_meetings_${tlId}`)
    if (storedMeetings) {
      setTlMeetings(JSON.parse(storedMeetings))
    } else {
      const mockMeetings = [
        {
          id: 1,
          type: 'team',
          title: 'Weekly Team Review',
          with: 'Team Members',
          date: new Date().toISOString().split('T')[0],
          time: '10:00 AM',
          duration: '60',
          notes: 'Weekly performance review with team members',
          status: 'scheduled',
          reminder: true,
          reminderMinutes: 30
        },
        {
          id: 2,
          type: 'tl_cp',
          title: 'Strategic CP Meeting',
          with: 'Key Channel Partners',
          date: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
          time: '02:00 PM',
          duration: '90',
          notes: 'Discuss Q2 strategy and incentives',
          status: 'scheduled',
          reminder: true,
          reminderMinutes: 60
        }
      ]
      setTlMeetings(mockMeetings)
      localStorage.setItem(`tl_meetings_${tlId}`, JSON.stringify(mockMeetings))
    }
  }

  const loadMeetingStats = () => {
    const stats = {}
    teamRMs.forEach(rm => {
      const storedMeetings = localStorage.getItem(`meetings_${rm.id}`)
      if (storedMeetings) {
        const meetings = JSON.parse(storedMeetings)
        stats[rm.id] = {
          total: meetings.length,
          scheduled: meetings.filter(m => m.status === 'scheduled').length,
          completed: meetings.filter(m => m.status === 'completed').length,
          upcoming: meetings.filter(m => m.status === 'scheduled' && m.date >= new Date().toISOString().split('T')[0]).length
        }
      } else {
        stats[rm.id] = { total: 0, scheduled: 0, completed: 0, upcoming: 0 }
      }
    })
    setMeetingStats(stats)
  }

  const loadAttendanceStats = () => {
    const stats = {}
    teamRMs.forEach(rm => {
      const storedAttendance = localStorage.getItem(`attendance_${rm.id}`)
      if (storedAttendance) {
        const attendance = JSON.parse(storedAttendance)
        stats[rm.id] = {
          presentDays: attendance.presentDays,
          totalDays: attendance.totalDays,
          attendanceRate: (attendance.presentDays / attendance.totalDays) * 100,
          lateDays: attendance.lateDays || 0
        }
      } else if (rm.attendance) {
        stats[rm.id] = {
          presentDays: rm.attendance.presentDays,
          totalDays: rm.attendance.totalDays,
          attendanceRate: (rm.attendance.presentDays / rm.attendance.totalDays) * 100,
          lateDays: rm.attendance.lateDays || 0
        }
      }
    })
    setAttendanceStats(stats)
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
    localStorage.setItem(`tl_attendance_${tlId}`, JSON.stringify(newAttendance))
    setShowCheckIn(false)
    setCheckIn({ location: '', notes: '' })
    setSuccessMessage('Attendance recorded successfully!')
    setTimeout(() => setSuccessMessage(''), 3000)
  }

  const handleMeetingAdded = () => {
    loadTLMeetings()
    setSuccessMessage('Meeting scheduled successfully!')
    setTimeout(() => setSuccessMessage(''), 3000)
  }

  const formatRupees = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const getStatusColor = (achievement) => {
    if (achievement >= 75) return '#28a745'
    if (achievement >= 50) return '#ffc107'
    return '#dc3545'
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
      background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
      color: 'white',
      padding: '20px',
      borderRadius: '12px',
      marginBottom: '20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '15px'
    },
    headerTitle: { fontSize: '24px', fontWeight: 'bold', margin: 0 },
    headerSubtitle: { fontSize: '14px', opacity: 0.9, marginTop: '5px' },
    checkInBtn: { background: '#28a745', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' },
    changePasswordBtn: { background: '#ffc107', color: '#333', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold', marginLeft: '10px' },
    logoutBtn: { background: '#dc3545', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold', marginLeft: '10px' },
    tabs: { display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '2px solid #f0f0f0', flexWrap: 'wrap' },
    tab: { padding: '10px 20px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', fontWeight: '500', color: '#666', transition: 'all 0.3s ease' },
    activeTab: { color: '#ff9800', borderBottom: '3px solid #ff9800', marginBottom: '-2px' },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' },
    statCard: { background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', textAlign: 'center' },
    statLabel: { fontSize: '13px', color: '#666', marginBottom: '8px', textTransform: 'uppercase' },
    statValue: { fontSize: '28px', fontWeight: 'bold', color: '#333' },
    statSub: { fontSize: '12px', color: '#999', marginTop: '5px' },
    addBtn: { background: '#28a745', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold', marginBottom: '20px' },
    teamTable: { width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
    th: { borderBottom: '2px solid #f0f0f0', padding: '12px', textAlign: 'left', fontWeight: 'bold', fontSize: '14px', background: '#fafafa' },
    td: { borderBottom: '1px solid #f0f0f0', padding: '12px', fontSize: '14px' },
    viewBtn: { background: '#ff9800', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' },
    addMeetingBtn: { background: '#28a745', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', marginBottom: '20px' },
    progressBar: { height: '8px', background: '#e0e0e0', borderRadius: '4px', overflow: 'hidden', marginTop: '8px' },
    progressFill: { height: '100%', borderRadius: '4px', transition: 'width 0.3s ease' },
    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
    modalContent: { background: 'white', borderRadius: '12px', padding: '0', maxWidth: '90vw', maxHeight: '90vh', overflow: 'auto' },
    meetingStatsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginTop: '15px' },
    meetingCard: { background: '#f8f9fa', padding: '10px', borderRadius: '8px', textAlign: 'center' },
    meetingCardLarge: { background: 'white', padding: '15px', borderRadius: '8px', marginBottom: '10px', borderLeft: '4px solid #ff9800', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
    successMessage: { background: '#d4edda', color: '#155724', padding: '10px', borderRadius: '4px', marginBottom: '20px' },
    errorMessage: { background: '#f8d7da', color: '#721c24', padding: '10px', borderRadius: '4px', marginBottom: '20px' },
    formContainer: { background: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '20px' },
    formGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '15px' },
    formLabel: { fontSize: '14px', fontWeight: '500', marginBottom: '5px', display: 'block' },
    formInput: { width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' },
    submitBtn: { background: '#28a745', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', marginRight: '10px' },
    cancelBtn: { background: '#6c757d', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }
  }

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Loading Team Dashboard...</div>
  }

  if (!tlData) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Error loading team data. Please contact admin.</div>
  }

  const teamAchievement = teamMetrics ? (teamMetrics.totalRevenueAchieved / teamMetrics.totalRevenueTarget) * 100 : 0
  const teamAvgAttendance = Object.values(attendanceStats).reduce((sum, s) => sum + s.attendanceRate, 0) / (Object.keys(attendanceStats).length || 1)
  const tlAttendanceRate = attendance ? (attendance.presentDays / attendance.totalDays) * 100 : 0
  const tlUpcomingMeetings = tlMeetings.filter(m => m.status === 'scheduled' && m.date >= new Date().toISOString().split('T')[0]).length

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.headerTitle}>👥 Welcome, {tlData.name}</h1>
          <p style={styles.headerSubtitle}>Team Leader • {tlData.region} • Managing {teamRMs.length} RMs</p>
        </div>
        <div>
          <button style={styles.checkInBtn} onClick={() => setShowCheckIn(!showCheckIn)}>
            📍 {attendance?.loginHistory?.find(h => h.date === new Date().toISOString().split('T')[0])?.logoutTime ? '✅ Checked Out' : 'Check In'}
          </button>
          <button style={styles.changePasswordBtn} onClick={() => setShowChangePassword(true)}>🔐 Change Password</button>
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
              {currentLocation && <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>📡 Live location: {currentLocation.lat.toFixed(4)}, {currentLocation.lng.toFixed(4)}</div>}
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
        <button style={{ ...styles.tab, ...(activeTab === 'overview' ? styles.activeTab : {}) }} onClick={() => setActiveTab('overview')}>📊 My Overview</button>
        <button style={{ ...styles.tab, ...(activeTab === 'team' ? styles.activeTab : {}) }} onClick={() => setActiveTab('team')}>👥 Team Members</button>
        <button style={{ ...styles.tab, ...(activeTab === 'cps' ? styles.activeTab : {}) }} onClick={() => setActiveTab('cps')}>🤝 Team CPs</button>
        <button style={{ ...styles.tab, ...(activeTab === 'sales' ? styles.activeTab : {}) }} onClick={() => setActiveTab('sales')}>💰 Team Sales</button>
        <button style={{ ...styles.tab, ...(activeTab === 'attendance' ? styles.activeTab : {}) }} onClick={() => setActiveTab('attendance')}>📅 RM Attendance</button>
        <button style={{ ...styles.tab, ...(activeTab === 'meetings' ? styles.activeTab : {}) }} onClick={() => setActiveTab('meetings')}>📅 My Meetings ({tlUpcomingMeetings})</button>
      </div>

      {activeTab === 'overview' && (
        <div>
          <div style={styles.statsGrid}>
            <div style={styles.statCard}><div style={styles.statLabel}>My Target</div><div style={styles.statValue}>{formatRupees(tlData.monthlyTarget)}</div><div style={styles.statSub}>Monthly Target</div></div>
            <div style={styles.statCard}><div style={styles.statLabel}>My Achievement</div><div style={styles.statValue}>{formatRupees(tlData.monthlyAchieved)}</div><div style={styles.statSub}>{tlData.monthlyAchievement.toFixed(1)}% of target</div><div style={styles.progressBar}><div style={{ ...styles.progressFill, width: `${Math.min(tlData.monthlyAchievement, 100)}%`, background: getStatusColor(tlData.monthlyAchievement) }} /></div></div>
            <div style={styles.statCard}><div style={styles.statLabel}>My Gap</div><div style={styles.statValue}>{formatRupees(tlData.monthlyGap)}</div><div style={styles.statSub}>Remaining to achieve</div></div>
            <div style={styles.statCard}><div style={styles.statLabel}>My Attendance</div><div style={styles.statValue}>{tlAttendanceRate.toFixed(1)}%</div><div style={styles.statSub}>{attendance?.presentDays || 0} / {attendance?.totalDays || 22} days</div></div>
          </div>

          <h3>🏆 Team Performance</h3>
          <div style={styles.statsGrid}>
            <div style={styles.statCard}><div style={styles.statLabel}>Team Revenue Target</div><div style={styles.statValue}>{formatRupees(teamMetrics?.totalRevenueTarget || 0)}</div></div>
            <div style={styles.statCard}><div style={styles.statLabel}>Team Revenue Achieved</div><div style={styles.statValue}>{formatRupees(teamMetrics?.totalRevenueAchieved || 0)}</div><div style={styles.statSub}>{teamAchievement.toFixed(1)}% of target</div><div style={styles.progressBar}><div style={{ ...styles.progressFill, width: `${Math.min(teamAchievement, 100)}%`, background: getStatusColor(teamAchievement) }} /></div></div>
            <div style={styles.statCard}><div style={styles.statLabel}>Team Revenue Gap</div><div style={styles.statValue}>{formatRupees(teamMetrics?.revenueGap || 0)}</div></div>
            <div style={styles.statCard}><div style={styles.statLabel}>Team CP Onboarded</div><div style={styles.statValue}>{teamMetrics?.totalCPOnboarded || 0} / {teamMetrics?.totalCPTarget || 0}</div></div>
            <div style={styles.statCard}><div style={styles.statLabel}>Team Active CP</div><div style={styles.statValue}>{teamMetrics?.totalActiveCP || 0} / {teamMetrics?.totalActiveCPTarget || 0}</div></div>
            <div style={styles.statCard}><div style={styles.statLabel}>Avg Team Attendance</div><div style={styles.statValue}>{teamAvgAttendance.toFixed(1)}%</div></div>
          </div>

          {teamInterventions.length > 0 && (
            <div><h3>⚠️ Team Alerts</h3>
              {teamInterventions.slice(0, 3).map(intervention => (
                <div key={intervention.id} style={{ background: '#fff3cd', borderLeft: `4px solid ${intervention.level === 'critical' ? '#dc3545' : intervention.level === 'high' ? '#fd7e14' : '#ffc107'}`, padding: '12px', marginBottom: '10px', borderRadius: '4px' }}>
                  <strong>{intervention.rm}</strong>: {intervention.message}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'team' && (
        <div>
          <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
            <button style={styles.addBtn} onClick={() => { setSelectedRMForForm(teamRMs[0]); setShowCPForm(true); }}>+ Onboard CP</button>
            <button style={styles.addBtn} onClick={() => { setSelectedRMForForm(teamRMs[0]); setShowSaleForm(true); }}>+ Add Sale</button>
            <button style={styles.addBtn} onClick={() => setShowSalesDB(true)}>📊 Sales DB</button>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.teamTable}>
              <thead>
                <tr><th style={styles.th}>RM Name</th><th style={styles.th}>Target</th><th style={styles.th}>Achieved</th><th style={styles.th}>Achievement %</th><th style={styles.th}>CP Onboarded</th><th style={styles.th}>Active CP</th><th style={styles.th}>Attendance</th><th style={styles.th}>Actions</th></tr>
              </thead>
              <tbody>
                {teamRMs.map(rm => {
                  const attendance = attendanceStats[rm.id]
                  return (
                    <tr key={rm.id}>
                      <td style={styles.td}><strong>{rm.name}</strong>{rm.escalationLevel && <span style={{ marginLeft: '8px', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', background: rm.escalationLevel === 'critical' ? '#dc3545' : rm.escalationLevel === 'high' ? '#fd7e14' : '#ffc107', color: 'white' }}>{rm.escalationLevel.toUpperCase()}</span>}   </td>
                      <td style={styles.td}>{formatRupees(rm.monthlyTarget)}   </td>
                      <td style={styles.td}>{formatRupees(rm.monthlyAchieved)}   </td>
                      <td style={styles.td}><span style={{ color: getStatusColor(rm.monthlyAchievement) }}>{rm.monthlyAchievement.toFixed(1)}%</span>   </td>
                      <td style={styles.td}>{rm.cpOnboarded}/{rm.cpTarget}   </td>
                      <td style={styles.td}>{rm.activeCP}/{rm.activeCPTarget}   </td>
                      <td style={styles.td}>{attendance ? `${attendance.attendanceRate.toFixed(0)}%` : 'N/A'}   </td>
                      <td style={styles.td}><button style={styles.viewBtn} onClick={() => { setSelectedRM(rm); setShowRMDetails(true); }}>View</button>   </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'cps' && (
        <div>
          <button style={styles.addBtn} onClick={() => setShowCPForm(true)}>+ Onboard CP</button>
          <h3>Team CPs ({teamCPs.length})</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.teamTable}>
              <thead><tr><th style={styles.th}>CP Name</th><th style={styles.th}>RM</th><th style={styles.th}>Status</th></tr></thead>
              <tbody>
                {teamCPs.map(cp => (
                  <tr key={cp.id}>
                    <td style={styles.td}>{cp.name}   </td>
                    <td style={styles.td}>{cp.rmName}   </td>
                    <td style={styles.td}>{cp.status}   </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'sales' && (
        <div>
          <button style={styles.addBtn} onClick={() => setShowSaleForm(true)}>+ Add Sale</button>
          <button style={styles.addBtn} onClick={() => setShowSalesDB(true)}>📊 Sales DB</button>
          <h3>Team Sales ({teamSales.length})</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.teamTable}>
              <thead><tr><th style={styles.th}>RM</th><th style={styles.th}>CP</th><th style={styles.th}>Amount</th><th style={styles.th}>Date</th></tr></thead>
              <tbody>
                {teamSales.map(sale => (
                  <tr key={sale.id}>
                    <td style={styles.td}>{sale.rmName}   </td>
                    <td style={styles.td}>{sale.cpName}   </td>
                    <td style={styles.td}>{formatRupees(sale.amount)}   </td>
                    <td style={styles.td}>{sale.date}   </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'attendance' && (
        <div>
          <h3>RM Attendance</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.teamTable}>
              <thead><tr><th style={styles.th}>RM</th><th style={styles.th}>Attendance Rate</th><th style={styles.th}>Present</th><th style={styles.th}>Late</th></tr></thead>
              <tbody>
                {teamRMs.map(rm => {
                  const att = attendanceStats[rm.id]
                  return (
                    <tr key={rm.id}>
                      <td style={styles.td}>{rm.name}   </td>
                      <td style={styles.td}>{att ? `${att.attendanceRate.toFixed(1)}%` : 'N/A'}   </td>
                      <td style={styles.td}>{att?.presentDays || 0}   </td>
                      <td style={styles.td}>{att?.lateDays || 0}   </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'meetings' && (
        <div>
          <button style={styles.addMeetingBtn} onClick={() => setShowMeetingScheduler(true)}>+ Schedule Meeting</button>
          <button style={styles.addMeetingBtn} onClick={() => setShowMeetingDB(true)}>📋 Meetings DB</button>
          <h3>My Upcoming Meetings</h3>
          {tlMeetings.filter(m => m.status === 'scheduled').map(meeting => (
            <div key={meeting.id} style={styles.meetingCardLarge}>
              <strong>{meeting.title}</strong> - {meeting.date} {meeting.time}
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {showCPForm && (
        <div style={styles.modalOverlay} onClick={() => setShowCPForm(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <CPOnboardingForm rmId={selectedRMForForm?.id || teamRMs[0]?.id} rmName={selectedRMForForm?.name || teamRMs[0]?.name} onClose={() => setShowCPForm(false)} onSuccess={() => { loadTeamData(); loadTeamCPsAndSales(); setShowCPForm(false); }} />
          </div>
        </div>
      )}

      {showSaleForm && (
        <div style={styles.modalOverlay} onClick={() => setShowSaleForm(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <AddSaleForm rmId={selectedRMForForm?.id || teamRMs[0]?.id} rmName={selectedRMForForm?.name || teamRMs[0]?.name} cps={teamCPs} onClose={() => setShowSaleForm(false)} onSuccess={() => { loadTeamData(); loadTeamCPsAndSales(); setShowSaleForm(false); }} />
          </div>
        </div>
      )}

      {showSalesDB && (
        <div style={styles.modalOverlay} onClick={() => setShowSalesDB(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <SalesDatabase rmId="all" rmName="All RMs" onClose={() => setShowSalesDB(false)} />
          </div>
        </div>
      )}

      {showMeetingDB && (
        <div style={styles.modalOverlay} onClick={() => setShowMeetingDB(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <MeetingDatabase rmId="all" onClose={() => setShowMeetingDB(false)} />
          </div>
        </div>
      )}

      {showMeetingScheduler && (
        <div style={styles.modalOverlay} onClick={() => setShowMeetingScheduler(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <MeetingScheduler rmId={`tl_${tlId}`} rmName={tlData.name} onClose={() => setShowMeetingScheduler(false)} onMeetingAdded={handleMeetingAdded} isTeamLeader={true} />
          </div>
        </div>
      )}

      {showRMDetails && selectedRM && (
        <div style={styles.modalOverlay} onClick={() => setShowRMDetails(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: '20px' }}>
              <h3>{selectedRM.name}</h3>
              <p>Achievement: {selectedRM.monthlyAchievement.toFixed(1)}%</p>
              <p>CPs: {selectedRM.cpOnboarded}/{selectedRM.cpTarget}</p>
              <p>Active CPs: {selectedRM.activeCP}/{selectedRM.activeCPTarget}</p>
              <button onClick={() => setShowRMDetails(false)} style={styles.cancelBtn}>Close</button>
            </div>
          </div>
        </div>
      )}

      {showChangePassword && (
        <div style={styles.modalOverlay} onClick={() => setShowChangePassword(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <ChangePassword userType="tl" userId={tlId} userName={tlData.name} onClose={() => setShowChangePassword(false)} onPasswordChanged={() => {}} />
          </div>
        </div>
      )}
    </div>
  )
}

export default TeamLeaderDashboard