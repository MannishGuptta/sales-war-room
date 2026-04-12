export default function Card({title,value,children}){

    return(
    <div style={card}>
    <h3>{title}</h3>
    {value && <h2>{value}</h2>}
    {children}
    </div>
    )
    
    }
    
    const card={
    background:"#fff",
    padding:20,
    borderRadius:10,
    marginBottom:20,
    boxShadow:"0 2px 10px rgba(0,0,0,0.1)"
    }
    