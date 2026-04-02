import Card from "../common/Card"

export default function RecentActivity({meetings,sales}){

return(

<div style={grid}>

<Card title="Recent Meetings">

{meetings.map((m,i)=>(
<p key={i}>{m.client_name}</p>
))}

</Card>

<Card title="Recent Deals">

{sales.map((s,i)=>(
<p key={i}>{s.applicant1_name}</p>
))}

</Card>

</div>

)

}

const grid={
display:"grid",
gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",
gap:20
}