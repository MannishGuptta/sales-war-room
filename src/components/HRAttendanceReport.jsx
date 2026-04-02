import { useState } from 'react'
import { mockData } from '../data/mockData'

const HRAttendanceReport = ({ onClose }) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [reportType, setReportType] = useState('monthly') // monthly, weekly, daily
  const [selectedRM, setSelectedRM] = useState('all')
  const [generating, setGenerating] = useState(false)

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const years = [2024, 2025, 2026]

  const generateMonthlyAttendanceSheet = () => {
    setGenerating(true)
    
    setTimeout(() => {
      const rmsToExport = selectedRM === 'all' ? mockData.rms : mockData.rms.filter(rm => rm.id === parseInt(selectedRM))
      
      // Create Excel/CSV content
      let csvRows = []
      
      // Header with company info
      csvRows.push(['='.repeat(80)])
      csvRows.push(['SALES WAR ROOM - HR ATTENDANCE REPORT'])
      csvRows.push([`Month: ${months[selectedMonth]} ${selectedYear}`])
      csvRows.push([`Generated on: ${new Date().toLocaleString()}`])
      csvRows.push(['='.repeat(80)])
      csvRows.push([])
      
      // Summary statistics
      csvRows.push(['SUMMARY STATISTICS'])
      csvRows.push(['-' .repeat(40)])
      
      let totalPresent = 0
      let totalAbsent = 0
      let totalLate = 0
      let totalWorkingDays = 0
      
      rmsToExport.forEach(rm => {
        totalPresent += rm.attendance.presentDays
        totalAbsent += rm.attendance.absentDays || 0
        totalLate += rm.attendance.lateDays || 0
        totalWorkingDays += rm.attendance.totalDays
      })
      
      const avgAttendance = (totalPresent / totalWorkingDays) * 100
      
      csvRows.push(['Total Employees:', rmsToExport.length])
      csvRows.push(['Total Present Days:', totalPresent])
      csvRows.push(['Total Absent Days:', totalAbsent])
      csvRows.push(['Total Late Arrivals:', totalLate])
      csvRows.push(['Overall Attendance Rate:', `${avgAttendance.toFixed(1)}%`])
      csvRows.push([])
      
      // Monthly Attendance Sheet
      csvRows.push(['MONTHLY ATTENDANCE SHEET'])
      csvRows.push(['-' .repeat(60)])
      csvRows.push([
        'Employee ID', 'RM Name', 'Email', 'Phone',
        'Total Days', 'Present', 'Absent', 'Late', 
        'Attendance %', 'Status', 'Remarks'
      ])
      
      rmsToExport.forEach(rm => {
        const attendanceRate = (rm.attendance.presentDays / rm.attendance.totalDays) * 100
        let status = 'Good'
        let remarks = ''
        
        if (attendanceRate < 75) {
          status = 'Warning'
          remarks = 'Attendance below 75% - Needs improvement'
        } else if (attendanceRate < 90) {
          status = 'Satisfactory'
          remarks = 'Attendance acceptable but can improve'
        } else {
          status = 'Excellent'
          remarks = 'Consistent attendance'
        }
        
        if ((rm.attendance.lateDays || 0) > 5) {
          remarks += ' | Multiple late arrivals'
        }
        
        csvRows.push([
          rm.id, rm.name, rm.email, rm.phone,
          rm.attendance.totalDays, rm.attendance.presentDays, 
          rm.attendance.absentDays || 0, rm.attendance.lateDays || 0,
          attendanceRate.toFixed(1) + '%', status, remarks
        ])
      })
      
      csvRows.push([])
      
      // Daily Attendance Details
      csvRows.push(['DAILY ATTENDANCE DETAILS'])
      csvRows.push(['-' .repeat(80)])
      csvRows.push([
        'Date', 'RM Name', 'Login Time', 'Logout Time', 
        'Location', 'Status', 'Working Hours', 'Notes'
      ])
      
      rmsToExport.forEach(rm => {
        const history = rm.attendance.loginHistory || []
        history.forEach(day => {
          // Calculate working hours
          let workingHours = 'N/A'
          if (day.loginTime && day.logoutTime) {
            const login = day.loginTime.split(':')
            const logout = day.logoutTime.split(':')
            const hours = parseInt(logout[0]) - parseInt(login[0])
            const minutes = parseInt(logout[1]) - parseInt(login[1])
            workingHours = `${hours}h ${minutes}m`
          }
          
          csvRows.push([
            day.date, rm.name, day.loginTime || '-', day.logoutTime || '-',
            day.location || '-', day.status || 'present', workingHours, day.notes || '-'
          ])
        })
      })
      
      csvRows.push([])
      
      // Late Arrivals Summary
      csvRows.push(['LATE ARRIVALS SUMMARY'])
      csvRows.push(['-' .repeat(60)])
      csvRows.push(['RM Name', 'Late Days', 'Dates', 'Average Delay'])
      
      rmsToExport.forEach(rm => {
        const lateDates = (rm.attendance.loginHistory || [])
          .filter(day => day.status === 'late')
          .map(day => day.date)
          .join(', ')
        
        if (lateDates) {
          csvRows.push([rm.name, rm.attendance.lateDays || 0, lateDates, '15-30 mins'])
        }
      })
      
      csvRows.push([])
      
      // Absent Days Summary
      csvRows.push(['ABSENT DAYS SUMMARY'])
      csvRows.push(['-' .repeat(60)])
      csvRows.push(['RM Name', 'Absent Days', 'Dates', 'Reason'])
      
      rmsToExport.forEach(rm => {
        const absentDates = (rm.attendance.loginHistory || [])
          .filter(day => day.status === 'absent')
          .map(day => `${day.date} (${day.notes || 'No reason'})`)
          .join(', ')
        
        if (absentDates) {
          csvRows.push([rm.name, rm.attendance.absentDays || 0, absentDates, 'See notes'])
        }
      })
      
      csvRows.push([])
      
      // Footer
      csvRows.push(['='.repeat(80)])
      csvRows.push(['Report Generated by Sales War Room System'])
      csvRows.push(['Authorized Signature: ____________________'])
      csvRows.push(['HR Manager Signature: ____________________'])
      csvRows.push(['='.repeat(80)])
      
      // Convert to CSV string
      const csvString = csvRows.map(row => 
        Array.isArray(row) ? row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',') : row
      ).join('\n')
      
      // Download file
      const blob = new Blob(['\uFEFF' + csvString], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `HR_Attendance_Report_${months[selectedMonth]}_${selectedYear}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      setGenerating(false)
    }, 1000)
  }

  const generateWeeklyAttendanceSheet = () => {
    setGenerating(true)
    
    setTimeout(() => {
      const rmsToExport = selectedRM === 'all' ? mockData.rms : mockData.rms.filter(rm => rm.id === parseInt(selectedRM))
      
      let csvRows = []
      
      // Header
      csvRows.push(['='.repeat(80)])
      csvRows.push(['SALES WAR ROOM - WEEKLY ATTENDANCE REPORT'])
      csvRows.push([`Week ${mockData.currentWeek} - ${months[selectedMonth]} ${selectedYear}`])
      csvRows.push([`Generated on: ${new Date().toLocaleString()}`])
      csvRows.push(['='.repeat(80)])
      csvRows.push([])
      
      // Weekly Summary
      csvRows.push(['WEEKLY ATTENDANCE SUMMARY'])
      csvRows.push(['-' .repeat(60)])
      csvRows.push(['RM Name', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Attendance %', 'Status'])
      
      // Get last 7 days
      const last7Days = []
      for (let i = 6; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        last7Days.push(date.toISOString().split('T')[0])
      }
      
      rmsToExport.forEach(rm => {
        const weekAttendance = []
        let presentCount = 0
        
        last7Days.forEach(date => {
          const dayRecord = rm.attendance.loginHistory?.find(h => h.date === date)
          const status = dayRecord?.status || 'absent'
          weekAttendance.push(status === 'present' ? 'P' : status === 'late' ? 'L' : 'A')
          if (status === 'present' || status === 'late') presentCount++
        })
        
        const attendanceRate = (presentCount / 7) * 100
        let statusText = attendanceRate >= 80 ? 'Good' : attendanceRate >= 60 ? 'Warning' : 'Critical'
        
        csvRows.push([rm.name, ...weekAttendance, `${attendanceRate.toFixed(1)}%`, statusText])
      })
      
      csvRows.push([])
      
      // Detailed Daily Log
      csvRows.push(['DAILY ATTENDANCE LOG'])
      csvRows.push(['-' .repeat(80)])
      csvRows.push(['Date', 'RM Name', 'Login', 'Logout', 'Location', 'Status', 'Hours'])
      
      rmsToExport.forEach(rm => {
        const recentHistory = (rm.attendance.loginHistory || []).slice(-7)
        recentHistory.forEach(day => {
          let workingHours = 'N/A'
          if (day.loginTime && day.logoutTime) {
            const login = day.loginTime.split(':')
            const logout = day.logoutTime.split(':')
            const hours = parseInt(logout[0]) - parseInt(login[0])
            const minutes = parseInt(logout[1]) - parseInt(login[1])
            workingHours = `${hours}h ${minutes}m`
          }
          
          csvRows.push([
            day.date, rm.name, day.loginTime || '-', day.logoutTime || '-',
            day.location || '-', day.status || 'absent', workingHours
          ])
        })
      })
      
      csvRows.push([])
      csvRows.push(['='.repeat(80)])
      csvRows.push(['Report Generated by Sales War Room System'])
      csvRows.push(['='.repeat(80)])
      
      const csvString = csvRows.map(row => 
        Array.isArray(row) ? row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',') : row
      ).join('\n')
      
      const blob = new Blob(['\uFEFF' + csvString], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `HR_Weekly_Attendance_Report_Week${mockData.currentWeek}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      setGenerating(false)
    }, 1000)
  }

  const generateIndividualAttendanceSheet = () => {
    if (selectedRM === 'all') {
      alert('Please select a specific RM for individual report')
      return
    }
    
    setGenerating(true)
    
    setTimeout(() => {
      const rm = mockData.rms.find(r => r.id === parseInt(selectedRM))
      
      let csvRows = []
      
      // Header
      csvRows.push(['='.repeat(80)])
      csvRows.push(['INDIVIDUAL ATTENDANCE REPORT'])
      csvRows.push([`Employee: ${rm.name}`])
      csvRows.push([`Email: ${rm.email} | Phone: ${rm.phone}`])
      csvRows.push([`Report Period: ${months[selectedMonth]} ${selectedYear}`])
      csvRows.push([`Generated on: ${new Date().toLocaleString()}`])
      csvRows.push(['='.repeat(80)])
      csvRows.push([])
      
      // Personal Summary
      csvRows.push(['PERSONAL ATTENDANCE SUMMARY'])
      csvRows.push(['-' .repeat(60)])
      csvRows.push(['Metric', 'Value'])
      csvRows.push(['Total Working Days', rm.attendance.totalDays])
      csvRows.push(['Days Present', rm.attendance.presentDays])
      csvRows.push(['Days Absent', rm.attendance.absentDays || 0])
      csvRows.push(['Late Arrivals', rm.attendance.lateDays || 0])
      csvRows.push(['Attendance Rate', `${((rm.attendance.presentDays / rm.attendance.totalDays) * 100).toFixed(1)}%`])
      csvRows.push(['Last Login', rm.attendance.lastLogin?.split('T')[0] || 'N/A'])
      csvRows.push([])
      
      // Monthly Calendar View
      csvRows.push(['MONTHLY ATTENDANCE CALENDAR'])
      csvRows.push(['-' .repeat(60)])
      csvRows.push(['Date', 'Day', 'Status', 'Login', 'Logout', 'Location', 'Working Hours', 'Notes'])
      
      const history = rm.attendance.loginHistory || []
      history.forEach(day => {
        let workingHours = 'N/A'
        if (day.loginTime && day.logoutTime) {
          const login = day.loginTime.split(':')
          const logout = day.logoutTime.split(':')
          const hours = parseInt(logout[0]) - parseInt(login[0])
          const minutes = parseInt(logout[1]) - parseInt(login[1])
          workingHours = `${hours}h ${minutes}m`
        }
        
        const dayOfWeek = new Date(day.date).toLocaleDateString('en-US', { weekday: 'long' })
        
        csvRows.push([
          day.date, dayOfWeek, day.status || 'present',
          day.loginTime || '-', day.logoutTime || '-',
          day.location || '-', workingHours, day.notes || '-'
        ])
      })
      
      csvRows.push([])
      
      // Performance Analysis
      csvRows.push(['PERFORMANCE ANALYSIS'])
      csvRows.push(['-' .repeat(60)])
      
      const attendanceRate = (rm.attendance.presentDays / rm.attendance.totalDays) * 100
      let recommendation = ''
      if (attendanceRate < 75) {
        recommendation = 'Needs improvement - Schedule HR meeting'
      } else if (attendanceRate < 90) {
        recommendation = 'Satisfactory - Encourage better consistency'
      } else {
        recommendation = 'Excellent - Recognize for good attendance'
      }
      
      csvRows.push(['Recommendation:', recommendation])
      if ((rm.attendance.lateDays || 0) > 3) {
        csvRows.push(['Late Arrival Notice:', `Arrived late ${rm.attendance.lateDays} times this month`])
      }
      
      csvRows.push([])
      csvRows.push(['='.repeat(80)])
      csvRows.push(['Report Generated by Sales War Room System'])
      csvRows.push(['For HR verification: ____________________'])
      csvRows.push(['Employee Signature: ____________________'])
      csvRows.push(['='.repeat(80)])
      
      const csvString = csvRows.map(row => 
        Array.isArray(row) ? row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',') : row
      ).join('\n')
      
      const blob = new Blob(['\uFEFF' + csvString], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `HR_Individual_Attendance_${rm.name}_${months[selectedMonth]}_${selectedYear}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      setGenerating(false)
    }, 1000)
  }

  const styles = {
    container: {
      background: 'white',
      borderRadius: '12px',
      padding: '24px',
      maxWidth: '800px',
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
      marginBottom: '20px'
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
    radioGroup: {
      display: 'flex',
      gap: '20px',
      marginTop: '8px'
    },
    radioLabel: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      cursor: 'pointer'
    },
    buttonGroup: {
      display: 'flex',
      gap: '15px',
      marginTop: '30px',
      flexWrap: 'wrap'
    },
    generateBtn: {
      flex: 1,
      padding: '12px',
      background: '#28a745',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: 'bold',
      transition: 'all 0.3s ease'
    },
    generateBtnDisabled: {
      background: '#6c757d',
      cursor: 'not-allowed'
    },
    infoBox: {
      background: '#e3f2fd',
      padding: '15px',
      borderRadius: '8px',
      marginTop: '20px'
    },
    infoTitle: {
      fontWeight: 'bold',
      marginBottom: '10px'
    },
    infoList: {
      margin: 0,
      paddingLeft: '20px',
      fontSize: '13px',
      color: '#666'
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>📄 HR Attendance Report</h2>
          <p style={styles.subtitle}>Generate professional attendance sheets for HR purposes</p>
        </div>
        <button onClick={onClose} style={styles.closeBtn}>Close</button>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Report Type</label>
        <div style={styles.radioGroup}>
          <label style={styles.radioLabel}>
            <input 
              type="radio" 
              name="reportType" 
              value="monthly" 
              checked={reportType === 'monthly'}
              onChange={() => setReportType('monthly')}
            />
            Monthly Report
          </label>
          <label style={styles.radioLabel}>
            <input 
              type="radio" 
              name="reportType" 
              value="weekly" 
              checked={reportType === 'weekly'}
              onChange={() => setReportType('weekly')}
            />
            Weekly Report
          </label>
          <label style={styles.radioLabel}>
            <input 
              type="radio" 
              name="reportType" 
              value="individual" 
              checked={reportType === 'individual'}
              onChange={() => setReportType('individual')}
            />
            Individual Employee Report
          </label>
        </div>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Select Employee</label>
        <select 
          style={styles.select}
          value={selectedRM}
          onChange={(e) => setSelectedRM(e.target.value)}
        >
          <option value="all">All Employees</option>
          {mockData.rms.map(rm => (
            <option key={rm.id} value={rm.id}>{rm.name}</option>
          ))}
        </select>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Select Month</label>
        <select 
          style={styles.select}
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
        >
          {months.map((month, idx) => (
            <option key={idx} value={idx}>{month}</option>
          ))}
        </select>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Select Year</label>
        <select 
          style={styles.select}
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
        >
          {years.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      <div style={styles.buttonGroup}>
        {reportType === 'monthly' && (
          <button 
            style={{...styles.generateBtn, ...(generating ? styles.generateBtnDisabled : {})}}
            onClick={generateMonthlyAttendanceSheet}
            disabled={generating}
          >
            {generating ? 'Generating...' : '📥 Download Monthly Attendance Sheet'}
          </button>
        )}
        {reportType === 'weekly' && (
          <button 
            style={{...styles.generateBtn, ...(generating ? styles.generateBtnDisabled : {})}}
            onClick={generateWeeklyAttendanceSheet}
            disabled={generating}
          >
            {generating ? 'Generating...' : '📥 Download Weekly Attendance Sheet'}
          </button>
        )}
        {reportType === 'individual' && (
          <button 
            style={{...styles.generateBtn, ...(generating ? styles.generateBtnDisabled : {})}}
            onClick={generateIndividualAttendanceSheet}
            disabled={generating || selectedRM === 'all'}
          >
            {generating ? 'Generating...' : '📥 Download Individual Attendance Report'}
          </button>
        )}
      </div>

      <div style={styles.infoBox}>
        <div style={styles.infoTitle}>📋 Report Includes:</div>
        <ul style={styles.infoList}>
          <li>Company header with official branding</li>
          <li>Employee personal information (Name, Email, Phone)</li>
          <li>Monthly/Weekly attendance summary with percentages</li>
          <li>Daily login/logout timestamps</li>
          <li>Location tracking information</li>
          <li>Working hours calculation</li>
          <li>Late arrivals and absent days summary</li>
          <li>HR recommendations and remarks</li>
          <li>Signature fields for HR and employee</li>
        </ul>
      </div>
    </div>
  )
}

export default HRAttendanceReport