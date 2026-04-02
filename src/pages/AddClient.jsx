import { useState } from "react";
import { supabase } from "../supabaseClient";

export default function AddClient(){

const [name,setName] = useState("");
const [phone,setPhone] = useState("");
const [city,setCity] = useState("");
const [budget,setBudget] = useState("");
const [source,setSource] = useState("");

async function saveClient(){

const user = JSON.parse(sessionStorage.getItem("user"));

const {error} = await supabase
.from("clients")
.insert([{
name,
phone,
city,
budget,
source,
rm_id:user?.id
}]);

if(error){
alert("Error saving client");
console.log(error);
}
else{

alert("Client Added");

setName("");
setPhone("");
setCity("");
setBudget("");
setSource("");

}

}

return(

<div style={container}>

<h1>Add Client</h1>

<div style={form}>

<label>Name</label>
<input value={name} onChange={(e)=>setName(e.target.value)} />

<label>Phone</label>
<input value={phone} onChange={(e)=>setPhone(e.target.value)} />

<label>City</label>
<input value={city} onChange={(e)=>setCity(e.target.value)} />

<label>Budget</label>
<input value={budget} onChange={(e)=>setBudget(e.target.value)} />

<label>Source</label>
<input value={source} onChange={(e)=>setSource(e.target.value)} />

<button onClick={saveClient}>Save Client</button>

</div>

</div>

)

}

const container={
padding:40,
fontFamily:"Arial"
}

const form={
display:"flex",
flexDirection:"column",
gap:10,
maxWidth:400
}