export default function RiskPanel({riskDeals}){

    return(
    
    <div style={riskBox}>
    
    <h2>⚠ Deals At Risk</h2>
    
    {riskDeals.length===0 ?
    
    <p>No risky deals detected</p>
    
    :
    
    riskDeals.map((d,i)=>(
    <div key={i} style={riskRow}>
    <div>{d.client}</div>
    <div>{d.stage}</div>
    <div style={{
    color: d.risk==="HIGH" ? "red":"orange",
    fontWeight:"bold"
    }}>
    {d.risk}
    </div>
    </div>
    ))
    
    }
    
    </div>
    
    )
    
    }
    
    const riskBox={
    background:"#fff",
    padding:20,
    borderRadius:10,
    marginBottom:40,
    boxShadow:"0 2px 10px rgba(0,0,0,0.1)"
    }
    
    const riskRow={
    display:"grid",
    gridTemplateColumns:"2fr 1fr 1fr",
    padding:"10px 0",
    borderBottom:"1px solid #eee"
    }