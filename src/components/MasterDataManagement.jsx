import { useState } from 'react'

const MasterDataManagement = ({ rms, cps, sales, onUpdateData, onClose }) => {
  const [activeMasterTab, setActiveMasterTab] = useState('rms') // 'rms', 'cps', 'sales'
  const [editingItem, setEditingItem] = useState(null)
  const [editValues, setEditValues] = useState({})
  const [showAddForm, setShowAddForm] = useState(false)
  const [newItem, setNewItem] = useState({})

  // RM Management
  const [rmList, setRmList] = useState(rms || [])
  
  // CP Management
  const [cpList, setCpList] = useState(cps || [
    { id: 1, name: 'Tech Solutions', rmId: 1, rmName: 'John Smith', status: 'active', onboardedDate: '2024-03-01', salesCount: 5 },
    { id: 2, name: 'Digital Innovations', rmId: 1, rmName: 'John Smith', status: 'active', onboardedDate: '2024-03-05', salesCount: 3 },
    { id: 3, name: 'Business Hub', rmId: 2, rmName: 'Sarah Johnson', status: 'active', onboardedDate: '2024-03-02', salesCount: 8 },
    { id: 4, name: 'Global Traders', rmId: 2, rmName: 'Sarah Johnson', status: 'inactive', onboardedDate: '2024-03-10', salesCount: 0 },
    { id: 5, name: 'Smart Enterprises', rmId: 3, rmName: 'Mike Brown', status: 'active', onboardedDate: '2024-03-01', salesCount: 2 },
    { id: 6, name: 'Vision Corp', rmId: 4, rmName: 'Emma Wilson', status: 'active', onboardedDate: '2024-03-03', salesCount: 1 },
    { id: 7, name: 'Peak Performance', rmId: 5, rmName: 'James Davis', status: 'active', onboardedDate: '2024-03-04', salesCount: 4 },
  ])

  // Sales Management
  const [salesList, setSalesList] = useState(sales || [
    { id: 1, rmId: 1, rmName: 'John Smith', cpId: 1, cpName: 'Tech Solutions', amount: 50000, date: '2024-03-15', status: 'completed' },
    { id: 2, rmId: 1, rmName: 'John Smith', cpId: 2, cpName: 'Digital Innovations', amount: 35000, date: '2024-03-18', status: 'completed' },
    { id: 3, rmId: 2, rmName: 'Sarah Johnson', cpId: 3, cpName: 'Business Hub', amount: 75000, date: '2024-03-20', status: 'completed' },
    { id: 4, rmId: 3, rmName: 'Mike Brown', cpId: 5, cpName: 'Smart Enterprises', amount: 25000, date: '2024-03-10', status: 'completed' },
    { id: 5, rmId: 5, rmName: 'James Davis', cpId: 7, cpName: 'Peak Performance', amount: 45000, date: '2024-03-12', status: 'completed' },
  ])

  const formatRupees = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  // RM CRUD Operations
  const handleAddRM = () => {
    const newRM = {
      id: rmList.length + 1,
      name: newItem.name,
      monthlyTarget: parseInt(newItem.monthlyTarget) || 0,
      cpTarget: parseInt(newItem.cpTarget) || 0,
      activeCPTarget: parseInt(newItem.activeCPTarget) || 0,
      status: 'active',
      joinedDate: new Date().toISOString().split('T')[0]
    }
    setRmList([...rmList, newRM])
    setShowAddForm(false)
    setNewItem({})
    onUpdateData({ rms: [...rmList, newRM], cps: cpList, sales: salesList })
  }

  const handleEditRM = (rm) => {
    setEditingItem(rm.id)
    setEditValues({
      name: rm.name,
      monthlyTarget: rm.monthlyTarget,
      cpTarget: rm.cpTarget,
      activeCPTarget: rm.activeCPTarget
    })
  }

  const handleSaveRM = (id) => {
    const updatedRMs = rmList.map(rm => 
      rm.id === id ? { ...rm, ...editValues } : rm
    )
    setRmList(updatedRMs)
    setEditingItem(null)
    setEditValues({})
    onUpdateData({ rms: updatedRMs, cps: cpList, sales: salesList })
  }

  const handleDeleteRM = (id) => {
    if (window.confirm('Are you sure you want to delete this RM? This will also delete associated CPs and Sales.')) {
      const updatedRMs = rmList.filter(rm => rm.id !== id)
      const updatedCPs = cpList.filter(cp => cp.rmId !== id)
      const updatedSales = salesList.filter(sale => sale.rmId !== id)
      setRmList(updatedRMs)
      setCpList(updatedCPs)
      setSalesList(updatedSales)
      onUpdateData({ rms: updatedRMs, cps: updatedCPs, sales: updatedSales })
    }
  }

  // CP CRUD Operations
  const handleAddCP = () => {
    const rm = rmList.find(r => r.id === parseInt(newItem.rmId))
    const newCP = {
      id: cpList.length + 1,
      name: newItem.name,
      rmId: parseInt(newItem.rmId),
      rmName: rm ? rm.name : '',
      status: newItem.status || 'active',
      onboardedDate: new Date().toISOString().split('T')[0],
      salesCount: 0
    }
    setCpList([...cpList, newCP])
    setShowAddForm(false)
    setNewItem({})
    onUpdateData({ rms: rmList, cps: [...cpList, newCP], sales: salesList })
  }

  const handleEditCP = (cp) => {
    setEditingItem(cp.id)
    setEditValues({
      name: cp.name,
      rmId: cp.rmId,
      status: cp.status
    })
  }

  const handleSaveCP = (id) => {
    const rm = rmList.find(r => r.id === parseInt(editValues.rmId))
    const updatedCPs = cpList.map(cp => 
      cp.id === id ? { 
        ...cp, 
        name: editValues.name,
        rmId: parseInt(editValues.rmId),
        rmName: rm ? rm.name : '',
        status: editValues.status
      } : cp
    )
    setCpList(updatedCPs)
    setEditingItem(null)
    setEditValues({})
    onUpdateData({ rms: rmList, cps: updatedCPs, sales: salesList })
  }

  const handleDeleteCP = (id) => {
    if (window.confirm('Are you sure you want to delete this CP?')) {
      const updatedCPs = cpList.filter(cp => cp.id !== id)
      setCpList(updatedCPs)
      onUpdateData({ rms: rmList, cps: updatedCPs, sales: salesList })
    }
  }

  // Sales CRUD Operations
  const handleAddSale = () => {
    const cp = cpList.find(c => c.id === parseInt(newItem.cpId))
    const rm = rmList.find(r => r.id === (cp ? cp.rmId : null))
    const newSale = {
      id: salesList.length + 1,
      rmId: rm ? rm.id : null,
      rmName: rm ? rm.name : '',
      cpId: parseInt(newItem.cpId),
      cpName: cp ? cp.name : '',
      amount: parseInt(newItem.amount),
      date: newItem.date || new Date().toISOString().split('T')[0],
      status: 'completed'
    }
    setSalesList([...salesList, newSale])
    
    // Update CP sales count
    const updatedCPs = cpList.map(c => 
      c.id === parseInt(newItem.cpId) ? { ...c, salesCount: (c.salesCount || 0) + 1 } : c
    )
    setCpList(updatedCPs)
    
    setShowAddForm(false)
    setNewItem({})
    onUpdateData({ rms: rmList, cps: updatedCPs, sales: [...salesList, newSale] })
  }

  const handleDeleteSale = (id) => {
    if (window.confirm('Are you sure you want to delete this sale?')) {
      const updatedSales = salesList.filter(sale => sale.id !== id)
      setSalesList(updatedSales)
      onUpdateData({ rms: rmList, cps: cpList, sales: updatedSales })
    }
  }

  const styles = {
    container: {
      background: 'white',
      borderRadius: '12px',
      padding: '24px',
      maxWidth: '1400px',
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
    masterTabs: {
      display: 'flex',
      gap: '10px',
      marginBottom: '24px',
      borderBottom: '2px solid #f0f0f0'
    },
    masterTab: {
      padding: '10px 20px',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: '500',
      color: '#666',
      transition: 'all 0.3s ease'
    },
    activeMasterTab: {
      color: '#2196f3',
      borderBottom: '3px solid #2196f3',
      marginBottom: '-2px'
    },
    addBtn: {
      background: '#28a745',
      color: 'white',
      border: 'none',
      padding: '8px 16px',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: 'bold',
      marginBottom: '20px'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginBottom: '24px',
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
      padding: '12px',
      textAlign: 'left',
      fontSize: '14px'
    },
    input: {
      padding: '8px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '14px',
      width: '100%'
    },
    select: {
      padding: '8px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '14px',
      width: '100%'
    },
    editBtn: {
      background: '#2196f3',
      color: 'white',
      border: 'none',
      padding: '5px 10px',
      borderRadius: '4px',
      cursor: 'pointer',
      marginRight: '5px',
      fontSize: '12px'
    },
    deleteBtn: {
      background: '#dc3545',
      color: 'white',
      border: 'none',
      padding: '5px 10px',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '12px'
    },
    saveBtn: {
      background: '#28a745',
      color: 'white',
      border: 'none',
      padding: '5px 10px',
      borderRadius: '4px',
      cursor: 'pointer',
      marginRight: '5px',
      fontSize: '12px'
    },
    cancelBtn: {
      background: '#6c757d',
      color: 'white',
      border: 'none',
      padding: '5px 10px',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '12px'
    },
    formContainer: {
      background: '#f8f9fa',
      padding: '20px',
      borderRadius: '8px',
      marginBottom: '20px'
    },
    formGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '15px',
      marginBottom: '15px'
    },
    formLabel: {
      fontSize: '14px',
      fontWeight: '500',
      marginBottom: '5px',
      display: 'block'
    },
    formInput: {
      width: '100%',
      padding: '8px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '14px'
    },
    formActions: {
      display: 'flex',
      gap: '10px',
      justifyContent: 'flex-end'
    },
    submitBtn: {
      background: '#28a745',
      color: 'white',
      border: 'none',
      padding: '8px 16px',
      borderRadius: '4px',
      cursor: 'pointer'
    },
    cancelFormBtn: {
      background: '#6c757d',
      color: 'white',
      border: 'none',
      padding: '8px 16px',
      borderRadius: '4px',
      cursor: 'pointer'
    },
    statusBadge: {
      display: 'inline-block',
      padding: '3px 8px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: 'bold'
    },
    activeBadge: {
      background: '#d4edda',
      color: '#155724'
    },
    inactiveBadge: {
      background: '#f8d7da',
      color: '#721c24'
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>📋 Master Data Management</h2>
        <button onClick={onClose} style={styles.closeBtn}>Close</button>
      </div>

      {/* Master Tabs */}
      <div style={styles.masterTabs}>
        <button
          style={{
            ...styles.masterTab,
            ...(activeMasterTab === 'rms' ? styles.activeMasterTab : {})
          }}
          onClick={() => {
            setActiveMasterTab('rms')
            setShowAddForm(false)
          }}
        >
          👤 RMs ({rmList.length})
        </button>
        <button
          style={{
            ...styles.masterTab,
            ...(activeMasterTab === 'cps' ? styles.activeMasterTab : {})
          }}
          onClick={() => {
            setActiveMasterTab('cps')
            setShowAddForm(false)
          }}
        >
          🤝 Channel Partners ({cpList.length})
        </button>
        <button
          style={{
            ...styles.masterTab,
            ...(activeMasterTab === 'sales' ? styles.activeMasterTab : {})
          }}
          onClick={() => {
            setActiveMasterTab('sales')
            setShowAddForm(false)
          }}
        >
          💰 Sales Records ({salesList.length})
        </button>
      </div>

      {/* Add Button */}
      <button style={styles.addBtn} onClick={() => setShowAddForm(!showAddForm)}>
        + Add New {activeMasterTab === 'rms' ? 'RM' : activeMasterTab === 'cps' ? 'Channel Partner' : 'Sale'}
      </button>

      {/* Add Form */}
      {showAddForm && (
        <div style={styles.formContainer}>
          <h3 style={{ marginBottom: '15px' }}>
            Add New {activeMasterTab === 'rms' ? 'RM' : activeMasterTab === 'cps' ? 'Channel Partner' : 'Sale'}
          </h3>
          <div style={styles.formGrid}>
            {activeMasterTab === 'rms' && (
              <>
                <div>
                  <label style={styles.formLabel}>RM Name</label>
                  <input
                    type="text"
                    style={styles.formInput}
                    value={newItem.name || ''}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  />
                </div>
                <div>
                  <label style={styles.formLabel}>Monthly Target (₹)</label>
                  <input
                    type="number"
                    style={styles.formInput}
                    value={newItem.monthlyTarget || ''}
                    onChange={(e) => setNewItem({ ...newItem, monthlyTarget: e.target.value })}
                  />
                </div>
                <div>
                  <label style={styles.formLabel}>CP Target</label>
                  <input
                    type="number"
                    style={styles.formInput}
                    value={newItem.cpTarget || ''}
                    onChange={(e) => setNewItem({ ...newItem, cpTarget: e.target.value })}
                  />
                </div>
                <div>
                  <label style={styles.formLabel}>Active CP Target</label>
                  <input
                    type="number"
                    style={styles.formInput}
                    value={newItem.activeCPTarget || ''}
                    onChange={(e) => setNewItem({ ...newItem, activeCPTarget: e.target.value })}
                  />
                </div>
              </>
            )}

            {activeMasterTab === 'cps' && (
              <>
                <div>
                  <label style={styles.formLabel}>CP Name</label>
                  <input
                    type="text"
                    style={styles.formInput}
                    value={newItem.name || ''}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  />
                </div>
                <div>
                  <label style={styles.formLabel}>Assigned RM</label>
                  <select
                    style={styles.formInput}
                    value={newItem.rmId || ''}
                    onChange={(e) => setNewItem({ ...newItem, rmId: e.target.value })}
                  >
                    <option value="">Select RM</option>
                    {rmList.map(rm => (
                      <option key={rm.id} value={rm.id}>{rm.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={styles.formLabel}>Status</label>
                  <select
                    style={styles.formInput}
                    value={newItem.status || 'active'}
                    onChange={(e) => setNewItem({ ...newItem, status: e.target.value })}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </>
            )}

            {activeMasterTab === 'sales' && (
              <>
                <div>
                  <label style={styles.formLabel}>Channel Partner</label>
                  <select
                    style={styles.formInput}
                    value={newItem.cpId || ''}
                    onChange={(e) => setNewItem({ ...newItem, cpId: e.target.value })}
                  >
                    <option value="">Select CP</option>
                    {cpList.map(cp => (
                      <option key={cp.id} value={cp.id}>{cp.name} ({cp.rmName})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={styles.formLabel}>Sale Amount (₹)</label>
                  <input
                    type="number"
                    style={styles.formInput}
                    value={newItem.amount || ''}
                    onChange={(e) => setNewItem({ ...newItem, amount: e.target.value })}
                  />
                </div>
                <div>
                  <label style={styles.formLabel}>Sale Date</label>
                  <input
                    type="date"
                    style={styles.formInput}
                    value={newItem.date || new Date().toISOString().split('T')[0]}
                    onChange={(e) => setNewItem({ ...newItem, date: e.target.value })}
                  />
                </div>
              </>
            )}
          </div>
          <div style={styles.formActions}>
            <button style={styles.submitBtn} onClick={
              activeMasterTab === 'rms' ? handleAddRM : activeMasterTab === 'cps' ? handleAddCP : handleAddSale
            }>
              Add {activeMasterTab === 'rms' ? 'RM' : activeMasterTab === 'cps' ? 'CP' : 'Sale'}
            </button>
            <button style={styles.cancelFormBtn} onClick={() => setShowAddForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* RM Table */}
      {activeMasterTab === 'rms' && (
        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Monthly Target (₹)</th>
                <th style={styles.th}>CP Target</th>
                <th style={styles.th}>Active CP Target</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rmList.map(rm => (
                <tr key={rm.id}>
                  <td style={styles.td}>{rm.id}</td>
                  <td style={styles.td}>
                    {editingItem === rm.id ? (
                      <input
                        type="text"
                        style={styles.input}
                        value={editValues.name || ''}
                        onChange={(e) => setEditValues({ ...editValues, name: e.target.value })}
                      />
                    ) : rm.name}
                  </td>
                  <td style={styles.td}>
                    {editingItem === rm.id ? (
                      <input
                        type="number"
                        style={styles.input}
                        value={editValues.monthlyTarget || ''}
                        onChange={(e) => setEditValues({ ...editValues, monthlyTarget: e.target.value })}
                      />
                    ) : formatRupees(rm.monthlyTarget)}
                  </td>
                  <td style={styles.td}>
                    {editingItem === rm.id ? (
                      <input
                        type="number"
                        style={styles.input}
                        value={editValues.cpTarget || ''}
                        onChange={(e) => setEditValues({ ...editValues, cpTarget: e.target.value })}
                      />
                    ) : rm.cpTarget}
                  </td>
                  <td style={styles.td}>
                    {editingItem === rm.id ? (
                      <input
                        type="number"
                        style={styles.input}
                        value={editValues.activeCPTarget || ''}
                        onChange={(e) => setEditValues({ ...editValues, activeCPTarget: e.target.value })}
                      />
                    ) : rm.activeCPTarget}
                  </td>
                  <td style={styles.td}>
                    <span style={{...styles.statusBadge, ...(rm.status === 'active' ? styles.activeBadge : styles.inactiveBadge)}}>
                      {rm.status || 'active'}
                    </span>
                  </td>
                  <td style={styles.td}>
                    {editingItem === rm.id ? (
                      <>
                        <button onClick={() => handleSaveRM(rm.id)} style={styles.saveBtn}>Save</button>
                        <button onClick={() => setEditingItem(null)} style={styles.cancelBtn}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleEditRM(rm)} style={styles.editBtn}>Edit</button>
                        <button onClick={() => handleDeleteRM(rm.id)} style={styles.deleteBtn}>Delete</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* CP Table */}
      {activeMasterTab === 'cps' && (
        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>CP Name</th>
                <th style={styles.th}>Assigned RM</th>
                <th style={styles.th}>Onboarded Date</th>
                <th style={styles.th}>Sales Count</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cpList.map(cp => (
                <tr key={cp.id}>
                  <td style={styles.td}>{cp.id}</td>
                  <td style={styles.td}>
                    {editingItem === cp.id ? (
                      <input
                        type="text"
                        style={styles.input}
                        value={editValues.name || ''}
                        onChange={(e) => setEditValues({ ...editValues, name: e.target.value })}
                      />
                    ) : cp.name}
                  </td>
                  <td style={styles.td}>
                    {editingItem === cp.id ? (
                      <select
                        style={styles.select}
                        value={editValues.rmId || ''}
                        onChange={(e) => setEditValues({ ...editValues, rmId: e.target.value })}
                      >
                        {rmList.map(rm => (
                          <option key={rm.id} value={rm.id}>{rm.name}</option>
                        ))}
                      </select>
                    ) : cp.rmName}
                  </td>
                  <td style={styles.td}>{cp.onboardedDate}</td>
                  <td style={styles.td}>{cp.salesCount || 0}</td>
                  <td style={styles.td}>
                    {editingItem === cp.id ? (
                      <select
                        style={styles.select}
                        value={editValues.status || 'active'}
                        onChange={(e) => setEditValues({ ...editValues, status: e.target.value })}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    ) : (
                      <span style={{...styles.statusBadge, ...(cp.status === 'active' ? styles.activeBadge : styles.inactiveBadge)}}>
                        {cp.status}
                      </span>
                    )}
                  </td>
                  <td style={styles.td}>
                    {editingItem === cp.id ? (
                      <>
                        <button onClick={() => handleSaveCP(cp.id)} style={styles.saveBtn}>Save</button>
                        <button onClick={() => setEditingItem(null)} style={styles.cancelBtn}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleEditCP(cp)} style={styles.editBtn}>Edit</button>
                        <button onClick={() => handleDeleteCP(cp.id)} style={styles.deleteBtn}>Delete</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Sales Table */}
      {activeMasterTab === 'sales' && (
        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>RM Name</th>
                <th style={styles.th}>CP Name</th>
                <th style={styles.th}>Amount (₹)</th>
                <th style={styles.th}>Sale Date</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {salesList.map(sale => (
                <tr key={sale.id}>
                  <td style={styles.td}>{sale.id}</td>
                  <td style={styles.td}>{sale.rmName}</td>
                  <td style={styles.td}>{sale.cpName}</td>
                  <td style={styles.td}>{formatRupees(sale.amount)}</td>
                  <td style={styles.td}>{sale.date}</td>
                  <td style={styles.td}>
                    <span style={{...styles.statusBadge, ...styles.activeBadge}}>
                      {sale.status}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <button onClick={() => handleDeleteSale(sale.id)} style={styles.deleteBtn}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default MasterDataManagement