import { useNavigate } from "react-router-dom";

export default function Header(){

const navigate = useNavigate();

const user = JSON.parse(sessionStorage.getItem("user"));

function logout(){

sessionStorage.removeItem("user");
navigate("/login");

}

return(

<div style={header}>

<div style={left}>

<h2 style={title}>👋 Welcome, {user?.email}</h2>

<p style={subtitle}>
RM Sales Command Dashboard
</p>

</div>

<button style={logoutBtn} onClick={logout}>
Logout
</button>

</div>

);

}

/* HEADER CONTAINER */

const header = {

display:"flex",
flexWrap:"wrap",
justifyContent:"space-between",
alignItems:"center",
background:"#fff",
padding:"16px",
borderRadius:"12px",
marginBottom:"20px",
boxShadow:"0 2px 10px rgba(0,0,0,0.08)",
gap:"10px"

};

/* LEFT SECTION */

const left = {

display:"flex",
flexDirection:"column"

};

/* TITLE */

const title = {

fontSize:"18px",
marginBottom:"2px"

};

/* SUBTITLE */

const subtitle = {

color:"#777",
fontSize:"13px"

};

/* LOGOUT BUTTON */

const logoutBtn = {

background:"#e74c3c",
border:"none",
color:"#fff",
padding:"8px 16px",
borderRadius:"8px",
cursor:"pointer",
fontWeight:"600",
fontSize:"14px",
height:"40px"

};