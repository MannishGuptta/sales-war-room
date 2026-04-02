export async function loadWarRoomData(supabase,getProbability){

    const today = new Date()
    const todayStr = today.toISOString().split("T")[0]
    const monthStart = new Date(today.getFullYear(),today.getMonth(),1)
    
    /* LOAD SALES */
    
    const {data:salesData,error:salesError} = await supabase
    .from("sales")
    .select("*")
    
    if(salesError) throw salesError
    
    /* LOAD USERS */
    
    const {data:rms} = await supabase
    .from("users")
    .select("id,name")
    .eq("role","rm")
    
    return {
    salesData,
    rms,
    today,
    todayStr,
    monthStart
    }
    
    }