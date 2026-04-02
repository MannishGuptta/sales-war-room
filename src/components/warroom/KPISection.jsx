import React from "react";

export default function KPISection({
  revenueToday,
  revenueMonth,
  totalSales,
  meetingsToday
}) {

  return (

    <>
      <h2>Executive Dashboard</h2>

      <div style={grid}>

        <div style={card}>
          <h3>Revenue Today</h3>
          <h1>₹ {revenueToday.toLocaleString()}</h1>
        </div>

        <div style={card}>
          <h3>Revenue This Month</h3>
          <h1>₹ {revenueMonth.toLocaleString()}</h1>
        </div>

        <div style={card}>
          <h3>Total Sales</h3>
          <h1>{totalSales}</h1>
        </div>

        <div style={card}>
          <h3>Meetings Today</h3>
          <h1>{meetingsToday}</h1>
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