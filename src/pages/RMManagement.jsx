import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function RMManagement(){

const [rms,setRms] = useState([])
const [cps,setCps] = useState([])

const [name,setName] = useState("")
const [email,setEmail] = useState("")
const [phone,setPhone] = useState("")

const [selectedRM,setSelectedRM] = useState("")

/* LOAD DATA */

useEffect(()=>{
loadData()
},[])

async function loadData(){

const {data:rmData,error:rmError} = await supabase
.from("users")
.select("*")
.eq("role","rm")

if(rmError) console.log(rmError)

setRms(rmData || [])

const {data:cpData,error:cpError} = await supabase
.from("channel_partners")
.select("*")

if(cpError) console.log(cpError)

setCps(cpData || [])

}

/* CREATE RM */

async function createRM(){

if(!name || !email){
alert("Name and Email required")
return
}

const {error} = await supabase
.from("users")
.insert([{
name,
email,
phone,
role:"rm"
}])

if(error){

alert("Error creating RM")
console.log(error)

}else{

alert("RM created")

setName("")
setEmail("")
setPhone("")

loadData()

}

}

/* ASSIGN CP */

async function assignCP(cp_id){

if(!selectedRM){
alert("Select RM first")
return
}

const {error} = await supabase
.from("channel_partners")
.update({
rm_id:selectedRM
})
.eq("id",cp_id)

if(error){

alert("Error assigning CP")
console.log(error)

}else{

alert("CP Assigned")

loadData()

}

}

/* DELETE RM */

async function deleteRM(id){

if(!window.confirm("Delete RM?")) return

const {error} = await supabase
.from("users")
.delete()
.eq("id",id)

if(error){

alert("Error deleting RM")
console.log(error)

}else{

loadData()

}

}

/* UI */

return(

<div style={container}>

<h1>RM Management</h1>

{/* CREATE RM */}

<div style={card}>

<h3>Create RM</h3>

<input
placeholder="Name"
value={name}
onChange={(e)=>setName(e.target.value)}
/>

<input
placeholder="Email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
/>

<input
placeholder="Phone"
value={phone}
onChange={(e)=>setPhone(e.target.value)}
/>

<button style={button} onClick={createRM}>
Create RM
</button>

</div>

{/* RM LIST */}

<div style={card}>

<h3>Existing RMs</h3>

{rms.length===0 && <p>No RM found</p>}

{rms.map(rm=>(
<div key={rm.id} style={row}>

<div>
<strong>{rm.name}</strong><br/>
<span style={sub}>{rm.email}</span>
</div>

<button style={deleteBtn} onClick={()=>deleteRM(rm.id)}>
Delete
</button>

</div>
))}

</div>

{/* CP ASSIGNMENT */}

<div style={card}>

<h3>Assign CP to RM</h3>

<select
value={selectedRM}
onChange={(e)=>setSelectedRM(e.target.value)}
style={select}
>

<option value="">Select RM</option>

{rms.map(rm=>(
<option key={rm.id} value={rm.id}>
{rm.name}
</option>
))}

</select>

{cps.map(cp=>(
<div key={cp.id} style={row}>

<div>
<strong>{cp.name}</strong><br/>
<span style={sub}>{cp.city}</span>
</div>

<button style={assignBtn} onClick={()=>assignCP(cp.id)}>
Assign
</button>

</div>
))}

</div>

</div>

)

}

/* STYLES */

const container={
padding:40,
fontFamily:"Arial",
maxWidth:900
}

const card={
background:"#fff",
padding:20,
borderRadius:10,
marginBottom:25,
boxShadow:"0 2px 8px rgba(0,0,0,0.1)",
display:"flex",
flexDirection:"column",
gap:10
}

const row={
display:"flex",
justifyContent:"space-between",
alignItems:"center",
borderBottom:"1px solid #eee",
padding:"10px 0"
}

const sub={
fontSize:12,
color:"#777"
}

const button={
padding:"10px 14px",
background:"#5c6bc0",
color:"#fff",
border:"none",
borderRadius:6,
cursor:"pointer"
}

const assignBtn={
padding:"8px 14px",
background:"#26a69a",
color:"#fff",
border:"none",
borderRadius:6,
cursor:"pointer"
}

const deleteBtn={
padding:"8px 14px",
background:"#e53935",
color:"#fff",
border:"none",
borderRadius:6,
cursor:"pointer"
}

const select={
padding:10,
borderRadius:6
}
