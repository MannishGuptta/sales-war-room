import { useState } from "react"
import { supabase } from "../../supabaseClient"

export default function MeetingLogger(){

const [client,setClient]=useState("")
const [notes,setNotes]=useState("")

async function logMeeting(){

const user = JSON.parse(sessionStorage.getItem("user"))

await supabase.from("meetings").insert({

rm_id:user.id,
client_name:client,
notes

})

alert("Meeting logged")

}

return(

<div style={card}>

<h3>Log Meeting</h3>

<input
placeholder="Client Name"
value={client}
onChange={e=>setClient(e.target.value)}
/>

<textarea
placeholder="Meeting notes"
value={notes}
onChange={e=>setNotes(e.target.value)}
/>

<button onClick={logMeeting}>Save</button>

</div>

)

}

const card={
background:"#fff",
padding:20,
borderRadius:10,
marginBottom:20
}