import React from "react";

import SalesPressurePanel from "./SalesPressurePanel";
import IntelligenceCharts from "./IntelligenceCharts";
import ForecastPanel from "./ForecastPanel";
import DealVelocityPanel from "./DealVelocityPanel";
import RiskPanel from "./RiskPanel";
import RadarPanel from "./RadarPanel";
import BottleneckPanel from "./BottleneckPanel";
import ActivitySection from "./ActivitySection";
import RMActivityMap from "./RMActivityMap";
import RMLeaderboardPanel from "./RMLeaderboardPanel";

/* ⚠️ TEMP SAFE IMPORTS (to prevent crash) */
let DealProbabilityBoard = null;
let RMProductivity = null;
let CPPredictor = null;

try {
  DealProbabilityBoard = require("../dashboard/DealProbabilityBoard").default;
} catch {}

try {
  RMProductivity = require("../dashboard/RMProductivity").default;
} catch {}

try {
  CPPredictor = require("../dashboard/CPPredictor").default;
} catch {}

export default function WarRoomPanels({ data }){

/* 🔒 HARD SAFETY LAYER */

const safe = {
...data,

dailyMission: data?.dailyMission || {},
pressure: data?.pressure || {},
rmLeaderboard: data?.rmLeaderboard || [],
funnel: data?.funnel || [],
citySales: data?.citySales || [],
forecast: data?.forecast || { expectedRevenue: 0 },
dealVelocity: data?.dealVelocity || { avgDays:0,fastDeals:[],slowDeals:[] },

rmStatus: Array.isArray(data?.rmStatus) ? data.rmStatus : [],
salesData: Array.isArray(data?.salesData) ? data.salesData : [],
cpList: Array.isArray(data?.cpList) ? data.cpList : [],

cpOnboardPeriod: data?.cpOnboardPeriod || 0,
activeCPPeriod: data?.activeCPPeriod || 0,
meetingsPeriod: data?.meetingsPeriod || 0,
salesPeriod: data?.salesPeriod || 0,
revenuePeriod: data?.revenuePeriod || 0,

targetIntelligence: data?.targetIntelligence || {}
}

return(

<div style={{
display:"grid",
gridTemplateColumns:"repeat(auto-fit,minmax(420px,1fr))",
gap:20
}}>

{/* DAILY MISSION */}

<div style={card}>
<h3>Today's Mission</h3>

<p>Revenue Needed Today: ₹{safe.dailyMission.revenueToday || 0}</p>
<p>Meetings Required Today: {safe.dailyMission.meetingsToday || 0}</p>
<p>CP Activations Needed: {safe.dailyMission.cpActivationToday || 0}</p>
<p>Deals Required This Week: {safe.dailyMission.dealsThisWeek || 0}</p>
</div>

<SalesPressurePanel pressure={safe.pressure} />

<RMLeaderboardPanel leaderboard={safe.rmLeaderboard} />

<IntelligenceCharts
funnel={safe.funnel}
rmLeaderboard={safe.rmLeaderboard}
citySales={safe.citySales}
/>

<ForecastPanel forecast={safe.forecast} />

{/* ✅ SAFE RENDERING (NO CRASH) */}

{DealProbabilityBoard && (
<DealProbabilityBoard deals={safe.salesData} />
)}

{CPPredictor && (
<CPPredictor cpPredict={safe.cpList} />
)}

{RMProductivity && (
<RMProductivity
stats={{
cp: safe.cpOnboardPeriod,
activeCP: safe.activeCPPeriod,
meetings: safe.meetingsPeriod,
sales: safe.salesPeriod,
revenue: safe.revenuePeriod
}}
targets={safe.targetIntelligence}
/>
)}

<DealVelocityPanel dealVelocity={safe.dealVelocity} />

<RiskPanel riskDeals={[]} />

<RadarPanel aiDeals={[]} />

<BottleneckPanel bottleneck={[]} />

<ActivitySection
rmStatus={safe.rmStatus || []}
activityFeed={[]}
/>

<RMActivityMap rmStatus={safe.rmStatus || []} />

</div>

)

}

const card = {
background:"#fff",
padding:20,
borderRadius:10,
boxShadow:"0 2px 10px rgba(0,0,0,0.1)"
}