import { useState } from 'react'

const TargetManagement = ({ rms, onUpdateTargets, onClose }) => {
  const [targets, setTargets] = useState(rms.map(rm => ({
    id: rm.id,
    name: rm.name,
    revenueTarget: rm.monthlyTarget,
    cpTarget: rm.cpTarget,
    activeCPTarget: rm.activeCPTarget
  })))
  
  const [editingId, setEditingId] = useState(null)
  const [editValues, setEditValues] = useState({})

  const handleEdit = (rm) => {
    setEditingId(rm.id)
    setEditValues({
      revenueTarget: rm.revenueTarget,
      cpTarget: rm.cpTarget,
      activeCPTarget: rm.activeCPTarget
    })
  }

  const handleSave = (id) => {
    const updatedTargets = targets.map(t => 
      t.id === id ? { ...t, ...editValues } : t
    )
    setTargets(updatedTargets)
    setEditingId(null)
    onUpdateTargets(updatedTargets)
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditValues({})
  }

  const handleInputChange = (field, value) => {
    setEditValues({
      ...editValues,
      [field]: parseInt(value) || 0
    })
  }

  const formatRupees = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
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
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#333',
      margin: 0
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
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginBottom: '24px'
    },
    th: {
      border: '1px solid #ddd',
      padding: '12px',
      background: '#f8f9fa',
      textAlign: 'left',
      fontWeight: 'bold',
      fontSize: '14px'
    },
    td: {
      border: '1px solid #ddd',
      padding: '12px',
      textAlign: 'left',
      fontSize: '14px'
    },
    input: {
      padding: '8px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '14px',
      width: '120px'
    },
    editBtn: {
      background: '#2196f3',
      color: 'white',
      border: 'none',
      padding: '6px 12px',
      borderRadius: '4px',
      cursor: 'pointer',
      marginRight: '8px',
      fontSize: '12px'
    },
    saveBtn: {
      background: '#28a745',
      color: 'white',
      border: 'none',
      padding: '6px 12px',
      borderRadius: '4px',
      cursor: 'pointer',
      marginRight: '8px',
      fontSize: '12px'
    },
    cancelBtn: {
      background: '#6c757d',
      color: 'white',
      border: 'none',
      padding: '6px 12px',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '12px'
    },
    summary: {
      background: '#e3f2fd',
      padding: '16px',
      borderRadius: '8px',
      marginTop: '20px'
    },
    summaryTitle: {
      fontWeight: 'bold',
      marginBottom: '12px',
      fontSize: '16px'
    },
    summaryGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '16px'
    },
    summaryItem: {
      textAlign: 'center'
    },
    summaryLabel: {
      fontSize: '12px',
      color: '#666',
      marginBottom: '4px'
    },
    summaryValue: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: '#333'
    }
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

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>RM Name</th>
            <th style={styles.th}>Revenue Target (₹/month)</th>
            <th style={styles.th}>CP Target (onboard/month)</th>
            <th style={styles.th}>Active CP Target (≥1 sale)</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {targets.map(rm => (
            <tr key={rm.id}>
              <td style={styles.td}>
                <strong>{rm.name}</strong>
              </td>
              <td style={styles.td}>
                {editingId === rm.id ? (
                  <input
                    type="number"
                    value={editValues.revenueTarget}
                    onChange={(e) => handleInputChange('revenueTarget', e.target.value)}
                    style={styles.input}
                  />
                ) : (
                  formatRupees(rm.revenueTarget)
                )}
              </td>
              <td style={styles.td}>
                {editingId === rm.id ? (
                  <input
                    type="number"
                    value={editValues.cpTarget}
                    onChange={(e) => handleInputChange('cpTarget', e.target.value)}
                    style={styles.input}
                  />
                ) : (
                  rm.cpTarget
                )}
              </td>
              <td style={styles.td}>
                {editingId === rm.id ? (
                  <input
                    type="number"
                    value={editValues.activeCPTarget}
                    onChange={(e) => handleInputChange('activeCPTarget', e.target.value)}
                    style={styles.input}
                  />
                ) : (
                  rm.activeCPTarget
                )}
              </td>
              <td style={styles.td}>
                {editingId === rm.id ? (
                  <>
                    <button onClick={() => handleSave(rm.id)} style={styles.saveBtn}>Save</button>
                    <button onClick={handleCancel} style={styles.cancelBtn}>Cancel</button>
                  </>
                ) : (
                  <button onClick={() => handleEdit(rm)} style={styles.editBtn}>✏️ Edit</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={styles.summary}>
        <div style={styles.summaryTitle}>📊 Monthly Targets Summary</div>
        <div style={styles.summaryGrid}>
          <div style={styles.summaryItem}>
            <div style={styles.summaryLabel}>Total Revenue Target</div>
            <div style={styles.summaryValue}>{formatRupees(totalRevenueTarget)}</div>
          </div>
          <div style={styles.summaryItem}>
            <div style={styles.summaryLabel}>Total CP Target</div>
            <div style={styles.summaryValue}>{totalCPTarget}</div>
          </div>
          <div style={styles.summaryItem}>
            <div style={styles.summaryLabel}>Total Active CP Target</div>
            <div style={styles.summaryValue}>{totalActiveCPTarget}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TargetManagement