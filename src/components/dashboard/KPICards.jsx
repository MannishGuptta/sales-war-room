import Card from "../common/Card"

export default function KPICards({stats}){

return(

<div style={kpiGrid}>

<Card title="CP Onboarded" value={stats.cp}/>
<Card title="Active CP" value={stats.activeCP}/>
<Card title="Meetings Logged" value={stats.meetings}/>
<Card title="Deals Closed" value={stats.sales}/>
<Card title="Revenue Generated" value={`₹${stats.revenue}`}/>

</div>

)

}

const kpiGrid={
display:"grid",
gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",
gap:20,
marginBottom:20
}