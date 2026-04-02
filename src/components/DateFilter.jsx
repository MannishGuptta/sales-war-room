import { useState } from 'react'

const DateFilter = ({ onDateChange }) => {
  const [dateRange, setDateRange] = useState('week')

  const handleChange = (range) => {
    setDateRange(range)
    onDateChange(range)
  }

  const styles = {
    container: {
      display: 'flex',
      gap: '10px',
      marginBottom: '20px',
      padding: '10px',
      background: '#f8f9fa',
      borderRadius: '8px'
    },
    button: {
      padding: '8px 16px',
      border: '1px solid #ddd',
      background: 'white',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'all 0.3s'
    },
    activeButton: {
      background: '#007bff',
      color: 'white',
      border: '1px solid #007bff'
    }
  }

  return (
    <div style={styles.container}>
      <button 
        style={{ ...styles.button, ...(dateRange === 'week' ? styles.activeButton : {}) }}
        onClick={() => handleChange('week')}
      >
        This Week
      </button>
      <button 
        style={{ ...styles.button, ...(dateRange === 'month' ? styles.activeButton : {}) }}
        onClick={() => handleChange('month')}
      >
        This Month
      </button>
      <button 
        style={{ ...styles.button, ...(dateRange === 'quarter' ? styles.activeButton : {}) }}
        onClick={() => handleChange('quarter')}
      >
        This Quarter
      </button>
    </div>
  )
}

export default DateFilter