import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Sparkles, TrendingUp, Crosshair } from "lucide-react";
import ParticleBackground from "../ParticleBackground.jsx";
import useCountUp from "../../utils/useCountUp.js";

const QUICK = ["IIT Bombay", "JEE Main 2026", "College Predictor", "NIT Trichy", "VITEEE", "Cutoffs"];

function Stat({ target, suffix, label }) {
  const [ref, val] = useCountUp(target);
  return (
    <div ref={ref} style={{ textAlign: "center" }}>
      <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "clamp(1.5rem,3.5vw,2.2rem)", color: "#fff" }}>
        {val.toLocaleString("en-IN")}{suffix}
      </div>
      <div style={{ fontSize: 12.5, color: "rgba(255,255,255,.65)", marginTop: 2 }}>{label}</div>
    </div>
  );
}

export default function Hero({ onSearch }) {
  const [q, setQ] = useState("");
  const nav = useNavigate();
  const go = (term) => {
    const t = (term ?? q).trim();
    if (t) nav(`/search?q=${encodeURIComponent(t)}`);
  };

  return (
    <section style={{
      position: "relative", overflow: "hidden",
      background: "linear-gradient(135deg,#0D1B3E 0%,#162550 50%,#0b3340 100%)",
      paddingTop: 110, paddingBottom: 56,
    }}>
      <ParticleBackground density={80} />
      <div className="container" style={{ position: "relative", zIndex: 2, textAlign: "center" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="pill" style={{
            background: "rgba(255,255,255,.1)", color: "rgba(255,255,255,.92)",
            border: "1px solid rgba(255,255,255,.2)", fontSize: 13,
          }}>
            <Sparkles size={13} /> India's smartest JEE & college discovery portal
          </span>
          <h1 style={{
            fontFamily: "Sora", fontWeight: 800, color: "#fff",
            fontSize: "clamp(2rem,5.5vw,3.6rem)", lineHeight: 1.08,
            margin: "1rem 0 0.5rem",
          }}>
            Know Your Rank.<br />
            <span style={{ background: "linear-gradient(90deg,#FF6B6B,#FFB347)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Find Your College.
            </span>
          </h1>
          <p style={{
            color: "rgba(255,255,255,.75)", fontSize: "clamp(0.95rem,1.8vw,1.1rem)",
            maxWidth: 580, margin: "0 auto 1.5rem", lineHeight: 1.65,
          }}>
            Predict your JEE rank from marks, discover every college across all JoSAA & CSAB rounds, and track every counselling deadline — all in one place.
          </p>
        </motion.div>

        {/* Search */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }}
          style={{
            maxWidth: 600, margin: "0 auto", display: "flex", gap: 8,
            background: "#fff", padding: 7, borderRadius: 14,
            boxShadow: "0 16px 48px rgba(0,0,0,.25)",
          }}>
          <div style={{ display: "flex", alignItems: "center", flex: 1, gap: 10, paddingLeft: 12 }}>
            <Search size={18} color="#94a3b8" />
            <input
              value={q} onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && go()}
              placeholder="Search colleges, exams, predictors…"
              onFocus={onSearch}
              style={{ border: "none", outline: "none", flex: 1, fontSize: 15, fontFamily: "DM Sans", background: "transparent" }}
            />
          </div>
          <button className="btn btn-coral" onClick={() => go()} style={{ borderRadius: 10 }}>Search</button>
        </motion.div>

        <div style={{ display: "flex", gap: 7, flexWrap: "wrap", justifyContent: "center", marginTop: 12 }}>
          {QUICK.map((t) => (
            <button key={t} onClick={() => go(t)} className="pill"
              style={{ background: "rgba(255,255,255,.08)", color: "rgba(255,255,255,.85)", border: "1px solid rgba(255,255,255,.18)", cursor: "pointer", fontSize: 12.5 }}>
              {t}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 22, flexWrap: "wrap" }}>
          <button className="btn btn-coral" onClick={() => nav("/jee-main#college")} style={{ fontSize: 14 }}>
            <Crosshair size={16} /> Predict My College
          </button>
          <button className="btn btn-light" onClick={() => nav("/jee-main#rank")} style={{ fontSize: 14 }}>
            <TrendingUp size={16} /> Predict My Rank
          </button>
        </div>

        {/* Stats */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16,
          maxWidth: 720, margin: "36px auto 0", padding: "20px 0",
          borderTop: "1px solid rgba(255,255,255,.12)",
          borderBottom: "1px solid rgba(255,255,255,.12)",
        }}>
          <Stat target={2500} suffix="+" label="Colleges & branches" />
          <Stat target={17} suffix="" label="Entrance exams" />
          <Stat target={8} suffix="" label="Counselling rounds" />
          <Stat target={50} suffix="K+" label="Students guided" />
        </div>
      </div>
    </section>
  );
}