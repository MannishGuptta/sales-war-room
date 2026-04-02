export default function RMProductivity({stats,targets}){

    function progress(done,target){
    
    if(!target || target===0) return 0
    
    return Math.min(done/target,1)
    
    }
    
    let meetingScore =
    progress(stats.meetings,targets.monthly_meetings) * 30
    
    let dealScore =
    progress(stats.sales,targets.monthly_deals) * 25
    
    let cpScore =
    progress(stats.cp,targets.monthly_cp_onboard) * 20
    
    let revenueScore =
    progress(stats.revenue,targets.monthly_revenue) * 25
    
    let total =
    Math.round(meetingScore + dealScore + cpScore + revenueScore)
    
    let color = "#4caf50"
    
    if(total < 70) color = "#ff9800"
    if(total < 50) color = "#f44336"
    
    return(
    
    <div style={card}>
    
    <h3>RM Productivity Score</h3>
    
    <div style={score}>
    
    <span style={{color}}>{total}%</span>
    
    </div>
    
    <div style={grid}>
    
    <p>Meetings: {stats.meetings} / {targets.monthly_meetings || 0}</p>
    
    <p>Deals: {stats.sales} / {targets.monthly_deals || 0}</p>
    
    <p>CP Onboard: {stats.cp} / {targets.monthly_cp_onboard || 0}</p>
    
    <p>Revenue: ₹{stats.revenue} / ₹{targets.monthly_revenue || 0}</p>
    
    </div>
    
    </div>
    
    )
    
    }
    
    const card={
    background:"#fff",
    padding:20,
    borderRadius:10,
    marginBottom:20,
    boxShadow:"0 2px 10px rgba(0,0,0,0.1)"
    }
    
    const score={
    fontSize:36,
    fontWeight:"bold",
    marginBottom:10
    }
    
    const grid={
    display:"grid",
    gridTemplateColumns:"1fr 1fr",
    gap:10
    }