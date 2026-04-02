import { useState, useEffect } from "react"
import { supabase } from "../supabaseClient"

export default function TargetManagement() {

  const [target, setTarget] = useState({
    monthly_revenue: "",
    monthly_sales: "",
    monthly_meetings: "",
    monthly_cp_onboard: "",
    monthly_active_cp: ""
  })

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTarget()
  }, [])

  async function loadTarget() {

    const now = new Date()
    const month = now.getMonth() + 1
    const year = now.getFullYear()

    const { data } = await supabase
      .from("targets")
      .select("*")
      .eq("month", month)
      .eq("year", year)
      .is("rm_id", null)
      .order("created_at", { ascending: false })
      .limit(1)

    if (data && data.length > 0) {
      setTarget(data[0])
    }

    setLoading(false)
  }

  async function saveTarget() {

    const now = new Date()
    const month = now.getMonth() + 1
    const year = now.getFullYear()

    const payload = {
      ...target,
      month,
      year,
      rm_id: null,
      created_at: new Date()
    }

    const { error } = await supabase
      .from("targets")
      .insert([payload])

    if (error) {
      alert("Error saving target")
      return
    }

    alert("✅ Target Saved Successfully")
  }

  if (loading) return <div>Loading...</div>

  return (
    <div style={container}>

      <h1>🎯 Target Control Panel</h1>

      <div style={card}>

        <Input label="Monthly Revenue"
          value={target.monthly_revenue}
          onChange={(v)=>setTarget({...target, monthly_revenue:v})}
        />

        <Input label="Monthly Sales"
          value={target.monthly_sales}
          onChange={(v)=>setTarget({...target, monthly_sales:v})}
        />

        <Input label="Monthly Meetings"
          value={target.monthly_meetings}
          onChange={(v)=>setTarget({...target, monthly_meetings:v})}
        />

        <Input label="CP Onboard"
          value={target.monthly_cp_onboard}
          onChange={(v)=>setTarget({...target, monthly_cp_onboard:v})}
        />

        <Input label="Active CP"
          value={target.monthly_active_cp}
          onChange={(v)=>setTarget({...target, monthly_active_cp:v})}
        />

        <button onClick={saveTarget} style={btn}>
          💾 Save Target
        </button>

      </div>

    </div>
  )
}

// SMALL INPUT COMPONENT
function Input({ label, value, onChange }) {
  return (
    <div style={{marginBottom:15}}>
      <label>{label}</label><br/>
      <input
        value={value || ""}
        onChange={(e)=>onChange(e.target.value)}
        style={{padding:8,width:"100%"}}
      />
    </div>
  )
}

// STYLES
const container = {
  padding: 40,
  maxWidth: 600,
  margin: "0 auto"
}

const card = {
  background:"#fff",
  padding:20,
  borderRadius:10,
  boxShadow:"0 2px 10px rgba(0,0,0,0.1)"
}

const btn = {
  marginTop:20,
  padding:10,
  background:"#4caf50",
  color:"#fff",
  border:"none",
  borderRadius:6
}