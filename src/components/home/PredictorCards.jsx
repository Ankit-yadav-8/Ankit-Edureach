import { useNavigate } from "react-router-dom";
import { Gauge, Crosshair, Building2, ArrowRight, Calculator, ListOrdered, Map, Sparkles } from "lucide-react";
import { CenterDonut } from "../Charts.jsx";
import Reveal from "../Reveal.jsx";

const CARDS = [
  {
    icon: Gauge, title: "Rank Predictor", accent: "#E63946",
    desc: "Enter your expected marks and instantly see your projected JEE Main rank, percentile and category rank.",
    to: "/jee-main#rank", cta: "Predict Rank",
    donut: { data: [{ name: "Physics", value: 33 }, { name: "Chemistry", value: 33 }, { name: "Maths", value: 34 }], label: "300", sub: "max marks" },
    colors: ["#4361ee", "#2EC4B6", "#F4A261"],
  },
  {
    icon: Crosshair, title: "College Predictor", accent: "#E63946",
    desc: "Turn your rank into a personalised list of colleges — across all JoSAA & CSAB rounds, with packages & placements.",
    to: "/jee-main#college", cta: "Find Colleges",
    donut: { data: [{ name: "Safe", value: 40 }, { name: "Moderate", value: 35 }, { name: "Stretch", value: 25 }], label: "6+2", sub: "JoSAA + CSAB" },
    colors: ["#2EC4B6", "#F4A261", "#E63946"],
  },
  {
    icon: Building2, title: "College Explorer", accent: "#6C5CE7",
    desc: "Deep-dive into IITs, NITs & IIITs — cutoffs, fees, branch-wise placements, recruiters and campus life.",
    to: "/colleges", cta: "Explore Colleges",
    donut: { data: [{ name: "IITs", value: 8 }, { name: "NITs", value: 6 }, { name: "IIITs", value: 3 }], label: "17", sub: "top institutes" },
    colors: ["#6C5CE7", "#457b9d", "#2EC4B6"],
  },
];

const NEW_FEATURES = [
  { icon: Calculator,  label: "ROI Calculator",       desc: "Calculate total degree cost, EMI, scholarship savings & 10-year return.", to: "/roi",              accent: "#e63946", bg: "rgba(230,57,70,0.06)",   cta: "Calculate ROI"   },
  { icon: ListOrdered, label: "Choice Filling Helper", desc: "Smart JoSAA choice order based on your rank, category & branch preferences.", to: "/choice-filling",   accent: "#2563eb", bg: "rgba(37,99,235,0.06)",  cta: "Fill Choices"    },
  { icon: Map,         label: "College Map View",      desc: "Explore IITs, NITs & IIITs on an interactive map. Filter by state & type.", to: "/college-map",      accent: "#0d9488", bg: "rgba(13,148,136,0.06)", cta: "Open Map"        },
  { icon: Sparkles,    label: "Colleges for You",      desc: "Answer a few questions and get a personalised college shortlist instantly.", to: "/colleges-for-you", accent: "#7c3aed", bg: "rgba(124,58,237,0.06)", cta: "Get My List"     },
];

export default function PredictorCards() {
  const nav = useNavigate();
  return (
    <>
      {/* ── Existing predictor cards ── */}
      <section className="section">
        <div className="container">
          <div className="title-bar">
            <span className="eyebrow">Smart Tools</span>
            <h2 className="section-title">Everything you need, before you fill a single choice</h2>
            <p className="section-sub">Three connected tools that take you from marks → rank → the exact colleges within your reach.</p>
          </div>
          <div className="grid-3">
            {CARDS.map((c, i) => (
              <Reveal key={c.title} delay={i * 0.08}>
                <div className="card" style={{ height: "100%", display: "flex", flexDirection: "column" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
                    <span style={{ width: 46, height: 46, borderRadius: 12, display: "grid", placeItems: "center", background: `${c.accent}1a`, color: c.accent }}>
                      <c.icon size={24} />
                    </span>
                    <h3 style={{ fontFamily: "Sora", fontWeight: 700, fontSize: "1.2rem" }}>{c.title}</h3>
                  </div>
                  <CenterDonut data={c.donut.data} centerLabel={c.donut.label} centerSub={c.donut.sub} colors={c.colors} height={170} />
                  <p style={{ color: "var(--muted)", fontSize: 14, margin: "6px 0 16px" }}>{c.desc}</p>
                  <button className="btn full" style={{ marginTop: "auto", justifyContent: "center", background: c.accent, color: "#fff" }} onClick={() => nav(c.to)}>
                    {c.cta} <ArrowRight size={16} />
                  </button>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── New Features section ── */}
      <section style={{ background: "linear-gradient(180deg,#f0f7ff 0%,#faf9f7 100%)", padding: "4rem 0" }}>
        <div className="container">
          <div className="title-bar">
            <span className="eyebrow" style={{ background: "#e6394615", color: "#e63946", border: "1px solid #e6394630" }}>✦ Just Launched</span>
            <h2 className="section-title">Powerful new tools for smarter decisions</h2>
            <p className="section-sub">From financial planning to personalised college lists — four new features to help you decide better.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {NEW_FEATURES.map((f) => (
              <div key={f.label} style={{
                background: "#fff", borderRadius: 16, padding: "1.5rem",
                border: `1.5px solid ${f.accent}25`,
                boxShadow: "0 2px 12px rgba(13,27,62,0.07)",
                display: "flex", flexDirection: "column", gap: 12,
              }}>
                {/* Icon + badge row */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ width: 44, height: 44, borderRadius: 12, display: "grid", placeItems: "center", background: f.bg, color: f.accent, flexShrink: 0 }}>
                      <f.icon size={22} />
                    </span>
                    <h3 style={{ fontFamily: "Sora", fontWeight: 700, fontSize: "1rem", color: "var(--navy)" }}>{f.label}</h3>
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: ".6px", background: f.accent, color: "#fff", padding: "3px 9px", borderRadius: 999 }}>NEW</span>
                </div>

                {/* Description */}
                <p style={{ fontSize: 13.5, color: "var(--muted)", lineHeight: 1.6, flex: 1 }}>{f.desc}</p>

                {/* CTA button */}
                <button onClick={() => nav(f.to)} style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                  padding: "0.6rem 1rem", borderRadius: 10,
                  border: `2px solid ${f.accent}`, background: "transparent",
                  color: f.accent, fontWeight: 700, fontSize: "0.88rem", cursor: "pointer",
                  transition: "all .2s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = f.accent; e.currentTarget.style.color = "#fff"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = f.accent; }}
                >
                  {f.cta} <ArrowRight size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}