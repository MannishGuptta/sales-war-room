import { useState, useEffect } from 'react'

const MeetingDatabase = ({ rmId, onClose }) => {
  const [meetings, setMeetings] = useState([])
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    loadMeetings()
  }, [rmId])

  const loadMeetings = () => {
    if (rmId === 'all') {
      const allMeetings = []
      const storedRMs = localStorage.getItem('rms') || '[]'
      const rmsList = JSON.parse(storedRMs)
      rmsList.forEach(rm => {
        const storedMeetings = localStorage.getItem(`meetings_${rm.id}`)
        if (storedMeetings) {
          const meetingsData = JSON.parse(storedMeetings)
          allMeetings.push(...meetingsData.map(m => ({ ...m, rmName: rm.name })))
        }
      })
      setMeetings(allMeetings)
    } else {
      const storedMeetings = localStorage.getItem(`meetings_${rmId}`)
      if (storedMeetings) {
        setMeetings(JSON.parse(storedMeetings))
      }
    }
  }

  const getMeetingTypeIcon = (type) => {
    const icons = {
      prospect: '🎯', cp: '🤝', client: '🏢', followup: '🔄',
      sales: '💰', training: '📚', review: '📊', team: '👥',
      tl_cp: '🤝⭐', tl_client: '🏢⭐'
    }
    return icons[type] || '📅'
  }

  const getMeetingTypeLabel = (type) => {
    const labels = {
      prospect: 'Prospect', cp: 'CP Meeting', client: 'Client',
      followup: 'Follow-up', sales: 'Sales', training: 'Training',
      review: 'Review', team: 'Team', tl_cp: 'TL-CP', tl_client: 'TL-Client'
    }
    return labels[type] || type
  }

  const filteredMeetings = meetings.filter(meeting => {
    if (filterType !== 'all' && meeting.type !== filterType) return false
    if (filterStatus !== 'all' && meeting.status !== filterStatus) return false
    return true
  })

  const styles = {
    container: {
      background: 'white',
      borderRadius: '12px',
      padding: '24px',
      maxWidth: '1000px',
      margin: '0 auto',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
      paddingBottom: '16px',
      borderBottom: '2px solid #f0f0f0'
    },
    title: { fontSize: '24px', fontWeight: 'bold', color: '#333', margin: 0 },
    closeBtn: {
      background: '#dc3545', color: 'white', border: 'none',
      padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold'
    },
    filters: { display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap' },
    select: { padding: '8px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { border: '1px solid #ddd', padding: '12px', background: '#f8f9fa', textAlign: 'left', fontWeight: 'bold', fontSize: '14px' },
    td: { border: '1px solid #ddd', padding: '10px', fontSize: '14px' },
    statusBadge: { display: 'inline-block', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' },
    scheduledBadge: { background: '#2196f3', color: 'white' },
    completedBadge: { background: '#28a745', color: 'white' },
    cancelledBadge: { background: '#dc3545', color: 'white' }
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>📅 Meeting Database</h2>
        <button onClick={onClose} style={styles.closeBtn}>Close</button>
      </div>

      <div style={styles.filters}>
        <select style={styles.select} value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="all">All Types</option>
          <option value="prospect">Prospect Meetings</option>
          <option value="cp">CP Meetings</option>
          <option value="client">Client Meetings</option>
          <option value="followup">Follow-ups</option>
          <option value="sales">Sales Meetings</option>
          <option value="team">Team Meetings</option>
        </select>
        <select style={styles.select} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="all">All Status</option>
          <option value="scheduled">Scheduled</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>RM</th>
              <th style={styles.th}>Type</th>
              <th style={styles.th}>Title</th>
              <th style={styles.th}>With</th>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Time</th>
              <th style={styles.th}>Duration</th>
              <th style={styles.th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredMeetings.map((meeting, idx) => (
              <tr key={meeting.id || idx}>
                <td style={styles.td}>{meeting.rmName || '-'}</td>
                <td style={styles.td}>{getMeetingTypeIcon(meeting.type)} {getMeetingTypeLabel(meeting.type)}</td>
                <td style={styles.td}>{meeting.title}</td>
                <td style={styles.td}>{meeting.with}</td>
                <td style={styles.td}>{meeting.date}</td>
                <td style={styles.td}>{meeting.time}</td>
                <td style={styles.td}>{meeting.duration} min</td>
                <td style={styles.td}>
                  <span style={{
                    ...styles.statusBadge,
                    ...(meeting.status === 'scheduled' ? styles.scheduledBadge :
                        meeting.status === 'completed' ? styles.completedBadge : styles.cancelledBadge)
                  }}>
                    {meeting.status}
                  </span>
                </td>
              </tr>
            ))}
            {filteredMeetings.length === 0 && (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '40px' }}>No meetings found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default MeetingDatabase