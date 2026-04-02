// AI Prediction Engine for Sales War Room

export const predictMonthlyOutcome = (rm, currentWeek, currentDate = new Date()) => {
    const weeksInMonth = 4
    const progress = rm.weeklyProgress
    
    // Calculate average weekly performance
    let totalRevenue = 0
    let totalCP = 0
    let totalActive = 0
    let weeksWithData = 0
    
    for (let i = 1; i <= currentWeek; i++) {
      const weekData = progress[`week${i}`]
      if (weekData) {
        totalRevenue += weekData.revenue
        totalCP += weekData.cpOnboarded
        totalActive += weekData.activeCP
        weeksWithData++
      }
    }
    
    const avgWeeklyRevenue = weeksWithData > 0 ? totalRevenue / weeksWithData : 0
    const avgWeeklyCP = weeksWithData > 0 ? totalCP / weeksWithData : 0
    const avgWeeklyActive = weeksWithData > 0 ? totalActive / weeksWithData : 0
    
    // Predict remaining weeks
    const remainingWeeks = weeksInMonth - currentWeek
    const predictedRevenue = rm.monthlyAchieved + (avgWeeklyRevenue * remainingWeeks)
    const predictedCP = rm.cpOnboarded + (avgWeeklyCP * remainingWeeks)
    const predictedActive = rm.activeCP + (avgWeeklyActive * remainingWeeks)
    
    // Calculate achievement percentage
    const predictedAchievement = (predictedRevenue / rm.monthlyTarget) * 100
    
    // Calculate required weekly pace to hit target
    const remainingTarget = rm.monthlyTarget - rm.monthlyAchieved
    const requiredWeeklyRevenue = remainingWeeks > 0 ? remainingTarget / remainingWeeks : 0
    
    const requiredCP = rm.cpTarget - rm.cpOnboarded
    const requiredWeeklyCP = remainingWeeks > 0 ? requiredCP / remainingWeeks : 0
    
    const requiredActive = rm.activeCPTarget - rm.activeCP
    const requiredWeeklyActive = remainingWeeks > 0 ? requiredActive / remainingWeeks : 0
    
    // Confidence level based on data consistency
    const consistencyScore = Math.min(100, (weeksWithData / currentWeek) * 100)
    let confidence = 'Low'
    if (consistencyScore > 70) confidence = 'High'
    else if (consistencyScore > 40) confidence = 'Medium'
    
    return {
      predictedRevenue: Math.round(predictedRevenue),
      predictedAchievement: Math.min(100, Math.round(predictedAchievement)),
      predictedCP: Math.round(predictedCP),
      predictedActive: Math.round(predictedActive),
      requiredWeeklyRevenue: Math.round(requiredWeeklyRevenue),
      requiredWeeklyCP: Math.max(0, Math.round(requiredWeeklyCP)),
      requiredWeeklyActive: Math.max(0, Math.round(requiredWeeklyActive)),
      remainingWeeks,
      confidence,
      onTrack: predictedAchievement >= 100
    }
  }
  
  export const generateAISuggestions = (rm, prediction, currentWeek) => {
    const suggestions = []
    
    // Revenue-based suggestions
    if (prediction.predictedAchievement < 60) {
      suggestions.push({
        priority: 'High',
        category: 'Revenue',
        title: 'Revenue Target at Risk',
        description: `Current pace suggests only ${prediction.predictedAchievement}% achievement. Need ${prediction.requiredWeeklyRevenue.toLocaleString('en-IN')} ₹ per week remaining.`,
        action: 'Increase daily sales calls by 50%, focus on high-value prospects',
        expectedImpact: `${Math.round(prediction.requiredWeeklyRevenue / 1000)}K ₹ per week`
      })
    } else if (prediction.predictedAchievement < 85) {
      suggestions.push({
        priority: 'Medium',
        category: 'Revenue',
        title: 'Revenue Target Needs Push',
        description: `Need ${prediction.requiredWeeklyRevenue.toLocaleString('en-IN')} ₹ per week to hit target.`,
        action: 'Run a weekend sales blitz, offer limited-time discounts',
        expectedImpact: `${Math.round(prediction.requiredWeeklyRevenue / 2000)}K ₹ extra per week`
      })
    }
    
    // CP-based suggestions
    if (prediction.predictedCP < rm.cpTarget) {
      suggestions.push({
        priority: prediction.predictedCP < rm.cpTarget * 0.5 ? 'High' : 'Medium',
        category: 'Channel Partners',
        title: 'CP Onboarding Behind Target',
        description: `Need ${prediction.requiredWeeklyCP} more CPs per week to meet target of ${rm.cpTarget}.`,
        action: 'Host a CP onboarding webinar, increase referral incentives',
        expectedImpact: `${prediction.requiredWeeklyCP} additional CPs per week`
      })
    }
    
    // Active CP suggestions
    if (prediction.predictedActive < rm.activeCPTarget) {
      const currentActivationRate = (rm.activeCP / rm.cpOnboarded) * 100
      if (currentActivationRate < 50) {
        suggestions.push({
          priority: 'High',
          category: 'CP Activation',
          title: 'Low CP Activation Rate',
          description: `Only ${currentActivationRate.toFixed(0)}% of onboarded CPs are active.`,
          action: 'Implement CP training program, provide sales incentives for first deal',
          expectedImpact: `Activate ${prediction.requiredWeeklyActive} CPs per week`
        })
      } else {
        suggestions.push({
          priority: 'Medium',
          category: 'CP Activation',
          title: 'Increase CP Activation',
          description: `Need ${prediction.requiredWeeklyActive} more active CPs to hit target.`,
          action: 'Send weekly engagement emails, offer bonus for first 5 sales',
          expectedImpact: `${prediction.requiredWeeklyActive} additional active CPs`
        })
      }
    }
    
    // Efficiency suggestions based on CP activation rate
    const activationRate = (rm.activeCP / rm.cpOnboarded) * 100
    if (rm.cpOnboarded > 0 && activationRate < 30) {
      suggestions.push({
        priority: 'Critical',
        category: 'Quality',
        title: 'Poor CP Quality',
        description: `${rm.cpOnboarded} CPs onboarded but only ${rm.activeCP} are active.`,
        action: 'Review CP selection criteria, provide one-on-one coaching to inactive CPs',
        expectedImpact: 'Improve activation rate by 30% in 2 weeks'
      })
    }
    
    // Weekly performance trend
    const weeklyRevenue = []
    for (let i = 1; i <= currentWeek; i++) {
      weeklyRevenue.push(rm.weeklyProgress[`week${i}`]?.revenue || 0)
    }
    
    if (weeklyRevenue.length >= 2) {
      const trend = weeklyRevenue[weeklyRevenue.length - 1] - weeklyRevenue[weeklyRevenue.length - 2]
      if (trend < 0 && Math.abs(trend) > 5000) {
        suggestions.push({
          priority: 'High',
          category: 'Trend',
          title: 'Declining Weekly Performance',
          description: `Revenue dropped by ${Math.abs(trend).toLocaleString('en-IN')} ₹ from last week.`,
          action: 'Review pipeline health, identify lost deals, accelerate pending closures',
          expectedImpact: 'Reverse negative trend this week'
        })
      } else if (trend > 10000) {
        suggestions.push({
          priority: 'Low',
          category: 'Trend',
          title: 'Positive Momentum',
          description: `Revenue increased by ${trend.toLocaleString('en-IN')} ₹ from last week.`,
          action: 'Maintain current strategy, replicate successful tactics',
          expectedImpact: 'Continue growth trajectory'
        })
      }
    }
    
    return suggestions.sort((a, b) => {
      const priorityOrder = { Critical: 0, High: 1, Medium: 2, Low: 3 }
      return priorityOrder[a.priority] - priorityOrder[b.priority]
    })
  }
  
  export const calculateOverallTeamPrediction = (rms, currentWeek) => {
    let totalPredictedRevenue = 0
    let totalTarget = 0
    let atRiskCount = 0
    let criticalCount = 0
    
    rms.forEach(rm => {
      const prediction = predictMonthlyOutcome(rm, currentWeek)
      totalPredictedRevenue += prediction.predictedRevenue
      totalTarget += rm.monthlyTarget
      
      if (prediction.predictedAchievement < 60) atRiskCount++
      if (prediction.predictedAchievement < 40) criticalCount++
    })
    
    const teamAchievement = (totalPredictedRevenue / totalTarget) * 100
    
    return {
      totalPredictedRevenue,
      totalTarget,
      teamAchievement: Math.round(teamAchievement),
      atRiskCount,
      criticalCount,
      onTrackCount: rms.length - atRiskCount - criticalCount
    }
  }