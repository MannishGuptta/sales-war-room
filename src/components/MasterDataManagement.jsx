import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

const MasterDataManagement = ({ rms, cps, sales, onUpdateData, onClose }) => {
  const [activeMasterTab, setActiveMasterTab] = useState('rms')
  const [editingItem, setEditingItem] = useState(null)
  const [editValues, setEditValues] = useState({})
  const [showAddForm, setShowAddForm] = useState(false)
  const [newItem, setNewItem] = useState({})
  const [saving, setSaving] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [rmList, setRmList] = useState([])
  const [cpList, setCpList] = useState(cps || [])
  const [salesList, setSalesList] = useState(sales || [])

  // Load RMs from Supabase on mount
  useEffect(() => {
    loadRMs()
  }, [])

  const loadRMs = async () => {
    try {
      const { data, error } = await supabase
        .from('rms')
        .select('*')
        .order('id')
      
      if (error) throw error
      setRmList(data || [])
    } catch (error) {
      console.error('Error loading RMs:', error)
    }
  }

  const formatRupees = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  // Refresh all data and notify parent
  const refreshData = async () => {
    await loadRMs()
    if (onUpdateData) {
      await onUpdateData()
    }
    setSuccessMessage('Data refreshed!')
    setTimeout(() => setSuccessMessage(''), 2000)
  }

  // RM CRUD Operations
  const handleAddRM = async () => {
    if (!newItem.name) {
      setErrorMessage('Please enter RM name')
      return
    }
    
    setSaving(true)
    setErrorMessage('')
    
    try {
      const newRM = {
        name: newItem.name,
        email: newItem.email || `${newItem.name.toLowerCase().replace(/ /g, '.')}@example.com`,
        phone: newItem.phone || '',
        monthly_target: parseInt(newItem.monthlyTarget) || 0,
        monthly_achieved: 0,
        cp_target: parseInt(newItem.cpTarget) || 0,
        cp_onboarded: 0,
        active_cp_target: parseInt(newItem.activeCPTarget) || 0,
        active_cp: 0
      }
      
      const { data, error } = await supabase
        .from('rms')
        .insert([newRM])
        .select()
      
      if (error) throw error
      
      await loadRMs()
      setShowAddForm(false)
      setNewItem({})
      setSuccessMessage('RM added successfully!')
      setTimeout(() => setSuccessMessage(''), 3000)
      
      // Notify parent to refresh WarRoom
      if (onUpdateData) {
        await onUpdateData()
      }
    } catch (error) {
      console.error('Error adding RM:', error)
      setErrorMessage('Error adding RM: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleEditRM = (rm) => {
    setEditingItem(rm.id)
    setEditValues({
      name: rm.name,
      email: rm.email,
      phone: rm.phone,
      monthlyTarget: rm.monthly_target,
      cpTarget: rm.cp_target,
      activeCPTarget: rm.active_cp_target
    })
  }

  const handleSaveRM = async (id) => {
    setSaving(true)
    
    try {
      const { error } = await supabase
        .from('rms')
        .update({
          name: editValues.name,
          email: editValues.email,
          phone: editValues.phone,
          monthly_target: parseInt(editValues.monthlyTarget) || 0,
          cp_target: parseInt(editValues.cpTarget) || 0,
          active_cp_target: parseInt(editValues.activeCPTarget) || 0
        })
        .eq('id', id)
      
      if (error) throw error
      
      await loadRMs()
      setEditingItem(null)
      setEditValues({})
      setSuccessMessage('RM updated successfully!')
      setTimeout(() => setSuccessMessage(''), 3000)
      
      // Notify parent to refresh WarRoom
      if (onUpdateData) {
        await onUpdateData()
      }
    } catch (error) {
      console.error('Error updating RM:', error)
      setErrorMessage('Error updating RM: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteRM = async (id) => {
    if (window.confirm('Are you sure you want to delete this RM?')) {
      setSaving(true)
      
      try {
        const { error } = await supabase
          .from('rms')
          .delete()
          .eq('id', id)
        
        if (error) throw error
        
        await loadRMs()
        setSuccessMessage('RM deleted successfully!')
        setTimeout(() => setSuccessMessage(''), 3000)
        
        // Notify parent to refresh WarRoom
        if (onUpdateData) {
          await onUpdateData()
        }
      } catch (error) {
        console.error('Error deleting RM:', error)
        setErrorMessage('Error deleting RM: ' + error.message)
      } finally {
        setSaving(false)
      }
    }
  }

  // CP CRUD Operations
  const handleAddCP = async () => {
    const rm = rmList.find(r => r.id === parseInt(newItem.rmId))
    if (!rm) {
      setErrorMessage('Please select a valid RM')
      return
    }
    
    setSaving(true)
    
    try {
      const newCP = {
        name: newItem.name,
        rm_id: parseInt(newItem.rmId),
        status: newItem.status || 'active',
        onboarded_date: new Date().toISOString().split('T')[0],
        sales_count: 0
      }
      
      const { data, error } = await supabase
        .from('channel_partners')
        .insert([newCP])
        .select()
      
      if (error) throw error
      
      const addedCP = data[0]
      const newCPData = {
        id: addedCP.id,
        name: addedCP.name,
        rmId: addedCP.rm_id,
        rmName: rm.name,
        status: addedCP.status,
        onboardedDate: addedCP.onboarded_date,
        salesCount: 0
      }
      
      setCpList([...cpList, newCPData])
      setShowAddForm(false)
      setNewItem({})
      setSuccessMessage('CP added successfully!')
      setTimeout(() => setSuccessMessage(''), 3000)
      
      if (onUpdateData) {
        await onUpdateData()
      }
    } catch (error) {
      console.error('Error adding CP:', error)
      setErrorMessage('Error adding CP: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleEditCP = (cp) => {
    setEditingItem(cp.id)
    setEditValues({
      name: cp.name,
      rmId: cp.rmId,
      status: cp.status
    })
  }

  const handleSaveCP = async (id) => {
    setSaving(true)
    
    try {
      const { error } = await supabase
        .from('channel_partners')
        .update({
          name: editValues.name,
          rm_id: parseInt(editValues.rmId),
          status: editValues.status
        })
        .eq('id', id)
      
      if (error) throw error
      
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
      setSuccessMessage('CP updated successfully!')
      setTimeout(() => setSuccessMessage(''), 3000)
      
      if (onUpdateData) {
        await onUpdateData()
      }
    } catch (error) {
      console.error('Error updating CP:', error)
      setErrorMessage('Error updating CP: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteCP = async (id) => {
    if (window.confirm('Are you sure you want to delete this CP?')) {
      setSaving(true)
      
      try {
        const { error } = await supabase
          .from('channel_partners')
          .delete()
          .eq('id', id)
        
        if (error) throw error
        
        const updatedCPs = cpList.filter(cp => cp.id !== id)
        setCpList(updatedCPs)
        setSuccessMessage('CP deleted successfully!')
        setTimeout(() => setSuccessMessage(''), 3000)
        
        if (onUpdateData) {
          await onUpdateData()
        }
      } catch (error) {
        console.error('Error deleting CP:', error)
        setErrorMessage('Error deleting CP: ' + error.message)
      } finally {
        setSaving(false)
      }
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
    
    const updatedCPs = cpList.map(c => 
      c.id === parseInt(newItem.cpId) ? { ...c, salesCount: (c.salesCount || 0) + 1 } : c
    )
    setCpList(updatedCPs)
    
    setShowAddForm(false)
    setNewItem({})
    setSuccessMessage('Sale added successfully!')
    setTimeout(() => setSuccessMessage(''), 3000)
    
    if (onUpdateData) {
      onUpdateData()
    }
  }

  const handleDeleteSale = (id) => {
    if (window.confirm('Are you sure you want to delete this sale?')) {
      const updatedSales = salesList.filter(sale => sale.id !== id)
      setSalesList(updatedSales)
      setSuccessMessage('Sale deleted successfully!')
      setTimeout(() => setSuccessMessage(''), 3000)
      
      if (onUpdateData) {
        onUpdateData()
      }
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
    title: { fontSize: '24px', fontWeight: 'bold', color: '#333', margin: 0 },
    refreshBtn: { background: '#17a2b8', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold', marginRight: '10px' },
    closeBtn: { background: '#dc3545', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' },
    successMessage: { background: '#d4edda', color: '#155724', padding: '10px', borderRadius: '4px', marginBottom: '20px' },
    errorMessage: { background: '#f8d7da', color: '#721c24', padding: '10px', borderRadius: '4px', marginBottom: '20px' },
    masterTabs: { display: 'flex', gap: '10px', marginBottom: '24px', borderBottom: '2px solid #f0f0f0' },
    masterTab: { padding: '10px 20px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', fontWeight: '500', color: '#666', transition: 'all 0.3s ease' },
    activeMasterTab: { color: '#2196f3', borderBottom: '3px solid #2196f3', marginBottom: '-2px' },
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
    cancelFormBtn: { background: '#6c757d', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' },
    statusBadge: { display: 'inline-block', padding: '3px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' },
    activeBadge: { background: '#d4edda', color: '#155724' },
    inactiveBadge: { background: '#f8d7da', color: '#721c24' }
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>📋 Master Data Management</h2>
        <div>
          <button onClick={refreshData} style={styles.refreshBtn}>🔄 Refresh</button>
          <button onClick={onClose} style={styles.closeBtn}>Close</button>
        </div>
      </div>

      {successMessage && <div style={styles.successMessage}>{successMessage}</div>}
      {errorMessage && <div style={styles.errorMessage}>{errorMessage}</div>}

      <div style={styles.masterTabs}>
        <button 
          style={{ ...styles.masterTab, ...(activeMasterTab === 'rms' ? styles.activeMasterTab : {}) }} 
          onClick={() => { setActiveMasterTab('rms'); setShowAddForm(false); }}
        >
          👤 RMs ({rmList.length})
        </button>
        <button 
          style={{ ...styles.masterTab, ...(activeMasterTab === 'cps' ? styles.activeMasterTab : {}) }} 
          onClick={() => { setActiveMasterTab('cps'); setShowAddForm(false); }}
        >
          🤝 Channel Partners ({cpList.length})
        </button>
        <button 
          style={{ ...styles.masterTab, ...(activeMasterTab === 'sales' ? styles.activeTab : {}) }} 
          onClick={() => { setActiveMasterTab('sales'); setShowAddForm(false); }}
        >
          💰 Sales Records ({salesList.length})
        </button>
      </div>

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
                  <label style={styles.formLabel}>RM Name *</label>
                  <input
                    type="text"
                    style={styles.formInput}
                    value={newItem.name || ''}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    placeholder="Enter RM name"
                  />
                </div>
                <div>
                  <label style={styles.formLabel}>Email</label>
                  <input
                    type="email"
                    style={styles.formInput}
                    value={newItem.email || ''}
                    onChange={(e) => setNewItem({ ...newItem, email: e.target.value })}
                    placeholder="Enter email"
                  />
                </div>
                <div>
                  <label style={styles.formLabel}>Phone</label>
                  <input
                    type="text"
                    style={styles.formInput}
                    value={newItem.phone || ''}
                    onChange={(e) => setNewItem({ ...newItem, phone: e.target.value })}
                    placeholder="Enter phone"
                  />
                </div>
                <div>
                  <label style={styles.formLabel}>Monthly Target (₹)</label>
                  <input
                    type="number"
                    style={styles.formInput}
                    value={newItem.monthlyTarget || ''}
                    onChange={(e) => setNewItem({ ...newItem, monthlyTarget: e.target.value })}
                    placeholder="Enter monthly target"
                  />
                </div>
                <div>
                  <label style={styles.formLabel}>CP Target</label>
                  <input
                    type="number"
                    style={styles.formInput}
                    value={newItem.cpTarget || ''}
                    onChange={(e) => setNewItem({ ...newItem, cpTarget: e.target.value })}
                    placeholder="Enter CP target"
                  />
                </div>
                <div>
                  <label style={styles.formLabel}>Active CP Target</label>
                  <input
                    type="number"
                    style={styles.formInput}
                    value={newItem.activeCPTarget || ''}
                    onChange={(e) => setNewItem({ ...newItem, activeCPTarget: e.target.value })}
                    placeholder="Enter active CP target"
                  />
                </div>
              </>
            )}

            {activeMasterTab === 'cps' && (
              <>
                <div>
                  <label style={styles.formLabel}>CP Name *</label>
                  <input
                    type="text"
                    style={styles.formInput}
                    value={newItem.name || ''}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    placeholder="Enter CP name"
                  />
                </div>
                <div>
                  <label style={styles.formLabel}>Assigned RM</label>
                  <select
                    style={styles.formSelect}
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
                    style={styles.formSelect}
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
                    style={styles.formSelect}
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
                    placeholder="Enter amount"
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
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              style={styles.submitBtn} 
              onClick={activeMasterTab === 'rms' ? handleAddRM : activeMasterTab === 'cps' ? handleAddCP : handleAddSale}
              disabled={saving}
            >
              {saving ? 'Adding...' : `Add ${activeMasterTab === 'rms' ? 'RM' : activeMasterTab === 'cps' ? 'CP' : 'Sale'}`}
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
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Phone</th>
                <th style={styles.th}>Monthly Target</th>
                <th style={styles.th}>CP Target</th>
                <th style={styles.th}>Active CP Target</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Actions</th>
               </thead>
            <tbody>
              {rmList.map(rm => (
                <tr key={rm.id}>
                  <td style={styles.td}>{rm.id}   </td>
                  <td style={styles.td}>
                    {editingItem === rm.id ? (
                      <input type="text" style={styles.input} value={editValues.name || ''} onChange={(e) => setEditValues({ ...editValues, name: e.target.value })} />
                    ) : rm.name}
                  </td>
                  <td style={styles.td}>
                    {editingItem === rm.id ? (
                      <input type="email" style={styles.input} value={editValues.email || ''} onChange={(e) => setEditValues({ ...editValues, email: e.target.value })} />
                    ) : rm.email || '-'}
                  </td>
                  <td style={styles.td}>
                    {editingItem === rm.id ? (
                      <input type="text" style={styles.input} value={editValues.phone || ''} onChange={(e) => setEditValues({ ...editValues, phone: e.target.value })} />
                    ) : rm.phone || '-'}
                  </td>
                  <td style={styles.td}>
                    {editingItem === rm.id ? (
                      <input type="number" style={styles.input} value={editValues.monthlyTarget || ''} onChange={(e) => setEditValues({ ...editValues, monthlyTarget: e.target.value })} />
                    ) : formatRupees(rm.monthly_target)}
                  </td>
                  <td style={styles.td}>
                    {editingItem === rm.id ? (
                      <input type="number" style={styles.input} value={editValues.cpTarget || ''} onChange={(e) => setEditValues({ ...editValues, cpTarget: e.target.value })} />
                    ) : rm.cp_target}
                  </td>
                  <td style={styles.td}>
                    {editingItem === rm.id ? (
                      <input type="number" style={styles.input} value={editValues.activeCPTarget || ''} onChange={(e) => setEditValues({ ...editValues, activeCPTarget: e.target.value })} />
                    ) : rm.active_cp_target}
                  </td>
                  <td style={styles.td}>
                    <span style={{...styles.statusBadge, ...styles.activeBadge}}>active</span>
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
               </thead>
            <tbody>
              {cpList.map(cp => (
                <tr key={cp.id}>
                  <td style={styles.td}>{cp.id}   </td>
                  <td style={styles.td}>
                    {editingItem === cp.id ? (
                      <input type="text" style={styles.input} value={editValues.name || ''} onChange={(e) => setEditValues({ ...editValues, name: e.target.value })} />
                    ) : cp.name}
                  </td>
                  <td style={styles.td}>
                    {editingItem === cp.id ? (
                      <select style={styles.select} value={editValues.rmId || ''} onChange={(e) => setEditValues({ ...editValues, rmId: e.target.value })}>
                        {rmList.map(rm => (<option key={rm.id} value={rm.id}>{rm.name}</option>))}
                      </select>
                    ) : cp.rmName}
                  </td>
                  <td style={styles.td}>{cp.onboardedDate}   </td>
                  <td style={styles.td}>{cp.salesCount || 0}   </td>
                  <td style={styles.td}>
                    {editingItem === cp.id ? (
                      <select style={styles.select} value={editValues.status || 'active'} onChange={(e) => setEditValues({ ...editValues, status: e.target.value })}>
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
               </thead>
            <tbody>
              {salesList.map(sale => (
                <tr key={sale.id}>
                  <td style={styles.td}>{sale.id}   </td>
                  <td style={styles.td}>{sale.rmName}   </td>
                  <td style={styles.td}>{sale.cpName}   </td>
                  <td style={styles.td}>{formatRupees(sale.amount)}   </td>
                  <td style={styles.td}>{sale.date}   </td>
                  <td style={styles.td}><span style={{...styles.statusBadge, ...styles.activeBadge}}>{sale.status}</span>   </td>
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