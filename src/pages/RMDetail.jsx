import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { supabase } from "../supabaseClient"

export default function RMDetail() {

  const { id } = useParams()

  const [data, setData] = useState({
    sales: [],
    meetings: [],
    leads: []
  })

  useEffect(() => {
    loadRMData()
  }, [])

  async function loadRMData() {

    const { data: sales = [] } = await supabase
      .from("sales")
      .select("*")
      .eq("rm_id", id)

    const { data: meetings = [] } = await supabase
      .from("meetings")
      .select("*")
      .eq("rm_id", id)

    const { data: leads = [] } = await supabase
      .from("leads")
      .select("*")
      .eq("rm_id", id)

    setData({ sales, meetings, leads })
  }

  const totalRevenue = data.sales.reduce((s, x) => s + (x.amount || 0), 0)

  const conversion =
    data.meetings.length > 0
      ? Math.round((data.sales.length / data.meetings.length) * 100)
      : 0

  return (
    <div style={{ padding: 40 }}>

      <h1>📊 RM Pipeline</h1>

      <div style={grid}>
        <Card title="Deals" value={data.sales.length} />
        <Card title="Meetings" value={data.meetings.length} />
        <Card title="Revenue" value={`₹${totalRevenue}`} />
        <Card title="Conversion %" value={`${conversion}%`} />
      </div>

      <h3>🔥 Pipeline</h3>

      <div>
        {data.leads.map((l, i) => (
          <div key={i} style={leadCard}>
            <strong>{l.name}</strong>
            <div>Status: {l.status || "New"}</div>
          </div>
        ))}
      </div>

    </div>
  )
}

function Card({ title, value }) {
  return (
    <div style={card}>
      <h4>{title}</h4>
      <h2>{value}</h2>
    </div>
  )
}

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
  gap: 20,
  marginBottom: 30
}

const card = {
  background: "#fff",
  padding: 20,
  borderRadius: 12
}

const leadCard = {
  padding: 10,
  borderBottom: "1px solid #eee"
}