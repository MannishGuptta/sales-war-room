import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const AssignmentManagement = ({ onUpdate }) => {
  const [rms, setRms] = useState([]);
  const [teamLeaders, setTeamLeaders] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selectedRm, setSelectedRm] = useState('');
  const [selectedTl, setSelectedTl] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [rmsRes, tlRes, assignRes] = await Promise.all([
      supabase.from('rms').select('*'),
      supabase.from('team_leaders').select('*'),
      supabase.from('rm_tl_assignments').select('*')
    ]);
    if (rmsRes.data) setRms(rmsRes.data);
    if (tlRes.data) setTeamLeaders(tlRes.data);
    if (assignRes.data) setAssignments(assignRes.data);
  };

  const assign = async () => {
    if (!selectedRm || !selectedTl) return alert('Select both RM and TL');
    
    const existing = assignments.find(a => a.rm_id === selectedRm);
    if (existing) {
      await supabase.from('rm_tl_assignments').update({ tl_id: selectedTl }).eq('rm_id', selectedRm);
    } else {
      await supabase.from('rm_tl_assignments').insert([{ rm_id: selectedRm, tl_id: selectedTl }]);
    }
    await loadData();
    if (onUpdate) onUpdate();
    alert('Assignment saved!');
  };

  const unassign = async (rmId) => {
    await supabase.from('rm_tl_assignments').delete().eq('rm_id', rmId);
    await loadData();
    if (onUpdate) onUpdate();
  };

  const getTLName = (tlId) => {
    const tl = teamLeaders.find(t => t.id === tlId);
    return tl ? `${tl.name} (${tl.region})` : 'Unassigned';
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>🔗 Assign RM to Team Leader</h2>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <select value={selectedRm} onChange={(e) => setSelectedRm(e.target.value)} style={{ padding: '8px', borderRadius: '6px' }}>
          <option value="">Select RM</option>
          {rms.map(rm => <option key={rm.id} value={rm.id}>{rm.name}</option>)}
        </select>
        <select value={selectedTl} onChange={(e) => setSelectedTl(e.target.value)} style={{ padding: '8px', borderRadius: '6px' }}>
          <option value="">Select TL</option>
          {teamLeaders.map(tl => <option key={tl.id} value={tl.id}>{tl.name} ({tl.region})</option>)}
        </select>
        <button onClick={assign} style={{ padding: '8px 16px', background: '#1e4a76', color: 'white', border: 'none', borderRadius: '6px' }}>
          Assign
        </button>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f0f2f5' }}>
            <th style={{ padding: '10px', textAlign: 'left' }}>RM Name</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Assigned TL</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rms.map(rm => {
            const assign = assignments.find(a => a.rm_id === rm.id);
            return (
              <tr key={rm.id}>
                <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{rm.name}</td>
                <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{assign ? getTLName(assign.tl_id) : '⚠️ Unassigned'}</td>
                <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                  {assign && <button onClick={() => unassign(rm.id)} style={{ background: '#dc2626', color: 'white', border: 'none', padding: '4px 12px', borderRadius: '4px' }}>Unassign</button>}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AssignmentManagement;