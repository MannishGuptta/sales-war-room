import React from 'react';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <h2>📊 Dashboard Overview</h2>
      <div style={{ padding: '20px' }}>
        <p>Revenue Target: £10,000,000</p>
        <p>Revenue Achieved: £5,810,007 (58%)</p>
        <p>Channel Partners: 55 target / 61 onboarded</p>
      </div>
    </div>
  );
};

export default Dashboard;