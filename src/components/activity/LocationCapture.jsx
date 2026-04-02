export default function LocationCapture(){

    function getLocation(){
    
    navigator.geolocation.getCurrentPosition(position=>{
    
    alert(
    `Lat: ${position.coords.latitude} 
    Lng: ${position.coords.longitude}`
    )
    
    })
    
    }
    
    return(
    
    <div style={card}>
    
    <h3>Capture Location</h3>
    
    <button onClick={getLocation}>Get Location</button>
    
    </div>
    
    )
    
    }
    
    const card={
    background:"#fff",
    padding:20,
    borderRadius:10,
    marginBottom:20
    }