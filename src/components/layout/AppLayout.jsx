import Sidebar from "./Sidebar"

export default function AppLayout({ children }) {

return (

<div style={{display:"flex"}}>

<Sidebar />

<div style={{
flex:1,
padding:"40px",
background:"#f4f6fb",
minHeight:"100vh"
}}>

{children}

</div>

</div>

)

}