// Get current date and week of month (capped at 4)
const today = new Date()
const currentMonth = today.toLocaleString('default', { month: 'long' })
const currentYear = today.getFullYear()
let weekOfMonth = Math.ceil(today.getDate() / 7)
weekOfMonth = Math.min(weekOfMonth, 4) // Cap at week 4

// Helper function to get date strings
const getDateString = (daysAgo) => {
  const date = new Date()
  date.setDate(today.getDate() - daysAgo)
  return date.toISOString().split('T')[0]
}

// Helper function to generate attendance history
function generateAttendanceHistory(days) {
  const history = []
  for (let i = days; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]
    
    const rand = Math.random()
    let status = 'present'
    let loginTime = '09:30 AM'
    let logoutTime = '06:30 PM'
    let location = 'Mumbai Office'
    
    if (rand < 0.1) {
      status = 'absent'
      loginTime = ''
      logoutTime = ''
      location = ''
    } else if (rand < 0.15) {
      status = 'late'
      loginTime = '10:15 AM'
      logoutTime = '07:00 PM'
      location = 'Remote'
    }
    
    history.push({
      date: dateStr,
      loginTime: loginTime,
      logoutTime: logoutTime,
      location: location,
      status: status,
      notes: ''
    })
  }
  return history
}

export const mockData = {
  currentMonth: currentMonth,
  currentYear: currentYear,
  currentWeek: weekOfMonth,
  
  // Overall monthly metrics
  monthlyMetrics: {
    totalRevenueTarget: 1000000,
    totalRevenueAchieved: 581007,
    revenueGap: 418993,
    revenueConversion: 58.1,
    totalCPTarget: 55,
    totalCPOnboarded: 61,
    cpGap: -6,
    totalActiveCPTarget: 45,
    totalActiveCP: 38,
    activeCPGap: 7,
    cpActivationRate: 62.3
  },
  
  // Weekly targets (monthly target divided by 4)
  weeklyTargets: {
    revenue: 250000,
    cpOnboarded: 14,
    activeCP: 11
  },
  
  rms: [
    { 
      id: 1, 
      name: 'John Smith', 
      email: 'john.smith@example.com',
      phone: '+91 98765 43210',
      monthlyTarget: 200000,
      monthlyAchieved: 158390,
      monthlyGap: 41610,
      monthlyAchievement: 79.2,
      cpTarget: 12,
      cpOnboarded: 14,
      cpOnboardedGap: -2,
      activeCPTarget: 10,
      activeCP: 11,
      activeCPGap: -1,
      cpActivationRate: 78.6,
      weeklyProgress: {
        week1: { revenue: 35000, cpOnboarded: 3, activeCP: 2 },
        week2: { revenue: 42000, cpOnboarded: 4, activeCP: 3 },
        week3: { revenue: 41000, cpOnboarded: 4, activeCP: 3 },
        week4: { revenue: 40390, cpOnboarded: 3, activeCP: 3 }
      },
      lastActivity: getDateString(0),
      status: 'green',
      escalationLevel: null,
      attendance: {
        totalDays: 22,
        presentDays: 18,
        absentDays: 2,
        lateDays: 2,
        lastLogin: new Date().toISOString(),
        loginHistory: generateAttendanceHistory(22)
      }
    },
    { 
      id: 2, 
      name: 'Sarah Johnson', 
      email: 'sarah.johnson@example.com',
      phone: '+91 98765 43211',
      monthlyTarget: 200000,
      monthlyAchieved: 184014,
      monthlyGap: 15986,
      monthlyAchievement: 92.0,
      cpTarget: 15,
      cpOnboarded: 19,
      cpOnboardedGap: -4,
      activeCPTarget: 13,
      activeCP: 12,
      activeCPGap: 1,
      cpActivationRate: 63.2,
      weeklyProgress: {
        week1: { revenue: 45000, cpOnboarded: 5, activeCP: 3 },
        week2: { revenue: 48000, cpOnboarded: 5, activeCP: 3 },
        week3: { revenue: 46000, cpOnboarded: 5, activeCP: 3 },
        week4: { revenue: 45014, cpOnboarded: 4, activeCP: 3 }
      },
      lastActivity: getDateString(0),
      status: 'green',
      escalationLevel: null,
      attendance: {
        totalDays: 22,
        presentDays: 20,
        absentDays: 1,
        lateDays: 1,
        lastLogin: new Date().toISOString(),
        loginHistory: generateAttendanceHistory(22)
      }
    },
    { 
      id: 3, 
      name: 'Mike Brown', 
      email: 'mike.brown@example.com',
      phone: '+91 98765 43212',
      monthlyTarget: 200000,
      monthlyAchieved: 81291,
      monthlyGap: 118709,
      monthlyAchievement: 40.6,
      cpTarget: 10,
      cpOnboarded: 11,
      cpOnboardedGap: -1,
      activeCPTarget: 8,
      activeCP: 4,
      activeCPGap: 4,
      cpActivationRate: 36.4,
      weeklyProgress: {
        week1: { revenue: 20000, cpOnboarded: 3, activeCP: 1 },
        week2: { revenue: 18000, cpOnboarded: 3, activeCP: 1 },
        week3: { revenue: 21000, cpOnboarded: 3, activeCP: 1 },
        week4: { revenue: 22291, cpOnboarded: 2, activeCP: 1 }
      },
      lastActivity: getDateString(2),
      status: 'yellow',
      escalationLevel: 'critical',
      attendance: {
        totalDays: 22,
        presentDays: 14,
        absentDays: 5,
        lateDays: 3,
        lastLogin: getDateString(2),
        loginHistory: generateAttendanceHistory(22)
      }
    },
    { 
      id: 4, 
      name: 'Emma Wilson', 
      email: 'emma.wilson@example.com',
      phone: '+91 98765 43213',
      monthlyTarget: 200000,
      monthlyAchieved: 55771,
      monthlyGap: 144229,
      monthlyAchievement: 27.9,
      cpTarget: 8,
      cpOnboarded: 8,
      cpOnboardedGap: 0,
      activeCPTarget: 6,
      activeCP: 4,
      activeCPGap: 2,
      cpActivationRate: 50.0,
      weeklyProgress: {
        week1: { revenue: 14000, cpOnboarded: 2, activeCP: 1 },
        week2: { revenue: 13000, cpOnboarded: 2, activeCP: 1 },
        week3: { revenue: 14000, cpOnboarded: 2, activeCP: 1 },
        week4: { revenue: 14771, cpOnboarded: 2, activeCP: 1 }
      },
      lastActivity: getDateString(5),
      status: 'red',
      escalationLevel: 'critical',
      attendance: {
        totalDays: 22,
        presentDays: 12,
        absentDays: 8,
        lateDays: 2,
        lastLogin: getDateString(5),
        loginHistory: generateAttendanceHistory(22)
      }
    },
    { 
      id: 5, 
      name: 'James Davis', 
      email: 'james.davis@example.com',
      phone: '+91 98765 43214',
      monthlyTarget: 200000,
      monthlyAchieved: 101541,
      monthlyGap: 98459,
      monthlyAchievement: 50.8,
      cpTarget: 10,
      cpOnboarded: 9,
      cpOnboardedGap: 1,
      activeCPTarget: 8,
      activeCP: 7,
      activeCPGap: 1,
      cpActivationRate: 77.8,
      weeklyProgress: {
        week1: { revenue: 25000, cpOnboarded: 2, activeCP: 2 },
        week2: { revenue: 24000, cpOnboarded: 2, activeCP: 2 },
        week3: { revenue: 26000, cpOnboarded: 3, activeCP: 2 },
        week4: { revenue: 26541, cpOnboarded: 2, activeCP: 1 }
      },
      lastActivity: getDateString(5),
      status: 'yellow',
      escalationLevel: 'critical',
      attendance: {
        totalDays: 22,
        presentDays: 15,
        absentDays: 5,
        lateDays: 2,
        lastLogin: getDateString(5),
        loginHistory: generateAttendanceHistory(22)
      }
    }
  ]
}

// Team Leaders data
export const teamLeaders = [
  {
    id: 1,
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@company.com',
    phone: '+91 98765 43220',
    region: 'North Zone',
    team: [1, 2],
    monthlyTarget: 400000,
    monthlyAchieved: 342404,
    monthlyGap: 57596,
    monthlyAchievement: 85.6,
    attendance: {
      totalDays: 22,
      presentDays: 20,
      absentDays: 1,
      lateDays: 1,
      lastLogin: new Date().toISOString(),
      loginHistory: generateAttendanceHistory(22)
    },
    meetings: [],
    escalationLevel: null
  },
  {
    id: 2,
    name: 'Priya Sharma',
    email: 'priya.sharma@company.com',
    phone: '+91 98765 43221',
    region: 'South Zone',
    team: [3, 4, 5],
    monthlyTarget: 600000,
    monthlyAchieved: 238603,
    monthlyGap: 361397,
    monthlyAchievement: 39.8,
    attendance: {
      totalDays: 22,
      presentDays: 18,
      absentDays: 2,
      lateDays: 2,
      lastLogin: new Date().toISOString(),
      loginHistory: generateAttendanceHistory(22)
    },
    meetings: [],
    escalationLevel: 'high'
  }
]