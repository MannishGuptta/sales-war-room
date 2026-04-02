export function calculateKPIs({ sales = [], meetings = [], cps = [] }) {

    const now = new Date()
  
    // ✅ SAFE DATE PARSER
    function getDate(obj) {
      const raw =
        obj.booking_date ||   // 🔥 PRIORITY (your DB)
        obj.created_at ||
        obj.meeting_date ||
        obj.date ||
        obj.createdAt ||
        obj.updated_at
  
      if (!raw) return new Date()
  
      const d = new Date(raw)
      if (isNaN(d.getTime())) return new Date()
  
      return d
    }
  
    // ✅ VALUE EXTRACTOR (🔥 CRITICAL FIX)
    function getSaleValue(s) {
      return (
        Number(s.plot_value) ||       // 🔥 MAIN FIELD (your DB)
        Number(s.booking_amount) ||
        Number(s.sale_value) ||
        Number(s.deal_value) ||
        Number(s.amount) ||
        0
      )
    }
  
    // ✅ TODAY (ROLLING)
    // ✅ TODAY (CALENDAR FIX)
const isToday = (obj) => {
    const d = getDate(obj)
    const now = new Date()
  
    return (
      d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    )
  }
  
    // ✅ WEEK (ROLLING)
    const isThisWeek = (obj) => {
      const d = getDate(obj)
      const diff = (new Date() - d) / (1000 * 60 * 60 * 24)
      return diff <= 7
    }
  
    // ✅ MONTH (CALENDAR)
    const isThisMonth = (obj) => {
      const d = getDate(obj)
      return (
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear()
      )
    }
  
    // ✅ CORE CALCULATION
    function compute(dataSales, dataMeetings, dataCps) {
      return {
        cpOnboard: dataCps.length,
  
        activeCP: dataCps.filter(c =>
          c.active === true ||
          c.status === "active" ||
          c.is_active === true
        ).length,
  
        meetings: dataMeetings.length,
  
        deals: dataSales.length,
  
        revenue: dataSales.reduce((sum, s) =>
          sum + getSaleValue(s), 0)
      }
    }
  
    // 🔍 DEBUG (KEEP THIS FOR NOW)
    console.log("TOTAL SALES:", sales.length)
    console.log("SAMPLE SALE:", sales[0])
    console.log("PARSED DATE:", sales[0] ? getDate(sales[0]) : null)
    console.log("SAMPLE VALUE:", sales[0] ? getSaleValue(sales[0]) : null)
  
    console.log("TODAY SALES:", sales.filter(isToday).length)
    console.log("WEEK SALES:", sales.filter(isThisWeek).length)
    console.log("MONTH SALES:", sales.filter(isThisMonth).length)
  
    // ✅ FINAL OUTPUT
    return {
      today: compute(
        sales.filter(isToday),
        meetings.filter(isToday),
        cps.filter(isToday)
      ),
  
      week: compute(
        sales.filter(isThisWeek),
        meetings.filter(isThisWeek),
        cps.filter(isThisWeek)
      ),
  
      month: compute(
        sales.filter(isThisMonth),
        meetings.filter(isThisMonth),
        cps.filter(isThisMonth)
      ),
  
      lifetime: compute(
        sales,
        meetings,
        cps
      )
    }
  }