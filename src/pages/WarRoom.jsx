import { useState, useEffect } from 'react';
import Dashboard from '../components/Dashboard';
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

const WarRoom = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [rms, setRms] = useState([
    { id: 1, name: 'John Smith', achievement: 79, target: 200000, achieved: 158390, cpOnboarded: 14, activeCP: 11, cpTarget: 12 },
    { id: 2, name: 'Sarah Johnson', achievement: 92, target: 200000, achieved: 184014, cpOnboarded: 19, activeCP: 12, cpTarget: 15 },
    { id: 3, name: 'Mike Brown', achievement: 41, target: 200000, achieved: 81291, cpOnboarded: 11, activeCP: 4, cpTarget: 10 },
    { id: 4, name: 'Emma Wilson', achievement: 28, target: 200000, achieved: 55771, cpOnboarded: 8, activeCP: 4, cpTarget: 8 },
    { id: 5, name: 'James Davis', achievement: 51, target: 200000, achieved: 101541, cpOnboarded: 9, activeCP: 7, cpTarget: 10 }
  ]);
  const [teamLeaders, setTeamLeaders] = useState([
    { id: 1, name: 'Rajesh Kumar', region: 'North Zone' },
    { id: 2, name: 'Priya Sharma', region: 'South Zone' }
  ]);
  const [meetings, setMeetings] = useState([]);
  const [showWeeklyProgress, setShowWeeklyProgress] = useState(false);
  const [selectedRM, setSelectedRM] = useState(null);
  const [showChangePassword, setShowChangePassword] = useState(false);

  const refreshAllData = () => {
    // Keep using mock data for now
    console.log('Data refreshed');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard rms={rms} meetings={meetings} onRefresh={refreshAllData} onViewWeeklyProgress={(rm) => { setSelectedRM(rm); setShowWeeklyProgress(true); }} />;
      case 'master-data':
        return <MasterDataManagement rms={rms} onUpdate={refreshAllData} />;
      case 'tl-mgmt':
        return <TLManagement teamLeaders={teamLeaders} rms={rms} onUpdate={refreshAllData} />;
      case 'assignments':
        return <AssignmentManagement rms={rms} teamLeaders={teamLeaders} onUpdate={refreshAllData} />;
      case 'meetings':
        return <MeetingDatabase meetings={meetings} rms={rms} onUpdate={refreshAllData} />;
      case 'ai-predict':
        return <AIPredictions rms={rms} teamLeaders={teamLeaders} />;
      case 'attendance':
        return <AttendanceMonitor rms={rms} teamLeaders={teamLeaders} />;
      case 'set-targets':
        return <TargetManagement rms={rms} onUpdateTargets={refreshAllData} onClose={() => setActiveTab('dashboard')} />;
      case 'tl-targets':
        return <TLTargetManagement teamLeaders={teamLeaders} onUpdate={refreshAllData} />;
      default:
        return <Dashboard rms={rms} meetings={meetings} />;
    }
  };

  return (
    <div className="warroom-container">
      <nav className="warroom-nav">
        <div className="nav-brand">
          <h2>📊 Sales War Room</h2>
          <span className="month-badge">April 2026 | Week 2 of 4</span>
        </div>
        <div className="nav-menu">
          <button className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>📈 Dashboard</button>
          <button className={`nav-item ${activeTab === 'set-targets' ? 'active' : ''}`} onClick={() => setActiveTab('set-targets')}>🎯 Set Targets</button>
          <button className={`nav-item ${activeTab === 'meetings' ? 'active' : ''}`} onClick={() => setActiveTab('meetings')}>📅 Meetings ({meetings.length})</button>
          <button className={`nav-item ${activeTab === 'master-data' ? 'active' : ''}`} onClick={() => setActiveTab('master-data')}>📋 Master Data</button>
          <button className={`nav-item ${activeTab === 'ai-predict' ? 'active' : ''}`} onClick={() => setActiveTab('ai-predict')}>🤖 AI Predict</button>
          <button className={`nav-item ${activeTab === 'attendance' ? 'active' : ''}`} onClick={() => setActiveTab('attendance')}>✅ Attendance</button>
          <button className={`nav-item ${activeTab === 'tl-mgmt' ? 'active' : ''}`} onClick={() => setActiveTab('tl-mgmt')}>👥 TL Mgmt</button>
          <button className={`nav-item ${activeTab === 'tl-targets' ? 'active' : ''}`} onClick={() => setActiveTab('tl-targets')}>🎯 TL Targets</button>
          <button className={`nav-item ${activeTab === 'assignments' ? 'active' : ''}`} onClick={() => setActiveTab('assignments')}>📝 Assignments</button>
        </div>
        <div className="nav-user">
          <span>👤 Admin</span>
          <button className="logout-btn" onClick={onLogout}>Logout</button>
          <button className="change-pwd-btn" onClick={() => setShowChangePassword(true)}>🔒 Change Password</button>
        </div>
      </nav>
      <main className="warroom-main">{renderContent()}</main>
      {showWeeklyProgress && selectedRM && (
        <div className="modal-overlay" onClick={() => setShowWeeklyProgress(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <WeeklyProgress rm={selectedRM} onClose={() => setShowWeeklyProgress(false)} />
          </div>
        </div>
      )}
      {showChangePassword && (
        <div className="modal-overlay" onClick={() => setShowChangePassword(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <ChangePassword userType="admin" userId="admin" userName="Admin" onClose={() => setShowChangePassword(false)} onPasswordChanged={() => {}} />
          </div>
        </div>
      )}
    </div>
  );
};

export default WarRoom;