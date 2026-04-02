export function calculateDealRisk(salesData){

    let risks = []
    
    salesData?.forEach(s=>{
    
    const stage = s.stage
    const created = new Date(s.booking_date)
    const now = new Date()
    
    const age = Math.floor((now - created)/(1000*60*60*24))
    
    let risk = null
    
    if(stage==="Inquiry" && age>10){
    risk="HIGH"
    }
    
    else if(stage==="Meeting" && age>7){
    risk="HIGH"
    }
    
    else if(stage==="Site Visit" && age>7){
    risk="MEDIUM"
    }
    
    else if(stage==="Negotiation" && age>10){
    risk="MEDIUM"
    }
    
    if(risk){
    
    risks.push({
    client:s.applicant1_name,
    stage,
    risk
    })
    
    }
    
    })
    
    return risks.slice(0,10)
    
    }