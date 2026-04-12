import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const AssignmentManagement = ({ onUpdate }) => {
  const [rms, setRms] = useState([]);
  const [teamLeaders, setTeamLeaders] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selectedRm, setSelectedRm] = useState('');
  const [selectedTl, setSelectedTl] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load RMs
      const { data: rmsData } = await supabase.from('rms').select('*');
      if (rmsData) setRms(rmsData);
      
      // Load Team Leaders
      const { data: tlData } = await supabase.from('team_leaders').select('*');
      if (tlData) setTeamLeaders(tlData);
      
      // Load Assignments
      const { data: assignData } = await supabase.from('rm_tl_assignments').select('*');
      if (assignData) setAssignments(assignData || []);
      
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const assignRM = async () => {
    if (!selectedRm || !selectedTl) {
      alert('Please select both RM and TL');
      return;
    }
    
    setLoading(true);
    
    // Check if assignment already exists
    const existing = assignments.find(a => a.rm_id === parseInt(selectedRm));
    
    const today = new Date().toISOString().slice(0, 10);
    
    let error;
    if (existing) {
      // Update existing
      const { error: updateError } = await supabase
        .from('rm_tl_assignments')
        .update({ tl_id: parseInt(selectedTl), assigned_date: today })
        .eq('rm_id', parseInt(selectedRm));
      error = updateError;
    } else {
      // Insert new
      const { error: insertError } = await supabase
        .from('rm_tl_assignments')
        .insert([{ 
          rm_id: parseInt(selectedRm), 
          tl_id: parseInt(selectedTl),
          assigned_date: today
        }]);
      error = insertError;
    }
    
    if (error) {
      alert('Error: ' + error.message);
    } else {
      await loadData();
      if (onUpdate) onUpdate();
      alert('Assignment saved successfully!');
      setSelectedRm('');
      setSelectedTl('');
    }
    setLoading(false);
  };

  const unassignRM = async (rmId) => {
    if (!confirm('Remove this assignment?')) return;
    
    setLoading(true);
    const { error } = await supabase
      .from('rm_tl_assignments')
      .delete()
      .eq('rm_id', rmId);
    
    if (error) {
      alert('Error: ' + error.message);
    } else {
      await loadData();
      if (onUpdate) onUpdate();
    }
    setLoading(false);
  };

  const getTLName = (tlId) => {
    const tl = teamLeaders.find(t => t.id === tlId);
    return tl ? `${tl.name}` : 'Unknown';
  };

  const getTLRegion = (tlId) => {
    const tl = teamLeaders.find(t => t.id === tlId);
    return tl ? tl.region : '';
  };

  const styles = {
    container: { padding: '20px' },
    formRow: { display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'flex-end' },
    select: { padding: '8px 12px', borderRadius: '6px', border: '1px solid #ccc', minWidth: '180px' },
    button: { padding: '8px 20px', background: '#1e4a76', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' },
    deleteButton: { background: '#dc2626', color: 'white', border: 'none', padding: '5px 12px', borderRadius: '4px', cursor: 'pointer' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { padding: '10px', textAlign: 'left', background: '#f8fafc', borderBottom: '1px solid #ddd' },
    td: { padding: '10px', borderBottom: '1px solid #ddd' },
    badgeUnassigned: { background: '#fef3c7', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', display: 'inline-block' }
  };

  return (
    <div style={styles.container}>
      <h2>🔗 Assign RM to Team Leader</h2>
      
      <div style={styles.formRow}>
        <select 
          value={selectedRm} 
          onChange={(e) => setSelectedRm(e.target.value)}
          style={styles.select}
        >
          <option value="">Select RM</option>
          {rms.map(rm => (
            <option key={rm.id} value={rm.id}>{rm.name}</option>
          ))}
        </select>
        
        <select 
          value={selectedTl} 
          onChange={(e) => setSelectedTl(e.target.value)}
          style={styles.select}
        >
          <option value="">Select TL</option>
          {teamLeaders.map(tl => (
            <option key={tl.id} value={tl.id}>{tl.name} ({tl.region})</option>
          ))}
        </select>
        
        <button onClick={assignRM} style={styles.button} disabled={loading}>
          {loading ? 'Saving...' : 'Assign'}
        </button>
      </div>
      
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>RM Name</th>
            <th style={styles.th}>Assigned TL</th>
            <th style={styles.th}>Region</th>
            <th style={styles.th}>Assigned Date</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rms.map(rm => {
            const assignment = assignments.find(a => a.rm_id === rm.id);
            const tl = assignment ? teamLeaders.find(t => t.id === assignment.tl_id) : null;
            
            return (
              <tr key={rm.id}>
                <td style={styles.td}>{rm.name}</td>
                <td style={styles.td}>
                  {tl ? tl.name : <span style={styles.badgeUnassigned}>⚠️ Unassigned</span>}
                </td>
                <td style={styles.td}>{tl ? tl.region : '-'}</td>
                <td style={styles.td}>{assignment ? assignment.assigned_date : '-'}</td>
                <td style={styles.td}>
                  {assignment && (
                    <button onClick={() => unassignRM(rm.id)} style={styles.deleteButton}>
                      Unassign
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      
      {assignments.length === 0 && (
        <div style={{ marginTop: '20px', padding: '15px', background: '#fef3c7', borderRadius: '8px' }}>
          💡 No assignments yet. Use the form above to assign RMs to Team Leaders.
        </div>
      )}
    </div>
  );
};

export default AssignmentManagement;