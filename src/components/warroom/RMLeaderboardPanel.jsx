export default function RMLeaderboard({ data = [], onSelect }) {

    function getColor(score) {
      if (score >= 80) return "#43a047"
      if (score >= 50) return "#fbc02d"
      return "#e53935"
    }
  
    return (
      <div style={container}>
  
        <h3>🏆 RM Leaderboard</h3>
  
        {data.map((rm, i) => {
  
          const score =
            rm.target && rm.target > 0
              ? Math.round((rm.revenue / rm.target) * 100)
              : 0
  
          const color = getColor(score)
  
          return (
            <div
              key={i}
              onClick={() => onSelect && onSelect(rm)}
              style={{
                ...row,
                borderLeft: `6px solid ${color}`,
                cursor: "pointer"
              }}
            >
              <div style={{ width: 50 }}>
                #{i + 1}
              </div>
  
              <div style={{ flex: 1 }}>
                <strong>{rm.name}</strong>
                <div style={{ fontSize: 12 }}>
                  {score}% performance
                </div>
              </div>
  
              <div>₹{rm.revenue || 0}</div>
              <div>{rm.deals || 0}</div>
              <div>{rm.meetings || 0}</div>
  
            </div>
          )
        })}
  
      </div>
    )
  }
  
  /* STYLES */
  
  const container = {
    background: "#fff",
    padding: 20,
    borderRadius: 12,
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    marginTop: 20
  }
  
  const row = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderBottom: "1px solid #eee"
  }