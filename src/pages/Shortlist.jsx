import { Link, useNavigate } from "react-router-dom";
import { Heart, MapPin, Trophy, ArrowRight, GitCompare, Trash2 } from "lucide-react";
import { useShortlist } from "../context/Shortlist.jsx";
import { COLLEGE_BY_SLUG } from "../data/colleges.js";
import { SaveButton, CompareButton } from "../components/SaveButton.jsx";
import { fmtINR } from "../utils/format.js";

export default function Shortlist() {
  const { saved, toggleCompare, inCompare, MAX_COMPARE } = useShortlist();
  const nav = useNavigate();
  const cols = saved.map((s) => COLLEGE_BY_SLUG[s]).filter(Boolean);

  const compareShortlist = () => {
    saved.slice(0, MAX_COMPARE).forEach((s) => { if (!inCompare(s)) toggleCompare(s); });
    nav("/compare");
  };

  return (
    <div className="page">
      <section style={{ background: "linear-gradient(135deg,#0D1B3E,#7a1f2b)", color: "#fff", padding: "40px 0" }}>
        <div className="container">
          <span className="eyebrow" style={{ color: "var(--gold)" }}>My Colleges</span>
          <h1 style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "clamp(1.7rem,4vw,2.4rem)", margin: "8px 0 4px", display: "flex", alignItems: "center", gap: 10 }}>
            <Heart size={28} fill="#fff" /> Your shortlist
          </h1>
          <p style={{ color: "rgba(255,255,255,.8)" }}>{cols.length ? `${cols.length} saved college${cols.length > 1 ? "s" : ""}.` : "Save colleges with the heart button to build your shortlist."}</p>
        </div>
      </section>

      <div className="container section">
        {cols.length === 0 ? (
          <div className="card" style={{ textAlign: "center", padding: 48, color: "var(--muted)" }}>
            <Heart size={44} color="var(--line)" />
            <p style={{ margin: "12px 0 16px" }}>No saved colleges yet. Browse colleges and tap the heart to add them here.</p>
            <button className="btn btn-coral" onClick={() => nav("/colleges")}>Explore colleges <ArrowRight size={16} /></button>
          </div>
        ) : (
          <div className="grid-3" style={{ paddingBottom: 40 }}>
            {cols.map((c) => (
              <div key={c.slug} className="card" style={{ display: "flex", flexDirection: "column", gap: 10, height: "100%", borderTop: `3px solid ${c.accent}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <h3 style={{ fontFamily: "Sora", fontWeight: 700, fontSize: "1.08rem", color: "var(--navy)" }}>{c.name}</h3>
                  <span className="badge orange" style={{ display: "inline-flex", gap: 3, alignItems: "center" }}><Trophy size={11} />#{c.nirf}</span>
                </div>
                <div style={{ fontSize: 12.5, color: "var(--muted)", display: "flex", alignItems: "center", gap: 4 }}><MapPin size={13} /> {c.location}</div>
                <div style={{ display: "flex", gap: 14, padding: "10px 0", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)", fontSize: 13 }}>
                  <div><div style={{ color: "var(--muted)", fontSize: 11 }}>Avg pkg</div><strong>{fmtINR(c.placements.avg)}</strong></div>
                  <div><div style={{ color: "var(--muted)", fontSize: 11 }}>Placed</div><strong>{c.placements.placedPct}%</strong></div>
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <SaveButton slug={c.slug} label />
                  <CompareButton slug={c.slug} />
                </div>
                <button className="btn btn-coral" style={{ justifyContent: "center", marginTop: "auto", fontSize: 13 }} onClick={() => nav(`/colleges/${c.slug}`)}>View details <ArrowRight size={15} /></button>
              </div>
            ))}
          </div>
        )}

        {cols.length >= 2 && (
          <div style={{ textAlign: "center" }}>
            <button className="btn btn-navy" onClick={compareShortlist}>
              <GitCompare size={16} /> Compare your shortlist
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
