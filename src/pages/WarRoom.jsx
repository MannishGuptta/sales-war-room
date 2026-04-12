// src/pages/WarRoom.jsx
import { useState, useEffect } from 'react';
import Dashboard from '../components/dashboard/Dashboard';
import MasterDataManagement from '../components/MasterDataManagement';
import TLManagement from '../components/TLManagement';
import AssignmentManagement from '../components/AssignmentManagement';
import MeetingDatabase from '../components/MeetingDatabase';
import AIPredictions from '../components/AIPredictions';
import AttendanceMonitor from '../components/AttendanceMonitor';
import TargetManagement from '../components/TargetManagement';
import TLTargetManagement from '../components/TLTargetManagement';
import ChangePassword from '../components/ChangePassword';
import WeeklyProgress from '../components/WeeklyProgress';
import { loadWarRoomData } from '../services/loadWarRoomData';

const WarRoom = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [rms, setRms] = useState([]);
  const [teamLeaders, setTeamLeaders] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showWeeklyProgress, setShowWeeklyProgress] = useState(false);
  const [selectedRM, setSelectedRM] = useState(null);
  const [showChangePassword, setShowChangePassword] = useState(false);

  const refreshAllData = async () => {
    setLoading(true);
    const data = await loadWarRoomData();
    setRms(data.rms || []);
    setTeamLeaders(data.teamLeaders || []);
    setMeetings(data.meetings || []);
    setLoading(false);
  };

  useEffect(() => {
    refreshAllData();
  }, []);

  const handleCloseWeeklyProgress = () => {
    setShowWeeklyProgress(false);
    setSelectedRM(null);
  };

  // Add this to test Supabase connection
const testSupabase = async () => {
  const { data, error } = await supabase.from('rms').select('*');
  console.log('Supabase test:', { data, error });
};
testSupabase();

  // ✅ CRITICAL FIX: Render different components based on activeTab
  const renderContent = () => {
    if (loading) {
      return <div className="loading-spinner">Loading...</div>;
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            rms={rms} 
            teamLeaders={teamLeaders}
            meetings={meetings}
            onRefresh={refreshAllData}
            onViewWeeklyProgress={(rm) => {
              setSelectedRM(rm);
              setShowWeeklyProgress(true);
            }}
          />
        );

      case 'master-data':
        return (
          <MasterDataManagement 
            rms={rms}
            teamLeaders={teamLeaders}
            onUpdate={refreshAllData}
          />
        );

      case 'tl-mgmt':
        return (
          <TLManagement 
            teamLeaders={teamLeaders}
            rms={rms}
            onUpdate={refreshAllData}
          />
        );

      case 'assignments':
        return (
          <AssignmentManagement 
            rms={rms}
            teamLeaders={teamLeaders}
            onUpdate={refreshAllData}
          />
        );

      case 'meetings':
        return (
          <MeetingDatabase 
            meetings={meetings}
            rms={rms}
            onUpdate={refreshAllData}
          />
        );

      case 'ai-predict':
        return (
          <AIPredictions 
            rms={rms}
            teamLeaders={teamLeaders}
          />
        );

      case 'attendance':
        return (
          <AttendanceMonitor 
            rms={rms}
            teamLeaders={teamLeaders}
          />
        );

      case 'set-targets':
        return (
          <TargetManagement 
            rms={rms}
            onUpdateTargets={refreshAllData}
            onClose={() => setActiveTab('dashboard')}
          />
        );

      case 'tl-targets':
        return (
          <TLTargetManagement 
            teamLeaders={teamLeaders}
            onUpdate={refreshAllData}
          />
        );

      default:
        return <Dashboard rms={rms} />;
    }
  };

  return (
    <div className="warroom-container">
      {/* Navigation Menu */}
      <nav className="warroom-nav">
        <div className="nav-brand">
          <h2>📊 Sales War Room</h2>
          <span className="month-badge">April 2026 | Week 2 of 4</span>
        </div>
        
        <div className="nav-menu">
          <button 
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            📈 Dashboard
          </button>
          <button 
            className={`nav-item ${activeTab === 'set-targets' ? 'active' : ''}`}
            onClick={() => setActiveTab('set-targets')}
          >
            🎯 Set Targets
          </button>
          <button 
            className={`nav-item ${activeTab === 'meetings' ? 'active' : ''}`}
            onClick={() => setActiveTab('meetings')}
          >
            📅 Meetings ({meetings.filter(m => m.status === 'scheduled').length})
          </button>
          <button 
            className={`nav-item ${activeTab === 'master-data' ? 'active' : ''}`}
            onClick={() => setActiveTab('master-data')}
          >
            📋 Master Data
          </button>
          <button 
            className={`nav-item ${activeTab === 'ai-predict' ? 'active' : ''}`}
            onClick={() => setActiveTab('ai-predict')}
          >
            🤖 AI Predict
          </button>
          <button 
            className={`nav-item ${activeTab === 'attendance' ? 'active' : ''}`}
            onClick={() => setActiveTab('attendance')}
          >
            ✅ Attendance
          </button>
          <button 
            className={`nav-item ${activeTab === 'tl-mgmt' ? 'active' : ''}`}
            onClick={() => setActiveTab('tl-mgmt')}
          >
            👥 TL Mgmt
          </button>
          <button 
            className={`nav-item ${activeTab === 'tl-targets' ? 'active' : ''}`}
            onClick={() => setActiveTab('tl-targets')}
          >
            🎯 TL Targets
          </button>
          <button 
            className={`nav-item ${activeTab === 'assignments' ? 'active' : ''}`}
            onClick={() => setActiveTab('assignments')}
          >
            📝 Assignments
          </button>
        </div>

        <div className="nav-user">
          <span>👤 Admin</span>
          <button className="logout-btn" onClick={onLogout}>Logout</button>
          <button className="change-pwd-btn" onClick={() => setShowChangePassword(true)}>
            🔒 Change Password
          </button>
        </div>
      </nav>

      {/* Main Content - Renders different component based on tab */}
      <main className="warroom-main">
        {renderContent()}
      </main>

      {/* Modals */}
      {showWeeklyProgress && selectedRM && (
        <div className="modal-overlay" onClick={handleCloseWeeklyProgress}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <WeeklyProgress 
              rm={selectedRM} 
              onClose={handleCloseWeeklyProgress}
            />
          </div>
        </div>
      )}

      {showChangePassword && (
        <div className="modal-overlay" onClick={() => setShowChangePassword(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <ChangePassword
              userType="admin"
              userId="admin"
              userName="Admin"
              onClose={() => setShowChangePassword(false)}
              onPasswordChanged={() => {}}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default WarRoom;