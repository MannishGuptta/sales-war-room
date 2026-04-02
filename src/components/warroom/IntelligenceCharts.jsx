import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid
    } from "recharts"
    
    export default function IntelligenceCharts({
    funnel,
    rmLeaderboard,
    rmScore,
    cpLeaderboard,
    citySales
    }){
    
    return(
    
    <div>
    
    <h2>Performance Intelligence</h2>
    
    <div style={chartGrid}>
    
    
    {/* SALES FUNNEL */}
    
    <div style={chartBox}>
    
    <h3>Sales Funnel</h3>
    
    <ResponsiveContainer width="100%" height={300}>
    
    <BarChart data={funnel}>
    
    <CartesianGrid strokeDasharray="3 3"/>
    
    <XAxis dataKey="stage"/>
    
    <YAxis/>
    
    <Tooltip/>
    
    <Bar dataKey="value" fill="#3f51b5"/>
    
    </BarChart>
    
    </ResponsiveContainer>
    
    </div>
    
    
    {/* RM LEADERBOARD */}
    
    <div style={chartBox}>
    
    <h3>Top RM Leaderboard</h3>
    
    <ResponsiveContainer width="100%" height={300}>
    
    <BarChart data={rmLeaderboard}>
    
    <CartesianGrid strokeDasharray="3 3"/>
    
    <XAxis dataKey="rm"/>
    
    <YAxis/>
    
    <Tooltip/>
    
    <Bar dataKey="revenue" fill="#5c6bc0"/>
    
    </BarChart>
    
    </ResponsiveContainer>
    
    </div>
    
    
    {/* RM PERFORMANCE */}
    
    <div style={chartBox}>
    
    <h3>RM Performance Score</h3>
    
    <ResponsiveContainer width="100%" height={300}>
    
    <BarChart data={rmScore}>
    
    <CartesianGrid strokeDasharray="3 3"/>
    
    <XAxis dataKey="rm"/>
    
    <YAxis/>
    
    <Tooltip/>
    
    <Bar dataKey="score" fill="#ff9800"/>
    
    </BarChart>
    
    </ResponsiveContainer>
    
    </div>
    
    
    {/* CP LEADERBOARD */}
    
    <div style={chartBox}>
    
    <h3>Top Channel Partners</h3>
    
    <ResponsiveContainer width="100%" height={300}>
    
    <BarChart data={cpLeaderboard}>
    
    <CartesianGrid strokeDasharray="3 3"/>
    
    <XAxis dataKey="cp"/>
    
    <YAxis/>
    
    <Tooltip/>
    
    <Bar dataKey="revenue" fill="#26a69a"/>
    
    </BarChart>
    
    </ResponsiveContainer>
    
    </div>
    
    
    {/* CITY SALES */}
    
    <div style={chartBox}>
    
    <h3>Sales Heat Map</h3>
    
    <ResponsiveContainer width="100%" height={300}>
    
    <BarChart data={citySales} layout="vertical">
    
    <CartesianGrid strokeDasharray="3 3"/>
    
    <XAxis type="number"/>
    
    <YAxis dataKey="city" type="category"/>
    
    <Tooltip/>
    
    <Bar dataKey="revenue" fill="#ff7043"/>
    
    </BarChart>
    
    </ResponsiveContainer>
    
    </div>
    
    
    </div>
    
    </div>
    
    )
    
    }
    
    
    
    const chartGrid={
    display:"grid",
    gridTemplateColumns:"repeat(auto-fit,minmax(400px,1fr))",
    gap:30,
    marginBottom:40
    }
    
    const chartBox={
    background:"#fff",
    padding:20,
    borderRadius:10,
    boxShadow:"0 2px 10px rgba(0,0,0,0.1)"
    }