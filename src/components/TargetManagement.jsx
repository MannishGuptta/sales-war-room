import { useState } from 'react'
import { supabase } from '../supabaseClient'

const TargetManagement = ({ rms, onUpdateTargets, onClose }) => {
  const [targets, setTargets] = useState(rms.map(rm => ({
    id: rm.id,
    name: rm.name,
    revenueTarget: rm.monthlyTarget,
    cpTarget: rm.cpTarget,
    activeCPTarget: rm.activeCPTarget,
    monthlyAchieved: rm.monthlyAchieved,
    monthlyAchievement: rm.monthlyAchievement
  })))
  
  const [editingId, setEditingId] = useState(null)
  const [editValues, setEditValues] = useState({})
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const formatRupees = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const handleEdit = (rm) => {
    setEditingId(rm.id)
    setEditValues({
      revenueTarget: rm.revenueTarget,
      cpTarget: rm.cpTarget,
      activeCPTarget: rm.activeCPTarget
    })
    setSaveSuccess(false)
  }

  const handleSave = async (id) => {
    setSaving(true)
    setSaveSuccess(false)
    
    const originalRM = targets.find(t => t.id === id)
    const updatedRM = {
      ...originalRM,
      revenueTarget: parseInt(editValues.revenueTarget) || 0,
      cpTarget: parseInt(editValues.cpTarget) || 0,
      activeCPTarget: parseInt(editValues.activeCPTarget) || 0
    }
    
    const updatedTargets = targets.map(t => 
      t.id === id ? updatedRM : t
    )
    setTargets(updatedTargets)
    setEditingId(null)
    
    const newAchievement = updatedRM.monthlyAchieved > 0 
      ? (updatedRM.monthlyAchieved / updatedRM.revenueTarget) * 100 
      : 0
    const newGap = updatedRM.revenueTarget - (updatedRM.monthlyAchieved || 0)
    
    try {
      const { error } = await supabase
        .from('rms')
        .update({
          monthly_target: updatedRM.revenueTarget,
          cp_target: updatedRM.cpTarget,
          active_cp_target: updatedRM.activeCPTarget,
          monthly_achievement: newAchievement,
          monthly_gap: newGap
        })
        .eq('id', id)
      
      if (error) throw error
      
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
      
      if (onUpdateTargets) {
        onUpdateTargets()
      }
    } catch (error) {
      console.error('Error saving targets:', error)
      alert('Error saving targets: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  const styles = {
    container: {
      background: 'white',
      borderRadius: '12px',
      padding: '24px',
      maxWidth: '1200px',
      margin: '0 auto',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '24px',
      paddingBottom: '16px',
      borderBottom: '2px solid #f0f0f0'
    },
    title: { fontSize: '24px', fontWeight: 'bold', color: '#333', margin: 0 },
    closeBtn: { background: '#dc3545', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' },
    successBanner: { background: '#d4edda', color: '#155724', padding: '12px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center', fontSize: '14px' },
    table: { width: '100%', borderCollapse: 'collapse', marginBottom: '24px' },
    th: { border: '1px solid #ddd', padding: '12px', background: '#f8f9fa', textAlign: 'left', fontWeight: 'bold', fontSize: '14px' },
    td: { border: '1px solid #ddd', padding: '12px', textAlign: 'left', fontSize: '14px' },
    input: { padding: '8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', width: '120px' },
    editBtn: { background: '#2196f3', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', marginRight: '8px', fontSize: '12px' },
    saveBtn: { background: '#28a745', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', marginRight: '8px', fontSize: '12px' },
    cancelBtn: { background: '#6c757d', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' },
    savingText: { fontSize: '11px', color: '#666', marginLeft: '8px' }
  }

  const totalRevenueTarget = targets.reduce((sum, t) => sum + t.revenueTarget, 0)
  const totalCPTarget = targets.reduce((sum, t) => sum + t.cpTarget, 0)
  const totalActiveCPTarget = targets.reduce((sum, t) => sum + t.activeCPTarget, 0)

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>🎯 RM Target Management</h2>
        <button onClick={onClose} style={styles.closeBtn}>Close</button>
      </div>

      {saveSuccess && (
        <div style={styles.successBanner}>
          ✅ Targets updated successfully in database!
        </div>
      )}

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>RM Name</th>
            <th style={styles.th}>Revenue Target (₹/month)</th>
            <th style={styles.th}>CP Target (onboard/month)</th>
            <th style={styles.th}>Active CP Target (≥1 sale)</th>
            <th style={styles.th}>Current Achievement</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {targets.map(rm => (
            <tr key={rm.id}>
              <td style={styles.td}><strong>{rm.name}</strong></td>
              <td style={styles.td}>
                {editingId === rm.id ? (
                  <input type="number" value={editValues.revenueTarget} onChange={(e) => setEditValues({ ...editValues, revenueTarget: parseInt(e.target.value) || 0 })} style={styles.input} />
                ) : formatRupees(rm.revenueTarget)}
              </td>
              <td style={styles.td}>
                {editingId === rm.id ? (
                  <input type="number" value={editValues.cpTarget} onChange={(e) => setEditValues({ ...editValues, cpTarget: parseInt(e.target.value) || 0 })} style={styles.input} />
                ) : rm.cpTarget}
              </td>
              <td style={styles.td}>
                {editingId === rm.id ? (
                  <input type="number" value={editValues.activeCPTarget} onChange={(e) => setEditValues({ ...editValues, activeCPTarget: parseInt(e.target.value) || 0 })} style={styles.input} />
                ) : rm.activeCPTarget}
              </td>
              <td style={styles.td}>
                <span style={{ color: rm.monthlyAchievement >= 75 ? '#28a745' : rm.monthlyAchievement >= 50 ? '#ffc107' : '#dc3545', fontWeight: 'bold' }}>
                  {rm.monthlyAchievement?.toFixed(1) || 0}%
                </span>
                <div style={{ fontSize: '11px', color: '#666' }}>{formatRupees(rm.monthlyAchieved || 0)} achieved</div>
              </td>
              <td style={styles.td}>
                {editingId === rm.id ? (
                  <>
                    <button onClick={() => handleSave(rm.id)} disabled={saving} style={styles.saveBtn}>{saving ? 'Saving...' : 'Save'}</button>
                    <button onClick={() => setEditingId(null)} style={styles.cancelBtn}>Cancel</button>
                    {saving && <span style={styles.savingText}>Updating database...</span>}
                  </>
                ) : (
                  <button onClick={() => handleEdit(rm)} style={styles.editBtn}>✏️ Edit</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ background: '#e3f2fd', padding: '16px', borderRadius: '8px', marginTop: '20px' }}>
        <strong>📊 Monthly Targets Summary</strong><br />
        Total Revenue Target: {formatRupees(totalRevenueTarget)}<br />
        Total CP Target: {totalCPTarget}<br />
        Total Active CP Target: {totalActiveCPTarget}
      </div>
    </div>
  )
}

export default TargetManagement