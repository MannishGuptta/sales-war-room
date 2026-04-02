import React from "react";

export default function WarRoomKPIs({ data, mode = "actual" }) {

  const safe = data || {};
  const target = safe.targetIntelligence || {};

  ////////////////////////////
  // MODE-BASED KPI LOGIC
  ////////////////////////////

  const revenue = mode === "target"
    ? target.targetRevenue || 0
    : safe.revenuePeriod || 0;

  const deals = mode === "target"
    ? target.targetSales || 0
    : safe.salesPeriod || 0;

  const meetings = mode === "target"
    ? target.targetMeetings || 0
    : safe.meetingsPeriod || 0;

  const cpOnboard = mode === "target"
    ? target.targetCPOnboard || 0
    : safe.cpOnboardPeriod || 0;

  const activeCP = mode === "target"
    ? target.targetActiveCP || 0
    : safe.activeCPPeriod || 0;

  ////////////////////////////
  // UI
  ////////////////////////////

  return (

    <div style={grid}>

      <div style={card}>
        <h3>Revenue</h3>
        <p style={value}>₹{revenue.toLocaleString()}</p>
      </div>

      <div style={card}>
        <h3>Deals</h3>
        <p style={value}>{deals}</p>
      </div>

      <div style={card}>
        <h3>Meetings</h3>
        <p style={value}>{meetings}</p>
      </div>

      <div style={card}>
        <h3>CP Onboarded</h3>
        <p style={value}>{cpOnboard}</p>
      </div>

      <div style={card}>
        <h3>Active CP</h3>
        <p style={value}>{activeCP}</p>
      </div>

    </div>

  );

}

/* STYLES */

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
  gap: 20,
  marginBottom: 30
};

const card = {
  background: "#fff",
  padding: 20,
  borderRadius: 10,
  boxShadow: "0 2px 10px rgba(0,0,0,0.08)"
};

const value = {
  fontSize: 22,
  fontWeight: "bold",
  marginTop: 10
};