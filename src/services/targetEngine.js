export function generateSmartTargets({
    current = {},
    targetRevenue = 0,
    daysLeft = 1
  }) {
  
    if (!targetRevenue || targetRevenue <= 0) {
      return {
        revenue: 0,
        sales: 0,
        meetings: 0,
        cp: 0,
        activeCP: 0
      }
    }
  
    const effectiveDays = Math.max(daysLeft, 1)
  
    // 🔥 DAILY TARGET
    const dailyRevenueNeeded = targetRevenue / effectiveDays
  
    // 🔥 FIXED AVG DEAL (CONTROLLED)
    let avgDealValue = 1000000   // 👉 HARD BASE: 10L
  
    if (current.sales > 0 && current.revenue > 0) {
      avgDealValue = current.revenue / current.sales
    }
  
    // 🚨 CRITICAL FIX (CAP RANGE)
    avgDealValue = Math.min(Math.max(avgDealValue, 300000), 2000000)
  
    // 🔥 DEAL CALC
    let dealsNeeded = dailyRevenueNeeded / avgDealValue
  
    // ✅ FORCE REAL OUTPUT
    dealsNeeded = Math.max(1, Math.ceil(dealsNeeded))
  
    const meetingsNeeded = Math.max(3, Math.ceil(dealsNeeded * 3))
    const cpNeeded = Math.max(2, Math.ceil(meetingsNeeded / 2))
  
    return {
      revenue: Math.ceil(dailyRevenueNeeded),
      sales: dealsNeeded,
      meetings: meetingsNeeded,
      cp: cpNeeded,
      activeCP: Math.ceil(cpNeeded * 0.7)
    }
  }
  