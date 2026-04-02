import React from "react";

export default function ForecastPanel({forecast}){

const expected = forecast?.expectedRevenue || 0

return(

<div style={card}>

<h3>Forecast Engine</h3>

<p>Expected Revenue: ₹{expected}</p>

</div>

)

}

const card={
background:"#fff",
padding:20,
borderRadius:10,
boxShadow:"0 2px 10px rgba(0,0,0,0.1)"
}