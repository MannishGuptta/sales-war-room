import { useState } from 'react'

const TLManagement = ({ teamLeaders, rms, onUpdate, onClose }) => {
  const [tlList, setTlList] = useState(teamLeaders || [])
  const [editingId, setEditingId] = useState(null)
  const [editValues, setEditValues] = useState({})
  const [showAddForm, setShowAddForm] = useState(false)
  const [newTL, setNewTL] = useState({
    name: '',
    email: '',
    phone: '',
    region: '',
    team: [],
    monthlyTarget: 0
  })

  const formatRupees = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const handleAddTL = () => {
    if (!newTL.name || !newTL.email || !newTL.region) {
      alert('Please fill required fields')
      return
    }

    const newId = Math.max(...tlList.map(t => t.id), 0) + 1
    const tlData = {
      id: newId,
      name: newTL.name,
      email: newTL.email,
      phone: newTL.phone,
      region: newTL.region,
      team: newTL.team.map(id => parseInt(id)),
      monthlyTarget: parseInt(newTL.monthlyTarget) || 0,
      monthlyAchieved: 0,
      monthlyGap: parseInt(newTL.monthlyTarget) || 0,
      monthlyAchievement: 0,
      attendance: {
        totalDays: 22,
        presentDays: 0,
        absentDays: 0,
        lateDays: 0,
        lastLogin: new Date().toISOString(),
        loginHistory: []
      },
      meetings: [],
      escalationLevel: null
    }

    const updatedList = [...tlList, tlData]
    setTlList(updatedList)
    onUpdate(updatedList)
    setShowAddForm(false)
    setNewTL({ name: '', email: '', phone: '', region: '', team: [], monthlyTarget: 0 })
    alert('Team Leader added successfully!')
  }

  const handleEditTL = (tl) => {
    setEditingId(tl.id)
    setEditValues({
      name: tl.name,
      email: tl.email,
      phone: tl.phone,
      region: tl.region,
      team: tl.team,
      monthlyTarget: tl.monthlyTarget
    })
  }

  const handleSaveTL = (id) => {
    const updatedList = tlList.map(tl =>
      tl.id === id ? {
        ...tl,
        name: editValues.name,
        email: editValues.email,
        phone: editValues.phone,
        region: editValues.region,
        team: editValues.team,
        monthlyTarget: editValues.monthlyTarget,
        monthlyGap: editValues.monthlyTarget - tl.monthlyAchieved,
        monthlyAchievement: tl.monthlyAchieved > 0 ? (tl.monthlyAchieved / editValues.monthlyTarget) * 100 : 0
      } : tl
    )
    setTlList(updatedList)
    setEditingId(null)
    setEditValues({})
    onUpdate(updatedList)
    alert('Team Leader updated successfully!')
  }

  const handleDeleteTL = (id) => {
    const tl = tlList.find(t => t.id === id)
    if (window.confirm(`Are you sure you want to delete ${tl.name}? This will not delete the RMs but they will become unassigned.`)) {
      const updatedList = tlList.filter(tl => tl.id !== id)
      setTlList(updatedList)
      onUpdate(updatedList)
      alert('Team Leader deleted successfully!')
    }
  }

  const styles = {
    container: { background: 'white', borderRadius: '12px', padding: '24px', maxWidth: '1200px', margin: '0 auto', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '2px solid #f0f0f0' },
    title: { fontSize: '24px', fontWeight: 'bold', color: '#333', margin: 0 },
    closeBtn: { background: '#dc3545', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' },
    addBtn: { background: '#28a745', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold', marginBottom: '20px' },
    table: { width: '100%', borderCollapse: 'collapse', marginBottom: '24px', overflowX: 'auto', display: 'block' },
    th: { border: '1px solid #ddd', padding: '12px', background: '#f8f9fa', textAlign: 'left', fontWeight: 'bold', fontSize: '14px' },
    td: { border: '1px solid #ddd', padding: '12px', textAlign: 'left', fontSize: '14px' },
    input: { padding: '8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', width: '100%' },
    select: { padding: '8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', width: '100%' },
    editBtn: { background: '#2196f3', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', marginRight: '5px', fontSize: '12px' },
    deleteBtn: { background: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' },
    saveBtn: { background: '#28a745', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', marginRight: '5px', fontSize: '12px' },
    cancelBtn: { background: '#6c757d', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' },
    formContainer: { background: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '20px' },
    formGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '15px' },
    formLabel: { fontSize: '14px', fontWeight: '500', marginBottom: '5px', display: 'block' },
    formInput: { width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' },
    formSelect: { width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' },
    submitBtn: { background: '#28a745', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', marginRight: '10px' },
    cancelFormBtn: { background: '#6c757d', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>👥 Team Leader Management</h2>
        <button onClick={onClose} style={styles.closeBtn}>Close</button>
      </div>

      <button style={styles.addBtn} onClick={() => setShowAddForm(!showAddForm)}>+ Add New Team Leader</button>

      {showAddForm && (
        <div style={styles.formContainer}>
          <h3 style={{ marginBottom: '15px' }}>Add New Team Leader</h3>
          <div style={styles.formGrid}>
            <div><label style={styles.formLabel}>Name *</label><input type="text" style={styles.formInput} value={newTL.name} onChange={(e) => setNewTL({ ...newTL, name: e.target.value })} placeholder="Enter name" /></div>
            <div><label style={styles.formLabel}>Email *</label><input type="email" style={styles.formInput} value={newTL.email} onChange={(e) => setNewTL({ ...newTL, email: e.target.value })} placeholder="Enter email" /></div>
            <div><label style={styles.formLabel}>Phone</label><input type="text" style={styles.formInput} value={newTL.phone} onChange={(e) => setNewTL({ ...newTL, phone: e.target.value })} placeholder="Enter phone" /></div>
            <div><label style={styles.formLabel}>Region *</label><input type="text" style={styles.formInput} value={newTL.region} onChange={(e) => setNewTL({ ...newTL, region: e.target.value })} placeholder="e.g., North Zone" /></div>
            <div><label style={styles.formLabel}>Monthly Target (₹)</label><input type="number" style={styles.formInput} value={newTL.monthlyTarget} onChange={(e) => setNewTL({ ...newTL, monthlyTarget: e.target.value })} placeholder="Enter target" /></div>
            <div><label style={styles.formLabel}>Assign RMs</label><select multiple style={styles.formSelect} value={newTL.team} onChange={(e) => setNewTL({ ...newTL, team: Array.from(e.target.selectedOptions, option => option.value) })}><option value="">Select RMs</option>{rms.map(rm => (<option key={rm.id} value={rm.id}>{rm.name}</option>))}</select><small style={{ fontSize: '11px', color: '#666' }}>Hold Ctrl/Cmd to select multiple</small></div>
          </div>
          <div><button onClick={handleAddTL} style={styles.submitBtn}>Add Team Leader</button><button onClick={() => setShowAddForm(false)} style={styles.cancelFormBtn}>Cancel</button></div>
        </div>
      )}

      <div style={{ overflowX: 'auto' }}>
        <table style={styles.table}>
          <thead><tr><th style={styles.th}>ID</th><th style={styles.th}>Name</th><th style={styles.th}>Email</th><th style={styles.th}>Phone</th><th style={styles.th}>Region</th><th style={styles.th}>Team Size</th><th style={styles.th}>Target (₹)</th><th style={styles.th}>Achievement</th><th style={styles.th}>Actions</th></tr></thead>
          <tbody>
            {tlList.map(tl => (
              <tr key={tl.id}>
                <td style={styles.td}>{tl.id}   </td>
                <td style={styles.td}>{editingId === tl.id ? <input type="text" style={styles.input} value={editValues.name || ''} onChange={(e) => setEditValues({ ...editValues, name: e.target.value })} /> : tl.name}</td>
                <td style={styles.td}>{editingId === tl.id ? <input type="email" style={styles.input} value={editValues.email || ''} onChange={(e) => setEditValues({ ...editValues, email: e.target.value })} /> : tl.email}</td>
                <td style={styles.td}>{editingId === tl.id ? <input type="text" style={styles.input} value={editValues.phone || ''} onChange={(e) => setEditValues({ ...editValues, phone: e.target.value })} /> : tl.phone || '-'}</td>
                <td style={styles.td}>{editingId === tl.id ? <input type="text" style={styles.input} value={editValues.region || ''} onChange={(e) => setEditValues({ ...editValues, region: e.target.value })} /> : tl.region}</td>
                <td style={styles.td}>{tl.team?.length || 0}</td>
                <td style={styles.td}>{editingId === tl.id ? <input type="number" style={styles.input} value={editValues.monthlyTarget || ''} onChange={(e) => setEditValues({ ...editValues, monthlyTarget: e.target.value })} /> : formatRupees(tl.monthlyTarget)}</td>
                <td style={styles.td}>{tl.monthlyAchievement.toFixed(1)}%</td>
                <td style={styles.td}>{editingId === tl.id ? <><button onClick={() => handleSaveTL(tl.id)} style={styles.saveBtn}>Save</button><button onClick={() => setEditingId(null)} style={styles.cancelBtn}>Cancel</button></> : <><button onClick={() => handleEditTL(tl)} style={styles.editBtn}>Edit</button><button onClick={() => handleDeleteTL(tl.id)} style={styles.deleteBtn}>Delete</button></>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default TLManagement