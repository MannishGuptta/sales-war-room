import React from "react";

export default function TargetCommandPanel({ data }) {

if(!data) return null;

return (
<div style={{
background:"#ffffff",
padding:20,
borderRadius:10,
marginBottom:20
}}>

<h3>Target Command</h3>

<p><b>Target Revenue:</b> ₹{data.targetRevenue}</p>
<p><b>Achieved:</b> ₹{data.achievedRevenue}</p>
<p><b>Gap:</b> ₹{data.gapRevenue}</p>
<p><b>Days Left:</b> {data.daysLeft}</p>
<p><b>Revenue Needed / Day:</b> ₹{data.revenuePerDayNeeded}</p>

</div>
);

}