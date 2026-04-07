import { useState, useEffect } from 'react'

const AIPredictions = ({ rms, currentWeek, onClose }) => {
  const [selectedRM, setSelectedRM] = useState(null)
  const [predictions, setPredictions] = useState({})
  const [suggestions, setSuggestions] = useState({})
  const [teamPrediction, setTeamPrediction] = useState(null)

  useEffect(() => {
    calculateTeamPredictions()
  }, [rms])

  const calculateTeamPredictions = () => {
    let totalPredictedRevenue = 0
    let totalTarget = 0
    let atRiskCount = 0
    
    rms.forEach(rm => {
      const prediction = predictMonthlyOutcome(rm)
      totalPredictedRevenue += prediction.predictedRevenue
      totalTarget += rm.monthlyTarget
      if (prediction.predictedAchievement < 60) atRiskCount++
    })
    
    const teamAchievement = totalTarget > 0 ? (totalPredictedRevenue / totalTarget) * 100 : 0
    
    setTeamPrediction({
      totalPredictedRevenue,
      totalTarget,
      teamAchievement: Math.round(teamAchievement),
      atRiskCount,
      onTrackCount: rms.length - atRiskCount
    })
  }

  const predictMonthlyOutcome = (rm) => {
    const achievement = rm.monthlyAchievement || 0
    const daysRemaining = 30 - new Date().getDate()
    const weeklyAvg = achievement / 4
    
    const predictedAchievement = Math.min(100, achievement + (weeklyAvg * (daysRemaining / 7)))
    
    return {
      predictedRevenue: Math.round(rm.monthlyTarget * (predictedAchievement / 100)),
      predictedAchievement: Math.round(predictedAchievement),
      confidence: achievement > 0 ? 'Medium' : 'Low',
      onTrack: predictedAchievement >= 100
    }
  }

  const generateSuggestions = (rm, prediction) => {
    const suggestions = []
    
    if (prediction.predictedAchievement < 60) {
      suggestions.push({
        priority: 'High',
        category: 'Revenue',
        title: 'Revenue Target at Risk',
        description: `Current pace suggests only ${prediction.predictedAchievement}% achievement.`,
        action: 'Increase daily sales calls by 50%, focus on high-value prospects',
        expectedImpact: 'Boost revenue by 20%'
      })
    }
    
    if (rm.cpTarget && rm.cpOnboarded < rm.cpTarget) {
      suggestions.push({
        priority: 'Medium',
        category: 'Channel Partners',
        title: 'CP Onboarding Behind Target',
        description: `Need ${rm.cpTarget - rm.cpOnboarded} more CPs to meet target.`,
        action: 'Host a CP onboarding webinar, increase referral incentives',
        expectedImpact: 'Add new CPs this month'
      })
    }
    
    return suggestions
  }

  const formatRupees = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'High': return '#dc3545'
      case 'Medium': return '#ffc107'
      default: return '#28a745'
    }
  }

  const styles = {
    container: {
      background: 'white',
      borderRadius: '12px',
      padding: '24px',
      maxWidth: '1200px',
      margin: '0 auto',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '24px',
      paddingBottom: '16px',
      borderBottom: '2px solid #f0f0f0'
    },
    title: { fontSize: '24px', fontWeight: 'bold', color: '#333', margin: 0 },
    subtitle: { fontSize: '14px', color: '#666', marginTop: '5px' },
    closeBtn: { background: '#dc3545', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' },
    teamSummary: { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '20px', borderRadius: '12px', marginBottom: '24px' },
    teamGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', marginTop: '15px' },
    teamCard: { textAlign: 'center' },
    teamValue: { fontSize: '28px', fontWeight: 'bold' },
    teamLabel: { fontSize: '12px', opacity: 0.9, marginTop: '5px' },
    rmSelector: { display: 'flex', gap: '10px', marginBottom: '24px', flexWrap: 'wrap', borderBottom: '1px solid #e0e0e0', paddingBottom: '15px' },
    rmButton: { padding: '8px 16px', background: '#f8f9fa', border: '1px solid #ddd', borderRadius: '20px', cursor: 'pointer', fontSize: '14px' },
    activeRmButton: { background: '#2196f3', color: 'white', borderColor: '#2196f3' },
    predictionGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '24px' },
    predictionCard: { background: '#f8f9fa', padding: '16px', borderRadius: '8px', borderLeft: '4px solid' },
    predictionTitle: { fontSize: '16px', fontWeight: 'bold', marginBottom: '12px' },
    predictionValue: { fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' },
    predictionSubtext: { fontSize: '12px', color: '#666' },
    suggestionsSection: { marginTop: '24px' },
    suggestionsTitle: { fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' },
    suggestionCard: { background: '#fff', border: '1px solid #e0e0e0', borderRadius: '8px', padding: '16px', marginBottom: '12px' },
    suggestionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' },
    suggestionPriority: { padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', color: 'white' },
    suggestionCategory: { fontSize: '12px', color: '#666' },
    suggestionTitle: { fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' },
    suggestionDescription: { fontSize: '14px', color: '#666', marginBottom: '8px' },
    suggestionAction: { background: '#e3f2fd', padding: '8px', borderRadius: '6px', marginTop: '8px', fontSize: '13px' },
    expectedImpact: { fontSize: '12px', color: '#28a745', marginTop: '8px', fontWeight: 'bold' }
  }

  if (!teamPrediction) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Loading AI predictions...</div>
  }

  const selectedRMData = selectedRM ? rms.find(rm => rm.id === selectedRM) : null
  const selectedPrediction = selectedRMData ? predictMonthlyOutcome(selectedRMData) : null
  const selectedSuggestions = selectedRMData ? generateSuggestions(selectedRMData, selectedPrediction) : []

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>🤖 AI Predictions & Recommendations</h2>
          <p style={styles.subtitle}>Powered by predictive analytics</p>
        </div>
        <button onClick={onClose} style={styles.closeBtn}>Close</button>
      </div>

      {/* Team Summary */}
      <div style={styles.teamSummary}>
        <h3 style={{ margin: 0 }}>Team Forecast</h3>
        <div style={styles.teamGrid}>
          <div style={styles.teamCard}>
            <div style={styles.teamValue}>{formatRupees(teamPrediction.totalPredictedRevenue)}</div>
            <div style={styles.teamLabel}>Predicted Team Revenue</div>
          </div>
          <div style={styles.teamCard}>
            <div style={styles.teamValue}>{teamPrediction.teamAchievement}%</div>
            <div style={styles.teamLabel}>Team Achievement Rate</div>
          </div>
          <div style={styles.teamCard}>
            <div style={styles.teamValue}>{teamPrediction.atRiskCount}</div>
            <div style={styles.teamLabel}>RMs at Risk (&lt;60%)</div>
          </div>
          <div style={styles.teamCard}>
            <div style={styles.teamValue}>{teamPrediction.onTrackCount}</div>
            <div style={styles.teamLabel}>RMs On Track</div>
          </div>
        </div>
      </div>

      {/* RM Selector */}
      <div style={styles.rmSelector}>
        <button style={{ ...styles.rmButton, ...(!selectedRM ? styles.activeRmButton : {}) }} onClick={() => setSelectedRM(null)}>Team Overview</button>
        {rms.map(rm => (
          <button key={rm.id} style={{ ...styles.rmButton, ...(selectedRM === rm.id ? styles.activeRmButton : {}) }} onClick={() => setSelectedRM(rm.id)}>{rm.name}</button>
        ))}
      </div>

      {/* Predictions for selected RM */}
      {selectedRMData && selectedPrediction && (
        <>
          <div style={styles.predictionGrid}>
            <div style={{ ...styles.predictionCard, borderLeftColor: selectedPrediction.onTrack ? '#28a745' : '#dc3545' }}>
              <div style={styles.predictionTitle}>Revenue Prediction</div>
              <div style={styles.predictionValue}>{formatRupees(selectedPrediction.predictedRevenue)}</div>
              <div style={styles.predictionSubtext}>Target: {formatRupees(selectedRMData.monthlyTarget)} | Achievement: {selectedPrediction.predictedAchievement}%</div>
            </div>
            <div style={{ ...styles.predictionCard, borderLeftColor: selectedPrediction.onTrack ? '#28a745' : '#ffc107' }}>
              <div style={styles.predictionTitle}>Status</div>
              <div style={styles.predictionValue}>{selectedPrediction.onTrack ? '🎯 On Track' : '⚠️ Needs Attention'}</div>
              <div style={styles.predictionSubtext}>Confidence: {selectedPrediction.confidence}</div>
            </div>
          </div>

          {/* AI Suggestions */}
          {selectedSuggestions.length > 0 && (
            <div style={styles.suggestionsSection}>
              <h3 style={styles.suggestionsTitle}>💡 AI-Powered Recommendations</h3>
              {selectedSuggestions.map((suggestion, idx) => (
                <div key={idx} style={styles.suggestionCard}>
                  <div style={styles.suggestionHeader}>
                    <span style={{ ...styles.suggestionPriority, background: getPriorityColor(suggestion.priority) }}>{suggestion.priority} Priority</span>
                    <span style={styles.suggestionCategory}>{suggestion.category}</span>
                  </div>
                  <div style={styles.suggestionTitle}>{suggestion.title}</div>
                  <div style={styles.suggestionDescription}>{suggestion.description}</div>
                  <div style={styles.suggestionAction}><strong>🎯 Action Item:</strong> {suggestion.action}</div>
                  <div style={styles.expectedImpact}>📈 Expected Impact: {suggestion.expectedImpact}</div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Team Overview */}
      {!selectedRM && (
        <div>
          <h3>📊 RM Performance Overview</h3>
          <div style={styles.predictionGrid}>
            {rms.map(rm => {
              const pred = predictMonthlyOutcome(rm)
              return (
                <div key={rm.id} style={{ ...styles.predictionCard, borderLeftColor: pred.onTrack ? '#28a745' : '#dc3545' }}>
                  <div style={styles.predictionTitle}>{rm.name}</div>
                  <div style={styles.predictionValue}>{pred.predictedAchievement}%</div>
                  <div style={styles.predictionSubtext}>{formatRupees(pred.predictedRevenue)} / {formatRupees(rm.monthlyTarget)}</div>
                  <div style={styles.predictionSubtext}>{pred.onTrack ? 'On Track' : 'Needs Improvement'}</div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default AIPredictions