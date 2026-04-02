import { FunnelChart, Funnel, Tooltip, LabelList } from "recharts"

export default function SalesFunnel({sales}){

let stages={
Inquiry:0,
Meeting:0,
"Site Visit":0,
Negotiation:0,
Booking:0
}

sales?.forEach(s=>{

if(stages[s.stage] !== undefined){
stages[s.stage]++
}

})

const data=[
{name:"Inquiry",value:stages["Inquiry"]},
{name:"Meeting",value:stages["Meeting"]},
{name:"Site Visit",value:stages["Site Visit"]},
{name:"Negotiation",value:stages["Negotiation"]},
{name:"Booking",value:stages["Booking"]}
]

return(

<div style={card}>

<h3>Sales Funnel</h3>

<FunnelChart width={500} height={300}>

<Tooltip/>

<Funnel dataKey="value" data={data} isAnimationActive>

<LabelList position="right" fill="#000"/>

</Funnel>

</FunnelChart>

</div>

)

}

const card={
background:"#fff",
padding:20,
borderRadius:10,
marginBottom:20,
boxShadow:"0 2px 10px rgba(0,0,0,0.1)"
}