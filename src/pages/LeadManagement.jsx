import { useState,useEffect } from "react";
import { supabase } from "../supabaseClient";
import { generateID } from "../utils/idGenerator";

export default function LeadManagement(){

const [leads,setLeads] = useState([])
const [rms,setRms] = useState([])

const [name,setName] = useState("")
const [phone,setPhone] = useState("")
const [email,setEmail] = useState("")
const [city,setCity] = useState("")
const [source,setSource] = useState("")

useEffect(()=>{
loadData()
},[])

async function loadData(){

const {data:leadData} = await supabase
.from("leads")
.select("*")
.order("created_at",{ascending:false})

setLeads(leadData || [])

const {data:rmData} = await supabase
.from("users")
.select("*")
.eq("role","rm")

setRms(rmData || [])

}

/* CREATE LEAD */

async function createLead(){

const {error} = await supabase
.from("leads")
.insert([{

lead_code:generateID("LEAD"),

name,
phone,
email,
city,
source,
status:"Open"

}])

if(error){

alert("Lead creation failed")

}else{

alert("Lead created")

setName("")
setPhone("")
setEmail("")
setCity("")
setSource("")

loadData()

}

}

/* ASSIGN RM */

async function assignRM(lead_id,rm_id){

await supabase
.from("leads")
.update({
assigned_rm:rm_id
})
.eq("id",lead_id)

alert("Lead Assigned")

loadData()

}

/* CONVERT LEAD → CLIENT */

async function convertLead(lead){

const {data:client,error} = await supabase
.from("clients")
.insert([{

name:lead.name,
phone:lead.phone,
email:lead.email,
city:lead.city,
source:"Lead Conversion",
status:"new"

}])
.select()
.single()

if(error){

alert("Client conversion failed")
return

}

await supabase
.from("leads")
.update({
status:"Converted"
})
.eq("id",lead.id)

alert("Lead Converted to Client")

loadData()

}

return(

<div style={container}>

<h1>Lead Management</h1>

{/* CREATE LEAD */}

<div style={card}>

<h3>Create Lead</h3>

<input
placeholder="Client Name"
value={name}
onChange={(e)=>setName(e.target.value)}
/>

<input
placeholder="Phone"
value={phone}
onChange={(e)=>setPhone(e.target.value)}
/>

<input
placeholder="Email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
/>

<input
placeholder="City"
value={city}
onChange={(e)=>setCity(e.target.value)}
/>

<input
placeholder="Lead Source"
value={source}
onChange={(e)=>setSource(e.target.value)}
/>

<button onClick={createLead}>
Create Lead
</button>

</div>


{/* LEAD LIST */}

<div style={card}>

<h3>Leads</h3>

{leads.map(lead=>(

<div key={lead.id} style={row}>

<div>

<b>{lead.name}</b>

<p>{lead.phone}</p>

<p>{lead.city}</p>

<p>Status: {lead.status}</p>

</div>

<div style={{display:"flex",gap:10}}>

<select
onChange={(e)=>assignRM(lead.id,e.target.value)}
>

<option>Assign RM</option>

{rms.map(rm=>(
<option key={rm.id} value={rm.id}>
{rm.name}
</option>
))}

</select>

{lead.status!=="Converted" && (

<button onClick={()=>convertLead(lead)}>
Convert
</button>

)}

</div>

</div>

))}

</div>

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
borderRadius:10,
marginBottom:20
}

const row={
display:"flex",
justifyContent:"space-between",
padding:"10px 0",
borderBottom:"1px solid #eee"
}