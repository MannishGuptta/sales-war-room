import { useState, useEffect } from 'react'
import { predictMonthlyOutcome, generateAISuggestions, calculateOverallTeamPrediction } from '../utils/aiPredictionEngine'

const AIPredictions = ({ rms, currentWeek, onClose }) => {
  const [selectedRM, setSelectedRM] = useState(null)
  const [predictions, setPredictions] = useState({})
  const [suggestions, setSuggestions] = useState({})
  const [teamPrediction, setTeamPrediction] = useState(null)

  useEffect(() => {
    // Calculate predictions for all RMs
    const preds = {}
    const suggs = {}
    rms.forEach(rm => {
      const prediction = predictMonthlyOutcome(rm, currentWeek)
      preds[rm.id] = prediction
      suggs[rm.id] = generateAISuggestions(rm, prediction, currentWeek)
    })
    setPredictions(preds)
    setSuggestions(suggs)
    
    // Calculate team prediction
    const team = calculateOverallTeamPrediction(rms, currentWeek)
    setTeamPrediction(team)
  }, [rms, currentWeek])

  const formatRupees = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const getConfidenceColor = (confidence) => {
    switch(confidence) {
      case 'High': return '#28a745'
      case 'Medium': return '#ffc107'
      default: return '#dc3545'
    }
  }

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'Critical': return '#dc3545'
      case 'High': return '#fd7e14'
      case 'Medium': return '#ffc107'
      default: return '#28a745'
    }
  }

  const styles = {
    container: {
      background: 'white',
      borderRadius: '12px',
      padding: '24px',
      maxWidth: '1400px',
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
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#333',
      margin: 0
    },
    subtitle: {
      fontSize: '14px',
      color: '#666',
      marginTop: '5px'
    },
    closeBtn: {
      background: '#dc3545',
      color: 'white',
      border: 'none',
      padding: '8px 16px',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: 'bold'
    },
    teamSummary: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '20px',
      borderRadius: '12px',
      marginBottom: '24px'
    },
    teamGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '20px',
      marginTop: '15px'
    },
    teamCard: {
      textAlign: 'center'
    },
    teamValue: {
      fontSize: '28px',
      fontWeight: 'bold'
    },
    teamLabel: {
      fontSize: '12px',
      opacity: 0.9,
      marginTop: '5px'
    },
    rmSelector: {
      display: 'flex',
      gap: '10px',
      marginBottom: '24px',
      flexWrap: 'wrap',
      borderBottom: '1px solid #e0e0e0',
      paddingBottom: '15px'
    },
    rmButton: {
      padding: '8px 16px',
      background: '#f8f9fa',
      border: '1px solid #ddd',
      borderRadius: '20px',
      cursor: 'pointer',
      fontSize: '14px',
      transition: 'all 0.3s ease'
    },
    activeRmButton: {
      background: '#2196f3',
      color: 'white',
      borderColor: '#2196f3'
    },
    predictionGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '20px',
      marginBottom: '24px'
    },
    predictionCard: {
      background: '#f8f9fa',
      padding: '16px',
      borderRadius: '8px',
      borderLeft: '4px solid'
    },
    predictionTitle: {
      fontSize: '16px',
      fontWeight: 'bold',
      marginBottom: '12px'
    },
    predictionValue: {
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '8px'
    },
    predictionSubtext: {
      fontSize: '12px',
      color: '#666'
    },
    suggestionsSection: {
      marginTop: '24px'
    },
    suggestionsTitle: {
      fontSize: '18px',
      fontWeight: 'bold',
      marginBottom: '16px'
    },
    suggestionCard: {
      background: '#fff',
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '12px',
      transition: 'transform 0.2s ease',
      cursor: 'pointer'
    },
    suggestionHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '10px'
    },
    suggestionPriority: {
      padding: '4px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: 'bold',
      color: 'white'
    },
    suggestionCategory: {
      fontSize: '12px',
      color: '#666'
    },
    suggestionTitle: {
      fontSize: '16px',
      fontWeight: 'bold',
      marginBottom: '8px'
    },
    suggestionDescription: {
      fontSize: '14px',
      color: '#666',
      marginBottom: '8px'
    },
    suggestionAction: {
      background: '#e3f2fd',
      padding: '8px',
      borderRadius: '6px',
      marginTop: '8px',
      fontSize: '13px'
    },
    expectedImpact: {
      fontSize: '12px',
      color: '#28a745',
      marginTop: '8px',
      fontWeight: 'bold'
    }
  }

  if (!teamPrediction) {
    return <div>Loading AI predictions...</div>
  }

  const selectedRMData = selectedRM ? rms.find(rm => rm.id === selectedRM) : null
  const selectedPredictions = selectedRM ? predictions[selectedRM] : null
  const selectedSuggestions = selectedRM ? suggestions[selectedRM] : []

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>🤖 AI Predictions & Recommendations</h2>
          <p style={styles.subtitle}>Powered by predictive analytics and machine learning</p>
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
        <button
          style={{
            ...styles.rmButton,
            ...(!selectedRM ? styles.activeRmButton : {})
          }}
          onClick={() => setSelectedRM(null)}
        >
          Team Overview
        </button>
        {rms.map(rm => (
          <button
            key={rm.id}
            style={{
              ...styles.rmButton,
              ...(selectedRM === rm.id ? styles.activeRmButton : {})
            }}
            onClick={() => setSelectedRM(rm.id)}
          >
            {rm.name}
          </button>
        ))}
      </div>

      {/* Predictions */}
      {selectedRMData && selectedPredictions && (
        <>
          <div style={styles.predictionGrid}>
            <div style={{ ...styles.predictionCard, borderLeftColor: getConfidenceColor(selectedPredictions.confidence) }}>
              <div style={styles.predictionTitle}>Revenue Prediction</div>
              <div style={styles.predictionValue}>{formatRupees(selectedPredictions.predictedRevenue)}</div>
              <div style={styles.predictionSubtext}>
                Target: {formatRupees(selectedRMData.monthlyTarget)} | 
                Achievement: {selectedPredictions.predictedAchievement}%
              </div>
              <div style={styles.predictionSubtext}>
                Confidence: {selectedPredictions.confidence}
              </div>
            </div>

            <div style={{ ...styles.predictionCard, borderLeftColor: '#17a2b8' }}>
              <div style={styles.predictionTitle}>Required Weekly Pace</div>
              <div style={styles.predictionValue}>{formatRupees(selectedPredictions.requiredWeeklyRevenue)}</div>
              <div style={styles.predictionSubtext}>Revenue needed per week</div>
              <div style={styles.predictionSubtext}>
                CPs: {selectedPredictions.requiredWeeklyCP} | 
                Active CPs: {selectedPredictions.requiredWeeklyActive}
              </div>
            </div>

            <div style={{ ...styles.predictionCard, borderLeftColor: selectedPredictions.onTrack ? '#28a745' : '#dc3545' }}>
              <div style={styles.predictionTitle}>Status</div>
              <div style={styles.predictionValue}>
                {selectedPredictions.onTrack ? '🎯 On Track' : '⚠️ Needs Attention'}
              </div>
              <div style={styles.predictionSubtext}>
                {selectedPredictions.remainingWeeks} weeks remaining in month
              </div>
            </div>
          </div>

          {/* AI Suggestions */}
          <div style={styles.suggestionsSection}>
            <h3 style={styles.suggestionsTitle}>💡 AI-Powered Recommendations</h3>
            {selectedSuggestions.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                ✅ Great job! No critical recommendations at this time.
              </div>
            ) : (
              selectedSuggestions.map((suggestion, idx) => (
                <div key={idx} style={styles.suggestionCard}>
                  <div style={styles.suggestionHeader}>
                    <span style={{ ...styles.suggestionPriority, background: getPriorityColor(suggestion.priority) }}>
                      {suggestion.priority} Priority
                    </span>
                    <span style={styles.suggestionCategory}>{suggestion.category}</span>
                  </div>
                  <div style={styles.suggestionTitle}>{suggestion.title}</div>
                  <div style={styles.suggestionDescription}>{suggestion.description}</div>
                  <div style={styles.suggestionAction}>
                    <strong>🎯 Action Item:</strong> {suggestion.action}
                  </div>
                  <div style={styles.expectedImpact}>
                    📈 Expected Impact: {suggestion.expectedImpact}
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {/* Team Overview */}
      {!selectedRM && (
        <div style={styles.suggestionsSection}>
          <h3 style={styles.suggestionsTitle}>🏢 Team Summary</h3>
          <div style={styles.predictionGrid}>
            {rms.map(rm => {
              const pred = predictions[rm.id]
              if (!pred) return null
              return (
                <div key={rm.id} style={{ ...styles.predictionCard, borderLeftColor: pred.onTrack ? '#28a745' : '#dc3545' }}>
                  <div style={styles.predictionTitle}>{rm.name}</div>
                  <div style={styles.predictionValue}>{pred.predictedAchievement}%</div>
                  <div style={styles.predictionSubtext}>
                    {formatRupees(pred.predictedRevenue)} / {formatRupees(rm.monthlyTarget)}
                  </div>
                  <div style={styles.predictionSubtext}>
                    {pred.onTrack ? 'On Track' : `${pred.requiredWeeklyRevenue.toLocaleString('en-IN')} ₹/week needed`}
                  </div>
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