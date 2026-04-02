import { useNavigate } from "react-router-dom"

export default function FloatingActions({ actions = [] }) {

  const navigate = useNavigate()

  return (
    <div style={container}>

      {actions.map((item, i) => (
        <button
          key={i}
          style={btn}
          onClick={() => {
            if (item.onClick) {
              item.onClick()   // ✅ CUSTOM ACTION (like modal)
            } else if (item.path) {
              navigate(item.path) // ✅ NAVIGATION
            }
          }}
        >
          {item.label}
        </button>
      ))}

    </div>
  )
}

const container = {
  position: "fixed",
  bottom: "20px",
  right: "20px",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  zIndex: 1000
}

const btn = {
  background: "#5c6bc0",
  color: "#fff",
  border: "none",
  padding: "12px 16px",
  borderRadius: "25px",
  cursor: "pointer",
  fontWeight: "600",
  boxShadow: "0 2px 6px rgba(0,0,0,0.15)"
}