import React from "react";

export default function ActivitySection({ rmStatus, activityFeed }) {

const rms = rmStatus || []
const activity = activityFeed || []

return (

<div style={card}>

<h3>RM Activity</h3>

<h4>RM Status</h4>

{rms.length === 0 && (
<p>No RM activity</p>
)}

<ul>
{rms.map((rm, i) => (
<li key={i}>
{rm.rm_name || "RM"} — {rm.status || "Offline"}
</li>
))}
</ul>

<h4>Recent Activity</h4>

{activity.length === 0 && (
<p>No activity yet</p>
)}

<ul>
{activity.map((a, i) => (
<li key={i}>
{a.text || "Activity"}
</li>
))}
</ul>

</div>

)

}

const card = {
background: "#fff",
padding: 20,
borderRadius: 10,
boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
}
