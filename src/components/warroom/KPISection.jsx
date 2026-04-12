import React from "react";

export default function KPISection({
  period,
  revenue,
  sales,
  meetings,
  cpOnboard
}) {

  return (

    <>
      <h2>Executive Dashboard ({period})</h2>

      <div style={grid}>

        <div style={card}>
          <h3>Revenue</h3>
          <h1>₹ {Number(revenue || 0).toLocaleString()}</h1>
        </div>

        <div style={card}>
          <h3>Total Sales</h3>
          <h1>{sales || 0}</h1>
        </div>

        <div style={card}>
          <h3>Meetings</h3>
          <h1>{meetings || 0}</h1>
        </div>

        <div style={card}>
          <h3>CP Onboarded</h3>
          <h1>{cpOnboard || 0}</h1>
        </div>

      </div>

    </>

  );

}

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
  gap: 20,
  marginBottom: 40
};

const card = {
  background: "#f5f6fa",
  padding: 30,
  borderRadius: 10,
  textAlign: "center"
};