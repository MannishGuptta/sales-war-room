import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard(){

const navigate = useNavigate()

const [cps,setCps] = useState([])
const [sales,setSales] = useState([])
const [clients,setClients] = useState([])

useEffect(()=>{
loadData()
},[])

async function loadData(){

const {data:cpData} = await supabase
.from("channel_partners")
.select("*")

setCps(cpData || [])

const {data:salesData} = await supabase
.from("sales")
.select("*")

setSales(salesData || [])

const {data:clientData} = await supabase
.from("clients")
.select("*")

setClients(clientData || [])

}

/* DELETE CP */

async function deleteCP(id){

if(!window.confirm("Delete CP?")) return

await supabase
.from("channel_partners")
.delete()
.eq("id",id)

loadData()

}

/* DELETE DEAL */

async function deleteDeal(id){

if(!window.confirm("Delete Deal?")) return

await supabase
.from("sales")
.delete()
.eq("id",id)

loadData()

}

/* EXPORT CSV */

function downloadCSV(data,fileName){

if(!data.length) return

const headers = Object.keys(data[0]).join(",")

const rows = data.map(obj =>
Object.values(obj).join(",")
)

const csv = [headers,...rows].join("\n")

const blob = new Blob([csv],{type:"text/csv"})

const url = URL.createObjectURL(blob)

const a = document.createElement("a")

a.href = url
a.download = fileName

a.click()

}

/* UI */

return(

<div style={container}>

<h1>Admin Control Panel</h1>

{/* ADMIN ACTION BUTTONS */}

<div style={actionBox}>

<button onClick={()=>navigate("/admin/add-cp")}>
Add Channel Partner
</button>

<button onClick={()=>navigate("/admin/add-meeting")}>
Add Meeting
</button>

<button onClick={()=>navigate("/admin/add-sale")}>
Add Sale
</button>

<button onClick={()=>navigate("/war-room")}>
Open War Room
</button>

</div>

{/* EXPORT BUTTONS */}

<div style={exportBox}>

<button onClick={()=>downloadCSV(cps,"cp_list.csv")}>
Download CP List
</button>

<button onClick={()=>downloadCSV(clients,"client_list.csv")}>
Download Client List
</button>

<button onClick={()=>downloadCSV(sales,"sales_report.csv")}>
Download Sales Report
</button>

</div>

{/* CP MANAGEMENT */}

<h2>Channel Partners</h2>

<div style={table}>

{cps.map(cp=>(
<div key={cp.id} style={row}>

<div>
<strong>{cp.name}</strong><br/>
<span style={sub}>{cp.city}</span>
</div>

<button style={deleteBtn} onClick={()=>deleteCP(cp.id)}>
Delete
</button>

</div>
))}

</div>

{/* DEAL MANAGEMENT */}

<h2>Deals</h2>

<div style={table}>

{sales.map(deal=>(
<div key={deal.id} style={row}>

<div>
<strong>{deal.applicant1_name}</strong><br/>
<span style={sub}>{deal.project_name}</span>
</div>

<button style={deleteBtn} onClick={()=>deleteDeal(deal.id)}>
Delete
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
maxWidth:1000
}

const actionBox={
display:"flex",
gap:15,
marginBottom:25,
flexWrap:"wrap"
}

const exportBox={
display:"flex",
gap:15,
marginBottom:30
}

const table={
display:"flex",
flexDirection:"column",
gap:10,
marginBottom:30
}

const row={
display:"flex",
justifyContent:"space-between",
alignItems:"center",
background:"#fff",
padding:15,
borderRadius:8,
boxShadow:"0 2px 6px rgba(0,0,0,0.08)"
}

const sub={
fontSize:12,
color:"#777"
}

const deleteBtn={
background:"#e53935",
color:"#fff",
border:"none",
padding:"8px 14px",
borderRadius:6,
cursor:"pointer"
}