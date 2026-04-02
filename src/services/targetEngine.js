export function generateSmartTargets({ current, targetRevenue, daysLeft }) {

    const revenueGap = Math.max((targetRevenue || 0) - (current.revenue || 0), 0)
  
    // 🔥 fallback if no target
    if (!targetRevenue || targetRevenue === 0) {
      return {
        revenue: 0,
        sales: 0,
        meetings: 0,
        cp: 0,
        activeCP: 0
      }
    }
  
    const dailyRevenueNeeded = revenueGap / daysLeft
  
    const avgDealValue = current.sales > 0
      ? current.revenue / current.sales
      : 50000   // 🔥 fallback assumption
  
    const dealsNeeded = Math.ceil(dailyRevenueNeeded / avgDealValue)
  
    const meetingsNeeded = dealsNeeded * 3
    const cpNeeded = Math.ceil(meetingsNeeded / 2)
  
    return {
      revenue: Math.ceil(dailyRevenueNeeded),
      sales: dealsNeeded,
      meetings: meetingsNeeded,
      cp: cpNeeded,
      activeCP: Math.ceil(cpNeeded * 0.7)
    }
  }