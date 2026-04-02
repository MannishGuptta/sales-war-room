export default function RMLeaderboard({ data = [] }) {

    console.log("RM UI DATA:", data)
  
    return (
      <div style={{
        background: "#fff",
        padding: 20,
        borderRadius: 12,
        marginTop: 20
      }}>
        <h3>🏆 RM Leaderboard</h3>
  
        {data.map((rm, index) => (
          <div key={rm.id} style={{
            padding: 12,
            borderBottom: "1px solid #eee"
          }}>
  
            <div style={{ fontWeight: "600" }}>
              {index + 1}. {rm.name}
            </div>
  
            <div style={{ fontSize: 12, color: "#555" }}>
              ₹{rm.revenue.toLocaleString("en-IN")} | 
              {rm.deals} deals | 
              {rm.meetings} meetings
            </div>
  
            {/* 🔥 EXECUTION */}
            <div style={{
              fontSize: 12,
              marginTop: 6,
              color: rm.execution ? "#333" : "red"
            }}>
              {rm.execution
                ? `🎯 ${rm.execution.dealsNeeded} deals | 🤝 ${rm.execution.meetingsNeeded} meetings | 💰 ₹${rm.execution.dailyRevenue.toLocaleString("en-IN")}/day`
                : "❌ No execution data"
              }
            </div>
  
          </div>
        ))}
      </div>
    )
  }