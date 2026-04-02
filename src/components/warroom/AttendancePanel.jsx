import { useEffect, useState } from "react"
import { supabase } from "../../supabaseClient"

export default function AttendancePanel(){

const [attendance,setAttendance] = useState([])

useEffect(()=>{

loadAttendance()

},[])

async function loadAttendance(){

const today = new Date().toISOString().split("T")[0]

const {data} = await supabase
.from("attendance")
.select("rm_id,login_time,logout_time")

.eq("date",today)

setAttendance(data || [])

}

return(

<div className="panel">

<h3>RM Attendance</h3>

{attendance.map((a)=>(
<div key={a.rm_id}>
RM {a.rm_id} - {a.login_time}
</div>
))}

</div>

)

}