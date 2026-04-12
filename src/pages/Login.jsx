import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function Login(){

const navigate = useNavigate()

const [email,setEmail] = useState("")
const [password,setPassword] = useState("")

async function handleLogin(e){

e.preventDefault()

/* STEP 1: AUTH LOGIN */

const { data, error } = await supabase.auth.signInWithPassword({
email,
password
})

if(error){
alert("Invalid login")
return
}

/* STEP 2: GET USER ROLE FROM TABLE */

const { data:profile } = await supabase
.from("users")
.select("*")
.eq("email",email)
.single()

if(!profile){
alert("User not registered in CRM")
return
}

/* STEP 3: SAVE CLEAN USER SESSION */

sessionStorage.setItem("user", JSON.stringify({
id: profile.id,
role: profile.role,
email: profile.email
}))

/* STEP 4: REDIRECT */

if(profile.role === "admin"){
navigate("/war-room")
}else{
navigate("/rm-dashboard")
}

}

return(

<div style={container}>

<form onSubmit={handleLogin} style={card}>

<h2>RevenuePilot Login</h2>

<input
type="email"
placeholder="Email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
style={input}
/>

<input
type="password"
placeholder="Password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
style={input}
/>

<button style={button}>
Login
</button>

</form>

</div>

)

}

const container={
display:"flex",
justifyContent:"center",
alignItems:"center",
height:"100vh",
background:"#f4f6f9"
}

const card={
background:"#fff",
padding:40,
borderRadius:10,
boxShadow:"0 2px 10px rgba(0,0,0,0.1)",
display:"flex",
flexDirection:"column",
width:300
}

const input={
marginBottom:15,
padding:10
}

const button={
padding:10,
background:"#5c6bc0",
color:"#fff",
border:"none"
}