import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const MasterDataManagement = ({ onUpdate }) => {
  const [rms, setRms] = useState([]);
  const [newName, setNewName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadRMs();
  }, []);

  const loadRMs = async () => {
    const { data } = await supabase.from('rms').select('*').order('name');
    if (data) setRms(data);
  };

  const addRM = async () => {
    if (!newName.trim()) return;
    setLoading(true);
    await supabase.from('rms').insert([{ name: newName.trim() }]);
    setNewName('');
    await loadRMs();
    if (onUpdate) onUpdate();
    setLoading(false);
  };

  const deleteRM = async (id) => {
    if (!confirm('Delete this RM?')) return;
    await supabase.from('rms').delete().eq('id', id);
    await loadRMs();
    if (onUpdate) onUpdate();
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>📇 Master Data - RMs</h2>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input 
          type="text" 
          value={newName} 
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Enter RM name"
          style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }}
        />
        <button onClick={addRM} disabled={loading} style={{ padding: '8px 16px', background: '#1e4a76', color: 'white', border: 'none', borderRadius: '6px' }}>
          + Add RM
        </button>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f0f2f5' }}>
            <th style={{ padding: '10px', textAlign: 'left' }}>Name</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rms.map(rm => (
            <tr key={rm.id}>
              <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{rm.name}</td>
              <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                <button onClick={() => deleteRM(rm.id)} style={{ background: '#dc2626', color: 'white', border: 'none', padding: '4px 12px', borderRadius: '4px' }}>
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

export default MasterDataManagement;