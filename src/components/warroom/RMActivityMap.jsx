import React from "react";

export default function RMActivityMap({ rmStatus }) {

const rms = rmStatus || []

return(

<div style={card}>

<h3>RM Activity Map</h3>

{rms.length === 0 && (
<p>No RM location data</p>
)}

<ul>

{rms.map((rm,i)=>{

if(!rm.lat || !rm.lng) return null

return(
<li key={i}>
{rm.rm_name} — {rm.lat},{rm.lng}
</li>
)

})}

</ul>

</div>

)

}

const card={
background:"#fff",
padding:20,
borderRadius:10,
boxShadow:"0 2px 10px rgba(0,0,0,0.1)"
}