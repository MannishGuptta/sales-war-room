import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

export default function Attendance(){

const [photo,setPhoto] = useState(null)
const [lat,setLat] = useState("")
const [long,setLong] = useState("")
const [checkedIn,setCheckedIn] = useState(false)

/* LOAD STATUS */

useEffect(()=>{
checkTodayStatus()
},[])

async function checkTodayStatus(){

const user = JSON.parse(sessionStorage.getItem("user"))
if(!user) return

const today = new Date().toISOString().split("T")[0]

const {data} = await supabase
.from("attendance")
.select("*")
.eq("rm_id",user.id)
.eq("date",today)
.single()

if(data){
setCheckedIn(true)
}

}


/* GET LOCATION */

function captureLocation(){

navigator.geolocation.getCurrentPosition((pos)=>{

setLat(pos.coords.latitude)
setLong(pos.coords.longitude)

alert("Location Captured")

})

}


/* UPLOAD SELFIE */

async function uploadPhoto(){

if(!photo){
alert("Selfie required")
return null
}

const fileName = Date.now()+"_"+photo.name

const {error} = await supabase.storage
.from("attendance")
.upload(fileName,photo)

if(error){
console.log(error)
alert("Photo upload failed")
return null
}

return fileName

}


/* CHECK IN */

async function checkin(){

const user = JSON.parse(sessionStorage.getItem("user"))

if(!lat || !long){
alert("Capture GPS first")
return
}

const selfie = await uploadPhoto()
if(!selfie) return

const today = new Date().toISOString().split("T")[0]

const {error} = await supabase
.from("attendance")
.insert([{

rm_id:user.id,

date:today,

checkin_time:new Date(),

checkin_lat:lat,
checkin_long:long,

checkin_selfie:selfie

}])

if(error){

alert("Checkin failed")

}else{

alert("Checkin Successful")
setCheckedIn(true)

}

}


/* CHECK OUT */

async function checkout(){

const user = JSON.parse(sessionStorage.getItem("user"))

if(!lat || !long){
alert("Capture GPS first")
return
}

const selfie = await uploadPhoto()
if(!selfie) return

const today = new Date().toISOString().split("T")[0]

const {error} = await supabase
.from("attendance")
.update({

checkout_time:new Date(),

checkout_lat:lat,
checkout_long:long,

checkout_selfie:selfie

})
.eq("rm_id",user.id)
.eq("date",today)

if(error){

alert("Checkout failed")

}else{

alert("Checkout Successful")
setCheckedIn(false)

}

}


return(

<div style={container}>

<h1>RM Attendance</h1>

<input
type="file"
accept="image/*"
capture="environment"
onChange={(e)=>setPhoto(e.target.files[0])}
/>

<button onClick={captureLocation}>
Capture GPS
</button>

<p>Latitude: {lat}</p>
<p>Longitude: {long}</p>

{!checkedIn ?

<button onClick={checkin}>
Start Day (Check In)
</button>

:

<button onClick={checkout}>
End Day (Check Out)
</button>

}

</div>

)

}

const container={
padding:40,
fontFamily:"Arial"
}
