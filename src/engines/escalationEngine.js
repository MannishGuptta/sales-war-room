export const calculateEscalation = (rm, currentDate = new Date()) => {
    const { monthlyAchievement, lastActivity } = rm
    
    // Handle missing data
    if (!monthlyAchievement && monthlyAchievement !== 0) {
      return null
    }
    
    // Calculate days since last activity
    let daysSinceActivity = 0
    if (lastActivity) {
      const lastActivityDate = new Date(lastActivity)
      daysSinceActivity = Math.floor((currentDate - lastActivityDate) / (1000 * 60 * 60 * 24))
    }
    
    // CRITICAL: No activity for 2 or more days
    if (daysSinceActivity >= 2) {
      return {
        level: 'critical',
        message: `No activity for ${daysSinceActivity} days - URGENT INTERVENTION NEEDED`,
        recommendation: 'Call RM immediately, conduct emergency coaching session'
      }
    }
    
    // HIGH: Monthly achievement below 40%
    if (monthlyAchievement < 40) {
      return {
        level: 'high',
        message: `${monthlyAchievement.toFixed(1)}% achievement - CRITICAL UNDERPERFORMANCE`,
        recommendation: 'Schedule daily performance review, shadow senior RM for a day'
      }
    }
    
    // MEDIUM: Monthly achievement below 60%
    if (monthlyAchievement < 60) {
      return {
        level: 'medium',
        message: `${monthlyAchievement.toFixed(1)}% achievement - BELOW TARGET`,
        recommendation: 'Weekly coaching session, review opportunity pipeline together'
      }
    }
    
    return null
  }
  
  export const processAllRMs = (rms, currentWeek = 1) => {
    if (!rms || !Array.isArray(rms)) {
      return []
    }
    
    return rms.map(rm => {
      const escalation = calculateEscalation(rm)
      
      // Determine status based on monthly achievement
      let status = 'green'
      const monthlyAchievement = rm.monthlyAchievement || 0
      
      if (monthlyAchievement < 40) status = 'red'
      else if (monthlyAchievement < 60) status = 'yellow'
      
      // Calculate gap if not provided
      const gap = rm.monthlyGap || (rm.monthlyTarget - rm.monthlyAchieved)
      
      return {
        ...rm,
        status,
        monthlyGap: gap,
        escalationLevel: escalation?.level || null,
        escalationMessage: escalation?.message || null,
        recommendation: escalation?.recommendation || null,
        monthlyTarget: rm.monthlyTarget || 0,
        monthlyAchieved: rm.monthlyAchieved || 0,
        monthlyAchievement: monthlyAchievement,
        cpTarget: rm.cpTarget || 0,
        cpOnboarded: rm.cpOnboarded || 0,
        activeCPTarget: rm.activeCPTarget || 0,
        activeCP: rm.activeCP || 0,
        cpActivationRate: rm.cpActivationRate || (rm.cpOnboarded > 0 ? (rm.activeCP / rm.cpOnboarded) * 100 : 0)
      }
    })
  }
  
  export const generateInterventions = (processedRMs) => {
    if (!processedRMs || !Array.isArray(processedRMs)) {
      return []
    }
    
    // Sort by escalation level: critical > high > medium
    const levelOrder = { critical: 0, high: 1, medium: 2 }
    
    return processedRMs
      .filter(rm => rm.escalationLevel !== null)
      .sort((a, b) => {
        return (levelOrder[a.escalationLevel] || 999) - (levelOrder[b.escalationLevel] || 999)
      })
      .map((rm, index) => ({
        id: index + 1,
        rm: rm.name,
        level: rm.escalationLevel,
        message: rm.escalationMessage,
        recommendation: rm.recommendation,
        monthlyAchievement: rm.monthlyAchievement,
        cpActivationRate: rm.cpActivationRate,
        daysInactive: rm.lastActivity ? Math.floor((new Date() - new Date(rm.lastActivity)) / (1000 * 60 * 60 * 24)) : 0,
        timestamp: new Date().toISOString()
      }))
  }