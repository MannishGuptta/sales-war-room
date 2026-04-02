import React from "react";

export default function TargetRecoveryPanel({data={}}){

const avgDeal = data?.avgDealValue || 0
const deals = data?.dealsNeeded || 0
const meetings = data?.meetingsNeeded || 0
const cp = data?.activeCPNeeded || 0
const meetingsDay = data?.meetingsPerDayNeeded || 0

return(

<div style={card}>

<h2>Target Recovery Plan</h2>

<div style={grid}>

<Box title="Avg Deal Value" value={`₹ ${avgDeal.toLocaleString()}`} />

<Box title="Deals Needed" value={deals} />

<Box title="Meetings Needed" value={meetings} />

<Box title="Active CP Needed" value={cp} />

<Box title="Meetings / Day" value={meetingsDay} />

</div>

</div>

)

}

function Box({title,value}){

return(

<div style={box}>
<div style={valueStyle}>{value}</div>
<div style={labelStyle}>{title}</div>
</div>

)

}

const card={
background:"#fff",
padding:20,
borderRadius:10,
boxShadow:"0 2px 8px rgba(0,0,0,0.08)"
}

const grid={
display:"grid",
gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",
gap:15
}

const box={
background:"#f5f7fb",
padding:15,
borderRadius:8,
textAlign:"center"
}

const valueStyle={
fontSize:20,
fontWeight:"bold"
}

const labelStyle={
fontSize:12,
color:"#777"
}