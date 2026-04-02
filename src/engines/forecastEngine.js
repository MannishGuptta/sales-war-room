export function calculateForecast(salesData,getProbability){

    let high=0
    let medium=0
    let low=0
    
    salesData?.forEach(s=>{
    
    const value = Number(s.plot_value || 0)
    const p = getProbability(s.stage)
    
    const weighted = value*p
    
    if(p>=0.8) high += weighted
    else if(p>=0.5) medium += weighted
    else low += weighted
    
    })
    
    return {
    expected: high+medium+low,
    high,
    medium,
    low
    }
    
    }