export default function RMControlPanel({ data = [] }) {

  const critical = data.filter(r => r.intervention?.status === "CRITICAL")
  const risk = data.filter(r => r.intervention?.status === "AT_RISK")
  const good = data.filter(r => r.intervention?.status === "ON_TRACK")

  const priority = [...data]
    .sort((a, b) => {
      const gapA = (a.intervention?.meetingGap || 0) + (a.intervention?.dealGap || 0)
      const gapB = (b.intervention?.meetingGap || 0) + (b.intervention?.dealGap || 0)
      return gapB - gapA
    })
    .slice(0, 3)

  return (
    <div style={{
      background: "#fff",
      padding: 20,
      borderRadius: 12,
      marginTop: 20
    }}>

      <h3>🎯 Control Panel</h3>

      <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
        <div style={{ color: "red" }}>🔴 Critical: {critical.length}</div>
        <div style={{ color: "orange" }}>🟡 At Risk: {risk.length}</div>
        <div style={{ color: "green" }}>🟢 On Track: {good.length}</div>
      </div>

      <div>
        <h4>🔥 Priority Actions</h4>

        {priority.map(rm => (
          <div key={rm.id} style={{
            padding: 10,
            borderBottom: "1px solid #eee"
          }}>
            <strong>{rm.name}</strong>

            <div style={{
              fontSize: 12,
              color:
                rm.intervention?.status === "CRITICAL"
                  ? "red"
                  : rm.intervention?.status === "AT_RISK"
                  ? "orange"
                  : "green"
            }}>
              {rm.intervention?.action}
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}