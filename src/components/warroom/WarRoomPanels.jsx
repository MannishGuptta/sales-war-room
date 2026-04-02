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

export default function WarRoomPanels({data}){

return(

<div style={{
display:"grid",
gridTemplateColumns:"repeat(auto-fit,minmax(420px,1fr))",
gap:20
}}>

<SalesPressurePanel pressure={data.pressure}/>

<RMLeaderboardPanel leaderboard={data.rmLeaderboard}/>

<IntelligenceCharts
funnel={data.funnel}
rmLeaderboard={data.rmLeaderboard}
citySales={data.citySales}
/>

<ForecastPanel forecast={data.forecast}/>

<DealVelocityPanel dealVelocity={data.dealVelocity}/>

<RiskPanel riskDeals={[]}/>

<RadarPanel aiDeals={[]}/>

<BottleneckPanel bottleneck={[]}/>

<ActivitySection rmStatus={data.rmStatus} activityFeed={[]} />

<RMActivityMap rmStatus={data.rmStatus}/>

</div>

)

}