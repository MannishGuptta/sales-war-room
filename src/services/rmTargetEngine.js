export function generateRMTTargets({ rmStats, totalGap, totalTeamRevenue, allRMs }) {

    const safeTeamRevenue = Number(totalTeamRevenue) || 0
    const totalRMs = allRMs?.length || 1
  
    const weight = safeTeamRevenue > 0
      ? rmStats.revenue / safeTeamRevenue
      : 1 / totalRMs
  
    const allocatedGap = (Number(totalGap) || 0) * weight
  
    return {
      revenue: Math.round(allocatedGap),
      deals: Math.ceil(allocatedGap / 100000)
    }
  }