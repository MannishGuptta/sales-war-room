export const calculateEscalation = (rm, currentDate = new Date()) => {
    const { achievementPercentage, lastActivity } = rm
    
    const lastActivityDate = new Date(lastActivity)
    const daysSinceActivity = Math.floor((currentDate - lastActivityDate) / (1000 * 60 * 60 * 24))
    
    if (daysSinceActivity >= 2) {
      return {
        level: 'critical',
        message: `No activity for ${daysSinceActivity} days - IMMEDIATE ACTION REQUIRED`,
        recommendation: 'Contact RM immediately, schedule urgent coaching session'
      }
    }
    
    if (achievementPercentage < 40) {
      return {
        level: 'high',
        message: `${achievementPercentage.toFixed(1)}% achievement - SEVERE UNDERPERFORMANCE`,
        recommendation: 'Mandatory daily check-ins, review pipeline, shadow senior RM'
      }
    }
    
    if (achievementPercentage < 60) {
      return {
        level: 'medium',
        message: `${achievementPercentage.toFixed(1)}% achievement - BELOW TARGET`,
        recommendation: 'Weekly coaching session, review opportunity pipeline'
      }
    }
    
    return null
  }
  
  export const processAllRMs = (rms) => {
    return rms.map(rm => {
      const escalation = calculateEscalation(rm)
      
      let status = 'green'
      if (rm.achievementPercentage < 40) status = 'red'
      else if (rm.achievementPercentage < 60) status = 'yellow'
      
      return {
        ...rm,
        status,
        escalationLevel: escalation?.level || null,
        escalationMessage: escalation?.message || null,
        recommendation: escalation?.recommendation || null
      }
    })
  }
  
  export const generateInterventions = (processedRMs) => {
    return processedRMs
      .filter(rm => rm.escalationLevel !== null)
      .map(rm => ({
        id: rm.id,
        rm: rm.name,
        level: rm.escalationLevel,
        message: rm.escalationMessage,
        recommendation: rm.recommendation,
        timestamp: new Date().toISOString()
      }))
  }