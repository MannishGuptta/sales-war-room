export default function ExecutionPlan(props) {

    // ✅ SAFE EXTRACTION (no destructuring crash)
    const actionPlan = props?.actionPlan || {}
    const period = props?.period || "today"
  
    // ✅ SAFE TITLE
    let title = "Execution"
  
    if (period === "today") title = "Today's"
    else if (period === "week") title = "Weekly"
    else if (period === "month") title = "Monthly"
    else title = "Strategic"
  
    return (
      <div style={card}>
        <h3>🔥 {title} Execution Plan</h3>
  
        <p>Meetings Needed: {Number(actionPlan.meetings) || 0}</p>
        <p>Deals Needed: {Number(actionPlan.sales) || 0}</p>
        <p>CP Onboard Needed: {Number(actionPlan.cp) || 0}</p>
        <p>Revenue Needed: ₹{Number(actionPlan.revenue) || 0}</p>
      </div>
    )
  }
  
  const card = {
    background: "#fff",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)"
  }