import { useState } from "react";

export default function FilterTabs({ onChange }) {

const [active,setActive] = useState("month")

function select(tab){
setActive(tab)
onChange(tab)
}

return (

<div style={container}>

<button
style={active==="today"?activeBtn:btn}
onClick={()=>select("today")}
>
Today
</button>

<button
style={active==="week"?activeBtn:btn}
onClick={()=>select("week")}
>
This Week
</button>

<button
style={active==="month"?activeBtn:btn}
onClick={()=>select("month")}
>
This Month
</button>

<button
style={active==="all"?activeBtn:btn}
onClick={()=>select("all")}
>
All Time
</button>

</div>

)

}

const container={
display:"flex",
gap:"10px",
marginBottom:"20px"
}

const btn={
padding:"8px 14px",
borderRadius:"6px",
border:"1px solid #ddd",
background:"#f4f6fb",
cursor:"pointer"
}

const activeBtn={
padding:"8px 14px",
borderRadius:"6px",
border:"1px solid #5c6bc0",
background:"#5c6bc0",
color:"#fff",
cursor:"pointer"
}