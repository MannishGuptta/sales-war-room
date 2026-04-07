import { useState, useEffect, useCallback } from "react";
import MetricsBar from "../components/MetricsBar";
import RMTable from "../components/RMTable";
import InterventionFeed from "../components/InterventionFeed";
import WeeklyProgress from "../components/WeeklyProgress";
import TargetManagement from "../components/TargetManagement";
import MasterDataManagement from "../components/MasterDataManagement";
import PerformanceChart from "../components/PerformanceChart";
import AIPredictions from "../components/AIPredictions";
import AttendanceMonitor from "../components/AttendanceMonitor";
import TLManagement from "../components/TLManagement";
import AssignmentManagement from "../components/AssignmentManagement";
import TLTargetManagement from "../components/TLTargetManagement";
import ChangePassword from "../components/ChangePassword";

import { supabase } from "../supabaseClient";
import { calculateMetrics } from "../utils/kpiEngine";
import { processAllRMs, generateInterventions } from "../engines/escalationEngine";

import { supabase } from "../supabaseClient";
import { useEffect, useState } from "react";

const WarRoom = ({ onLogout }) => {
  const [rms, setRms] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [interventions, setInterventions] = useState([]);
  const [meetingStats, setMeetingStats] = useState({});
  const [teamLeadersList, setTeamLeadersList] = useState([]);

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");

  const [showMasterData, setShowMasterData] = useState(false);
  const [showTLManagement, setShowTLManagement] = useState(false);
  const [showAssignmentMgmt, setShowAssignmentMgmt] = useState(false);

  const [lastUpdated, setLastUpdated] = useState(new Date());

  const WarRoom = ({ onLogout }) => {

    const test = async () => {
      const { data, error } = await supabase.from("rms").select("*");
      console.log("FINAL TEST:", data, error);
    };
  
    useEffect(() => {
      test();
    }, []);

  // ✅ MAIN DATA LOADER
  const loadData = useCallback(async () => {
    try {
      setLoading(true);

      console.log("🔄 Loading War Room Data...");

      // =========================
      // RMS
      // =========================
      const { data: rmsData, error: rmsError } = await supabase
        .from("rms")
        .select("*");

      if (rmsError) throw rmsError;

      console.log("✅ RMS:", rmsData);

      const mappedRMs = (rmsData || []).map((rm) => ({
        id: rm.id,
        name: rm.name,
        email: rm.email,
        phone: rm.phone,
        monthlyTarget: rm.monthly_target || 0,
        monthlyAchieved: rm.monthly_achieved || 0,
        cpTarget: rm.cp_target || 0,
        cpOnboarded: rm.cp_onboarded || 0,
        activeCPTarget: rm.active_cp_target || 0,
        activeCP: rm.active_cp || 0,
        status: rm.status || "active",
        escalationLevel: rm.escalation_level || "low",
      }));

      // =========================
      // TEAM LEADERS
      // =========================
      const { data: tlData } = await supabase
        .from("team_leaders")
        .select("*");

      setTeamLeadersList(tlData || []);

      // =========================
      // MEETINGS
      // =========================
      const { data: meetingsData } = await supabase
        .from("meetings")
        .select("*");

      const stats = {};
      const today = new Date().toISOString().split("T")[0];

      meetingsData?.forEach((m) => {
        if (!stats[m.rm_id]) {
          stats[m.rm_id] = { total: 0, upcoming: 0 };
        }
        stats[m.rm_id].total++;
        if (m.meeting_date >= today) stats[m.rm_id].upcoming++;
      });

      setMeetingStats(stats);

      // =========================
      // PROCESS DATA
      // =========================
      const processed = processAllRMs(mappedRMs, 1);

      setRms(processed);
      setMetrics(calculateMetrics(processed));
      setInterventions(generateInterventions(processed));

      setLastUpdated(new Date());

    } catch (error) {
      console.error("❌ WAR ROOM ERROR:", error);
      alert("Error loading data. Check console.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // =========================
  // UI STATES
  // =========================
  if (loading) return <div style={{ padding: 40 }}>Loading...</div>;
  if (!metrics) return <div>Error loading data</div>;

  const totalMeetings = Object.values(meetingStats).reduce(
    (sum, s) => sum + s.total,
    0
  );

  const totalUpcoming = Object.values(meetingStats).reduce(
    (sum, s) => sum + s.upcoming,
    0
  );

  // =========================
  // UI
  // =========================
  return (
    <div style={{ padding: 20 }}>
      <h1>🏆 Sales War Room</h1>

      <button onClick={loadData}>🔄 Refresh</button>

      <p>Last Updated: {lastUpdated.toLocaleTimeString()}</p>

      {/* NAV */}
      <div style={{ marginBottom: 20 }}>
        <button onClick={() => setActiveTab("dashboard")}>Dashboard</button>
        <button onClick={() => setActiveTab("meetings")}>
          Meetings ({totalUpcoming})
        </button>
        <button onClick={() => setShowMasterData(true)}>Master Data</button>
        <button onClick={() => setShowTLManagement(true)}>TL Mgmt</button>
        <button onClick={() => setShowAssignmentMgmt(true)}>
          Assignments
        </button>
      </div>

      {/* MASTER DATA */}
      {showMasterData && (
        <MasterDataManagement onClose={() => setShowMasterData(false)} />
      )}

      {/* TL */}
      {showTLManagement && (
        <TLManagement onClose={() => setShowTLManagement(false)} />
      )}

      {/* ASSIGNMENTS */}
      {showAssignmentMgmt && (
        <AssignmentManagement onClose={() => setShowAssignmentMgmt(false)} />
      )}

      {/* DASHBOARD */}
      {activeTab === "dashboard" && (
        <>
          <h3>Total Meetings: {totalMeetings}</h3>
          <h3>Upcoming: {totalUpcoming}</h3>

          <MetricsBar metrics={metrics} />
          <PerformanceChart rms={rms} />
          <RMTable rms={rms} />
          <InterventionFeed interventions={interventions} />
        </>
      )}

      {/* MEETINGS */}
      {activeTab === "meetings" && (
        <table border="1">
          <thead>
            <tr>
              <th>RM</th>
              <th>Total</th>
              <th>Upcoming</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(meetingStats).map(([rmId, stat]) => {
              const rm = rms.find((r) => r.id === rmId);
              return (
                <tr key={rmId}>
                  <td>{rm?.name}</td>
                  <td>{stat.total}</td>
                  <td>{stat.upcoming}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};


export default WarRoom;