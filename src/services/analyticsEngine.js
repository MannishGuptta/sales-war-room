export function calculateSalesMetrics(sales=[], meetings=[], cps=[]){

    let revenue = 0
    let pipelineValue = 0
    let forecast = 0
    
    const probability = (stage)=>{
    switch(stage){
    case "Inquiry": return 0.2
    case "Meeting": return 0.4
    case "Site Visit": return 0.6
    case "Negotiation": return 0.8
    case "Booking": return 0.95
    default: return 0
    }
    }
    
    sales.forEach(s=>{
    
    let value = Number(s.plot_value || 0)
    
    revenue += value
    pipelineValue += value
    forecast += value * probability(s.stage)
    
    })
    
    let active = new Set()
    
    meetings.forEach(m=>active.add(m.cp_id))
    sales.forEach(s=>active.add(s.cp_id))
    
    return{
    
    revenue,
    pipelineValue,
    forecast,
    activeCP:active.size,
    salesCount:sales.length,
    meetingsCount:meetings.length,
    cpCount:cps.length
    
    }
    
    }