import React from "react";

export default function WarRoomHeader(){

return(

<div style={{marginBottom:20}}>

<h1>War Room</h1>

<div style={{display:"flex",gap:10}}>

<button>Add RM</button>
<button>Edit RM</button>
<button>Delete RM</button>

<button>Add CP</button>
<button>Edit CP</button>
<button>Delete CP</button>

<button>Reallocate Leads</button>

</div>

</div>

)

}