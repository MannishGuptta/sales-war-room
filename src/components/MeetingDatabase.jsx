import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const MeetingDatabase = ({ onUpdate }) => {
  const [meetings, setMeetings] = useState([]);
  const [rms, setRms] = useState([]);
  const [newMeeting, setNewMeeting] = useState({ 
    rm_id: '', 
    meeting_date: '', 
    meeting_time: '',
    duration: 30,
    type: 'client',
    notes: '',
    status: 'scheduled'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadMeetings();
    loadRms();
  }, []);

  const loadMeetings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('meetings')
      .select('*')
      .order('meeting_date', { ascending: false });
    
    if (error) {
      console.error('Error loading meetings:', error);
    } else {
      setMeetings(data || []);
    }
    setLoading(false);
  };

  const loadRms = async () => {
    const { data } = await supabase.from('rms').select('id, name');
    if (data) setRms(data);
  };

  const addMeeting = async () => {
    if (!newMeeting.rm_id) {
      alert('Please select an RM');
      return;
    }
    if (!newMeeting.meeting_date) {
      alert('Please select a date');
      return;
    }
    if (!newMeeting.type) {
      alert('Please enter meeting type');
      return;
    }
    
    setLoading(true);
    
    const meetingData = {
      rm_id: newMeeting.rm_id,
      meeting_date: newMeeting.meeting_date,
      meeting_time: newMeeting.meeting_time || null,
      duration: parseInt(newMeeting.duration) || 30,
      type: newMeeting.type,
      notes: newMeeting.notes || null,
      status: 'scheduled'
    };
    
    const { error } = await supabase
      .from('meetings')
      .insert([meetingData]);
    
    if (error) {
      alert('Error adding meeting: ' + error.message);
    } else {
      setNewMeeting({ 
        rm_id: '', 
        meeting_date: '', 
        meeting_time: '',
        duration: 30,
        type: 'client',
        notes: '',
        status: 'scheduled'
      });
      await loadMeetings();
      if (onUpdate) onUpdate();
      alert('Meeting added successfully!');
    }
    setLoading(false);
  };

  const deleteMeeting = async (id) => {
    if (!confirm('Delete this meeting?')) return;
    
    setLoading(true);
    const { error } = await supabase
      .from('meetings')
      .delete()
      .eq('id', id);
    
    if (error) {
      alert('Error: ' + error.message);
    } else {
      await loadMeetings();
      if (onUpdate) onUpdate();
    }
    setLoading(false);
  };

  const updateMeetingStatus = async (id, status) => {
    const { error } = await supabase
      .from('meetings')
      .update({ status })
      .eq('id', id);
    
    if (error) {
      alert('Error: ' + error.message);
    } else {
      await loadMeetings();
      if (onUpdate) onUpdate();
    }
  };

  const getRmName = (rmId) => {
    const rm = rms.find(r => r.id === rmId);
    return rm ? rm.name : 'Unknown';
  };

  // Check if meeting is upcoming (meeting_date >= today)
  const isUpcoming = (meetingDate) => {
    return meetingDate >= new Date().toISOString().slice(0, 10);
  };

  const totalMeetings = meetings.length;
  const upcomingMeetings = meetings.filter(m => isUpcoming(m.meeting_date)).length;

  const styles = {
    container: { padding: '20px' },
    statsRow: { display: 'flex', gap: '20px', marginBottom: '20px', padding: '15px', background: '#f0f2f5', borderRadius: '8px' },
    formRow: { display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'flex-end' },
    input: { padding: '8px 12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px' },
    select: { padding: '8px 12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px' },
    button: { padding: '8px 20px', background: '#1e4a76', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' },
    deleteButton: { background: '#dc2626', color: 'white', border: 'none', padding: '5px 12px', borderRadius: '4px', cursor: 'pointer' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { padding: '10px', textAlign: 'left', background: '#f8fafc', borderBottom: '1px solid #ddd' },
    td: { padding: '10px', borderBottom: '1px solid #ddd' },
    badgeUpcoming: { background: '#fef3c7', padding: '4px 12px', borderRadius: '20px', fontSize: '12px' },
    badgeCompleted: { background: '#dcfce7', padding: '4px 12px', borderRadius: '20px', fontSize: '12px' }
  };

  return (
    <div style={styles.container}>
      <h2>📅 Meetings Database</h2>
      
      <div style={styles.statsRow}>
        <div><strong>Total Meetings:</strong> {totalMeetings}</div>
        <div><strong>Upcoming:</strong> {upcomingMeetings}</div>
      </div>
      
      <div style={styles.formRow}>
        <select 
          value={newMeeting.rm_id} 
          onChange={(e) => setNewMeeting({ ...newMeeting, rm_id: e.target.value })}
          style={styles.select}
        >
          <option value="">Select RM</option>
          {rms.map(rm => <option key={rm.id} value={rm.id}>{rm.name}</option>)}
        </select>
        
        <input 
          type="date" 
          value={newMeeting.meeting_date} 
          onChange={(e) => setNewMeeting({ ...newMeeting, meeting_date: e.target.value })}
          style={styles.input}
        />
        
        <input 
          type="time" 
          value={newMeeting.meeting_time} 
          onChange={(e) => setNewMeeting({ ...newMeeting, meeting_time: e.target.value })}
          style={styles.input}
          placeholder="Time"
        />
        
        <input 
          type="number" 
          placeholder="Duration (min)" 
          value={newMeeting.duration} 
          onChange={(e) => setNewMeeting({ ...newMeeting, duration: parseInt(e.target.value) || 0 })}
          style={{ ...styles.input, width: '100px' }}
        />
        
        <select 
          value={newMeeting.type} 
          onChange={(e) => setNewMeeting({ ...newMeeting, type: e.target.value })}
          style={styles.select}
        >
          <option value="prospect">Prospect</option>
          <option value="cp">Channel Partner</option>
          <option value="client">Client</option>
          <option value="review">Review</option>
        </select>
        
        <input 
          type="text" 
          placeholder="Notes" 
          value={newMeeting.notes} 
          onChange={(e) => setNewMeeting({ ...newMeeting, notes: e.target.value })}
          style={{ ...styles.input, minWidth: '200px' }}
        />
        
        <button onClick={addMeeting} style={styles.button} disabled={loading}>
          {loading ? 'Adding...' : '+ Add Meeting'}
        </button>
      </div>
      
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>RM Name</th>
            <th style={styles.th}>Date</th>
            <th style={styles.th}>Time</th>
            <th style={styles.th}>Duration</th>
            <th style={styles.th}>Type</th>
            <th style={styles.th}>Notes</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {meetings.map(meeting => (
            <tr key={meeting.id}>
              <td style={styles.td}>{getRmName(meeting.rm_id)}</td>
              <td style={styles.td}>{meeting.meeting_date}</td>
              <td style={styles.td}>{meeting.meeting_time || '-'}</td>
              <td style={styles.td}>{meeting.duration} min</td>
              <td style={styles.td}>{meeting.type}</td>
              <td style={styles.td}>{meeting.notes || '-'}</td>
              <td style={styles.td}>
                <select 
                  value={meeting.status || 'scheduled'} 
                  onChange={(e) => updateMeetingStatus(meeting.id, e.target.value)}
                  style={styles.select}
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </td>
              <td style={styles.td}>
                <button onClick={() => deleteMeeting(meeting.id)} style={styles.deleteButton}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {meetings.length === 0 && !loading && (
            <tr>
              <td colSpan="8" style={{ ...styles.td, textAlign: 'center' }}>
                No meetings yet. Use the form above to add meetings.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MeetingDatabase;