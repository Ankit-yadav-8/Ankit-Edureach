import { useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, MapPin, Trophy, ChevronRight, RefreshCw } from "lucide-react";
import { COLLEGES, CATEGORIES } from "../data/colleges.js";
import { expandRounds } from "../utils/cutoffEngine.js";
import { fmtINR, fmtRank } from "../utils/format.js";
import { useShortlist } from "../context/Shortlist.jsx";
import { SaveButton, CompareButton } from "./SaveButton.jsx";

/* ── scoring ─────────────────────────────────────────────── */
const getBestClosing = (college, cat) => {
  const allBranches = college.branches || [];
  const closings = allBranches.flatMap((b) => {
    const rounds = expandRounds(college, b.code, cat);
    return rounds.map((r) => r.closing).filter(Boolean);
  });
  return closings.length ? Math.min(...closings) : null;
};

const scoreCollege = (college, rank, cat, savedSlugs) => {
  const closing = getBestClosing(college, cat);
  if (!closing) return null;
  const ratio = rank / closing;
  // sweet spot: rank is 80%–105% of closing — genuinely reachable
  if (ratio < 0.3 || ratio > 1.3) return null;

  let score = 0;
  if (ratio >= 0.7 && ratio <= 1.0)  score += 40;   // strong match
  else if (ratio < 0.7)              score += 20;   // safely in
  else                                score += 15;   // slight reach

  score += Math.min(college.placements?.avg / 100_000, 30);  // up to 30 for placement
  score += Math.max(0, 20 - college.nirf);                   // up to 20 for NIRF rank
  if (savedSlugs.includes(college.slug)) score += 10;        // bonus for shortlisted

  return { score, closing, ratio };
};

const MATCH_LABEL = (ratio) => {
  if (ratio <= 0.7)  return { label: "Safe choice",   color: "#16a34a", bg: "#f0fdf4" };
  if (ratio <= 0.9)  return { label: "Strong match",  color: "#22c55e", bg: "#f0fdf4" };
  if (ratio <= 1.0)  return { label: "Good match",    color: "#f59e0b", bg: "#fffbeb" };
  return                    { label: "Reach school",  color: "#f97316", bg: "#fff7ed" };
};

