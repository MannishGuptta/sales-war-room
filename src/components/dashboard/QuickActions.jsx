import { useNavigate } from "react-router-dom";

export default function QuickActions(){

const navigate = useNavigate()

return(

<div style={container}>

<h3 style={title}>Quick Actions</h3>

<div style={grid}>

<button style={btn} onClick={()=>navigate("/onboard-cp")}>
+ Add CP
</button>

<button style={btn} onClick={()=>navigate("/clients")}>
My CP
</button>

<button style={btn} onClick={()=>navigate("/add-deal")}>
+ Add Deal
</button>

<button style={btn} onClick={()=>navigate("/log-meeting")}>
Log Meeting
</button>

</div>

</div>

)

}

/* CARD CONTAINER */

const container = {

background:"#fff",
padding:"16px",
borderRadius:"12px",
marginBottom:"20px",
boxShadow:"0 2px 8px rgba(0,0,0,0.08)"

}

/* TITLE */

const title = {

marginBottom:"12px",
fontSize:"16px",
fontWeight:"600"

}

/* RESPONSIVE GRID */

const grid = {

display:"grid",
gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",
gap:"10px"

}

/* BUTTON STYLE */

const btn = {

height:"48px",
borderRadius:"10px",
border:"1px solid #e5e7eb",
background:"#f6f7fb",
cursor:"pointer",
fontWeight:"600",
fontSize:"14px",
boxShadow:"0 1px 4px rgba(0,0,0,0.08)"

}