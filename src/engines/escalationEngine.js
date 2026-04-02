export const calculateEscalation = (rm, currentDate = new Date(), currentWeek = 3) => {
    const { monthlyAchievement, cpActivationRate, lastActivity, weeklyProgress } = rm
    
    // Calculate days since last activity
    let daysSinceActivity = 0
    if (lastActivity) {
      const lastActivityDate = new Date(lastActivity)
      daysSinceActivity = Math.floor((currentDate - lastActivityDate) / (1000 * 60 * 60 * 24))
    }
    
    // Calculate week-to-date progress
    const weekProgress = weeklyProgress[`week${currentWeek}`]
    const weeklyTargetRevenue = rm.monthlyTarget / 4
    const weeklyRevenuePercent = weekProgress ? (weekProgress.revenue / weeklyTargetRevenue) * 100 : 0
    
    // CRITICAL: No activity for 2+ days OR Week progress < 20%
    if (daysSinceActivity >= 2 || (currentWeek === 3 && weeklyRevenuePercent < 20)) {
      const reason = daysSinceActivity >= 2 
        ? `No activity for ${daysSinceActivity} days`
        : `Only ${weeklyRevenuePercent.toFixed(0)}% of weekly target achieved`
      return {
        level: 'critical',
        message: `${reason} - URGENT INTERVENTION NEEDED`,
        recommendation: 'Call RM immediately, conduct emergency coaching session'
      }
    }
    
    // HIGH: Monthly achievement <40% OR CP activation <30% OR Week progress <40%
    if (monthlyAchievement < 40 || cpActivationRate < 30 || weeklyRevenuePercent < 40) {
      const reasons = []
      if (monthlyAchievement < 40) reasons.push(`${monthlyAchievement.toFixed(1)}% monthly achievement`)
      if (cpActivationRate < 30) reasons.push(`${cpActivationRate.toFixed(1)}% CP activation`)
      if (weeklyRevenuePercent < 40) reasons.push(`${weeklyRevenuePercent.toFixed(0)}% week progress`)
      
      return {
        level: 'high',
        message: `${reasons.join(', ')} - CRITICAL UNDERPERFORMANCE`,
        recommendation: 'Schedule daily performance review, shadow senior RM for a day'
      }
    }
    
    // MEDIUM: Monthly achievement <60% OR CP activation <50% OR Week progress <60%
    if (monthlyAchievement < 60 || cpActivationRate < 50 || weeklyRevenuePercent < 60) {
      const reasons = []
      if (monthlyAchievement < 60) reasons.push(`${monthlyAchievement.toFixed(1)}% monthly achievement`)
      if (cpActivationRate < 50) reasons.push(`${cpActivationRate.toFixed(1)}% CP activation`)
      if (weeklyRevenuePercent < 60) reasons.push(`${weeklyRevenuePercent.toFixed(0)}% week progress`)
      
      return {
        level: 'medium',
        message: `${reasons.join(', ')} - BELOW TARGET`,
        recommendation: 'Weekly coaching session, review opportunity pipeline together'
      }
    }
    
    return null
  }
  
  export const processAllRMs = (rms, currentWeek = 3) => {
    if (!rms || !Array.isArray(rms)) {
      return []
    }
    
    return rms.map(rm => {
      const escalation = calculateEscalation(rm, new Date(), currentWeek)
      
      // Determine status based on multiple factors
      let status = 'green'
      const monthlyAchievement = rm.monthlyAchievement || 0
      const cpActivationRate = rm.cpActivationRate || 0
      const weekProgress = rm.weeklyProgress[`week${currentWeek}`]
      const weeklyTargetRevenue = rm.monthlyTarget / 4
      const weeklyRevenuePercent = weekProgress ? (weekProgress.revenue / weeklyTargetRevenue) * 100 : 0
      
      if (monthlyAchievement < 40 || cpActivationRate < 30 || weeklyRevenuePercent < 40) status = 'red'
      else if (monthlyAchievement < 60 || cpActivationRate < 50 || weeklyRevenuePercent < 60) status = 'yellow'
      
      return {
        ...rm,
        status,
        escalationLevel: escalation?.level || null,
        escalationMessage: escalation?.message || null,
        recommendation: escalation?.recommendation || null,
        currentWeekProgress: {
          revenue: weekProgress?.revenue || 0,
          revenuePercent: weeklyRevenuePercent,
          cpOnboarded: weekProgress?.cpOnboarded || 0,
          activeCP: weekProgress?.activeCP || 0
        }
      }
    })
  }
  
  export const generateInterventions = (processedRMs) => {
    if (!processedRMs || !Array.isArray(processedRMs)) {
      return []
    }
    
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
        weekProgress: rm.currentWeekProgress,
        daysInactive: rm.lastActivity ? Math.floor((new Date() - new Date(rm.lastActivity)) / (1000 * 60 * 60 * 24)) : 0,
        timestamp: new Date().toISOString()
      }))
  }