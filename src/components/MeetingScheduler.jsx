import { useState, useEffect } from 'react'

const MeetingScheduler = ({ rmId, rmName, onClose, onMeetingAdded, isTeamLeader = false }) => {
  const [meetings, setMeetings] = useState([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [reminders, setReminders] = useState([])
  const [showReminders, setShowReminders] = useState(false)
  const [newMeeting, setNewMeeting] = useState({
    type: isTeamLeader ? 'team' : 'prospect',
    title: '',
    with: '',
    date: new Date().toISOString().split('T')[0],
    time: '10:00',
    duration: '30',
    notes: '',
    status: 'scheduled',
    followUp: false,
    followUpDate: '',
    reminder: true,
    reminderMinutes: 30
  })

  useEffect(() => {
    loadMeetings()
    checkReminders()
    // Check reminders every minute
    const interval = setInterval(checkReminders, 60000)
    return () => clearInterval(interval)
  }, [rmId])

  const loadMeetings = () => {
    const storageKey = isTeamLeader ? `tl_meetings_${rmId}` : `meetings_${rmId}`
    const storedMeetings = localStorage.getItem(storageKey)
    if (storedMeetings) {
      setMeetings(JSON.parse(storedMeetings))
    } else {
      // Mock meetings based on user type
      let mockMeetings = []
      
      if (isTeamLeader) {
        mockMeetings = [
          {
            id: 1,
            type: 'team',
            title: 'Weekly Team Review',
            with: 'North Zone Team',
            date: new Date().toISOString().split('T')[0],
            time: '10:00 AM',
            duration: '60',
            notes: 'Weekly performance review with team members',
            status: 'scheduled',
            followUp: false,
            reminder: true,
            reminderMinutes: 30,
            createdAt: new Date().toISOString()
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
            followUp: true,
            followUpDate: new Date(Date.now() + 9 * 86400000).toISOString().split('T')[0],
            reminder: true,
            reminderMinutes: 60,
            createdAt: new Date().toISOString()
          },
          {
            id: 3,
            type: 'tl_client',
            title: 'Enterprise Client Meeting',
            with: 'Major Client - ABC Corp',
            date: new Date(Date.now() + 1 * 86400000).toISOString().split('T')[0],
            time: '11:30 AM',
            duration: '45',
            notes: 'Review proposal and close deal',
            status: 'scheduled',
            followUp: false,
            reminder: true,
            reminderMinutes: 30,
            createdAt: new Date().toISOString()
          }
        ]
      } else {
        mockMeetings = [
          {
            id: 1,
            type: 'prospect',
            title: 'Initial Discovery Call',
            with: 'ABC Corp - Procurement Team',
            date: new Date().toISOString().split('T')[0],
            time: '10:30 AM',
            duration: '45',
            notes: 'Discussed product features and pricing',
            status: 'scheduled',
            followUp: true,
            followUpDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
            reminder: true,
            reminderMinutes: 30,
            createdAt: new Date().toISOString()
          },
          {
            id: 2,
            type: 'cp',
            title: 'CP Onboarding Session',
            with: 'Tech Solutions - Rajesh Sharma',
            date: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
            time: '02:00 PM',
            duration: '60',
            notes: 'Complete onboarding and training',
            status: 'scheduled',
            followUp: false,
            reminder: true,
            reminderMinutes: 15,
            createdAt: new Date().toISOString()
          }
        ]
      }
      
      setMeetings(mockMeetings)
      localStorage.setItem(storageKey, JSON.stringify(mockMeetings))
    }
  }

  const checkReminders = () => {
    const now = new Date()
    const today = now.toISOString().split('T')[0]
    
    const upcomingReminders = meetings.filter(meeting => {
      if (meeting.status !== 'scheduled') return false
      if (!meeting.reminder) return false
      
      const meetingDateTime = new Date(`${meeting.date}T${convertTo24Hour(meeting.time)}`)
      const reminderTime = new Date(meetingDateTime.getTime() - (meeting.reminderMinutes * 60000))
      
      const alreadyReminded = reminders.some(r => r.meetingId === meeting.id)
      
      return !alreadyReminded && reminderTime <= now && meetingDateTime > now
    })
    
    if (upcomingReminders.length > 0) {
      showReminderNotification(upcomingReminders)
    }
  }

  const convertTo24Hour = (time12h) => {
    const [time, modifier] = time12h.split(' ')
    let [hours, minutes] = time.split(':')
    if (hours === '12') hours = '00'
    if (modifier === 'PM') hours = parseInt(hours) + 12
    return `${hours}:${minutes}`
  }

  const showReminderNotification = (upcomingMeetings) => {
    upcomingMeetings.forEach(meeting => {
      // Browser notification
      if (Notification.permission === 'granted') {
        new Notification(`Meeting Reminder: ${meeting.title}`, {
          body: `With: ${meeting.with}\nTime: ${meeting.time}\nIn ${meeting.reminderMinutes} minutes`,
          icon: 'https://via.placeholder.com/64',
          tag: `meeting-${meeting.id}`
        })
      }
      
      // Store reminder in localStorage
      const newReminder = {
        id: Date.now(),
        meetingId: meeting.id,
        title: meeting.title,
        with: meeting.with,
        time: meeting.time,
        date: meeting.date,
        read: false,
        createdAt: new Date().toISOString()
      }
      
      setReminders(prev => [...prev, newReminder])
      const storageKey = isTeamLeader ? `tl_reminders_${rmId}` : `reminders_${rmId}`
      localStorage.setItem(storageKey, JSON.stringify([...reminders, newReminder]))
    })
  }

  const requestNotificationPermission = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          console.log('Notification permission granted')
        }
      })
    }
  }

  const handleAddMeeting = () => {
    if (!newMeeting.title || !newMeeting.with) {
      alert('Please fill in meeting title and participant')
      return
    }

    const meetingData = {
      id: meetings.length + 1,
      ...newMeeting,
      createdAt: new Date().toISOString(),
      status: 'scheduled'
    }

    const updatedMeetings = [meetingData, ...meetings]
    setMeetings(updatedMeetings)
    const storageKey = isTeamLeader ? `tl_meetings_${rmId}` : `meetings_${rmId}`
    localStorage.setItem(storageKey, JSON.stringify(updatedMeetings))
    
    setShowAddForm(false)
    setNewMeeting({
      type: isTeamLeader ? 'team' : 'prospect',
      title: '',
      with: '',
      date: new Date().toISOString().split('T')[0],
      time: '10:00',
      duration: '30',
      notes: '',
      status: 'scheduled',
      followUp: false,
      followUpDate: '',
      reminder: true,
      reminderMinutes: 30
    })
    
    if (onMeetingAdded) onMeetingAdded()
    alert('Meeting scheduled successfully! Reminder will be sent before the meeting.')
  }

  const handleCompleteMeeting = (id) => {
    const updatedMeetings = meetings.map(meeting =>
      meeting.id === id ? { ...meeting, status: 'completed' } : meeting
    )
    setMeetings(updatedMeetings)
    const storageKey = isTeamLeader ? `tl_meetings_${rmId}` : `meetings_${rmId}`
    localStorage.setItem(storageKey, JSON.stringify(updatedMeetings))
  }

  const handleCancelMeeting = (id) => {
    if (window.confirm('Are you sure you want to cancel this meeting?')) {
      const updatedMeetings = meetings.map(meeting =>
        meeting.id === id ? { ...meeting, status: 'cancelled' } : meeting
      )
      setMeetings(updatedMeetings)
      const storageKey = isTeamLeader ? `tl_meetings_${rmId}` : `meetings_${rmId}`
      localStorage.setItem(storageKey, JSON.stringify(updatedMeetings))
    }
  }

  const handleDismissReminder = (reminderId) => {
    const updatedReminders = reminders.filter(r => r.id !== reminderId)
    setReminders(updatedReminders)
    const storageKey = isTeamLeader ? `tl_reminders_${rmId}` : `reminders_${rmId}`
    localStorage.setItem(storageKey, JSON.stringify(updatedReminders))
  }

  const getMeetingTypeIcon = (type) => {
    const icons = {
      prospect: '🎯',
      cp: '🤝',
      client: '🏢',
      followup: '🔄',
      sales: '💰',
      training: '📚',
      review: '📊',
      team: '👥',
      tl_cp: '🤝⭐',
      tl_client: '🏢⭐'
    }
    return icons[type] || '📅'
  }

  const getMeetingTypeLabel = (type) => {
    const labels = {
      prospect: 'Prospect Meeting',
      cp: 'CP Meeting',
      client: 'Client Meeting',
      followup: 'Follow-up',
      sales: 'Sales Meeting',
      training: 'Training Session',
      review: 'Performance Review',
      team: 'Team Meeting',
      tl_cp: 'TL-CP Strategic Meeting',
      tl_client: 'TL-Client Escalation'
    }
    return labels[type] || type
  }

  const getStatusBadge = (status) => {
    const styles = {
      scheduled: { background: '#2196f3', color: 'white' },
      completed: { background: '#28a745', color: 'white' },
      cancelled: { background: '#dc3545', color: 'white' }
    }
    return styles[status] || styles.scheduled
  }

  const getReminderText = (reminderMinutes) => {
    if (reminderMinutes >= 60) return `${reminderMinutes / 60} hour(s) before`
    return `${reminderMinutes} minute(s) before`
  }

  const filteredMeetings = meetings.filter(meeting => true)
  const upcomingMeetings = meetings.filter(m => m.status === 'scheduled' && m.date >= new Date().toISOString().split('T')[0]).length
  const completedMeetings = meetings.filter(m => m.status === 'completed').length
  const totalMeetings = meetings.length

  const styles = {
    container: {
      background: 'white',
      borderRadius: '12px',
      padding: '20px',
      maxWidth: '1200px',
      margin: '0 auto',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
      paddingBottom: '12px',
      borderBottom: '2px solid #f0f0f0',
      flexWrap: 'wrap',
      gap: '10px'
    },
    title: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: '#333',
      margin: 0
    },
    subtitle: {
      fontSize: '12px',
      color: '#666',
      marginTop: '4px'
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
    addBtn: {
      background: '#28a745',
      color: 'white',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: 'bold'
    },
    reminderBtn: {
      background: '#ff9800',
      color: 'white',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: 'bold'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
      gap: '12px',
      marginBottom: '20px'
    },
    statCard: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '12px',
      borderRadius: '8px',
      textAlign: 'center'
    },
    statValue: {
      fontSize: '24px',
      fontWeight: 'bold'
    },
    statLabel: {
      fontSize: '11px',
      opacity: 0.9,
      marginTop: '4px'
    },
    formContainer: {
      background: '#f8f9fa',
      padding: '16px',
      borderRadius: '8px',
      marginBottom: '20px'
    },
    formGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
      gap: '12px',
      marginBottom: '12px'
    },
    formLabel: {
      fontSize: '12px',
      fontWeight: '500',
      marginBottom: '4px',
      display: 'block'
    },
    formInput: {
      width: '100%',
      padding: '8px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '13px'
    },
    formSelect: {
      width: '100%',
      padding: '8px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '13px'
    },
    textarea: {
      width: '100%',
      padding: '8px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '13px',
      resize: 'vertical'
    },
    checkbox: {
      marginRight: '8px'
    },
    submitBtn: {
      background: '#28a745',
      color: 'white',
      border: 'none',
      padding: '8px 16px',
      borderRadius: '4px',
      cursor: 'pointer',
      marginRight: '8px'
    },
    cancelBtn: {
      background: '#6c757d',
      color: 'white',
      border: 'none',
      padding: '8px 16px',
      borderRadius: '4px',
      cursor: 'pointer'
    },
    meetingCard: {
      background: '#f8f9fa',
      borderRadius: '8px',
      padding: '12px',
      marginBottom: '10px',
      borderLeft: '4px solid',
      transition: 'transform 0.2s ease',
      cursor: 'pointer'
    },
    meetingHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '8px',
      flexWrap: 'wrap',
      gap: '8px'
    },
    meetingType: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      fontSize: '12px',
      fontWeight: '500'
    },
    meetingTitle: {
      fontSize: '14px',
      fontWeight: 'bold',
      marginBottom: '6px'
    },
    meetingDetails: {
      display: 'flex',
      gap: '12px',
      fontSize: '11px',
      color: '#666',
      flexWrap: 'wrap',
      marginBottom: '6px'
    },
    meetingNotes: {
      fontSize: '11px',
      color: '#666',
      marginTop: '6px',
      paddingTop: '6px',
      borderTop: '1px solid #e0e0e0'
    },
    meetingActions: {
      display: 'flex',
      gap: '8px',
      marginTop: '8px'
    },
    completeBtn: {
      background: '#28a745',
      color: 'white',
      border: 'none',
      padding: '4px 8px',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '11px'
    },
    cancelMeetingBtn: {
      background: '#dc3545',
      color: 'white',
      border: 'none',
      padding: '4px 8px',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '11px'
    },
    reminderBadge: {
      display: 'inline-block',
      background: '#ff9800',
      color: 'white',
      padding: '2px 6px',
      borderRadius: '12px',
      fontSize: '10px',
      marginLeft: '8px'
    },
    reminderCard: {
      background: '#fff3e0',
      borderLeft: '4px solid #ff9800',
      padding: '12px',
      marginBottom: '10px',
      borderRadius: '8px'
    },
    reminderTitle: {
      fontWeight: 'bold',
      fontSize: '13px',
      marginBottom: '4px'
    },
    reminderText: {
      fontSize: '12px',
      color: '#666',
      marginBottom: '8px'
    },
    dismissBtn: {
      background: '#ff9800',
      color: 'white',
      border: 'none',
      padding: '4px 12px',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '11px'
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>📅 Meeting Scheduler</h2>
          <p style={styles.subtitle}>
            {isTeamLeader ? 'Schedule team meetings, CP meetings, and client escalations' : 'Schedule and manage meetings with reminders'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button style={styles.reminderBtn} onClick={() => setShowReminders(!showReminders)}>
            🔔 {reminders.filter(r => !r.read).length} Reminders
          </button>
          <button style={styles.addBtn} onClick={() => setShowAddForm(!showAddForm)}>
            + Schedule
          </button>
          <button onClick={onClose} style={styles.closeBtn}>Close</button>
        </div>
      </div>

      {/* Request Notification Permission */}
      <button 
        onClick={requestNotificationPermission}
        style={{ fontSize: '11px', marginBottom: '10px', background: '#e3f2fd', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}
      >
        🔔 Enable Notifications
      </button>

      {/* Reminders Panel */}
      {showReminders && reminders.filter(r => !r.read).length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h3>🔔 Upcoming Reminders</h3>
          {reminders.filter(r => !r.read).map(reminder => (
            <div key={reminder.id} style={styles.reminderCard}>
              <div style={styles.reminderTitle}>⏰ Meeting Reminder</div>
              <div style={styles.reminderText}>
                <strong>{reminder.title}</strong><br />
                With: {reminder.with}<br />
                Time: {reminder.time} on {reminder.date}
              </div>
              <button style={styles.dismissBtn} onClick={() => handleDismissReminder(reminder.id)}>
                Dismiss
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Statistics */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{totalMeetings}</div>
          <div style={styles.statLabel}>Total</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{upcomingMeetings}</div>
          <div style={styles.statLabel}>Upcoming</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{completedMeetings}</div>
          <div style={styles.statLabel}>Completed</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{reminders.filter(r => !r.read).length}</div>
          <div style={styles.statLabel}>Active Reminders</div>
        </div>
      </div>

      {/* Add Meeting Form */}
      {showAddForm && (
        <div style={styles.formContainer}>
          <h3 style={{ marginBottom: '12px', fontSize: '16px' }}>Schedule New Meeting</h3>
          <div style={styles.formGrid}>
            <div>
              <label style={styles.formLabel}>Meeting Type</label>
              <select
                style={styles.formSelect}
                value={newMeeting.type}
                onChange={(e) => setNewMeeting({ ...newMeeting, type: e.target.value })}
              >
                {isTeamLeader ? (
                  <>
                    <option value="team">👥 Team Meeting</option>
                    <option value="tl_cp">🤝⭐ TL-CP Strategic Meeting</option>
                    <option value="tl_client">🏢⭐ TL-Client Escalation</option>
                    <option value="review">📊 Performance Review</option>
                    <option value="training">📚 Training Session</option>
                  </>
                ) : (
                  <>
                    <option value="prospect">🎯 Prospect Meeting</option>
                    <option value="cp">🤝 CP Meeting</option>
                    <option value="client">🏢 Client Meeting</option>
                    <option value="followup">🔄 Follow-up Meeting</option>
                    <option value="sales">💰 Sales Meeting</option>
                    <option value="training">📚 Training Session</option>
                    <option value="review">📊 Performance Review</option>
                  </>
                )}
              </select>
            </div>
            <div>
              <label style={styles.formLabel}>Meeting Title</label>
              <input
                type="text"
                style={styles.formInput}
                value={newMeeting.title}
                onChange={(e) => setNewMeeting({ ...newMeeting, title: e.target.value })}
                placeholder={isTeamLeader ? "e.g., Weekly Team Sync, Q2 Planning" : "e.g., Product Demo"}
              />
            </div>
            <div>
              <label style={styles.formLabel}>With (Person/Company)</label>
              <input
                type="text"
                style={styles.formInput}
                value={newMeeting.with}
                onChange={(e) => setNewMeeting({ ...newMeeting, with: e.target.value })}
                placeholder={isTeamLeader ? "e.g., Team Members, Key CPs" : "e.g., ABC Corp - John"}
              />
            </div>
            <div>
              <label style={styles.formLabel}>Date</label>
              <input
                type="date"
                style={styles.formInput}
                value={newMeeting.date}
                onChange={(e) => setNewMeeting({ ...newMeeting, date: e.target.value })}
              />
            </div>
            <div>
              <label style={styles.formLabel}>Time</label>
              <input
                type="time"
                style={styles.formInput}
                value={newMeeting.time}
                onChange={(e) => setNewMeeting({ ...newMeeting, time: e.target.value })}
              />
            </div>
            <div>
              <label style={styles.formLabel}>Duration</label>
              <select
                style={styles.formSelect}
                value={newMeeting.duration}
                onChange={(e) => setNewMeeting({ ...newMeeting, duration: e.target.value })}
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">1 hour</option>
                <option value="90">1.5 hours</option>
                <option value="120">2 hours</option>
              </select>
            </div>
            <div>
              <label style={styles.formLabel}>
                <input
                  type="checkbox"
                  style={styles.checkbox}
                  checked={newMeeting.reminder}
                  onChange={(e) => setNewMeeting({ ...newMeeting, reminder: e.target.checked })}
                />
                Enable Reminder
              </label>
            </div>
            {newMeeting.reminder && (
              <div>
                <label style={styles.formLabel}>Reminder Before</label>
                <select
                  style={styles.formSelect}
                  value={newMeeting.reminderMinutes}
                  onChange={(e) => setNewMeeting({ ...newMeeting, reminderMinutes: parseInt(e.target.value) })}
                >
                  <option value="5">5 minutes before</option>
                  <option value="15">15 minutes before</option>
                  <option value="30">30 minutes before</option>
                  <option value="60">1 hour before</option>
                  <option value="120">2 hours before</option>
                </select>
              </div>
            )}
            <div>
              <label style={styles.formLabel}>Follow-up Required?</label>
              <select
                style={styles.formSelect}
                value={newMeeting.followUp}
                onChange={(e) => setNewMeeting({ ...newMeeting, followUp: e.target.value === 'true' })}
              >
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
            {newMeeting.followUp && (
              <div>
                <label style={styles.formLabel}>Follow-up Date</label>
                <input
                  type="date"
                  style={styles.formInput}
                  value={newMeeting.followUpDate}
                  onChange={(e) => setNewMeeting({ ...newMeeting, followUpDate: e.target.value })}
                />
              </div>
            )}
            <div style={{ gridColumn: '1/-1' }}>
              <label style={styles.formLabel}>Notes/Agenda</label>
              <textarea
                style={styles.textarea}
                rows="2"
                value={newMeeting.notes}
                onChange={(e) => setNewMeeting({ ...newMeeting, notes: e.target.value })}
                placeholder="Add meeting agenda..."
              />
            </div>
          </div>
          <div>
            <button onClick={handleAddMeeting} style={styles.submitBtn}>Schedule Meeting</button>
            <button onClick={() => setShowAddForm(false)} style={styles.cancelBtn}>Cancel</button>
          </div>
        </div>
      )}

      {/* Meetings List */}
      <div>
        {filteredMeetings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            No meetings scheduled. Click "Schedule Meeting" to add one.
          </div>
        ) : (
          filteredMeetings.map(meeting => (
            <div key={meeting.id} style={{
              ...styles.meetingCard,
              borderLeftColor: getStatusBadge(meeting.status).background
            }}>
              <div style={styles.meetingHeader}>
                <div style={styles.meetingType}>
                  <span>{getMeetingTypeIcon(meeting.type)}</span>
                  <span>{getMeetingTypeLabel(meeting.type)}</span>
                  {meeting.reminder && meeting.status === 'scheduled' && (
                    <span style={styles.reminderBadge}>
                      🔔 {getReminderText(meeting.reminderMinutes)}
                    </span>
                  )}
                </div>
                <span style={{
                  ...getStatusBadge(meeting.status),
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '10px'
                }}>
                  {meeting.status.toUpperCase()}
                </span>
              </div>
              <div style={styles.meetingTitle}>{meeting.title}</div>
              <div style={styles.meetingDetails}>
                <span>👤 {meeting.with}</span>
                <span>📅 {meeting.date}</span>
                <span>⏰ {meeting.time}</span>
                <span>⏱️ {meeting.duration} min</span>
              </div>
              {meeting.notes && (
                <div style={styles.meetingNotes}>
                  📝 {meeting.notes}
                </div>
              )}
              {meeting.followUp && meeting.followUpDate && (
                <div style={{ fontSize: '11px', color: '#ff9800', marginTop: '6px' }}>
                  🔄 Follow-up scheduled for {meeting.followUpDate}
                </div>
              )}
              {meeting.status === 'scheduled' && (
                <div style={styles.meetingActions}>
                  <button onClick={() => handleCompleteMeeting(meeting.id)} style={styles.completeBtn}>
                    ✓ Mark Complete
                  </button>
                  <button onClick={() => handleCancelMeeting(meeting.id)} style={styles.cancelMeetingBtn}>
                    ✗ Cancel
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default MeetingScheduler