export async function runWarRoomEngine(
    supabase,
    getProbability,
    period = "today",
    selectedRM = "all"
  ) {
  
    try {
  
      ////////////////////////////
      // FETCH DATA
      ////////////////////////////
  
      const { data: sales = [] } = await supabase.from("sales").select("*");
      const { data: meetings = [] } = await supabase.from("meetings").select("*");
      const { data: cps = [] } = await supabase.from("channel_partners").select("*");
      const { data: rms = [] } = await supabase.from("users").select("id,name").eq("role", "rm");
      const { data: targets = [] } = await supabase.from("targets").select("*");
  
      ////////////////////////////
      // RM FILTER
      ////////////////////////////
  
      let filteredSales = sales;
      let filteredMeetings = meetings;
      let filteredCP = cps;
  
      if (selectedRM !== "all") {
        filteredSales = sales.filter(s => s.rm_id === selectedRM);
        filteredMeetings = meetings.filter(m => m.rm_id === selectedRM);
        filteredCP = cps.filter(c => c.rm_id === selectedRM);
      }
  
      ////////////////////////////
      // DATE FILTER
      ////////////////////////////
  
      const now = new Date();
      const startOfToday = new Date();
      startOfToday.setHours(0,0,0,0);
  
      let startDate = null;
      if (period === "today") startDate = startOfToday;
  
      const rangeSales = startDate
        ? filteredSales.filter(s => s.booking_date && new Date(s.booking_date) >= startDate)
        : filteredSales;
  
      const rangeMeetings = startDate
        ? filteredMeetings.filter(m => m.meeting_date && new Date(m.meeting_date) >= startDate)
        : filteredMeetings;
  
      const rangeCP = startDate
        ? filteredCP.filter(c => c.created_at && new Date(c.created_at) >= startDate)
        : filteredCP;
  
      ////////////////////////////
      // KPI
      ////////////////////////////
  
      const revenue = rangeSales.reduce(
        (sum, s) => sum + Number(s.plot_value || 0),
        0
      );
  
      const activeSet = new Set();
      rangeMeetings.forEach(m => m.cp_id && activeSet.add(m.cp_id));
      rangeSales.forEach(s => s.cp_id && activeSet.add(s.cp_id));
  
      const activeCP = activeSet.size;
  
      ////////////////////////////
      // TARGET ENGINE
      ////////////////////////////
  
      const currentMonth = now.getMonth() + 1;
      const currentYear = now.getFullYear();
  
      const latestTarget = targets
        .filter(t =>
          t.month === currentMonth &&
          t.year === currentYear &&
          !t.rm_id
        )
        .sort((a,b)=> new Date(b.created_at) - new Date(a.created_at))[0] || {};
  
      const targetRevenue = Number(latestTarget.monthly_revenue || 0);
      const targetSales = Number(latestTarget.monthly_sales || 0);
      const targetMeetings = Number(latestTarget.monthly_meetings || 0);
      const targetCP = Number(latestTarget.monthly_cp_onboard || 0);
      const targetActiveCP = Number(latestTarget.monthly_active_cp || 0);
  
      ////////////////////////////
      // ACHIEVEMENTS
      ////////////////////////////
  
      const achievedRevenue = revenue;
      const achievedSales = rangeSales.length;
      const achievedMeetings = rangeMeetings.length;
      const achievedCP = rangeCP.length;
      const achievedActiveCP = activeCP;
  
      ////////////////////////////
      // GAP
      ////////////////////////////
  
      const gapRevenue = Math.max(targetRevenue - achievedRevenue, 0);
      const gapSales = Math.max(targetSales - achievedSales, 0);
      const gapMeetings = Math.max(targetMeetings - achievedMeetings, 0);
      const gapCP = Math.max(targetCP - achievedCP, 0);
      const gapActiveCP = Math.max(targetActiveCP - achievedActiveCP, 0);
  
      ////////////////////////////
      // PACE ENGINE
      ////////////////////////////
  
      const dayOfMonth = now.getDate();
      const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
  
      const expectedRevenueTillToday = (targetRevenue / daysInMonth) * dayOfMonth;
  
      const pace = {
        expected: Math.round(expectedRevenueTillToday),
        actual: achievedRevenue,
        status:
          achievedRevenue >= expectedRevenueTillToday ? "On Track" :
          achievedRevenue >= expectedRevenueTillToday * 0.7 ? "At Risk" :
          "Behind"
      };
  
      ////////////////////////////
      // PROJECTION
      ////////////////////////////
  
      const projectedRevenue = Math.round(
        (achievedRevenue / Math.max(dayOfMonth,1)) * daysInMonth
      );
  
      const projection = {
        projectedRevenue,
        achievementPercent:
          targetRevenue > 0
            ? Math.round((projectedRevenue / targetRevenue) * 100)
            : 0
      };
  
      ////////////////////////////
      // RECOVERY PLAN
      ////////////////////////////
  
      const daysRemaining = Math.max(daysInMonth - dayOfMonth, 1);
  
      const recoveryPlan = {
        revenuePerDay: Math.ceil(gapRevenue / daysRemaining),
        dealsPerDay: Math.ceil(gapSales / daysRemaining),
        meetingsPerDay: Math.ceil(gapMeetings / daysRemaining),
        cpPerDay: Math.ceil(gapCP / daysRemaining),
        activeCPPerDay: Math.ceil(gapActiveCP / daysRemaining)
      };
  
      ////////////////////////////
      // FORECAST (PIPELINE)
      ////////////////////////////
  
      let forecastRevenue = 0;
  
      rangeSales.forEach(s => {
        const value = Number(s.plot_value || 0);
        const prob = getProbability(s.stage || "Inquiry");
        forecastRevenue += value * prob;
      });
  
      ////////////////////////////
      // FUNNEL
      ////////////////////////////
  
      const stages = ["Inquiry","Meeting","Site Visit","Negotiation","Booking"];
  
      const funnel = stages.map(stage => ({
        stage,
        count: rangeSales.filter(s => (s.stage || "Inquiry") === stage).length
      }));
  
      ////////////////////////////
      // CITY SALES
      ////////////////////////////
  
      let cityMap = {};
  
      rangeSales.forEach(s => {
        const city = s.city || "Unknown";
        if (!cityMap[city]) cityMap[city] = 0;
        cityMap[city]++;
      });
  
      const citySales = Object.keys(cityMap).map(c => ({
        name: c,
        value: cityMap[c]
      }));
  
      ////////////////////////////
      // RM LEADERBOARD (SCORE BASED)
      ////////////////////////////
  
      let rmMap = {};
  
      rms.forEach(r => {
        rmMap[r.id] = {
          rm_id: r.id,
          name: r.name,
          revenue: 0,
          deals: 0,
          meetings: 0,
          activeCP: 0
        };
      });
  
      rangeSales.forEach(s => {
        if (rmMap[s.rm_id]) {
          rmMap[s.rm_id].revenue += Number(s.plot_value || 0);
          rmMap[s.rm_id].deals += 1;
        }
      });
  
      rangeMeetings.forEach(m => {
        if (rmMap[m.rm_id]) {
          rmMap[m.rm_id].meetings += 1;
        }
      });
  
      const cpMap = {};
  
      rangeMeetings.forEach(m => {
        if (m.cp_id) cpMap[m.cp_id] = m.rm_id;
      });
  
      rangeSales.forEach(s => {
        if (s.cp_id) cpMap[s.cp_id] = s.rm_id;
      });
  
      Object.keys(cpMap).forEach(cp => {
        const rm_id = cpMap[cp];
        if (rmMap[rm_id]) rmMap[rm_id].activeCP += 1;
      });
  
      const rmLeaderboard = Object.values(rmMap).map(rm => {
  
        const score =
          rm.revenue * 0.4 +
          rm.deals * 20000 +
          rm.meetings * 2000 +
          rm.activeCP * 3000;
  
        let status =
          score > 800000 ? "Green" :
          score > 300000 ? "Amber" :
          "Red";
  
        return { ...rm, score, status };
  
      }).sort((a,b)=> b.score - a.score);
  
      ////////////////////////////
      // INTERVENTION ENGINE
      ////////////////////////////
  
      const intervention = {
        highValueStuckDeals: rangeSales.filter(s =>
          s.stage === "Negotiation" && Number(s.plot_value) > 5000000
        ),
        noFollowUp: rangeMeetings.filter(m => !m.followup_date),
        inactiveCP: filteredCP.filter(cp =>
          !rangeMeetings.some(m => m.cp_id === cp.id)
        )
      };
  
      ////////////////////////////
      // RETURN
      ////////////////////////////
  
      return {
  
        revenuePeriod: revenue,
        salesPeriod: rangeSales.length,
        meetingsPeriod: rangeMeetings.length,
        cpOnboardPeriod: rangeCP.length,
        activeCPPeriod: activeCP,
  
        salesData: rangeSales,
        meetingsData: rangeMeetings,
        cpList: filteredCP,
  
        forecast: { expectedRevenue: Math.round(forecastRevenue) },
        funnel,
        citySales,
        rmLeaderboard,
  
        pace,
        projection,
        recoveryPlan,
        intervention,
  
        targetIntelligence: {
          targetRevenue,
          achievedRevenue,
          gapRevenue,
          targetSales,
          targetMeetings,
          targetCPOnboard: targetCP,
          targetActiveCP
        }
  
      };
  
    } catch (err) {
  
      console.log("WarRoom Engine Error", err);
  
      return {
        revenuePeriod: 0,
        salesPeriod: 0,
        meetingsPeriod: 0,
        cpOnboardPeriod: 0,
        activeCPPeriod: 0,
  
        salesData: [],
        meetingsData: [],
        cpList: [],
  
        forecast: { expectedRevenue: 0 },
        funnel: [],
        citySales: [],
        rmLeaderboard: [],
  
        pace: {},
        projection: {},
        recoveryPlan: {},
        intervention: {},
  
        targetIntelligence: {}
      };
  
    }
  
  }