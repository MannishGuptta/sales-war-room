import { useEffect,useState } from "react";
import { supabase } from "../supabaseClient";

export default function Clients(){

const [clients,setClients] = useState([]);

useEffect(()=>{
loadClients();
},[])

async function loadClients(){

const {data} = await supabase
.from("clients")
.select("*")
.order("created_at",{ascending:false});

setClients(data || []);

}

return(

<div style={container}>

<h1>Clients</h1>

<table style={table}>

<thead>
<tr>
<th>Name</th>
<th>Phone</th>
<th>City</th>
<th>Budget</th>
<th>Status</th>
</tr>
</thead>

<tbody>

{clients.map((c,i)=>(

<tr key={i}>
<td>{c.name}</td>
<td>{c.phone}</td>
<td>{c.city}</td>
<td>₹ {c.budget}</td>
<td>{c.status}</td>
</tr>

))}

</tbody>

</table>

</div>

)

}

const container={
padding:40
}

const table={
width:"100%",
borderCollapse:"collapse"
}