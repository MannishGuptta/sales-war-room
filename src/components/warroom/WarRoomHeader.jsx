import React from "react";
import { useNavigate } from "react-router-dom";

export default function WarRoomHeader(){

const navigate = useNavigate();

return(

<div style={{marginBottom:20}}>

<h1>War Room</h1>

<div style={{
display:"flex",
gap:10,
flexWrap:"wrap"
}}>

{/* RM MANAGEMENT */}

<button onClick={()=>navigate("/rm-management")}>
Add RM
</button>

<button onClick={()=>navigate("/rm-management")}>
Edit RM
</button>

<button onClick={()=>navigate("/rm-management")}>
Delete RM
</button>

{/* CP + SALES ACTIONS */}

<button onClick={()=>navigate("/admin/add-cp")}>
Add CP
</button>

<button onClick={()=>navigate("/admin")}>
Edit CP
</button>

<button onClick={()=>navigate("/admin")}>
Delete CP
</button>

<button onClick={()=>navigate("/admin/add-meeting")}>
Add Meeting
</button>

<button onClick={()=>navigate("/admin/add-sale")}>
Add Sale
</button>

{/* FUTURE FEATURE */}

<button onClick={()=>alert("Lead reallocation coming soon")}>
Reallocate Leads
</button>

</div>

</div>

)

}