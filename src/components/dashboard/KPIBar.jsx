export default function KPIBar({ stats = {}, targets = {}, period, setPeriod }) {

    const periods = ["today", "week", "month", "lifetime"]
  
    return (
      <div style={wrapper}>
  
        {/* 🔥 PERIOD TOGGLE */}
        <div style={periodBar}>
          {periods.map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              style={period === p ? activeBtn : btn}
            >
              {p.toUpperCase()}
            </button>
          ))}
        </div>
  
        {/* 🎯 KPI GRID */}
        <div style={kpiGrid}>
  
          <KPI title="CP Onboarded" value={stats.cp} target={targets.cp} />
          <KPI title="Active CP" value={stats.activeCP} target={targets.activeCP} />
          <KPI title="Meetings" value={stats.meetings} target={targets.meetings} />
          <KPI title="Deals Closed" value={stats.sales} target={targets.sales} />
          <KPI title="Revenue" value={stats.revenue} target={targets.revenue} highlight />
  
        </div>
  
      </div>
    )
  }
  
  
  /* 🔹 KPI COMPONENT */
  function KPI({ title, value, target, highlight }) {
  
    const safeValue = Number(value) || 0
    const safeTarget = Number(target) || 0
  
    const achievement = safeTarget > 0
      ? Math.round((safeValue / safeTarget) * 100)
      : 0
  
    // 🎯 COLOR LOGIC
    let color = "#e53935" // red
    let status = "Critical"
  
    if (achievement >= 80) {
      color = "#43a047"
      status = "On Track"
    } else if (achievement >= 50) {
      color = "#fbc02d"
      status = "At Risk"
    }
  
    const icon =
      achievement >= 80 ? "🟢" :
      achievement >= 50 ? "🟡" :
      "🔴"
  
    return (
      <div style={{
        ...(highlight ? highlightCard : card),
        borderTop: `4px solid ${highlight ? "#fff" : color}`
      }}>
  
        <h4>{icon} {title}</h4>
  
        <h2>
          {title === "Revenue" ? `₹${safeValue}` : safeValue}
        </h2>
  
        {target !== undefined && (
          <p style={subText}>
            Target: {target || 0} | {achievement}% ({status})
          </p>
        )}
  
      </div>
    )
  }
  
  
  /* 🎨 STYLES */
  
  const wrapper = {
    marginTop: 20,
    marginBottom: 20
  }
  
  const periodBar = {
    display: "flex",
    gap: 10,
    marginBottom: 20
  }
  
  const btn = {
    padding: "8px 14px",
    border: "1px solid #ddd",
    background: "#fff",
    cursor: "pointer",
    borderRadius: 20,
    fontWeight: 500
  }
  
  const activeBtn = {
    ...btn,
    background: "#3f51b5",
    color: "#fff",
    border: "1px solid #3f51b5",
    boxShadow: "0 2px 8px rgba(63,81,181,0.3)"
  }
  
  const kpiGrid = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
    gap: 20
  }
  
  const card = {
    background: "#fff",
    padding: 18,
    borderRadius: 12,
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
  }
  
  const highlightCard = {
    ...card,
    background: "linear-gradient(135deg,#3f51b5,#5c6bc0)",
    color: "#fff",
    borderTop: "4px solid #fff"
  }
  
  const subText = {
    fontSize: 12,
    opacity: 0.8,
    marginTop: 6
  }