// src/services/loadWarRoomData.js
import { supabase } from '../supabaseClient';

export const loadWarRoomData = async () => {
  try {
    // Fetch all data in parallel
    const [rmsResult, meetingsResult, teamLeadersResult] = await Promise.all([
      supabase.from('rms').select('*'),
      supabase.from('meetings').select('*'),
      supabase.from('team_leaders').select('*')
    ]);

    if (rmsResult.error) throw rmsResult.error;
    if (meetingsResult.error) throw meetingsResult.error;
    if (teamLeadersResult.error) throw teamLeadersResult.error;

    // Map RMs - handle your column names
    const mappedRMs = (rmsResult.data || []).map(rm => ({
      id: rm.id,
      name: rm.name,
      email: rm.email,
      phone: rm.phone,
      target: rm.monthly_target || rm.target || 200000,
      achieved: rm.monthly_achieved || rm.achieved || 0,
      tl: rm.tl || 'Unassigned',
      status: rm.status || 'active'
    }));

    // Map Meetings - handle your column names
    const mappedMeetings = (meetingsResult.data || []).map(meeting => ({
      id: meeting.id,
      date: meeting.meeting_date || meeting.date,
      time: meeting.meeting_time || meeting.time || 'TBD',
      rm: meeting.rm || meeting.rm_name || `RM ${meeting.rm_id}`,
      tl: meeting.tl || 'Unknown',
      type: meeting.type || 'Review',
      status: meeting.status || 'scheduled'
    }));

    return {
      rms: mappedRMs,
      meetings: mappedMeetings,
      teamLeaders: teamLeadersResult.data || []
    };
    
  } catch (error) {
    console.error('Error loading data:', error);
    
    // Return mock data as fallback
    return {
      rms: [
        { id: 1, name: "Sarah Johnson", tl: "Emma Wilson", target: 200000, achieved: 184014, status: "active" },
        { id: 2, name: "John Smith", tl: "Emma Wilson", target: 200000, achieved: 158390, status: "active" },
        { id: 3, name: "James Davis", tl: "Michael Lee", target: 200000, achieved: 101541, status: "active" },
        { id: 4, name: "Mike Brown", tl: "Michael Lee", target: 200000, achieved: 81291, status: "inactive" },
        { id: 5, name: "Emma Wilson", tl: "Sarah Chen", target: 200000, achieved: 55771, status: "active" }
      ],
      meetings: [
        { id: 1, date: "2026-04-10", time: "11:00 AM", rm: "Sarah Johnson", tl: "Emma Wilson", type: "CP Review", status: "scheduled" },
        { id: 2, date: "2026-04-10", time: "2:00 PM", rm: "John Smith", tl: "Emma Wilson", type: "Target Review", status: "scheduled" },
        { id: 3, date: "2026-04-11", time: "10:30 AM", rm: "James Davis", tl: "Michael Lee", type: "Performance", status: "scheduled" }
      ],
      teamLeaders: [
        { id: 1, name: "Emma Wilson", region: "North" },
        { id: 2, name: "Michael Lee", region: "South" },
        { id: 3, name: "Sarah Chen", region: "East" }
      ]
    };
  }
};