export default function RadarPanel({aiDeals}){

    return(
    
    <div style={radarBox}>
    
    <h2>AI Deal Closing Radar</h2>
    
    {aiDeals.length===0 ?
    
    <p>No strong deals detected</p>
    
    :
    
    aiDeals.map((d,i)=>(
    <div key={i} style={radarRow}>
    <div>{d.client}</div>
    <div>{d.stage}</div>
    <div>₹{d.value.toLocaleString()}</div>
    </div>
    ))
    
    }
    
    </div>
    
    )
    
    }
    
    const radarBox={
    background:"#fff",
    padding:20,
    borderRadius:10,
    marginBottom:40,
    boxShadow:"0 2px 10px rgba(0,0,0,0.1)"
    }
    
    const radarRow={
    display:"grid",
    gridTemplateColumns:"2fr 1fr 1fr",
    padding:"10px 0",
    borderBottom:"1px solid #eee"
    }