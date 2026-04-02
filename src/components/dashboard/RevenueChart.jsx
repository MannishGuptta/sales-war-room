import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import {
LineChart,
Line,
CartesianGrid,
XAxis,
YAxis,
Tooltip,
ResponsiveContainer
} from "recharts";

export default function RevenueChart({ filter }){

const [data,setData] = useState([])

useEffect(()=>{

loadRevenue()

},[filter])

async function loadRevenue(){

const user = JSON.parse(sessionStorage.getItem("user"))
if(!user) return

const rm_id = user.id

const {data:sales} = await supabase
.from("sales")
.select("*")
.eq("rm_id",rm_id)

if(!sales) return

const now = new Date()

function inRange(date){

const d = new Date(date)

if(filter==="today"){
return d.toDateString()===now.toDateString()
}

if(filter==="week"){
const start = new Date()
start.setDate(now.getDate()-now.getDay())
return d>=start
}

if(filter==="month"){
return d.getMonth()===now.getMonth()
}

return true

}

const filtered = sales.filter(s=>inRange(s.booking_date))

let map={}

filtered.forEach(s=>{

let day=new Date(s.booking_date).toLocaleDateString()

if(!map[day]) map[day]=0

map[day]+=Number(s.plot_value||0)

})

let chartData = Object.keys(map).map(d=>({

date:d,
revenue:map[d]

}))

setData(chartData)

}

return(

<div style={card}>

<h3>Revenue Trend</h3>

<ResponsiveContainer width="100%" height={300}>

<LineChart data={data}>

<Line type="monotone" dataKey="revenue" stroke="#5c6bc0"/>

<CartesianGrid stroke="#ccc"/>

<XAxis dataKey="date"/>

<YAxis/>

<Tooltip/>

</LineChart>

</ResponsiveContainer>

</div>

)

}

const card={
background:"#fff",
padding:20,
borderRadius:10,
marginBottom:20,
boxShadow:"0 2px 10px rgba(0,0,0,0.08)"
}