import { useRef } from "react"
import { supabase } from "../../supabaseClient"

export default function SelfieAttendance(){

const videoRef = useRef(null)
const streamRef = useRef(null)

async function startCamera(){

try{

const stream = await navigator.mediaDevices.getUserMedia({ video:true })

videoRef.current.srcObject = stream
streamRef.current = stream

}catch(err){

alert("Camera access denied")

}

}

function getLocation(){

return new Promise((resolve,reject)=>{

navigator.geolocation.getCurrentPosition(

(position)=>{

resolve({
lat:position.coords.latitude,
lng:position.coords.longitude
})

},

(err)=>{

resolve({
lat:null,
lng:null
})

}

)

})

}

async function capture(){

try{

const user = JSON.parse(sessionStorage.getItem("user"))

if(!user){

alert("User not logged in")
return

}

/* Capture Image */

const canvas = document.createElement("canvas")

canvas.width = videoRef.current.videoWidth
canvas.height = videoRef.current.videoHeight

const ctx = canvas.getContext("2d")

ctx.drawImage(videoRef.current,0,0)

const blob = await new Promise(resolve=>canvas.toBlob(resolve,"image/png"))

/* Get GPS */

const location = await getLocation()

/* Upload Image */

const fileName = `selfie_${Date.now()}.png`

const { error:uploadError } = await supabase.storage
.from("attendance")
.upload(fileName,blob)

if(uploadError){

console.log(uploadError)
alert("Upload failed")
return

}

/* Get Public URL */

const { data } = supabase.storage
.from("attendance")
.getPublicUrl(fileName)

const selfieURL = data.publicUrl

/* Save Activity */

await supabase
.from("rm_activity")
.insert({

rm_id:user.id,
activity_type:"attendance",
selfie_url:selfieURL,
latitude:location.lat,
longitude:location.lng,
created_at:new Date()

})

/* Stop Camera */

if(streamRef.current){

streamRef.current.getTracks().forEach(track=>track.stop())

}

alert("Attendance recorded successfully")

}catch(err){

console.log(err)
alert("Attendance failed")

}

}

return(

<div style={card}>

<h3>Selfie Attendance</h3>

<video
ref={videoRef}
autoPlay
playsInline
width="250"
/>

<br/>

<button onClick={startCamera}>
Start Camera
</button>

<button onClick={capture}>
Capture Selfie
</button>

</div>

)

}

const card={
background:"#fff",
padding:20,
borderRadius:10,
marginBottom:20,
boxShadow:"0 2px 10px rgba(0,0,0,0.1)"
}