export default function BottleneckPanel({ bottleneck }){

    if(!bottleneck) return null
    
    return(
    
    <div style={bottleneckBox}>
    
    <h2>Pipeline Bottleneck Detector</h2>
    
    {bottleneck.stage ?
    
    <p>
    ⚠ Deals are accumulating at
    <b> {bottleneck.stage} </b>
    stage ({bottleneck.count} deals)
    </p>
    
    :
    
    <p>No bottleneck detected</p>
    
    }
    
    </div>
    
    )
    
    }
    
    const bottleneckBox={
    background:"#fff",
    padding:20,
    borderRadius:10,
    marginBottom:40,
    boxShadow:"0 2px 10px rgba(0,0,0,0.1)"
    }