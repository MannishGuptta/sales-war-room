import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const TLManagement = ({ onUpdate }) => {
  const [teamLeaders, setTeamLeaders] = useState([]);
  const [newTL, setNewTL] = useState({ name: '', region: 'North' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTLs();
  }, []);

  const loadTLs = async () => {
    const { data } = await supabase.from('team_leaders').select('*').order('name');
    if (data) setTeamLeaders(data);
  };

  const addTL = async () => {
    if (!newTL.name.trim()) return;
    setLoading(true);
    await supabase.from('team_leaders').insert([newTL]);
    setNewTL({ name: '', region: 'North' });
    await loadTLs();
    if (onUpdate) onUpdate();
    setLoading(false);
  };

  const deleteTL = async (id) => {
    if (!confirm('Delete this Team Leader?')) return;
    await supabase.from('team_leaders').delete().eq('id', id);
    await loadTLs();
    if (onUpdate) onUpdate();
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>👥 Team Leader Management</h2>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <input 
          type="text" 
          value={newTL.name} 
          onChange={(e) => setNewTL({ ...newTL, name: e.target.value })}
          placeholder="TL Name"
          style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }}
        />
        <select 
          value={newTL.region} 
          onChange={(e) => setNewTL({ ...newTL, region: e.target.value })}
          style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }}
        >
          <option>North</option><option>South</option><option>East</option><option>West</option>
        </select>
        <button onClick={addTL} disabled={loading} style={{ padding: '8px 16px', background: '#1e4a76', color: 'white', border: 'none', borderRadius: '6px' }}>
          + Add TL
        </button>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f0f2f5' }}>
            <th style={{ padding: '10px', textAlign: 'left' }}>Name</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Region</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {teamLeaders.map(tl => (
            <tr key={tl.id}>
              <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{tl.name}</td>
              <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{tl.region}</td>
              <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                <button onClick={() => deleteTL(tl.id)} style={{ background: '#dc2626', color: 'white', border: 'none', padding: '4px 12px', borderRadius: '4px' }}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TLManagement;