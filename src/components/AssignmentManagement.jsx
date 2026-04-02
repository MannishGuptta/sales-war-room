import { useState } from 'react'

const AssignmentManagement = ({ rms, teamLeaders, cps, onUpdate, onClose }) => {
  const [activeAssignmentTab, setActiveAssignmentTab] = useState('rm-to-tl')
  const [selectedRM, setSelectedRM] = useState('')
  const [selectedTL, setSelectedTL] = useState('')
  const [selectedCP, setSelectedCP] = useState('')
  const [selectedRMForCP, setSelectedRMForCP] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleAssignRMToTL = () => {
    if (!selectedRM || !selectedTL) {
      setError('Please select both RM and Team Leader')
      return
    }

    const tlIndex = teamLeaders.findIndex(tl => tl.id === parseInt(selectedTL))
    if (tlIndex === -1) {
      setError('Team Leader not found')
      return
    }

    const rmId = parseInt(selectedRM)
    const updatedTLs = [...teamLeaders]
    
    // Remove RM from all TLs first
    updatedTLs.forEach(tl => {
      tl.team = tl.team.filter(id => id !== rmId)
    })
    
    // Add RM to selected TL
    if (!updatedTLs[tlIndex].team.includes(rmId)) {
      updatedTLs[tlIndex].team.push(rmId)
    }
    
    onUpdate({ teamLeaders: updatedTLs })
    setMessage(`RM assigned to ${updatedTLs[tlIndex].name} successfully!`)
    setSelectedRM('')
    setSelectedTL('')
    setTimeout(() => setMessage(''), 3000)
  }

  const handleAssignCPToRM = () => {
    if (!selectedCP || !selectedRMForCP) {
      setError('Please select both CP and RM')
      return
    }

    const rmId = parseInt(selectedRMForCP)
    const cpId = parseInt(selectedCP)
    
    // Update CP assignment in localStorage
    const storedCPs = localStorage.getItem(`cps_${rmId}`)
    let existingCPs = storedCPs ? JSON.parse(storedCPs) : []
    
    const cpExists = existingCPs.find(cp => cp.id === cpId)
    if (cpExists) {
      setError('This CP is already assigned to this RM')
      return
    }
    
    // Find CP details
    const cpToAssign = cps.find(cp => cp.id === cpId)
    if (!cpToAssign) {
      setError('CP not found')
      return
    }
    
    const newCP = {
      ...cpToAssign,
      rmId: rmId,
      rmName: rms.find(rm => rm.id === rmId)?.name || 'Unknown'
    }
    
    existingCPs.push(newCP)
    localStorage.setItem(`cps_${rmId}`, JSON.stringify(existingCPs))
    
    // Also update in the global CPs list
    const updatedCPs = cps.map(cp => 
      cp.id === cpId ? { ...cp, rmId: rmId, rmName: rms.find(rm => rm.id === rmId)?.name } : cp
    )
    
    setMessage(`CP assigned to RM successfully!`)
    setSelectedCP('')
    setSelectedRMForCP('')
    setTimeout(() => setMessage(''), 3000)
    
    // Trigger update
    onUpdate({ cps: updatedCPs })
  }

  const getUnassignedRMs = () => {
    const assignedRMIds = teamLeaders.flatMap(tl => tl.team)
    return rms.filter(rm => !assignedRMIds.includes(rm.id))
  }

  const getRMsByTL = (tlId) => {
    const tl = teamLeaders.find(t => t.id === tlId)
    if (!tl) return []
    return rms.filter(rm => tl.team.includes(rm.id))
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
    tabs: {
      display: 'flex',
      gap: '10px',
      marginBottom: '24px',
      borderBottom: '2px solid #f0f0f0'
    },
    tab: {
      padding: '10px 20px',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: '500',
      color: '#666',
      transition: 'all 0.3s ease'
    },
    activeTab: {
      color: '#2196f3',
      borderBottom: '3px solid #2196f3',
      marginBottom: '-2px'
    },
    formCard: {
      background: '#f8f9fa',
      padding: '20px',
      borderRadius: '8px',
      marginBottom: '30px'
    },
    formTitle: {
      fontSize: '18px',
      fontWeight: 'bold',
      marginBottom: '15px'
    },
    formGroup: {
      marginBottom: '15px'
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      fontWeight: '500',
      color: '#333'
    },
    select: {
      width: '100%',
      padding: '10px',
      border: '1px solid #ddd',
      borderRadius: '6px',
      fontSize: '14px'
    },
    button: {
      background: '#28a745',
      color: 'white',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: 'bold'
    },
    successMessage: {
      background: '#d4edda',
      color: '#155724',
      padding: '10px',
      borderRadius: '4px',
      marginBottom: '20px'
    },
    errorMessage: {
      background: '#f8d7da',
      color: '#721c24',
      padding: '10px',
      borderRadius: '4px',
      marginBottom: '20px'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginTop: '20px',
      overflowX: 'auto',
      display: 'block'
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
      padding: '10px',
      textAlign: 'left',
      fontSize: '14px'
    },
    subHeader: {
      fontSize: '16px',
      fontWeight: 'bold',
      marginTop: '20px',
      marginBottom: '10px'
    }
  }

  const unassignedRMs = getUnassignedRMs()

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>🔄 Assignment Management</h2>
        <button onClick={onClose} style={styles.closeBtn}>Close</button>
      </div>

      {message && <div style={styles.successMessage}>{message}</div>}
      {error && <div style={styles.errorMessage}>{error}</div>}

      <div style={styles.tabs}>
        <button
          style={{ ...styles.tab, ...(activeAssignmentTab === 'rm-to-tl' ? styles.activeTab : {}) }}
          onClick={() => setActiveAssignmentTab('rm-to-tl')}
        >
          👥 RM to Team Leader
        </button>
        <button
          style={{ ...styles.tab, ...(activeAssignmentTab === 'cp-to-rm' ? styles.activeTab : {}) }}
          onClick={() => setActiveAssignmentTab('cp-to-rm')}
        >
          🤝 CP to RM
        </button>
        <button
          style={{ ...styles.tab, ...(activeAssignmentTab === 'view' ? styles.activeTab : {}) }}
          onClick={() => setActiveAssignmentTab('view')}
        >
          📋 View Assignments
        </button>
      </div>

      {/* RM to TL Assignment */}
      {activeAssignmentTab === 'rm-to-tl' && (
        <div>
          <div style={styles.formCard}>
            <h3 style={styles.formTitle}>Assign RM to Team Leader</h3>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Select RM</label>
              <select
                style={styles.select}
                value={selectedRM}
                onChange={(e) => setSelectedRM(e.target.value)}
              >
                <option value="">Select RM</option>
                {unassignedRMs.map(rm => (
                  <option key={rm.id} value={rm.id}>{rm.name}</option>
                ))}
              </select>
              {unassignedRMs.length === 0 && (
                <small style={{ color: '#28a745' }}>All RMs are assigned to Team Leaders!</small>
              )}
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Select Team Leader</label>
              <select
                style={styles.select}
                value={selectedTL}
                onChange={(e) => setSelectedTL(e.target.value)}
              >
                <option value="">Select Team Leader</option>
                {teamLeaders.map(tl => (
                  <option key={tl.id} value={tl.id}>{tl.name} ({tl.region}) - Current Team: {tl.team?.length || 0} RMs</option>
                ))}
              </select>
            </div>

            <button style={styles.button} onClick={handleAssignRMToTL}>
              Assign RM to Team Leader
            </button>
          </div>

          <h3 style={styles.subHeader}>Current Team Leader Assignments</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Team Leader</th>
                  <th style={styles.th}>Region</th>
                  <th style={styles.th}>Assigned RMs</th>
                  <th style={styles.th}>Team Size</th>
                </tr>
              </thead>
              <tbody>
                {teamLeaders.map(tl => {
                  const teamRMs = rms.filter(rm => tl.team.includes(rm.id))
                  return (
                    <tr key={tl.id}>
                      <td style={styles.td}>{tl.name}</td>
                      <td style={styles.td}>{tl.region}</td>
                      <td style={styles.td}>
                        {teamRMs.length > 0 ? teamRMs.map(rm => rm.name).join(', ') : 'No RMs assigned'}
                      </td>
                      <td style={styles.td}>{teamRMs.length}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CP to RM Assignment */}
      {activeAssignmentTab === 'cp-to-rm' && (
        <div>
          <div style={styles.formCard}>
            <h3 style={styles.formTitle}>Assign Channel Partner to RM</h3>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Select Channel Partner</label>
              <select
                style={styles.select}
                value={selectedCP}
                onChange={(e) => setSelectedCP(e.target.value)}
              >
                <option value="">Select CP</option>
                {cps.map(cp => (
                  <option key={cp.id} value={cp.id}>{cp.name} {cp.rmId ? `(Currently: ${cp.rmName})` : '(Unassigned)'}</option>
                ))}
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Select RM</label>
              <select
                style={styles.select}
                value={selectedRMForCP}
                onChange={(e) => setSelectedRMForCP(e.target.value)}
              >
                <option value="">Select RM</option>
                {rms.map(rm => (
                  <option key={rm.id} value={rm.id}>{rm.name}</option>
                ))}
              </select>
            </div>

            <button style={styles.button} onClick={handleAssignCPToRM}>
              Assign CP to RM
            </button>
          </div>

          <h3 style={styles.subHeader}>Current CP Assignments by RM</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>RM Name</th>
                  <th style={styles.th}>Assigned Channel Partners</th>
                  <th style={styles.th}>Total CPs</th>
                </tr>
              </thead>
              <tbody>
                {rms.map(rm => {
                  const rmCPs = cps.filter(cp => cp.rmId === rm.id)
                  return (
                    <tr key={rm.id}>
                      <td style={styles.td}>{rm.name}</td>
                      <td style={styles.td}>
                        {rmCPs.length > 0 ? rmCPs.map(cp => cp.name).join(', ') : 'No CPs assigned'}
                      </td>
                      <td style={styles.td}>{rmCPs.length}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View Assignments Tab */}
      {activeAssignmentTab === 'view' && (
        <div>
          <h3 style={styles.subHeader}>Complete Organization Structure</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Team Leader</th>
                  <th style={styles.th}>Region</th>
                  <th style={styles.th}>RM Name</th>
                  <th style={styles.th}>Assigned CPs</th>
                  <th style={styles.th}>CP Count</th>
                </tr>
              </thead>
              <tbody>
                {teamLeaders.map(tl => {
                  const teamRMs = rms.filter(rm => tl.team.includes(rm.id))
                  if (teamRMs.length === 0) {
                    return (
                      <tr key={`${tl.id}-empty`}>
                        <td style={styles.td}>{tl.name}</td>
                        <td style={styles.td}>{tl.region}</td>
                        <td colSpan="3" style={styles.td}>No RMs assigned</td>
                      </tr>
                    )
                  }
                  return teamRMs.map((rm, idx) => {
                    const rmCPs = cps.filter(cp => cp.rmId === rm.id)
                    return (
                      <tr key={rm.id}>
                        {idx === 0 && (
                          <>
                            <td rowSpan={teamRMs.length} style={styles.td}>{tl.name}</td>
                            <td rowSpan={teamRMs.length} style={styles.td}>{tl.region}</td>
                          </>
                        )}
                        <td style={styles.td}>{rm.name}</td>
                        <td style={styles.td}>
                          {rmCPs.length > 0 ? rmCPs.map(cp => cp.name).join(', ') : 'No CPs'}
                        </td>
                        <td style={styles.td}>{rmCPs.length}</td>
                      </tr>
                    )
                  })
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default AssignmentManagement