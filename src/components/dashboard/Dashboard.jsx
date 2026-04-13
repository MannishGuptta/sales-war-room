import React from 'react';

const Dashboard = ({ rms, teamLeaders, meetings, onRefresh, onViewWeeklyProgress }) => {
  // Dashboard metrics from your screenshots
  const totalRevenueTarget = 10000000;
  const totalRevenueAchieved = 5810007;
  const revenueGap = totalRevenueTarget - totalRevenueAchieved;
  const achievementPercent = ((totalRevenueAchieved / totalRevenueTarget) * 100).toFixed(0);
  
  const cpTarget = 55;
  const cpOnboarded = 61;
  const cpGap = cpOnboarded - cpTarget;
  
  const activeCPTarget = 45;
  const activeCP = 38;
  const cpActivationRate = ((activeCP / cpOnboarded) * 100).toFixed(0);
  
  // Calculate RM statistics
  const criticalCount = (rms || []).filter(rm => (rm.achievement || 0) < 40).length;
  const onTrackCount = (rms || []).filter(rm => (rm.achievement || 0) >= 60).length;
  
  // Sample RM data (from your working dashboard)
  const rmPerformance = [
    { name: 'Sarah Johnson', achieved: 184014, target: 200000, percent: 92, cpOnboarded: 19, activeCP: 12, cpTarget: 15, status: 'GREEN' },
    { name: 'John Smith', achieved: 158390, target: 200000, percent: 79, cpOnboarded: 14, activeCP: 11, cpTarget: 12, status: 'GREEN' },
    { name: 'James Davis', achieved: 101541, target: 200000, percent: 51, cpOnboarded: 9, activeCP: 7, cpTarget: 10, status: 'YELLOW' },
    { name: 'Mike Brown', achieved: 81291, target: 200000, percent: 41, cpOnboarded: 11, activeCP: 4, cpTarget: 10, status: 'RED' },
    { name: 'Emma Wilson', achieved: 55771, target: 200000, percent: 28, cpOnboarded: 8, activeCP: 4, cpTarget: 8, status: 'RED' }
  ];

  const styles = {
    container: { padding: '24px', fontFamily: 'system-ui, -apple-system, sans-serif' },
    cardsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '30px' },
    card: { background: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
    cardTitle: { fontSize: '12px', fontWeight: '600', color: '#64748b', marginBottom: '8px' },
    cardValue: { fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' },
    progressBar: { background: '#e2e8f0', borderRadius: '10px', height: '8px', marginTop: '10px' },
    progressFill: { background: '#16a34a', borderRadius: '10px', height: '8px' },
    table: { width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '12px', overflow: 'hidden' },
    th: { padding: '12px', textAlign: 'left', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontWeight: '600' },
    td: { padding: '12px', borderBottom: '1px solid #e2e8f0' },
    statusGreen: { background: '#dcfce7', color: '#166534', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', display: 'inline-block' },
    statusRed: { background: '#fee2e2', color: '#991b1b', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', display: 'inline-block' },
    statusYellow: { background: '#fef3c7', color: '#92400e', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', display: 'inline-block' }
  };

  return (
    <div style={styles.container}>
      {/* Metrics Cards */}
      <div style={styles.cardsGrid}>
        <div style={styles.card}>
          <div style={styles.cardTitle}>💰 REVENUE TARGET</div>
          <div style={styles.cardValue}>£{totalRevenueTarget.toLocaleString()}</div>
          <div>REVENUE ACHIEVED: £{totalRevenueAchieved.toLocaleString()}</div>
          <div>GAP: £{revenueGap.toLocaleString()}</div>
          <div style={styles.progressBar}>
            <div style={{ ...styles.progressFill, width: `${achievementPercent}%` }}></div>
          </div>
          <div>{achievementPercent}% of target</div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardTitle}>🤝 CHANNEL PARTNERS</div>
          <div>CP TARGET: {cpTarget}</div>
          <div>CP ONBOARDED: {cpOnboarded}</div>
          <div style={{ color: cpGap > 0 ? '#16a34a' : '#dc2626' }}>Gap: {cpGap > 0 ? `+${cpGap}` : cpGap}</div>
          <div>ACTIVE CP TARGET: {activeCPTarget}</div>
          <div>ACTIVE CP: {activeCP}</div>
          <div>ACTIVATION RATE: {cpActivationRate}%</div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardTitle}>📊 TEAM STATUS</div>
          <div><span style={{ color: '#dc2626' }}>🔴 Critical:</span> {criticalCount}</div>
          <div><span style={{ color: '#16a34a' }}>🟢 On Track:</span> {onTrackCount}</div>
          <div><span style={{ color: '#eab308' }}>🟡 Warning:</span> {rms?.length - criticalCount - onTrackCount}</div>
          <hr />
          <div>TOTAL MEETINGS: {meetings?.length || 0}</div>
          <div>UPCOMING MEETINGS: {meetings?.filter(m => m.status === 'scheduled' || m.status === 'Upcoming').length || 0}</div>
        </div>
      </div>

      {/* RM Performance Table */}
      <div style={{ ...styles.card, overflowX: 'auto' }}>
        <h3 style={{ marginBottom: '16px' }}>📈 RM Performance Overview</h3>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>RM Name</th>
              <th style={styles.th}>Target (£)</th>
              <th style={styles.th}>Achieved (£)</th>
              <th style={styles.th}>Gap (£)</th>
              <th style={styles.th}>Achievement %</th>
              <th style={styles.th}>CP Onboarded</th>
              <th style={styles.th}>Active CP</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rmPerformance.map(rm => {
              const gap = rm.target - rm.achieved;
              let statusStyle = styles.statusGreen;
              if (rm.status === 'RED') statusStyle = styles.statusRed;
              if (rm.status === 'YELLOW') statusStyle = styles.statusYellow;
              
              return (
                <tr key={rm.name}>
                  <td style={styles.td}>{rm.name}</td>
                  <td style={styles.td}>£{rm.target.toLocaleString()}</td>
                  <td style={styles.td}>£{rm.achieved.toLocaleString()}</td>
                  <td style={styles.td}>£{gap.toLocaleString()}</td>
                  <td style={styles.td}>{rm.percent}%</td>
                  <td style={styles.td}>{rm.cpOnboarded}</td>
                  <td style={styles.td}>{rm.activeCP} / {rm.cpTarget}</td>
                  <td style={styles.td}><span style={statusStyle}>{rm.status}</span></td>
                  <td style={styles.td}>
                    <button onClick={() => onViewWeeklyProgress?.({ name: rm.name })} style={{ background: '#1e4a76', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>
                      Week 2 Progress
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Refresh Button */}
      <div style={{ marginTop: '20px', textAlign: 'right' }}>
        <button onClick={onRefresh} style={{ background: '#e2e8f0', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}>
          🔄 Refresh
        </button>
      </div>
    </div>
  );
};

export default Dashboard;