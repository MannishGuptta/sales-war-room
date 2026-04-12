import React from "react";

export default function WarRoomFilters({
period,
setPeriod,
selectedRM,
setSelectedRM,
rmLeaderboard
}){

return(

<div style={{marginBottom:30}}>

<div style={{display:"flex",gap:10,marginBottom:10}}>

<button onClick={()=>setPeriod("today")}>Today</button>
<button onClick={()=>setPeriod("week")}>Week</button>
<button onClick={()=>setPeriod("month")}>Month</button>
<button onClick={()=>setPeriod("lifetime")}>Lifetime</button>

</div>

<select
value={selectedRM}
onChange={(e)=>setSelectedRM(e.target.value)}
>

<option value="all">All RMs</option>

{(rmLeaderboard || []).map((rm,index)=>(
<option key={index} value={rm.rm_id || rm.name}>
{rm.name}
</option>
))}

</select>

</div>

)

}