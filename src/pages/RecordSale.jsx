import React, { useState } from "react";
import { supabase } from "../supabaseClient";

export default function RecordSale() {

const [clientName,setClientName] = useState("");
const [projectName,setProjectName] = useState("");
const [amount,setAmount] = useState("");

async function saveSale(){

const { error } = await supabase
.from("sales")
.insert([
{
amount: Number(amount),
sale_date: new Date().toISOString().split("T")[0],
product: projectName || "Property Sale",
payment_status: "pending"
}
]);

if(error){

console.log(error);
alert("Error saving sale");

}else{

alert("Sale Recorded Successfully");

setClientName("");
setProjectName("");
setAmount("");

}

}

return(

<div style={{padding:40,fontFamily:"Arial"}}>

<h1>Record Sale</h1>

<div style={{display:"flex",flexDirection:"column",gap:12,maxWidth:400}}>

<label>Client Name</label>
<input
value={clientName}
onChange={(e)=>setClientName(e.target.value)}
/>

<label>Project Name</label>
<input
value={projectName}
onChange={(e)=>setProjectName(e.target.value)}
/>

<label>Sale Amount</label>
<input
type="number"
value={amount}
onChange={(e)=>setAmount(e.target.value)}
/>

<button onClick={saveSale}>
Record Sale
</button>

</div>

</div>

);

}