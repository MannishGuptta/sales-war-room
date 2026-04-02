import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function RMLeads(){

const [leads,setLeads] = useState([])

useEffect(()=>{
loadLeads()
},[])

async function loadLeads(){

const user = JSON.parse(sessionStorage.getItem("user"))

if(!user) return

const {data,error} = await supabase
.from("leads")
.select("*")
.eq("assigned_rm",user.id)

if(error){
console.log(error)
return
}

setLeads(data || [])

}

async function updateStage(id,stage){

const {error} = await supabase
.from("leads")
.update({
lead_stage:stage
})
.eq("id",id)

if(error){
console.log(error)
}

loadLeads()

}

return(

<div style={container}>

<h1>My Leads</h1>

{leads.map(l=>(

<div key={l.id} style={card}>

<b>{l.name}</b>

<p>Expected Value: ₹{l.expected_value}</p>

<select
value={l.lead_stage || "Inquiry"}
onChange={(e)=>updateStage(l.id,e.target.value)}
>

<option value="Inquiry">Inquiry</option>
<option value="Meeting">Meeting</option>
<option value="Site Visit">Site Visit</option>
<option value="Negotiation">Negotiation</option>
<option value="Booking">Booking</option>

</select>

</div>

))}

</div>

)

}

const container={
padding:40,
fontFamily:"Arial"
}

const card={
background:"#fff",
padding:20,
marginBottom:10,
borderRadius:8,
boxShadow:"0 2px 6px rgba(0,0,0,0.1)"
}