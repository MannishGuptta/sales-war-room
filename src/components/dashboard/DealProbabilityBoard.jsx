import Card from "../common/Card"

export default function DealProbabilityBoard({deals}){

return(

<Card title="Deal Probability Board">

{deals.map((d,i)=>(

<div key={i} style={dealRow}>
<div>{d.client}</div>
<div>{d.stage}</div>
<div>{d.probability}%</div>
<div>₹{d.expected}</div>
</div>

))}

</Card>

)

}

const dealRow={
display:"grid",
gridTemplateColumns:"2fr 1fr 1fr 1fr",
padding:"8px 0",
borderBottom:"1px solid #eee"
}