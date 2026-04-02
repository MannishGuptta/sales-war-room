export const calculateMetrics = (rms) => {
    const totalRevenueTarget = rms.reduce((sum, rm) => sum + rm.monthlyTarget, 0)
    const totalRevenueAchieved = rms.reduce((sum, rm) => sum + rm.monthlyAchieved, 0)
    const revenueGap = totalRevenueTarget - totalRevenueAchieved
    const revenueConversion = totalRevenueTarget > 0 ? (totalRevenueAchieved / totalRevenueTarget) * 100 : 0
    
    const totalCPTarget = rms.reduce((sum, rm) => sum + rm.cpTarget, 0)
    const totalCPOnboarded = rms.reduce((sum, rm) => sum + rm.cpOnboarded, 0)
    const cpGap = totalCPTarget - totalCPOnboarded
    
    const totalActiveCPTarget = rms.reduce((sum, rm) => sum + rm.activeCPTarget, 0)
    const totalActiveCP = rms.reduce((sum, rm) => sum + rm.activeCP, 0)
    const activeCPGap = totalActiveCPTarget - totalActiveCP
    
    const cpActivationRate = totalCPOnboarded > 0 ? (totalActiveCP / totalCPOnboarded) * 100 : 0
    
    return {
      totalRevenueTarget,
      totalRevenueAchieved,
      revenueGap,
      revenueConversion: Math.round(revenueConversion),
      totalCPTarget,
      totalCPOnboarded,
      cpGap,
      totalActiveCPTarget,
      totalActiveCP,
      activeCPGap,
      cpActivationRate: Math.round(cpActivationRate)
    }
  }