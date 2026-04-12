import React, { useEffect, useState } from "react";

export default function LiveTicker({ sales = [], meetings = [], cps = [] }) {

const [messages,setMessages] = useState([])
const [index,setIndex] = useState(0)

useEffect(()=>{

let list=[]

sales.slice(0,5).forEach(s=>{
list.push(`💰 Deal Closed: ${s.applicant1_name} - ₹${Number(s.plot_value || 0).toLocaleString()}`)
})

meetings.slice(0,5).forEach(m=>{
list.push(`📅 Meeting Logged: ${m.client_name || "Client Meeting"}`)
})

cps.slice(0,5).forEach(c=>{
list.push(`🤝 New CP Onboarded: ${c.name}`)
})

setMessages(list)

},[sales,meetings,cps])

useEffect(()=>{

if(messages.length===0) return

const interval=setInterval(()=>{
setIndex(prev => (prev + 1) % messages.length)
},4000)

return ()=>clearInterval(interval)

},[messages])

if(messages.length===0){
return null
}

return(

<div style={ticker}>

<span>{messages[index]}</span>

</div>

)

}

const ticker={
background:"#222",
color:"#fff",
padding:"10px 20px",
borderRadius:6,
marginBottom:20,
fontSize:14
}