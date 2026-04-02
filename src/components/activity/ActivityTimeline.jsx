import { useEffect,useState } from "react"
import { supabase } from "../../supabaseClient"

export default function ActivityTimeline(){

const [activities,setActivities] = useState([])

useEffect(()=>{

loadActivities()

},[])

async function loadActivities(){

const user = JSON.parse(sessionStorage.getItem("user"))

if(!user) return

const today = new Date()
today.setHours(0,0,0,0)

const { data } = await supabase
.from("rm_activity")
.select("*")
.eq("rm_id",user.id)
.gte("created_at",today.toISOString())
.order("created_at",{ascending:false})

setActivities(data || [])

}

function formatTime(date){

return new Date(date).toLocaleTimeString([],{
hour:"2-digit",
minute:"2-digit"
})

}

return(

<div style={card}>

<h3>Today's Activity</h3>

{activities.length === 0 && <p>No activity today</p>}

{activities.map((a,i)=>(

<div key={i} style={row}>

<div style={time}>
{formatTime(a.created_at)}
</div>

<div>

<b>{a.activity_type}</b>

{a.latitude &&
<p style={location}>
📍 {a.latitude.toFixed(4)}, {a.longitude.toFixed(4)}
</p>
}

</div>

</div>

))}

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

const row={
display:"flex",
gap:20,
padding:"8px 0",
borderBottom:"1px solid #eee"
}

const time={
width:80,
fontWeight:"bold"
}

const location={
fontSize:12,
color:"#666"
}