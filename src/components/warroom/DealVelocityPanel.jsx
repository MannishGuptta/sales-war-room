import React from "react";

export default function DealVelocityPanel({dealVelocity}){

const avgDays = dealVelocity?.avgDays || 0
const fastDeals = dealVelocity?.fastDeals || []
const slowDeals = dealVelocity?.slowDeals || []

return(

<div style={card}>

<h3>Deal Velocity</h3>

<p>Average Closing Time: {avgDays} days</p>

<h4>Fast Deals</h4>

<ul>
{fastDeals.length === 0 && <li>No fast deals</li>}

{fastDeals.map((d,i)=>(
<li key={i}>{d.client || "Deal"}</li>
))}
</ul>

<h4>Slow Deals</h4>

<ul>
{slowDeals.length === 0 && <li>No slow deals</li>}

{slowDeals.map((d,i)=>(
<li key={i}>{d.client || "Deal"}</li>
))}
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