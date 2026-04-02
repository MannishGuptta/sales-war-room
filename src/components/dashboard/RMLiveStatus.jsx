import { useEffect,useState } from "react"
import { supabase } from "../../supabaseClient"

export default function RMLiveStatus(){

const [rms,setRms] = useState([])

useEffect(()=>{

loadStatus()

},[])

async function loadStatus(){

const { data:users } = await supabase
.from("users")
.select("id,name")

let list=[]

for(const rm of users || []){

const { data:activity } = await supabase
.from("rm_activity")
.select("created_at")
.eq("rm_id",rm.id)
.order("created_at",{ascending:false})
.limit(1)
.maybeSingle()

let status="Offline"
let color="red"

if(activity){

const diff =
(new Date() - new Date(activity.created_at)) / (1000*60)

if(diff < 30){

status="Active"
color="green"

}
else if(diff < 120){

status="Idle"
color="orange"

}

}

list.push({

name:rm.name,
status,
color

})

}

setRms(list)

}

return(

<div style={card}>

<h3>RM Live Status</h3>

{rms.map((rm,i)=>(

<div key={i} style={row}>

<span
style={{
width:10,
height:10,
background:rm.color,
borderRadius:"50%",
display:"inline-block",
marginRight:10
}}
></span>

{rm.name}

<span style={{marginLeft:"auto"}}>
{rm.status}
</span>

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
alignItems:"center",
padding:"8px 0",
borderBottom:"1px solid #eee"
}