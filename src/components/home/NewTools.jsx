import { useNavigate } from "react-router-dom";
import { Calculator, ListOrdered, Map, Sparkles } from "lucide-react";

const TOOLS = [
  {
    icon: Calculator,
    title: "ROI Calculator",
    desc: "Calculate total degree cost, EMI, scholarship savings & 10-year return.",
    btn: "Calculate ROI",
    path: "/roi",
    color: "#E63946",
  },
  {
    icon: ListOrdered,
    title: "Choice Filling Helper",
    desc: "Smart JoSAA choice order based on your rank, category & branch preferences.",
    btn: "Fill Choices",
    path: "/choice-filling",
    color: "#2EC4B6",
  },
  {
    icon: Map,
    title: "College Map View",
    desc: "Explore IITs, NITs & IIITs on an interactive map. Filter by state & type.",
    btn: "Open Map",
    path: "/college-map",
    color: "#2EC4B6",
  },
  {
    icon: Sparkles,
    title: "Colleges for You",
    desc: "Answer a few questions and get a personalised college shortlist instantly.",
    btn: "Get My List",
    path: "/colleges-for-you",
    color: "#6C5CE7",
  },
];

export default function NewTools() {
  const nav = useNavigate();
  return (
    <section style={{ background: "linear-gradient(180deg,#f0f4ff,#fff)", padding: "64px 0" }}>
      <div className="container">
        <div className="title-bar">
          <span className="eyebrow" style={{ background: "#fff0f0", color: "#E63946", border: "1px solid #ffd6d6" }}>
            + JUST LAUNCHED
          </span>
          <h2 className="section-title">Powerful new tools for smarter decisions</h2>
          <p className="section-sub">
            From financial planning to personalised college lists — four new features to help you decide better.
          </p>
        </div>

        <div className="grid-3" style={{ marginTop: 32 }}>
          {TOOLS.slice(0, 3).map(({ icon: Icon, title, desc, btn, path, color }) => (
            <div key={title} className="card" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: color + "18", display: "grid", placeItems: "center" }}>
                    <Icon size={18} color={color} />
                  </div>
                  <strong style={{ fontFamily: "Sora", color: "var(--navy)" }}>{title}</strong>
                </div>
                <span className="badge" style={{ background: "#e8fff8", color: "#059669", fontSize: 10 }}>NEW</span>
              </div>
              <p style={{ fontSize: 13.5, color: "var(--muted)", lineHeight: 1.55 }}>{desc}</p>
              <button
                className="btn btn-ghost"
                style={{ marginTop: "auto", justifyContent: "center", fontSize: 13 }}
                onClick={() => nav(path)}
              >
                {btn} →
              </button>
            </div>
          ))}
        </div>

        {/* 4th card centered below */}
        <div style={{ display: "flex", justifyContent: "flex-start", marginTop: 16, maxWidth: 380 }}>
          {TOOLS.slice(3).map(({ icon: Icon, title, desc, btn, path, color }) => (
            <div key={title} className="card" style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: color + "18", display: "grid", placeItems: "center" }}>
                    <Icon size={18} color={color} />
                  </div>
                  <strong style={{ fontFamily: "Sora", color: "var(--navy)" }}>{title}</strong>
                </div>
                <span className="badge" style={{ background: "#e8fff8", color: "#059669", fontSize: 10 }}>NEW</span>
              </div>
              <p style={{ fontSize: 13.5, color: "var(--muted)", lineHeight: 1.55 }}>{desc}</p>
              <button
                className="btn btn-ghost"
                style={{ marginTop: "auto", justifyContent: "center", fontSize: 13 }}
                onClick={() => nav(path)}
              >
                {btn} →
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}