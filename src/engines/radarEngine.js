export function calculateRadarDeals(salesData,getProbability){

    let radar = []
    
    salesData?.forEach(s=>{
    
    const value = Number(s.plot_value || 0)
    const probability = getProbability(s.stage)
    
    const score = value * probability
    
    if(probability >= 0.6){
    
    radar.push({
    client:s.applicant1_name,
    stage:s.stage,
    value:value,
    score:score
    })
    
    }
    
    })
    
    radar.sort((a,b)=>b.score-a.score)
    
    return radar.slice(0,8)
    
    }