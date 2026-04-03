import { useState, useEffect, useCallback } from 'react'
import MetricsBar from '../components/MetricsBar'
import RMTable from '../components/RMTable'
import InterventionFeed from '../components/InterventionFeed'
import WeeklyProgress from '../components/WeeklyProgress'
import TargetManagement from '../components/TargetManagement'
import MasterDataManagement from '../components/MasterDataManagement'
import PerformanceChart from '../components/PerformanceChart'
import AIPredictions from '../components/AIPredictions'
import AttendanceMonitor from '../components/AttendanceMonitor'
import TLManagement from '../components/TLManagement'
import AssignmentManagement from '../components/AssignmentManagement'
import TLTargetManagement from '../components/TLTargetManagement'
import ChangePassword from '../components/ChangePassword'
import { supabase } from '../supabaseClient'
import { mockData } from '../data/mockData'
import { calculateMetrics } from '../utils/kpiEngine'
import { processAllRMs, generateInterventions } from '../engines/escalationEngine'

const WarRoom = ({ onLogout }) => {
  const [metrics, setMetrics] = useState(null)
  const [rms, setRms] = useState([])
  const [interventions, setInterventions] = useState([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [selectedRM, setSelectedRM] = useState(null)
  const [showWeeklyProgress, setShowWeeklyProgress] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [showMasterData, setShowMasterData] = useState(false)
  const [showAIPredictions, setShowAIPredictions] = useState(false)
  const [showAttendanceMonitor, setShowAttendanceMonitor] = useState(false)
  const [showTLManagement, setShowTLManagement] = useState(false)
  const [showAssignmentMgmt, setShowAssignmentMgmt] = useState(false)
  const [showTLTargets, setShowTLTargets] = useState(false)
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [meetingStats, setMeetingStats] = useState({})
  const [teamLeadersList, setTeamLeadersList] = useState([])
  const [allCPs, setAllCPs] = useState([])
  const [currentWeek, setCurrentWeek] = useState(1)
  const [currentMonth, setCurrentMonth] = useState('')
  const [currentYear, setCurrentYear] = useState(2024)

  // Load current date info
  useEffect(() => {
    const now = new Date()
    setCurrentMonth(now.toLocaleString('default', { month: 'long' }))
    setCurrentYear(now.getFullYear())
    const weekOfMonth = Math.ceil(now.getDate() / 7)
    setCurrentWeek(Math.min(weekOfMonth, 4))
  }, [])

  // Load RMs from Supabase
  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      
      const { data: rmsData, error: rmsError } = await supabase
        .from('rms')
        .select('*')
        .order('id')
      
      if (rmsError) throw rmsError
      
      let rmsToUse = rmsData || []
      if (rmsToUse.length === 0) {
        console.log('No data in database, using mock data')
        rmsToUse = mockData.rms
      }
      
      const { data: tlData, error: tlError } = await supabase
        .from('team_leaders')
        .select('*')
        .order('id')
      
      if (tlError) console.warn('Error fetching team leaders:', tlError.message)
      
      const { data: cpsData, error: cpsError } = await supabase
        .from('channel_partners')
        .select('*')
      
      if (cpsError) console.warn('Error fetching channel partners:', cpsError.message)
      
      const processedRMs = processAllRMs(rmsToUse, currentWeek)
      setRms(processedRMs)
      
      const updatedMetrics = calculateMetrics(processedRMs)
      setMetrics(updatedMetrics)
      
      const activeInterventions = generateInterventions(processedRMs)
      setInterventions(activeInterventions)
      
      setTeamLeadersList(tlData || [])
      setAllCPs(cpsData || [])
      setLastUpdated(new Date())
      
    } catch (error) {
      console.error('Error loading WarRoom:', error)
      const processedRMs = processAllRMs(mockData.rms, currentWeek)
      setRms(processedRMs)
      const updatedMetrics = calculateMetrics(processedRMs)
      setMetrics(updatedMetrics)
      const activeInterventions = generateInterventions(processedRMs)
      setInterventions(activeInterventions)
    } finally {
      setLoading(false)
    }
  }, [currentWeek])

  // Refresh all data function
  const refreshAllData = async () => {
    await loadData()
    await loadMeetingStats()
  }

  // Load meeting stats
  const loadMeetingStats = useCallback(async () => {
    try {
      const { data: meetingsData, error } = await supabase
        .from('meetings')
        .select('*, rms(name)')
      
      if (error) {
        console.warn('Meetings table not found:', error.message)
        setMeetingStats({})
        return
      }
      
      const stats = {}
      const today = new Date().toISOString().split('T')[0]
      
      meetingsData?.forEach(meeting => {
        const rmId = meeting.rm_id
        if (!stats[rmId]) {
          stats[rmId] = {
            name: meeting.rms?.name || `RM ${rmId}`,
            total: 0,
            upcoming: 0
          }
        }
        stats[rmId].total++
        if (meeting.meeting_date >= today && meeting.status === 'scheduled') {
          stats[rmId].upcoming++
        }
      })
      
      setMeetingStats(stats)
    } catch (error) {
      console.error('Error loading meeting stats:', error)
      setMeetingStats({})
    }
  }, [])

  useEffect(() => {
    loadData()
    loadMeetingStats()
  }, [loadData, loadMeetingStats])

  const exportToCSV = () => {
    const exportData = rms.map(rm => ({
      'RM Name': rm.name,
      'Monthly Target (₹)': rm.monthlyTarget,
      'Monthly Achieved (₹)': rm.monthlyAchieved,
      'Achievement %': rm.monthlyAchievement.toFixed(1),
      'CP Onboarded': `${rm.cpOnboarded}/${rm.cpTarget}`,
      'Active CP': `${rm.activeCP}/${rm.activeCPTarget}`,
      'Meetings': meetingStats[rm.id]?.total || 0
    }))

    const headers = Object.keys(exportData[0])
    const csvRows = [headers.join(','), ...exportData.map(row => headers.map(h => `"${row[h] || ''}"`).join(','))]
    const csvString = csvRows.join('\n')
    const blob = new Blob(['\uFEFF' + csvString], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `war-room-export-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleRefresh = () => {
    refreshAllData()
  }

  const handleRMSummaryClick = (rm) => {
    setSelectedRM(rm)
    setShowWeeklyProgress(true)
  }

  const handleCloseWeeklyProgress = () => {
    setShowWeeklyProgress(false)
    setSelectedRM(null)
  }

  const totalMeetings = Object.values(meetingStats).reduce((sum, stat) => sum + stat.total, 0)
  const totalUpcoming = Object.values(meetingStats).reduce((sum, stat) => sum + stat.upcoming, 0)

  const styles = {
    container: {
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
      paddingBottom: '20px',
      borderBottom: '2px solid #f0f0f0',
      flexWrap: 'wrap',
      gap: '15px'
    },
    headerLeft: { flex: 1 },
    headerRight: { display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' },
    title: { fontSize: '28px', fontWeight: 'bold', color: '#333', margin: 0 },
    subtitle: { color: '#666', marginTop: '5px', fontSize: '14px' },
    tabs: { display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '2px solid #f0f0f0', flexWrap: 'wrap', overflowX: 'auto' },
    tab: { padding: '10px 20px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', fontWeight: '500', color: '#666', transition: 'all 0.3s ease', whiteSpace: 'nowrap' },
    activeTab: { color: '#2196f3', borderBottom: '3px solid #2196f3', marginBottom: '-2px' },
    exportBtn: { backgroundColor: '#28a745', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' },
    refreshBtn: { backgroundColor: '#17a2b8', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' },
    syncBtn: { backgroundColor: '#6f42c1', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' },
    changePasswordBtn: { backgroundColor: '#ffc107', color: '#333', padding: '10px 20px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' },
    lastUpdated: { fontSize: '12px', color: '#999', marginLeft: '10px' },
    loading: { textAlign: 'center', padding: '50px', fontSize: '18px', color: '#666' },
    statsBar: { display: 'flex', gap: '20px', marginBottom: '20px', padding: '10px', background: '#f8f9fa', borderRadius: '8px', fontSize: '13px', flexWrap: 'wrap' },
    stat: { display: 'flex', alignItems: 'center', gap: '5px' },
    criticalDot: { width: '10px', height: '10px', borderRadius: '50%', background: '#dc3545', display: 'inline-block' },
    highDot: { width: '10px', height: '10px', borderRadius: '50%', background: '#fd7e14', display: 'inline-block' },
    mediumDot: { width: '10px', height: '10px', borderRadius: '50%', background: '#ffc107', display: 'inline-block' },
    weeklyHeader: { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '15px 20px', borderRadius: '12px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', color: 'white' },
    monthInfo: { fontSize: '14px' },
    weekBadge: { background: 'rgba(255,255,255,0.2)', color: 'white', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold' },
    meetingStatsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '20px' },
    meetingStatCard: { background: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)', color: 'white', padding: '15px', borderRadius: '8px', textAlign: 'center' },
    progressOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
    progressModal: { position: 'relative', maxWidth: '90vw', maxHeight: '90vh', overflow: 'auto' }
  }

  if (loading) {
    return <div style={styles.loading}>Loading Sales War Room...</div>
  }

  if (!metrics) {
    return <div style={styles.loading}>Error loading data. Please refresh.</div>
  }

  const criticalCount = rms.filter(rm => rm.escalationLevel === 'critical').length
  const highCount = rms.filter(rm => rm.escalationLevel === 'high').length
  const mediumCount = rms.filter(rm => rm.escalationLevel === 'medium').length

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <h1 style={styles.title}>🏆 Sales War Room</h1>
          <p style={styles.subtitle}>Monthly Targets with Weekly Monitoring</p>
        </div>
        <div style={styles.headerRight}>
          <button onClick={exportToCSV} style={styles.exportBtn}>📊 Export to CSV</button>
          <button onClick={handleRefresh} style={styles.refreshBtn}>🔄 Refresh</button>
          <button onClick={refreshAllData} style={styles.syncBtn}>🔄 Sync with DB</button>
          <button onClick={() => setShowChangePassword(true)} style={styles.changePasswordBtn}>🔐 Change Password</button>
          <span style={styles.lastUpdated}>Last updated: {lastUpdated.toLocaleTimeString()}</span>
        </div>
      </div>

      <div style={styles.tabs}>
        <button style={{ ...styles.tab, ...(activeTab === 'dashboard' && !showMasterData && !showAIPredictions && !showAttendanceMonitor && !showTLManagement && !showAssignmentMgmt && !showTLTargets ? styles.activeTab : {}) }} onClick={() => { setActiveTab('dashboard'); setShowMasterData(false); setShowAIPredictions(false); setShowAttendanceMonitor(false); setShowTLManagement(false); setShowAssignmentMgmt(false); setShowTLTargets(false); }}>📊 Dashboard</button>
        <button style={{ ...styles.tab, ...(activeTab === 'targets' && !showMasterData && !showAIPredictions && !showAttendanceMonitor && !showTLManagement && !showAssignmentMgmt && !showTLTargets ? styles.activeTab : {}) }} onClick={() => { setActiveTab('targets'); setShowMasterData(false); setShowAIPredictions(false); setShowAttendanceMonitor(false); setShowTLManagement(false); setShowAssignmentMgmt(false); setShowTLTargets(false); }}>🎯 Set Targets</button>
        <button style={{ ...styles.tab, ...(activeTab === 'meetings' && !showMasterData && !showAIPredictions && !showAttendanceMonitor && !showTLManagement && !showAssignmentMgmt && !showTLTargets ? styles.activeTab : {}) }} onClick={() => { setActiveTab('meetings'); setShowMasterData(false); setShowAIPredictions(false); setShowAttendanceMonitor(false); setShowTLManagement(false); setShowAssignmentMgmt(false); setShowTLTargets(false); loadMeetingStats(); }}>📅 Meetings ({totalUpcoming})</button>
        <button style={{ ...styles.tab, ...(showMasterData ? styles.activeTab : {}) }} onClick={() => { setShowMasterData(true); setShowAIPredictions(false); setShowAttendanceMonitor(false); setShowTLManagement(false); setShowAssignmentMgmt(false); setShowTLTargets(false); setActiveTab('dashboard'); }}>📋 Master Data</button>
        <button style={{ ...styles.tab, ...(showAIPredictions ? styles.activeTab : {}) }} onClick={() => { setShowAIPredictions(true); setShowMasterData(false); setShowAttendanceMonitor(false); setShowTLManagement(false); setShowAssignmentMgmt(false); setShowTLTargets(false); setActiveTab('dashboard'); }}>🤖 AI Predict</button>
        <button style={{ ...styles.tab, ...(showAttendanceMonitor ? styles.activeTab : {}) }} onClick={() => { setShowAttendanceMonitor(true); setShowMasterData(false); setShowAIPredictions(false); setShowTLManagement(false); setShowAssignmentMgmt(false); setShowTLTargets(false); setActiveTab('dashboard'); }}>📍 Attendance</button>
        <button style={{ ...styles.tab, ...(showTLManagement ? styles.activeTab : {}) }} onClick={() => { setShowTLManagement(true); setShowMasterData(false); setShowAIPredictions(false); setShowAttendanceMonitor(false); setShowAssignmentMgmt(false); setShowTLTargets(false); setActiveTab('dashboard'); }}>👥 TL Mgmt</button>
        <button style={{ ...styles.tab, ...(showTLTargets ? styles.activeTab : {}) }} onClick={() => { setShowTLTargets(true); setShowMasterData(false); setShowAIPredictions(false); setShowAttendanceMonitor(false); setShowTLManagement(false); setShowAssignmentMgmt(false); setActiveTab('dashboard'); }}>🎯 TL Targets</button>
        <button style={{ ...styles.tab, ...(showAssignmentMgmt ? styles.activeTab : {}) }} onClick={() => { setShowAssignmentMgmt(true); setShowMasterData(false); setShowAIPredictions(false); setShowAttendanceMonitor(false); setShowTLManagement(false); setShowTLTargets(false); setActiveTab('dashboard'); }}>🔄 Assignments</button>
      </div>

      {showTLTargets ? (
        <TLTargetManagement 
          teamLeaders={teamLeadersList}
          onUpdate={(updatedTL) => {
            setTeamLeadersList(updatedTL)
            refreshAllData()
          }}
          onClose={() => setShowTLTargets(false)}
        />
      ) : showAssignmentMgmt ? (
        <AssignmentManagement 
          rms={rms}
          teamLeaders={teamLeadersList}
          cps={allCPs}
          onUpdate={(updatedData) => {
            if (updatedData.teamLeaders) {
              setTeamLeadersList(updatedData.teamLeaders)
            }
            refreshAllData()
          }}
          onClose={() => setShowAssignmentMgmt(false)}
        />
      ) : showTLManagement ? (
        <TLManagement 
          teamLeaders={teamLeadersList} 
          rms={rms} 
          onUpdate={(updatedTL) => { 
            setTeamLeadersList(updatedTL); 
            refreshAllData()
          }} 
          onClose={() => setShowTLManagement(false)} 
        />
      ) : showAttendanceMonitor ? (
        <AttendanceMonitor onClose={() => setShowAttendanceMonitor(false)} />
      ) : showAIPredictions ? (
        <AIPredictions rms={rms} currentWeek={currentWeek} onClose={() => setShowAIPredictions(false)} />
      ) : showMasterData ? (
        <MasterDataManagement 
          rms={rms} 
          cps={allCPs} 
          sales={[]} 
          onUpdateData={async () => {
            await refreshAllData()
          }} 
          onClose={() => setShowMasterData(false)} 
        />
      ) : activeTab === 'dashboard' ? (
        <>
          <div style={styles.weeklyHeader}>
            <div style={styles.monthInfo}><strong>📅 {currentMonth} {currentYear}</strong><span style={{ marginLeft: '15px', opacity: 0.9 }}>Week {currentWeek} of 4 | Monthly Progress: {metrics.revenueConversion || 0}%</span></div>
            <div><span style={styles.weekBadge}>📍 Week {currentWeek} Monitoring Active</span></div>
          </div>

          <div style={styles.statsBar}>
            <div style={styles.stat}><span style={styles.criticalDot}></span> Critical: {criticalCount}</div>
            <div style={styles.stat}><span style={styles.highDot}></span> High: {highCount}</div>
            <div style={styles.stat}><span style={styles.mediumDot}></span> Medium: {mediumCount}</div>
            <div style={styles.stat}>✅ On Track: {rms.length - (criticalCount + highCount + mediumCount)}</div>
          </div>

          <div style={styles.meetingStatsGrid}>
            <div style={styles.meetingStatCard}><div style={{ fontSize: '28px', fontWeight: 'bold' }}>{totalMeetings}</div><div style={{ fontSize: '12px', opacity: 0.9 }}>Total Meetings</div></div>
            <div style={styles.meetingStatCard}><div style={{ fontSize: '28px', fontWeight: 'bold' }}>{totalUpcoming}</div><div style={{ fontSize: '12px', opacity: 0.9 }}>Upcoming Meetings</div></div>
            <div style={styles.meetingStatCard}><div style={{ fontSize: '28px', fontWeight: 'bold' }}>{metrics.revenueConversion || 0}%</div><div style={{ fontSize: '12px', opacity: 0.9 }}>Achievement</div></div>
          </div>

          <MetricsBar metrics={metrics} />
          <PerformanceChart rms={rms} />
          <RMTable rms={rms} onRMSummaryClick={handleRMSummaryClick} />
          <InterventionFeed interventions={interventions} />
        </>
      ) : activeTab === 'meetings' ? (
        <div>
          <div style={styles.meetingStatsGrid}>
            <div style={styles.meetingStatCard}><div style={{ fontSize: '28px' }}>{totalMeetings}</div><div>Total Meetings</div></div>
            <div style={styles.meetingStatCard}><div style={{ fontSize: '28px' }}>{totalUpcoming}</div><div>Upcoming</div></div>
            <div style={styles.meetingStatCard}><div style={{ fontSize: '28px' }}>{Object.keys(meetingStats).length}</div><div>RMs</div></div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '8px' }}>
              <thead>
                <tr>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>RM Name</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>Total Meetings</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>Upcoming Meetings</th>
                </tr>
              </thead>
              <tbody>
                {Object.values(meetingStats).map((stat, idx) => (
                  <tr key={idx}>
                    <td style={{ padding: '12px', borderBottom: '1px solid #e0e0e0' }}>{stat.name}</td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #e0e0e0' }}>{stat.total}</td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #e0e0e0' }}>{stat.upcoming}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <TargetManagement 
          rms={rms} 
          onUpdateTargets={async () => {
            await refreshAllData()
          }} 
          onClose={() => setActiveTab('dashboard')} 
        />
      )}

      {showWeeklyProgress && selectedRM && (
        <div style={styles.progressOverlay} onClick={handleCloseWeeklyProgress}>
          <div style={styles.progressModal} onClick={(e) => e.stopPropagation()}>
            <WeeklyProgress rm={selectedRM} onClose={handleCloseWeeklyProgress} />
          </div>
        </div>
      )}

      {showChangePassword && (
        <div style={styles.progressOverlay} onClick={() => setShowChangePassword(false)}>
          <div style={styles.progressModal} onClick={(e) => e.stopPropagation()}>
            <ChangePassword 
              userType="admin"
              userId="admin"
              userName="Admin"
              onClose={() => setShowChangePassword(false)}
              onPasswordChanged={() => {}}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default WarRoom