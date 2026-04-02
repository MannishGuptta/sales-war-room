export default function DealHeatMap({sales}){

    let hot=[]
    let warm=[]
    let cold=[]
    
    sales?.forEach(s=>{
    
    switch(s.stage){
    
    case "Negotiation":
    hot.push(s)
    break
    
    case "Site Visit":
    warm.push(s)
    break
    
    default:
    cold.push(s)
    
    }
    
    })
    
    return(
    
    <div style={card}>
    
    <h3>Deal Heat Map</h3>
    
    <div style={grid}>
    
    <div>
    
    <h4 style={{color:"red"}}>🔥 Hot Deals</h4>
    
    {hot.length===0 ? <p>No hot deals</p> :
    
    hot.slice(0,5).map((d,i)=>(
    <p key={i}>{d.applicant1_name}</p>
    ))
    
    }
    
    </div>
    
    <div>
    
    <h4 style={{color:"orange"}}>🟠 Warm Deals</h4>
    
    {warm.length===0 ? <p>No warm deals</p> :
    
    warm.slice(0,5).map((d,i)=>(
    <p key={i}>{d.applicant1_name}</p>
    ))
    
    }
    
    </div>
    
    <div>
    
    <h4 style={{color:"blue"}}>❄ Cold Deals</h4>
    
    {cold.length===0 ? <p>No cold deals</p> :
    
    cold.slice(0,5).map((d,i)=>(
    <p key={i}>{d.applicant1_name}</p>
    ))
    
    }
    
    </div>
    
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
    
    const grid={
    display:"grid",
    gridTemplateColumns:"1fr 1fr 1fr",
    gap:20
    }