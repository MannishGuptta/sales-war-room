import React from 'react';

const Dashboard = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Sales War Room Dashboard</h1>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)', 
        gap: '16px', 
        marginTop: '20px' 
      }}>
        <div style={{ background: '#f0f2f5', padding: '16px', borderRadius: '12px' }}>
          <h3>Revenue Target</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>£10,000,000</p>
        </div>
        <div style={{ background: '#f0f2f5', padding: '16px', borderRadius: '12px' }}>
          <h3>Revenue Achieved</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: 'green' }}>£5,810,007</p>
          <p>58% of target</p>
        </div>
        <div style={{ background: '#f0f2f5', padding: '16px', borderRadius: '12px' }}>
          <h3>Channel Partners</h3>
          <p>Target: 55 | Onboarded: 61</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
