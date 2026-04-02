export default function SalesPressurePanel({pressure}){

    return(
    
    <div style={box}>
    
    <h2>Sales Pressure Meter</h2>
    
    <p><b>Target:</b> ₹ {pressure?.target?.toLocaleString() || 0}</p>
    
    <p><b>Achieved:</b> ₹ {pressure?.achieved?.toLocaleString() || 0}</p>
    
    <p><b>Pace:</b> {pressure?.pace || 0}%</p>
    
    <p style={{
    color:
    pressure?.status==="CRITICAL" ? "red" :
    pressure?.status==="WARNING" ? "orange" :
    "green",
    fontWeight:"bold"
    }}>
    
    Status: {pressure?.status || "NORMAL"}
    
    </p>
    
    </div>
    
    )
    
    }
    
    const box={
    background:"#fff",
    padding:20,
    borderRadius:10,
    marginBottom:40,
    boxShadow:"0 2px 10px rgba(0,0,0,0.1)"
    }