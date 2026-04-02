import { useState, useEffect } from 'react'

const AddSaleForm = ({ rmId, rmName, cps, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    cpId: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    paymentMode: 'UPI',
    invoiceNo: '',
    notes: '',
    status: 'completed'
  })

  const [loading, setLoading] = useState(false)

  const handleSubmit = () => {
    if (!formData.cpId || !formData.amount) {
      alert('Please select CP and enter amount')
      return
    }

    setLoading(true)

    const selectedCP = cps.find(cp => cp.id === parseInt(formData.cpId))
    
    const saleData = {
      id: Date.now(),
      rmId: parseInt(rmId),
      rmName: rmName,
      cpId: parseInt(formData.cpId),
      cpName: selectedCP?.name || 'Unknown',
      amount: parseInt(formData.amount),
      date: formData.date,
      paymentMode: formData.paymentMode,
      invoiceNo: formData.invoiceNo || `INV-${Date.now()}`,
      notes: formData.notes,
      status: formData.status
    }

    // Store in localStorage
    const storedSales = localStorage.getItem(`sales_${rmId}`)
    let existingSales = storedSales ? JSON.parse(storedSales) : []
    existingSales.push(saleData)
    localStorage.setItem(`sales_${rmId}`, JSON.stringify(existingSales))

    // Update CP sales count
    const storedCPs = localStorage.getItem(`cps_${rmId}`)
    if (storedCPs) {
      const cpsData = JSON.parse(storedCPs)
      const updatedCPs = cpsData.map(cp =>
        cp.id === parseInt(formData.cpId)
          ? { ...cp, salesCount: (cp.salesCount || 0) + 1, totalSales: (cp.totalSales || 0) + parseInt(formData.amount) }
          : cp
      )
      localStorage.setItem(`cps_${rmId}`, JSON.stringify(updatedCPs))
    }

    setLoading(false)
    if (onSuccess) onSuccess(saleData)
    alert('Sale added successfully!')
    onClose()
  }

  const styles = {
    container: {
      background: 'white',
      borderRadius: '12px',
      padding: '24px',
      maxWidth: '500px',
      margin: '0 auto',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
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
    formGroup: {
      marginBottom: '16px'
    },
    label: {
      display: 'block',
      marginBottom: '6px',
      fontWeight: '500',
      color: '#333',
      fontSize: '14px'
    },
    input: {
      width: '100%',
      padding: '10px',
      border: '1px solid #ddd',
      borderRadius: '6px',
      fontSize: '14px'
    },
    select: {
      width: '100%',
      padding: '10px',
      border: '1px solid #ddd',
      borderRadius: '6px',
      fontSize: '14px'
    },
    textarea: {
      width: '100%',
      padding: '10px',
      border: '1px solid #ddd',
      borderRadius: '6px',
      fontSize: '14px',
      resize: 'vertical',
      minHeight: '80px'
    },
    submitBtn: {
      background: '#28a745',
      color: 'white',
      border: 'none',
      padding: '12px 24px',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: 'bold',
      width: '100%',
      marginTop: '20px'
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>💰 Add New Sale</h2>
        <button onClick={onClose} style={styles.closeBtn}>Close</button>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Channel Partner *</label>
        <select
          style={styles.select}
          value={formData.cpId}
          onChange={(e) => setFormData({ ...formData, cpId: e.target.value })}
        >
          <option value="">Select Channel Partner</option>
          {cps.map(cp => (
            <option key={cp.id} value={cp.id}>{cp.name}</option>
          ))}
        </select>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Amount (₹) *</label>
        <input
          type="number"
          style={styles.input}
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          placeholder="Enter sale amount"
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Sale Date</label>
        <input
          type="date"
          style={styles.input}
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Payment Mode</label>
        <select
          style={styles.select}
          value={formData.paymentMode}
          onChange={(e) => setFormData({ ...formData, paymentMode: e.target.value })}
        >
          <option value="UPI">UPI</option>
          <option value="Bank Transfer">Bank Transfer</option>
          <option value="Cheque">Cheque</option>
          <option value="Cash">Cash</option>
          <option value="Card">Card</option>
        </select>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Invoice Number</label>
        <input
          type="text"
          style={styles.input}
          value={formData.invoiceNo}
          onChange={(e) => setFormData({ ...formData, invoiceNo: e.target.value })}
          placeholder="Enter invoice number"
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Status</label>
        <select
          style={styles.select}
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
        >
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Notes</label>
        <textarea
          style={styles.textarea}
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Any additional notes"
        />
      </div>

      <button
        onClick={handleSubmit}
        style={styles.submitBtn}
        disabled={loading}
      >
        {loading ? 'Adding...' : '✓ Add Sale'}
      </button>
    </div>
  )
}

export default AddSaleForm