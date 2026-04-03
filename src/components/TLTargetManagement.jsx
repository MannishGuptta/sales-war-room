import { useState } from 'react'
import { supabase } from '../supabaseClient'

const TLTargetManagement = ({ teamLeaders, onUpdate, onClose }) => {
  const [tlList, setTlList] = useState(teamLeaders || [])
  const [editingId, setEditingId] = useState(null)
  const [editValues, setEditValues] = useState({})
  const [selectedTL, setSelectedTL] = useState(null)
  const [showTargetHistory, setShowTargetHistory] = useState(false)
  const [saving, setSaving] = useState(false)

  const formatRupees = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const handleEditTarget = (tl) => {
    setEditingId(tl.id)
    setEditValues({
      monthlyTarget: tl.monthlyTarget,
      monthlyAchieved: tl.monthlyAchieved
    })
  }

  const handleSaveTarget = async (id) => {
    setSaving(true)
    const updatedList = tlList.map(tl =>
      tl.id === id ? {
        ...tl,
        monthlyTarget: parseInt(editValues.monthlyTarget) || 0,
        monthlyAchieved: parseInt(editValues.monthlyAchieved) || tl.monthlyAchieved,
        monthlyGap: (parseInt(editValues.monthlyTarget) || 0) - tl.monthlyAchieved,
        monthlyAchievement: tl.monthlyAchieved > 0 ? (tl.monthlyAchieved / (parseInt(editValues.monthlyTarget) || 1)) * 100 : 0
      } : tl
    )
    setTlList(updatedList)
    setEditingId(null)
    setEditValues({})
    
    const tlToUpdate = updatedList.find(tl => tl.id === id)
    try {
      const { error } = await supabase
        .from('team_leaders')
        .update({
          monthly_target: tlToUpdate.monthlyTarget,
          monthly_achieved: tlToUpdate.monthlyAchieved
        })
        .eq('id', id)
      
      if (error) throw error
      alert('Target updated successfully!')
      onUpdate(updatedList)
    } catch (error) {
      console.error('Error saving TL targets:', error)
      alert('Error saving targets. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const getStatusColor = (achievement) => {
    if (achievement >= 75) return '#28a745'
    if (achievement >= 50) return '#ffc107'
    return '#dc3545'
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
    subtitle: { fontSize: '14px', color: '#666', marginTop: '5px' },
    closeBtn: { background: '#dc3545', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' },
    statCard: { background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)', color: 'white', padding: '20px', borderRadius: '12px', textAlign: 'center' },
    statLabel: { fontSize: '13px', opacity: 0.9, marginBottom: '8px', textTransform: 'uppercase' },
    statValue: { fontSize: '28px', fontWeight: 'bold' },
    table: { width: '100%', borderCollapse: 'collapse', marginTop: '20px' },
    th: { border: '1px solid #ddd', padding: '12px', background: '#f8f9fa', textAlign: 'left', fontWeight: 'bold', fontSize: '14px' },
    td: { border: '1px solid #ddd', padding: '12px', textAlign: 'left', fontSize: '14px' },
    input: { padding: '8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', width: '120px' },
    editBtn: { background: '#2196f3', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', marginRight: '5px', fontSize: '12px' },
    saveBtn: { background: '#28a745', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', marginRight: '5px', fontSize: '12px' },
    cancelBtn: { background: '#6c757d', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' },
    viewBtn: { background: '#17a2b8', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' },
    progressBar: { height: '8px', background: '#e0e0e0', borderRadius: '4px', overflow: 'hidden', marginTop: '8px' },
    progressFill: { height: '100%', borderRadius: '4px', transition: 'width 0.3s ease' },
    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
    modalContent: { background: 'white', borderRadius: '12px', padding: '24px', maxWidth: '500px', width: '90%' },
    modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '10px', borderBottom: '2px solid #f0f0f0' },
    modalTitle: { fontSize: '18px', fontWeight: 'bold' },
    modalCloseBtn: { background: '#dc3545', color: 'white', border: 'none', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer' }
  }

  const totalTarget = tlList.reduce((sum, tl) => sum + tl.monthlyTarget, 0)
  const totalAchieved = tlList.reduce((sum, tl) => sum + tl.monthlyAchieved, 0)
  const overallAchievement = totalTarget > 0 ? (totalAchieved / totalTarget) * 100 : 0

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>🎯 Team Leader Targets</h2>
          <p style={styles.subtitle}>Manage monthly targets for all Team Leaders</p>
        </div>
        <button onClick={onClose} style={styles.closeBtn}>Close</button>
      </div>

      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Total TL Target</div>
          <div style={styles.statValue}>{formatRupees(totalTarget)}</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Total TL Achieved</div>
          <div style={styles.statValue}>{formatRupees(totalAchieved)}</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Overall Achievement</div>
          <div style={styles.statValue}>{overallAchievement.toFixed(1)}%</div>
          <div style={styles.progressBar}>
            <div style={{ ...styles.progressFill, width: `${Math.min(overallAchievement, 100)}%`, background: getStatusColor(overallAchievement) }} />
          </div>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Team Leader</th>
              <th style={styles.th}>Region</th>
              <th style={styles.th}>Team Size</th>
              <th style={styles.th}>Target (₹)</th>
              <th style={styles.th}>Achieved (₹)</th>
              <th style={styles.th}>Gap (₹)</th>
              <th style={styles.th}>Achievement %</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tlList.map(tl => {
              const achievementPercent = tl.monthlyAchievement || 0
              const statusColor = getStatusColor(achievementPercent)
              return (
                <tr key={tl.id}>
                  <td style={styles.td}><strong>{tl.name}</strong></td>
                  <td style={styles.td}>{tl.region}</td>
                  <td style={styles.td}>{tl.team?.length || 0}</td>
                  <td style={styles.td}>
                    {editingId === tl.id ? (
                      <input type="number" style={styles.input} value={editValues.monthlyTarget || ''} onChange={(e) => setEditValues({ ...editValues, monthlyTarget: e.target.value })} />
                    ) : formatRupees(tl.monthlyTarget)}
                  </td>
                  <td style={styles.td}>
                    {editingId === tl.id ? (
                      <input type="number" style={styles.input} value={editValues.monthlyAchieved || ''} onChange={(e) => setEditValues({ ...editValues, monthlyAchieved: e.target.value })} />
                    ) : formatRupees(tl.monthlyAchieved)}
                  </td>
                  <td style={styles.td}>{formatRupees(tl.monthlyGap)}</td>
                  <td style={styles.td}>
                    <span style={{ color: statusColor, fontWeight: 'bold' }}>{achievementPercent.toFixed(1)}%</span>
                    <div style={styles.progressBar}>
                      <div style={{ ...styles.progressFill, width: `${Math.min(achievementPercent, 100)}%`, background: statusColor }} />
                    </div>
                  </td>
                  <td style={styles.td}>
                    <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: statusColor, marginRight: '8px' }}></span>
                    {achievementPercent >= 75 ? 'Excellent' : achievementPercent >= 50 ? 'On Track' : 'Needs Attention'}
                  </td>
                  <td style={styles.td}>
                    {editingId === tl.id ? (
                      <>
                        <button onClick={() => handleSaveTarget(tl.id)} disabled={saving} style={styles.saveBtn}>Save</button>
                        <button onClick={() => setEditingId(null)} style={styles.cancelBtn}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleEditTarget(tl)} style={styles.editBtn}>Edit</button>
                        <button onClick={() => { setSelectedTL(tl); setShowTargetHistory(true); }} style={styles.viewBtn}>History</button>
                      </>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {showTargetHistory && selectedTL && (
        <div style={styles.modalOverlay} onClick={() => setShowTargetHistory(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>📊 {selectedTL.name} - Target Details</h3>
              <button onClick={() => setShowTargetHistory(false)} style={styles.modalCloseBtn}>Close</button>
            </div>
            <div style={{ padding: '10px' }}>
              <p><strong>Current Target:</strong> {formatRupees(selectedTL.monthlyTarget)}</p>
              <p><strong>Current Achieved:</strong> {formatRupees(selectedTL.monthlyAchieved)}</p>
              <p><strong>Current Gap:</strong> {formatRupees(selectedTL.monthlyGap)}</p>
              <p><strong>Achievement Rate:</strong> {selectedTL.monthlyAchievement.toFixed(1)}%</p>
              <p><strong>Team Size:</strong> {selectedTL.team?.length || 0} RMs</p>
              <p><strong>Region:</strong> {selectedTL.region}</p>
              <hr style={{ margin: '15px 0' }} />
              <h4>💡 Recommendations:</h4>
              {selectedTL.monthlyAchievement < 50 && (
                <p style={{ color: '#dc3545' }}>⚠️ Critical: Need immediate intervention. Schedule weekly review meetings.</p>
              )}
              {selectedTL.monthlyAchievement >= 50 && selectedTL.monthlyAchievement < 75 && (
                <p style={{ color: '#ffc107' }}>⚠️ Warning: Below target. Focus on underperforming RMs in team.</p>
              )}
              {selectedTL.monthlyAchievement >= 75 && (
                <p style={{ color: '#28a745' }}>✅ Good: Team is performing well. Consider recognizing top performers.</p>
              )}
              {selectedTL.team?.length === 0 && (
                <p style={{ color: '#dc3545' }}>⚠️ No RMs assigned to this Team Leader. Please assign RMs.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TLTargetManagement