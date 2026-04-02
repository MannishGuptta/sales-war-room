export function generateRMExecutionTargets({
    rmData = [],
    totalGap = 0,
    totalTeamRevenue = 0,
    daysLeft = 1
  }) {
  
    if (!rmData.length || totalGap <= 0) return []
  
    return rmData.map(rm => {
  
      // ✅ WEIGHT BASED ON PERFORMANCE
      const weight =
        totalTeamRevenue > 0
          ? rm.revenue / totalTeamRevenue
          : 1 / rmData.length
  
      const rmGap = totalGap * weight
  
      // ✅ DAILY BREAKDOWN
      const dailyRevenue = rmGap / Math.max(daysLeft, 1)
  
      // ✅ SMART DEAL VALUE
      let avgDeal = 500000
  
      if (rm.deals > 0 && rm.revenue > 0) {
        avgDeal = rm.revenue / rm.deals
      }
  
      avgDeal = Math.max(100000, Math.min(avgDeal, 2000000))
  
      let dealsNeeded = dailyRevenue / avgDeal
      dealsNeeded = Math.max(dealsNeeded, 0.5)
      dealsNeeded = Math.ceil(dealsNeeded)
  
      const meetingsNeeded = Math.ceil(dealsNeeded * 2)
      const cpNeeded = Math.ceil(dealsNeeded * 1)
  
      return {
        id: rm.id,
        name: rm.name,
  
        revenueTarget: Math.round(rmGap),
        dailyRevenue: Math.round(dailyRevenue),
  
        dealsNeeded,
        meetingsNeeded,
        cpNeeded
      }
    })
  }