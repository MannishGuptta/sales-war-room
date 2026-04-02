import { calculateKPIs } from "./kpiEngine"

export function buildDashboardData({
  sales = [],
  meetings = [],
  cps = [],
  targets = {},
  period = "today"
}) {

  // ---------------- KPI ENGINE ----------------
  const kpis = calculateKPIs({ sales, meetings, cps })
  const selected = kpis[period] || kpis["today"]

  const stats = {
    cp: selected.cpOnboard || 0,
    activeCP: selected.activeCP || 0,
    meetings: selected.meetings || 0,
    sales: selected.deals || 0,
    revenue: selected.revenue || 0
  }

  // ---------------- TARGET ENGINE ----------------
  let factor = 1
  if (period === "today") factor = 30
  if (period === "week") factor = 4
  if (period === "month") factor = 1
  if (period === "lifetime") factor = 1

  const adjustedTargets = {
    cp: Math.round((targets?.monthly_cp_onboard || 0) / factor),
    activeCP: Math.round((targets?.monthly_active_cp || 0) / factor),
    meetings: Math.round((targets?.monthly_meetings || 0) / factor),
    sales: Math.round((targets?.monthly_sales || 0) / factor),
    revenue: Math.round((targets?.monthly_revenue || 0) / factor)
  }

  // ---------------- ACTION PLAN ----------------
  const actionPlan = {
    cp: Math.max(adjustedTargets.cp - stats.cp, 0),
    activeCP: Math.max(adjustedTargets.activeCP - stats.activeCP, 0),
    meetings: Math.max(adjustedTargets.meetings - stats.meetings, 0),
    sales: Math.max(adjustedTargets.sales - stats.sales, 0),
    revenue: Math.max(adjustedTargets.revenue - stats.revenue, 0)
  }

  // ---------------- PIPELINE ----------------
  let pipelineValue = 0
  let forecast = 0

  sales.forEach(s => {
    const value = Number(s.plot_value || 0)

    let probability = 0
    switch (s.stage) {
      case "Inquiry": probability = 0.2; break
      case "Meeting": probability = 0.4; break
      case "Site Visit": probability = 0.6; break
      case "Negotiation": probability = 0.8; break
      case "Booking": probability = 0.95; break
      default: probability = 0
    }

    pipelineValue += value
    forecast += value * probability
  })

  // ---------------- ALERTS ----------------
  let alerts = []

  meetings.forEach(m => {
    if (!m.notes || m.notes.length < 5) {
      alerts.push({ text: `Meeting notes missing for ${m.client_name}` })
    }
  })

  sales.forEach(s => {
    if (s.balance_amount > 0) {
      alerts.push({ text: `Balance pending from ${s.applicant1_name}` })
    }
  })

  // ---------------- DEAL BOARD ----------------
  let dealBoard = sales.map(s => {
    let p = 0
    switch (s.stage) {
      case "Inquiry": p = 0.2; break
      case "Meeting": p = 0.4; break
      case "Site Visit": p = 0.6; break
      case "Negotiation": p = 0.8; break
      case "Booking": p = 0.95; break
    }

    const value = Number(s.plot_value || 0)

    return {
      client: s.applicant1_name,
      stage: s.stage,
      probability: Math.round(p * 100),
      expected: Math.round(value * p)
    }
  }).sort((a, b) => b.probability - a.probability).slice(0, 10)

  // ---------------- CP PREDICTOR ----------------
  let cpScore = {}

  cps.forEach(cp => {
    cpScore[cp.id] = { name: cp.name, score: 0 }
  })

  meetings.forEach(m => {
    if (cpScore[m.cp_id]) cpScore[m.cp_id].score += 2
  })

  sales.forEach(s => {
    if (cpScore[s.cp_id]) cpScore[s.cp_id].score += 5
  })

  const cpPredict = Object.values(cpScore)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)

  // ---------------- RETURN EVERYTHING ----------------
  return {
    stats,
    adjustedTargets,
    actionPlan,
    pipeline: {
      value: pipelineValue,
      forecast: Math.round(forecast)
    },
    alerts,
    dealBoard,
    cpPredict
  }
}