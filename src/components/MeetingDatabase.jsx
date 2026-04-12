import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const MeetingDatabase = ({ onUpdate }) => {
  const [meetings, setMeetings] = useState([]);
  const [rms, setRms] = useState([]);
  const [newMeeting, setNewMeeting] = useState({ rm_id: '', date: '', type: '', status: 'Upcoming' });

  useEffect(() => {
    loadMeetings();
    loadRms();
  }, []);

  const loadMeetings = async () => {
    const { data } = await supabase.from('meetings').select('*').order('date', { ascending: false });
    if (data) setMeetings(data);
  };

  const loadRms = async () => {
    const { data } = await supabase.from('rms').select('id, name');
    if (data) setRms(data);
  };

  const addMeeting = async () => {
    if (!newMeeting.rm_id || !newMeeting.date || !newMeeting.type) {
      return alert('Please fill all fields');
    }
    await supabase.from('meetings').insert([newMeeting]);
    setNewMeeting({ rm_id: '', date: '', type: '', status: 'Upcoming' });
    await loadMeetings();
    if (onUpdate) onUpdate();
    alert('Meeting added!');
  };

  const deleteMeeting = async (id) => {
    if (!confirm('Delete this meeting?')) return;
    await supabase.from('meetings').delete().eq('id', id);
    await loadMeetings();
    if (onUpdate) onUpdate();
  };

  const getRmName = (rmId) => {
    const rm = rms.find(r => r.id === rmId);
    return rm ? rm.name : 'Unknown';
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>📅 Meetings Database</h2>
      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', padding: '10px', background: '#f0f2f5', borderRadius: '8px' }}>
        <div><strong>Total Meetings:</strong> {meetings.length}</div>
        <div><strong>Upcoming:</strong> {meetings.filter(m => m.status === 'Upcoming').length}</div>
      </div>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <select value={newMeeting.rm_id} onChange={(e) => setNewMeeting({ ...newMeeting, rm_id: e.target.value })} style={{ padding: '8px', borderRadius: '6px' }}>
          <option value="">Select RM</option>
          {rms.map(rm => <option key={rm.id} value={rm.id}>{rm.name}</option>)}
        </select>
        <input type="date" value={newMeeting.date} onChange={(e) => setNewMeeting({ ...newMeeting, date: e.target.value })} style={{ padding: '8px', borderRadius: '6px' }} />
        <input type="text" placeholder="Meeting type" value={newMeeting.type} onChange={(e) => setNewMeeting({ ...newMeeting, type: e.target.value })} style={{ padding: '8px', borderRadius: '6px' }} />
        <select value={newMeeting.status} onChange={(e) => setNewMeeting({ ...newMeeting, status: e.target.value })} style={{ padding: '8px', borderRadius: '6px' }}>
          <option>Upcoming</option><option>Completed</option>
        </select>
        <button onClick={addMeeting} style={{ padding: '8px 16px', background: '#1e4a76', color: 'white', border: 'none', borderRadius: '6px' }}>+ Add Meeting</button>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f0f2f5' }}>
            <th style={{ padding: '10px', textAlign: 'left' }}>RM Name</th><th>Date</th><th>Type</th><th>Status</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {meetings.map(m => (
            <tr key={m.id}>
              <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{getRmName(m.rm_id)}</td>
              <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{m.date}</td>
              <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{m.type}</td>
              <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{m.status}</td>
              <td><button onClick={() => deleteMeeting(m.id)} style={{ background: '#dc2626', color: 'white', border: 'none', padding: '4px 12px', borderRadius: '4px' }}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MeetingDatabase;