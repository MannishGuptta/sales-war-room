import { useState, useEffect } from "react"
import { supabase } from "../supabaseClient"

export default function MeetingLogger(){

const [cps,setCps] = useState([])

const [clientName,setClientName] = useState("")
const [clientPhone,setClientPhone] = useState("")

const [cpId,setCpId] = useState("")
const [meetingMode,setMeetingMode] = useState("Physical")
const [meetingOutcome,setMeetingOutcome] = useState("Interested")
const [notes,setNotes] = useState("")

const [selfie,setSelfie] = useState(null)

useEffect(()=>{
loadCPs()
},[])


/* LOAD CHANNEL PARTNERS (ONLY RM OWN CPS) */

async function loadCPs(){

const user = JSON.parse(sessionStorage.getItem("user"))

if(!user) return

const {data,error} = await supabase
.from("channel_partners")
.select("id,name")
.eq("rm_id",user.id)

if(error){
console.log(error)
return
}

setCps(data || [])

}


/* GET GPS LOCATION */

function getLocation(){

return new Promise((resolve,reject)=>{

navigator.geolocation.getCurrentPosition(

(pos)=>{
resolve({
lat:pos.coords.latitude,
lng:pos.coords.longitude
})
},

(err)=>reject(err)

)

})

}


/* SAVE MEETING */

async function saveMeeting(){

/* GET LOGGED IN RM */

const user = JSON.parse(sessionStorage.getItem("user"))

if(!user){
alert("User session expired. Login again.")
return
}

const rm_id = user.id

if(!rm_id){
alert("RM ID missing")
return
}


/* VALIDATION */

if(!clientName){
alert("Enter client name")
return
}

if(!clientPhone){
alert("Enter client phone")
return
}

if(!cpId){
alert("Select Channel Partner")
return
}


/* GET LOCATION */

let location

try{
location = await getLocation()
}
catch{
alert("Location permission required")
return
}


/* UPLOAD SELFIE */

let selfieUrl = null

if(selfie){

const fileName = Date.now()+"_"+selfie.name

const {error:uploadError} = await supabase
.storage
.from("meeting-selfies")
.upload(fileName,selfie)

if(uploadError){
alert("Selfie upload failed")
return
}

selfieUrl = fileName

}


/* SAVE MEETING */

const {error} = await supabase
.from("meetings")
.insert([{

rm_id: rm_id,

cp_id: cpId,

client_name: clientName,

meeting_with: "Channel Partner",

meeting_mode: meetingMode,

meeting_date: new Date(),

meeting_outcome: meetingOutcome,

notes: notes,

selfie_url: selfieUrl,

latitude: location.lat,
longitude: location.lng

}])


if(error){

console.log(error)
alert("Meeting save failed")
return

}


/* AUTO UPDATE LEAD PIPELINE */

let newStage = "Inquiry"

if(meetingOutcome==="Interested") newStage="Meeting"
if(meetingOutcome==="Site Visit") newStage="Site Visit"
if(meetingOutcome==="Negotiation") newStage="Negotiation"

await supabase
.from("leads")
.update({status:newStage})
.eq("phone",clientPhone)


alert("Meeting logged successfully")

resetForm()

}


/* RESET FORM */

function resetForm(){

setClientName("")
setClientPhone("")
setCpId("")
setMeetingMode("Physical")
setMeetingOutcome("Interested")
setNotes("")
setSelfie(null)

}


/* UI */

return(

<div style={container}>

<h1>Log Meeting</h1>

<div style={formBox}>

<label>Client Name</label>

<input
value={clientName}
onChange={(e)=>setClientName(e.target.value)}
/>

<label>Client Phone</label>

<input
value={clientPhone}
onChange={(e)=>setClientPhone(e.target.value)}
/>


<label>Channel Partner</label>

<select
value={cpId}
onChange={(e)=>setCpId(e.target.value)}
>

<option value="">Select CP</option>

{cps.map(cp=>(
<option key={cp.id} value={cp.id}>
{cp.name}
</option>
))}

</select>


<label>Meeting Mode</label>

<select
value={meetingMode}
onChange={(e)=>setMeetingMode(e.target.value)}
>

<option>Physical</option>
<option>Online</option>

</select>


<label>Outcome</label>

<select
value={meetingOutcome}
onChange={(e)=>setMeetingOutcome(e.target.value)}
>

<option>Interested</option>
<option>Site Visit</option>
<option>Negotiation</option>
<option>Not Interested</option>

</select>


<label>Notes</label>

<textarea
value={notes}
onChange={(e)=>setNotes(e.target.value)}
/>


<label>Meeting Selfie</label>

<input
type="file"
accept="image/*"
capture="environment"
onChange={(e)=>setSelfie(e.target.files[0])}
/>


<button onClick={saveMeeting}>
Log Meeting
</button>

</div>

</div>

)

}


/* STYLES */

const container={
padding:40,
fontFamily:"Arial"
}

const formBox={
display:"flex",
flexDirection:"column",
gap:12,
maxWidth:420
}