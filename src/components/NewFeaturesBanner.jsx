import { Link } from "react-router-dom";
import { Calculator, ListOrdered, Map, Sparkles, X } from "lucide-react";
import { useState } from "react";

const FEATURES = [
  { icon: Calculator,  label: "ROI Calculator",        sub: "Is your college worth it?",  to: "/roi",              color: "#e63946" },
  { icon: ListOrdered, label: "Choice Filling Helper",  sub: "Smart JoSAA choice order",  to: "/choice-filling",   color: "#2563eb" },
  { icon: Map,         label: "College Map View",       sub: "Explore colleges on map",    to: "/college-map",      color: "#0d9488" },
  { icon: Sparkles,    label: "Colleges for You",       sub: "Personalised picks",         to: "/colleges-for-you", color: "#7c3aed" },
];

export default function NewFeaturesBanner() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div style={{
      position: "fixed",
      top: 71,
      left: 0,
      right: 0,
      zIndex: 999,
      background: "#fff",
      borderBottom: "2px solid #e63946",
      padding: "0.45rem 1.4rem",
      display: "flex",
      alignItems: "center",
      gap: "1rem",
      flexWrap: "wrap",
      justifyContent: "center",
      boxShadow: "0 4px 16px rgba(13,27,62,0.10)",
    }}>
      {/* Label */}
      <span style={{
        fontSize: "0.7rem", fontWeight: 800, letterSpacing: "1.2px",
        color: "#e63946", textTransform: "uppercase", whiteSpace: "nowrap",
      }}>
        ✦ New Features
      </span>

      <span style={{ width: 1, height: 18, background: "#e5e7eb" }} />

      {/* Feature pills */}
      <div style={{ display: "flex", gap: "0.45rem", flexWrap: "wrap", justifyContent: "center" }}>
        {FEATURES.map(({ icon: Icon, label, sub, to, color }) => (
          <Link key={to} to={to} style={{
            display: "flex", alignItems: "center", gap: "0.4rem",
            padding: "0.28rem 0.8rem",
            borderRadius: 999,
            background: `${color}11`,
            border: `1px solid ${color}33`,
            textDecoration: "none",
            transition: "background .2s, transform .2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.background = `${color}22`; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = `${color}11`; e.currentTarget.style.transform = "none"; }}
          >
            <Icon size={13} color={color} />
            <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.2 }}>
              <span style={{ fontSize: "0.76rem", fontWeight: 700, color: "#0d1b3e" }}>{label}</span>
              <span style={{ fontSize: "0.63rem", color: "#6b7280" }}>{sub}</span>
            </span>
            <span style={{
              fontSize: "0.56rem", fontWeight: 800, letterSpacing: ".4px",
              background: color, color: "#fff",
              padding: "1px 5px", borderRadius: 999, marginLeft: 2,
            }}>NEW</span>
          </Link>
        ))}
      </div>

      {/* Dismiss */}
      <button onClick={() => setDismissed(true)} aria-label="Dismiss" style={{
        position: "absolute", right: "0.8rem", top: "50%", transform: "translateY(-50%)",
        background: "none", color: "#9ca3af", padding: 4, borderRadius: 6,
        display: "flex", alignItems: "center",
      }}>
        <X size={14} />
      </button>
    </div>
  );
}