/* ── component ───────────────────────────────────────────── */
export default function CollegesForYou() {
  const { saved } = useShortlist();
  const [rank,     setRank]     = useState("");
  const [cat,      setCat]      = useState("OPEN");
  const [homeState,setHomeState]= useState("");
  const [typeFilter,setType]    = useState("All");
  const [submitted,setSubmitted]= useState(false);

  const numRank = Number(rank) || 0;

  const results = submitted && numRank
    ? COLLEGES
        .map((c) => {
          const res = scoreCollege(c, numRank, cat, saved);
          return res ? { ...c, ...res } : null;
        })
        .filter(Boolean)
        .filter((c) => typeFilter === "All" || c.type === typeFilter)
        .filter((c) => !homeState || c.state?.toLowerCase().includes(homeState.toLowerCase()) || true)
        .sort((a, b) => b.score - a.score)
        .slice(0, 18)
    : [];

  return (
    <section style={{ background: "linear-gradient(180deg,var(--sky),#fff)", padding: "60px 0" }}>
      <div className="container">
        <div className="title-bar" style={{ marginBottom: "2rem" }}>
          <span className="eyebrow">Personalised</span>
          <h2 className="section-title">
            Colleges <span className="accent">for You</span>
          </h2>
          <p className="section-sub">
            Enter your JEE rank to get a personalised shortlist ranked by fit — placement, cutoff match, and NIRF score.
          </p>
        </div>

        {/* Input form */}
        <div className="card" style={{ maxWidth: 680, margin: "0 auto 2rem", padding: "1.5rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 12, alignItems: "end" }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: "var(--navy)", display: "block", marginBottom: 5 }}>
                Your JEE Rank
              </label>
              <input type="number" min="1" placeholder="e.g. 8000"
                value={rank} onChange={(e) => setRank(e.target.value)}
                style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid var(--border)", fontSize: "1rem", fontWeight: 700, boxSizing: "border-box" }}
              />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: "var(--navy)", display: "block", marginBottom: 5 }}>
                Category
              </label>
              <select value={cat} onChange={(e) => setCat(e.target.value)}
                style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid var(--border)", fontSize: "0.95rem", fontWeight: 600, boxSizing: "border-box" }}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <button
              onClick={() => { if (numRank) setSubmitted(true); }}
              className="btn btn-coral"
              style={{ padding: "10px 20px", whiteSpace: "nowrap" }}>
              <Sparkles size={15} /> Find Colleges
            </button>
          </div>
        </div>

        {/* Type filter */}
        {submitted && results.length > 0 && (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginBottom: 24 }}>
            {["All", "IIT", "NIT", "IIIT", "Private"].map((t) => (
              <button key={t} onClick={() => setType(t)}
                style={{
                  padding: "5px 16px", borderRadius: 20, fontSize: 13, fontWeight: 700, cursor: "pointer",
                  border: "1.5px solid var(--border)",
                  background: typeFilter === t ? "var(--navy)" : "transparent",
                  color: typeFilter === t ? "#fff" : "var(--navy)",
                  transition: "all .2s",
                }}>
                {t}
              </button>
            ))}
            <button onClick={() => { setSubmitted(false); setRank(""); }}
              className="btn btn-ghost" style={{ fontSize: 12, gap: 5 }}>
              <RefreshCw size={12} /> Reset
            </button>
          </div>
        )}

        {/* Empty state */}
        {!submitted && (
          <div style={{ textAlign: "center", padding: "32px", color: "var(--muted)" }}>
            <Sparkles size={40} style={{ opacity: .2, marginBottom: 12 }} />
            <p style={{ fontWeight: 600 }}>Enter your rank above to see personalised recommendations</p>
          </div>
        )}

        {submitted && results.length === 0 && (
          <div style={{ textAlign: "center", padding: "32px", color: "var(--muted)" }}>
            <p style={{ fontWeight: 600 }}>No strong matches found for rank {numRank} ({cat}). Try adjusting your category or filters.</p>
          </div>
        )}

        {/* Results grid */}
        {results.length > 0 && (
          <>
            <p style={{ textAlign: "center", fontSize: 13, color: "var(--muted)", marginBottom: 20 }}>
              Showing <strong>{results.length}</strong> colleges matched to rank <strong>{numRank}</strong> · {cat}
            </p>
            <div className="grid-3" style={{ gap: 16 }}>
              {results.map((c, i) => {
                const match = MATCH_LABEL(c.ratio);
                return (
                  <div key={c.slug} className="card"
                    style={{ display: "flex", flexDirection: "column", gap: 10, padding: "1.1rem", position: "relative", overflow: "hidden" }}>

                    {/* Rank badge */}
                    <div style={{
                      position: "absolute", top: 0, left: 0,
                      background: i < 3 ? "var(--coral)" : "var(--navy)",
                      color: "#fff", fontSize: 10, fontWeight: 800,
                      padding: "4px 12px", borderRadius: "0 0 10px 0",
                    }}>
                      #{i + 1} pick
                    </div>

                    <div style={{ paddingTop: 14 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                        <h3 style={{ fontFamily: "Sora", fontWeight: 700, fontSize: "0.95rem", color: "var(--navy)", margin: 0, lineHeight: 1.3 }}>
                          {c.name}
                        </h3>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: match.bg, color: match.color, whiteSpace: "nowrap", flexShrink: 0 }}>
                          {match.label}
                        </span>
                      </div>

                      <div style={{ fontSize: 12, color: "var(--muted)", display: "flex", alignItems: "center", gap: 4, margin: "5px 0 8px" }}>
                        <MapPin size={11} /> {c.location} · NIRF #{c.nirf}
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                      <div style={{ background: "var(--sky)", borderRadius: 8, padding: "8px 10px" }}>
                        <div style={{ fontSize: 10, color: "var(--muted)", fontWeight: 600 }}>Closing rank</div>
                        <div style={{ fontFamily: "Sora", fontWeight: 800, color: "var(--navy)", fontSize: "0.9rem" }}>{fmtRank(c.closing)}</div>
                      </div>
                      <div style={{ background: "#f0fdf4", borderRadius: 8, padding: "8px 10px" }}>
                        <div style={{ fontSize: 10, color: "var(--muted)", fontWeight: 600 }}>Avg package</div>
                        <div style={{ fontFamily: "Sora", fontWeight: 800, color: "var(--green)", fontSize: "0.9rem" }}>{fmtINR(c.placements?.avg)}</div>
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: 6, marginTop: "auto" }}>
                      <Link to={`/colleges/${c.slug}`} className="btn btn-ghost" style={{ flex: 1, fontSize: 12, justifyContent: "center", gap: 4 }}>
                        Details <ChevronRight size={12} />
                      </Link>
                      <SaveButton slug={c.slug} />
                      <CompareButton slug={c.slug} />
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </section>
  );
}