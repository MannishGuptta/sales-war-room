import { useState } from 'react'

const CPOnboardingForm = ({ rmId, rmName, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    gst: '',
    pan: '',
    address: '',
    city: '',
    pincode: '',
    phone: '',
    email: '',
    website: '',
    contactPerson: '',
    contactPersonPhone: '',
    contactPersonEmail: '',
    commissionRate: '',
    agreementDate: new Date().toISOString().split('T')[0],
    agreementEndDate: '',
    documents: [],
    status: 'active',
    notes: ''
  })

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}
    if (!formData.name) newErrors.name = 'CP name is required'
    if (!formData.companyName) newErrors.companyName = 'Company name is required'
    if (!formData.phone) newErrors.phone = 'Phone number is required'
    if (!formData.email) newErrors.email = 'Email is required'
    if (!formData.contactPerson) newErrors.contactPerson = 'Contact person name is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validateForm()) return
    
    setLoading(true)
    
    // Create CP data
    const cpData = {
      id: Date.now(),
      ...formData,
      rmId: parseInt(rmId),
      rmName: rmName,
      onboardedDate: new Date().toISOString().split('T')[0],
      salesCount: 0,
      totalSales: 0
    }
    
    // Store in localStorage
    const storedCPs = localStorage.getItem(`cps_${rmId}`)
    let existingCPs = storedCPs ? JSON.parse(storedCPs) : []
    existingCPs.push(cpData)
    localStorage.setItem(`cps_${rmId}`, JSON.stringify(existingCPs))
    
    // Also store in master CP database
    const allCPs = localStorage.getItem('all_cps')
    let allCPsList = allCPs ? JSON.parse(allCPs) : []
    allCPsList.push(cpData)
    localStorage.setItem('all_cps', JSON.stringify(allCPsList))
    
    setLoading(false)
    if (onSuccess) onSuccess(cpData)
    alert('Channel Partner onboarded successfully!')
    onClose()
  }

  const styles = {
    container: {
      background: 'white',
      borderRadius: '12px',
      padding: '24px',
      maxWidth: '800px',
      margin: '0 auto',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      maxHeight: '90vh',
      overflowY: 'auto'
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
    subtitle: {
      fontSize: '14px',
      color: '#666',
      marginTop: '5px'
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
    required: {
      color: '#dc3545',
      marginLeft: '4px'
    },
    input: {
      width: '100%',
      padding: '10px',
      border: '1px solid #ddd',
      borderRadius: '6px',
      fontSize: '14px',
      transition: 'border-color 0.3s ease'
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
    error: {
      color: '#dc3545',
      fontSize: '12px',
      marginTop: '4px'
    },
    formRow: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '16px',
      marginBottom: '16px'
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
    },
    submitBtnDisabled: {
      background: '#6c757d',
      cursor: 'not-allowed'
    },
    sectionTitle: {
      fontSize: '18px',
      fontWeight: 'bold',
      marginTop: '20px',
      marginBottom: '15px',
      paddingBottom: '8px',
      borderBottom: '1px solid #e0e0e0'
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>🤝 Onboard Channel Partner</h2>
          <p style={styles.subtitle}>Fill in the details to onboard a new CP</p>
        </div>
        <button onClick={onClose} style={styles.closeBtn}>Close</button>
      </div>

      <div>
        <h3 style={styles.sectionTitle}>Basic Information</h3>
        
        <div style={styles.formGroup}>
          <label style={styles.label}>CP Name <span style={styles.required}>*</span></label>
          <input
            type="text"
            style={styles.input}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter CP name"
          />
          {errors.name && <div style={styles.error}>{errors.name}</div>}
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Company Name <span style={styles.required}>*</span></label>
          <input
            type="text"
            style={styles.input}
            value={formData.companyName}
            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
            placeholder="Enter company name"
          />
          {errors.companyName && <div style={styles.error}>{errors.companyName}</div>}
        </div>

        <div style={styles.formRow}>
          <div style={styles.formGroup}>
            <label style={styles.label}>GST Number</label>
            <input
              type="text"
              style={styles.input}
              value={formData.gst}
              onChange={(e) => setFormData({ ...formData, gst: e.target.value })}
              placeholder="Enter GST number"
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>PAN Number</label>
            <input
              type="text"
              style={styles.input}
              value={formData.pan}
              onChange={(e) => setFormData({ ...formData, pan: e.target.value })}
              placeholder="Enter PAN number"
            />
          </div>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Address</label>
          <textarea
            style={styles.textarea}
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            placeholder="Enter complete address"
          />
        </div>

        <div style={styles.formRow}>
          <div style={styles.formGroup}>
            <label style={styles.label}>City</label>
            <input
              type="text"
              style={styles.input}
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              placeholder="Enter city"
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Pincode</label>
            <input
              type="text"
              style={styles.input}
              value={formData.pincode}
              onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
              placeholder="Enter pincode"
            />
          </div>
        </div>

        <h3 style={styles.sectionTitle}>Contact Information</h3>

        <div style={styles.formRow}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Phone <span style={styles.required}>*</span></label>
            <input
              type="tel"
              style={styles.input}
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="Enter phone number"
            />
            {errors.phone && <div style={styles.error}>{errors.phone}</div>}
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email <span style={styles.required}>*</span></label>
            <input
              type="email"
              style={styles.input}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter email address"
            />
            {errors.email && <div style={styles.error}>{errors.email}</div>}
          </div>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Website</label>
          <input
            type="url"
            style={styles.input}
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            placeholder="Enter website URL"
          />
        </div>

        <div style={styles.formRow}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Contact Person <span style={styles.required}>*</span></label>
            <input
              type="text"
              style={styles.input}
              value={formData.contactPerson}
              onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
              placeholder="Enter contact person name"
            />
            {errors.contactPerson && <div style={styles.error}>{errors.contactPerson}</div>}
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Contact Person Phone</label>
            <input
              type="tel"
              style={styles.input}
              value={formData.contactPersonPhone}
              onChange={(e) => setFormData({ ...formData, contactPersonPhone: e.target.value })}
              placeholder="Enter contact person phone"
            />
          </div>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Contact Person Email</label>
          <input
            type="email"
            style={styles.input}
            value={formData.contactPersonEmail}
            onChange={(e) => setFormData({ ...formData, contactPersonEmail: e.target.value })}
            placeholder="Enter contact person email"
          />
        </div>

        <h3 style={styles.sectionTitle}>Agreement Details</h3>

        <div style={styles.formRow}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Agreement Date</label>
            <input
              type="date"
              style={styles.input}
              value={formData.agreementDate}
              onChange={(e) => setFormData({ ...formData, agreementDate: e.target.value })}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Agreement End Date</label>
            <input
              type="date"
              style={styles.input}
              value={formData.agreementEndDate}
              onChange={(e) => setFormData({ ...formData, agreementEndDate: e.target.value })}
            />
          </div>
        </div>

        <div style={styles.formRow}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Commission Rate (%)</label>
            <input
              type="number"
              style={styles.input}
              value={formData.commissionRate}
              onChange={(e) => setFormData({ ...formData, commissionRate: e.target.value })}
              placeholder="Enter commission rate"
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Status</label>
            <select
              style={styles.input}
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending Approval</option>
            </select>
          </div>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Additional Notes</label>
          <textarea
            style={styles.textarea}
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Any additional notes about the CP"
          />
        </div>

        <button
          onClick={handleSubmit}
          style={{
            ...styles.submitBtn,
            ...(loading ? styles.submitBtnDisabled : {})
          }}
          disabled={loading}
        >
          {loading ? 'Onboarding...' : '✓ Onboard Channel Partner'}
        </button>
      </div>
    </div>
  )
}

export default CPOnboardingForm