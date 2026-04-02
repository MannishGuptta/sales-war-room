import Card from "../common/Card"

export default function Alerts({alerts}){

return(

<Card title="Alerts">

{alerts.length===0
? <p>No alerts</p>
: alerts.map((a,i)=>(<p key={i}>{a.text}</p>))
}

</Card>

)

}