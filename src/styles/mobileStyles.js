export const mobileStyles = {
    // Breakpoints
    breakpoints: {
      mobile: '576px',
      tablet: '768px',
      desktop: '1024px'
    },
  
    // Responsive containers
    container: {
      width: '100%',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '12px',
      '@media (max-width: 768px)': {
        padding: '8px'
      }
    },
  
    // Card styles
    card: {
      background: 'white',
      borderRadius: '12px',
      padding: '16px',
      marginBottom: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      '@media (max-width: 768px)': {
        padding: '12px',
        marginBottom: '10px'
      }
    },
  
    // Grid layouts
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '16px',
      '@media (max-width: 768px)': {
        gridTemplateColumns: '1fr',
        gap: '12px'
      }
    },
  
    // Tables - make scrollable on mobile
    tableWrapper: {
      overflowX: 'auto',
      WebkitOverflowScrolling: 'touch',
      marginBottom: '16px'
    },
  
    // Buttons
    button: {
      padding: '10px 16px',
      fontSize: '14px',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      fontWeight: '500',
      transition: 'all 0.3s ease',
      '@media (max-width: 768px)': {
        padding: '8px 12px',
        fontSize: '12px'
      }
    },
  
    // Form inputs
    input: {
      width: '100%',
      padding: '10px',
      fontSize: '14px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      '@media (max-width: 768px)': {
        padding: '8px',
        fontSize: '13px'
      }
    },
  
    // Header
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '10px',
      marginBottom: '16px',
      '@media (max-width: 768px)': {
        flexDirection: 'column',
        alignItems: 'stretch'
      }
    },
  
    // Tabs
    tabs: {
      display: 'flex',
      overflowX: 'auto',
      WebkitOverflowScrolling: 'touch',
      gap: '4px',
      marginBottom: '16px',
      paddingBottom: '4px',
      '@media (max-width: 768px)': {
        whiteSpace: 'nowrap'
      }
    },
  
    tab: {
      padding: '8px 16px',
      fontSize: '13px',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontWeight: '500',
      color: '#666',
      whiteSpace: 'nowrap',
      '@media (max-width: 768px)': {
        padding: '6px 12px',
        fontSize: '12px'
      }
    },
  
    // Metrics cards
    metricsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
      gap: '12px',
      marginBottom: '20px',
      '@media (max-width: 768px)': {
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '10px'
      }
    },
  
    metricCard: {
      background: 'white',
      padding: '12px',
      borderRadius: '8px',
      textAlign: 'center',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      '@media (max-width: 768px)': {
        padding: '8px'
      }
    },
  
    // Modal for mobile
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      padding: '16px'
    },
  
    modalContent: {
      background: 'white',
      borderRadius: '16px',
      padding: '20px',
      maxWidth: '95%',
      width: '500px',
      maxHeight: '90vh',
      overflowY: 'auto',
      '@media (max-width: 768px)': {
        padding: '16px',
        width: '100%'
      }
    },
  
    // Drawer for mobile (bottom sheet)
    drawer: {
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: 'white',
      borderRadius: '20px 20px 0 0',
      padding: '20px',
      maxHeight: '80vh',
      overflowY: 'auto',
      zIndex: 1000,
      boxShadow: '0 -2px 10px rgba(0,0,0,0.1)'
    }
  }