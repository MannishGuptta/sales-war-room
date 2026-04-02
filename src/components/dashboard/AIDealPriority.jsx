export default function AIDealPriority({sales}){

    function probability(stage){
    
    switch(stage){
    
    case "Inquiry": return 0.2
    case "Meeting": return 0.4
    case "Site Visit": return 0.6
    case "Negotiation": return 0.8
    case "Booking": return 1
    default: return 0
    
    }
    
    }
    
    function dealScore(deal){
    
    let value = Number(deal.plot_value || 0)
    
    let stageScore = probability(deal.stage) * 50
    
    let valueScore = Math.min(value / 1000000,20)
    
    let activityScore = 0
    
    if(deal.last_meeting_date){
    
    let diff = (new Date() - new Date(deal.last_meeting_date))/(1000*60*60*24)
    
    if(diff <= 2) activityScore = 20
    else if(diff <= 5) activityScore = 10
    
    }
    
    return Math.round(stageScore + valueScore + activityScore)
    
    }
    
    let ranked = sales?.map(d=>({
    
    client:d.applicant1_name,
    value:d.plot_value,
    stage:d.stage,
    score:dealScore(d)
    
    })) || []
    
    ranked.sort((a,b)=>b.score-a.score)
    
    let topDeals = ranked.slice(0,5)
    
    return(
    
    <div style={card}>
    
    <h3>AI Priority Deals</h3>
    
    {topDeals.length===0 ? <p>No active deals</p> :
    
    topDeals.map((d,i)=>(
    
    <div key={i} style={row}>
    
    <div>{d.client}</div>
    
    <div>{d.stage}</div>
    
    <div>₹{d.value}</div>
    
    <div><b>{d.score}</b></div>
    
    </div>
    
    ))
    
    }
    
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
    
    const row={
    display:"grid",
    gridTemplateColumns:"2fr 1fr 1fr 1fr",
    padding:"8px 0",
    borderBottom:"1px solid #eee"
    }