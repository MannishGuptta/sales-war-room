import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function Dashboard() {

  const [range, setRange] = useState("month");

  const [stats, setStats] = useState({
    totalCPs: 0,
    activeCPs: 0,
    limboCPs: 0,
    meetings: 0,
    sales: 0,
    revenue: 0
  });

  const [todayMeetings, setTodayMeetings] = useState([]);

  useEffect(() => {
    loadDashboard();
  }, [range]);

  async function loadDashboard() {

    const startDate = getStartDate(range);

    const { data: cps } = await supabase
      .from("channel_partners")
      .select("*");

    const { data: meetings } = await supabase
      .from("meetings")
      .select("*");

    const { data: sales } = await supabase
      .from("sales")
      .select("*");

    const filteredMeetings =
      meetings?.filter(m =>
        new Date(m.meeting_date) >= startDate
      ) || [];

    const filteredSales =
      sales?.filter(s =>
        new Date(s.sale_date) >= startDate
      ) || [];

    const revenue = filteredSales.reduce(
      (sum, s) => sum + (s.sale_value || 0),
      0
    );

    const activeCPSet = new Set(
      filteredSales.map(s => s.cp_id)
    );

    const activeCPs = cps?.filter(
      cp => activeCPSet.has(cp.id)
    ) || [];

    const limboCPs = cps?.filter(cp => {

      const lastSale = sales
        ?.filter(s => s.cp_id === cp.id)
        .sort((a, b) =>
          new Date(b.sale_date) - new Date(a.sale_date)
        )[0];

      if (!lastSale) return false;

      const days =
        (new Date() - new Date(lastSale.sale_date)) /
        (1000 * 60 * 60 * 24);

      return days > 30;

    }) || [];

    const today = new Date().toDateString();

    const todayMeetings =
      meetings?.filter(m =>
        new Date(m.meeting_date).toDateString() === today
      ) || [];

    setStats({
      totalCPs: cps?.length || 0,
      activeCPs: activeCPs.length,
      limboCPs: limboCPs.length,
      meetings: filteredMeetings.length,
      sales: filteredSales.length,
      revenue
    });

    setTodayMeetings(todayMeetings);
  }

  function getStartDate(range) {

    const now = new Date();

    if (range === "today")
      return new Date(now.setHours(0, 0, 0, 0));

    if (range === "week") {

      const first = now.getDate() - now.getDay();
      return new Date(now.setDate(first));

    }

    if (range === "month")
      return new Date(now.getFullYear(), now.getMonth(), 1);

    return new Date(2000, 0, 1);
  }

  return (

    <div style={container}>

      <h1>RevenuePilot</h1>
      <h2>Sales Command Dashboard</h2>

      <div style={filters}>

        <button onClick={() => setRange("today")}>
          Today
        </button>

        <button onClick={() => setRange("week")}>
          Week
        </button>

        <button onClick={() => setRange("month")}>
          Month
        </button>

      </div>

      <div style={grid}>

        <Card title="Total CPs" value={stats.totalCPs} />
        <Card title="Active CPs" value={stats.activeCPs} />
        <Card title="Limbo CPs" value={stats.limboCPs} />
        <Card title="Meetings" value={stats.meetings} />
        <Card title="Sales" value={stats.sales} />
        <Card title="Revenue" value={"₹" + stats.revenue.toLocaleString()} />

      </div>

      <h3>Today's Meetings</h3>

      {todayMeetings.length === 0 && (
        <p>No meetings scheduled today</p>
      )}

      {todayMeetings.map(m => (
        <div key={m.id} style={meetingCard}>
          <b>{m.name}</b>
          <p>{m.meeting_notes}</p>
        </div>
      ))}

    </div>
  );
}

function Card({ title, value }) {

  return (
    <div style={card}>
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
  );

}

const container = {
  padding: 40
};

const filters = {
  display: "flex",
  gap: 10,
  marginBottom: 20
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(3,1fr)",
  gap: 20,
  marginBottom: 30
};

const card = {
  padding: 20,
  background: "#f5f5f5",
  borderRadius: 10
};

const meetingCard = {
  padding: 10,
  border: "1px solid #ddd",
  marginBottom: 10
};