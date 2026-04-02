import Card from "../common/Card"

export default function CPPredictor({cpPredict}){

return(

<Card title="CP Conversion Predictor">

{cpPredict.map((cp,i)=>(
<p key={i}>{cp.name}</p>
))}

</Card>

)

}