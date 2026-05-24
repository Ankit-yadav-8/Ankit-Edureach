import { useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { GripVertical, Plus, X, Trophy, MapPin, TrendingUp, Download, Share2, Info } from "lucide-react";
import { COLLEGES, CATEGORIES, BRANCHES } from "../data/colleges.js";
import { expandRounds } from "../utils/cutoffEngine.js";
import { fmtINR, fmtRank } from "../utils/format.js";

/* ── helpers ─────────────────────────────────────────────── */
const getClosing = (college, branch, cat) => {
  const rounds = expandRounds(college, branch, cat);
  if (!rounds.length) return null;
  return Math.min(...rounds.map((r) => r.closing).filter(Boolean));
};

const LIKELIHOOD = (rank, closing) => {
  if (!closing) return { label: "No data", color: "#94a3b8", pct: 0 };
  const ratio = rank / closing;
  if (ratio <= 0.7)  return { label: "Very likely",   color: "#16a34a", pct: 95 };
  if (ratio <= 0.9)  return { label: "Likely",         color: "#22c55e", pct: 78 };
  if (ratio <= 1.0)  return { label: "Borderline",     color: "#f59e0b", pct: 55 };
  if (ratio <= 1.15) return { label: "Reach",          color: "#f97316", pct: 30 };
  return               { label: "Unlikely",            color: "#ef4444", pct: 8  };
};

/* default branch per college type */
const defaultBranch = (college) =>
  college.branches?.find((b) => b.code === "cse")?.code ||
  college.branches?.[0]?.code || "cse";

/* ── main component ──────────────────────────────────────── */
export default function ChoiceFilling() {
  const [rank,     setRank]     = useState("");
  const [cat,      setCat]      = useState("OPEN");
  const [query,    setQuery]    = useState("");
  const [choices,  setChoices]  = useState([]);   // { college, branch, id }
  const [dragIdx,  setDragIdx]  = useState(null);
  const [overIdx,  setOverIdx]  = useState(null);
  const dragNode   = useRef(null);

  /* search suggestions */
  const suggestions = query.length > 1
    ? COLLEGES.filter((c) =>
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.short?.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 6)
    : [];

  const addCollege = (college) => {
    if (choices.find((ch) => ch.college.slug === college.slug)) return;
    setChoices((prev) => [
      ...prev,
      { college, branch: defaultBranch(college), id: `${college.slug}-${Date.now()}` },
    ]);
    setQuery("");
  };

  const removeChoice = (id) =>
    setChoices((prev) => prev.filter((c) => c.id !== id));

  const updateBranch = (id, branch) =>
    setChoices((prev) => prev.map((c) => c.id === id ? { ...c, branch } : c));

  /* ── drag-and-drop (HTML5) ─────────────────────────────── */
  const onDragStart = useCallback((e, idx) => {
    dragNode.current = e.currentTarget;
    setDragIdx(idx);
    e.dataTransfer.effectAllowed = "move";
  }, []);

  const onDragEnter = useCallback((e, idx) => {
    e.preventDefault();
    setOverIdx(idx);
  }, []);

  const onDragEnd = useCallback(() => {
    if (dragIdx !== null && overIdx !== null && dragIdx !== overIdx) {
      setChoices((prev) => {
        const arr = [...prev];
        const [moved] = arr.splice(dragIdx, 1);
        arr.splice(overIdx, 0, moved);
        return arr;
      });
    }
    setDragIdx(null);
    setOverIdx(null);
    dragNode.current = null;
  }, [dragIdx, overIdx]);

  /* ── print / export ────────────────────────────────────── */
  const handlePrint = () => window.print();

  const handleShare = () => {
    const lines = choices.map((ch, i) =>
      `${i + 1}. ${ch.college.name} — ${ch.branch.toUpperCase()}`
    ).join("\n");
    const text = `My JoSAA Choice Fill (Rank ${rank}, ${cat}):\n\n${lines}\n\nGenerated on EduReach.in`;
    if (navigator.share) {
      navigator.share({ title: "My JoSAA Choice Fill", text });
    } else {
      navigator.clipboard.writeText(text);
      alert("Copied to clipboard!");
    }
  };

  const numRank = Number(rank) || 0;

  return (
    <div className="page">
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .choice-card { break-inside: avoid; }
          nav, footer { display: none !important; }
        }
        .choice-card.dragging { opacity: .4; }
        .choice-card.drag-over { border-color: var(--coral) !important; background: rgba(230,57,70,.04) !important; }
      `}</style>

      {/* ── Hero ── */}
      <section style={{ background: "linear-gradient(135deg,var(--navy),#1a3a6b)", color: "#fff", padding: "40px 0 30px" }}>
        <div className="container">
          <span className="badge orange" style={{ marginBottom: 10 }}>JoSAA Helper</span>
          <h1 style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "clamp(1.8rem,4vw,2.4rem)", margin: "0 0 8px" }}>
            Choice Filling Assistant
          </h1>
          <p style={{ color: "rgba(255,255,255,.8)", maxWidth: 580, marginBottom: 24 }}>
            Build your JoSAA/CSAB preference list. Drag to reorder. See at-a-glance whether your rank is likely, borderline, or a reach for each choice.
          </p>

          {/* Rank + Category */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }} className="no-print">
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,.7)" }}>Your JEE Rank</label>
              <input
                type="number" min="1" placeholder="e.g. 4500"
                value={rank} onChange={(e) => setRank(e.target.value)}
                style={{ padding: "9px 14px", borderRadius: 10, border: "none", fontSize: "1rem", fontWeight: 700, width: 160 }}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,.7)" }}>Category</label>
              <select value={cat} onChange={(e) => setCat(e.target.value)}
                style={{ padding: "9px 14px", borderRadius: 10, border: "none", fontSize: "0.95rem", fontWeight: 600, background: "#fff" }}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </div>
      </section>

      <div className="container" style={{ paddingTop: 28, paddingBottom: 60 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 28, alignItems: "start" }}
          className="choice-grid">

          {/* ── Left: preference list ── */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h2 style={{ fontFamily: "Sora", fontWeight: 700, fontSize: "1.1rem" }}>
                Your Preference List
                <span style={{ marginLeft: 10, fontSize: "0.8rem", fontWeight: 600, color: "var(--muted)" }}>
                  {choices.length} {choices.length === 1 ? "choice" : "choices"}
                </span>
              </h2>
              {choices.length > 0 && (
                <div style={{ display: "flex", gap: 8 }} className="no-print">
                  <button onClick={handlePrint} className="btn btn-ghost" style={{ fontSize: 13, gap: 6 }}>
                    <Download size={14} /> Export PDF
                  </button>
                  <button onClick={handleShare} className="btn btn-ghost" style={{ fontSize: 13, gap: 6 }}>
                    <Share2 size={14} /> Share
                  </button>
                </div>
              )}
            </div>

            {choices.length === 0 && (
              <div style={{ textAlign: "center", padding: "48px 24px", background: "var(--sky)", borderRadius: 16, color: "var(--muted)" }}>
                <Trophy size={36} style={{ opacity: .3, marginBottom: 12 }} />
                <p style={{ fontWeight: 600 }}>Search and add colleges on the right to build your list</p>
                <p style={{ fontSize: 13, marginTop: 4 }}>Then drag to reorder by preference</p>
              </div>
            )}

            {choices.map((ch, idx) => {
              const closing = numRank ? getClosing(ch.college, ch.branch, cat) : null;
              const lk = numRank && closing ? LIKELIHOOD(numRank, closing) : null;
              const isDragging = dragIdx === idx;
              const isDragOver = overIdx === idx && dragIdx !== idx;
              const branches = ch.college.branches || [];

              return (
                <div key={ch.id}
                  className={`choice-card ${isDragging ? "dragging" : ""} ${isDragOver ? "drag-over" : ""}`}
                  draggable
                  onDragStart={(e) => onDragStart(e, idx)}
                  onDragEnter={(e) => onDragEnter(e, idx)}
                  onDragOver={(e) => e.preventDefault()}
                  onDragEnd={onDragEnd}
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    background: "#fff", borderRadius: 14, padding: "14px 16px",
                    marginBottom: 10, border: "1.5px solid var(--border)",
                    cursor: "grab", transition: "all .2s",
                    boxShadow: isDragging ? "0 8px 24px rgba(0,0,0,.12)" : "none",
                  }}>

                  {/* Rank number */}
                  <div style={{ minWidth: 36, height: 36, borderRadius: 10, background: "var(--sky)", display: "grid", placeItems: "center", fontFamily: "Sora", fontWeight: 800, fontSize: "1rem", color: "var(--navy)", flexShrink: 0 }}>
                    {idx + 1}
                  </div>

                  {/* Grip */}
                  <GripVertical size={18} color="var(--gray-2)" style={{ flexShrink: 0 }} className="no-print" />

                  {/* College info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, color: "var(--navy)", fontSize: "0.95rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {ch.college.short || ch.college.name}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--muted)", display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                      <MapPin size={11} /> {ch.college.location}
                    </div>
                    {/* Branch selector */}
                    {branches.length > 0 && (
                      <select value={ch.branch}
                        onChange={(e) => updateBranch(ch.id, e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        style={{ marginTop: 6, fontSize: 12, padding: "3px 8px", borderRadius: 6, border: "1.5px solid var(--border)", color: "var(--navy)", fontWeight: 600, cursor: "pointer" }}>
                        {branches.map((b) => <option key={b.code} value={b.code}>{b.name}</option>)}
                      </select>
                    )}
                  </div>

                  {/* Closing rank */}
                  {closing && (
                    <div style={{ textAlign: "center", flexShrink: 0 }}>
                      <div style={{ fontSize: 10, color: "var(--muted)", fontWeight: 600 }}>Closing rank</div>
                      <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "0.95rem", color: "var(--navy)" }}>{fmtRank(closing)}</div>
                    </div>
                  )}

                  {/* Likelihood pill */}
                  {lk && (
                    <div style={{
                      padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700,
                      background: lk.color + "18", color: lk.color, flexShrink: 0,
                    }}>
                      {lk.label}
                    </div>
                  )}

                  {/* Avg package */}
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontSize: 10, color: "var(--muted)", fontWeight: 600 }}>Avg pkg</div>
                    <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "0.9rem", color: "var(--green)" }}>{fmtINR(ch.college.placements?.avg)}</div>
                  </div>

                  {/* Remove */}
                  <button onClick={() => removeChoice(ch.id)} className="no-print"
                    style={{ flexShrink: 0, width: 28, height: 28, borderRadius: 8, display: "grid", placeItems: "center", background: "var(--gray-light)", color: "var(--muted)" }}>
                    <X size={14} />
                  </button>
                </div>
              );
            })}

            {/* Likelihood legend */}
            {numRank > 0 && choices.length > 0 && (
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 16, padding: "10px 14px", background: "var(--sky)", borderRadius: 10 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)" }}><Info size={11} /> LEGEND:</span>
                {[
                  { label: "Very likely", color: "#16a34a" }, { label: "Likely", color: "#22c55e" },
                  { label: "Borderline", color: "#f59e0b" }, { label: "Reach", color: "#f97316" },
                  { label: "Unlikely",   color: "#ef4444" },
                ].map(({ label, color }) => (
                  <span key={label} style={{ fontSize: 11, fontWeight: 700, color, display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: color, display: "inline-block" }} />
                    {label}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* ── Right: search panel ── */}
          <div className="no-print" style={{ position: "sticky", top: 88 }}>
            <div className="card">
              <h3 style={{ fontFamily: "Sora", fontWeight: 700, marginBottom: 12, fontSize: "0.95rem" }}>
                <Plus size={16} color="var(--coral)" style={{ verticalAlign: "middle", marginRight: 6 }} />
                Add a College
              </h3>
              <div style={{ position: "relative" }}>
                <input
                  type="text" placeholder="Search college name..."
                  value={query} onChange={(e) => setQuery(e.target.value)}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid var(--border)", fontSize: "0.9rem", boxSizing: "border-box" }}
                />
                {suggestions.length > 0 && (
                  <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, background: "#fff", borderRadius: 12, boxShadow: "var(--shadow-lg)", border: "1px solid var(--border)", zIndex: 50 }}>
                    {suggestions.map((c) => (
                      <button key={c.slug} onClick={() => addCollege(c)}
                        style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 14px", textAlign: "left", borderBottom: "1px solid var(--gray-light)" }}>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--navy)" }}>{c.short || c.name}</div>
                          <div style={{ fontSize: 11, color: "var(--muted)" }}>{c.type} · {c.location}</div>
                        </div>
                        {choices.find((ch) => ch.college.slug === c.slug)
                          ? <span style={{ marginLeft: "auto", fontSize: 10, color: "var(--green)", fontWeight: 700 }}>Added ✓</span>
                          : <Plus size={14} color="var(--coral)" style={{ marginLeft: "auto" }} />
                        }
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick add by type */}
              <div style={{ marginTop: 16 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 8 }}>Quick add by type</p>
                {["IIT", "NIT", "IIIT"].map((type) => (
                  <div key={type} style={{ marginBottom: 6 }}>
                    <p style={{ fontSize: 12, fontWeight: 700, color: "var(--navy)", margin: "6px 0 4px" }}>{type}s</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                      {COLLEGES.filter((c) => c.type === type).slice(0, 8).map((c) => (
                        <button key={c.slug} onClick={() => addCollege(c)}
                          disabled={!!choices.find((ch) => ch.college.slug === c.slug)}
                          style={{
                            padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, cursor: "pointer",
                            background: choices.find((ch) => ch.college.slug === c.slug) ? "var(--green)" : "var(--sky)",
                            color:      choices.find((ch) => ch.college.slug === c.slug) ? "#fff" : "var(--navy)",
                            border: "1px solid var(--border)",
                          }}>
                          {c.short || c.name.split(" ").slice(-1)[0]}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Tips */}
              <div style={{ marginTop: 16, padding: "12px 14px", background: "var(--sky)", borderRadius: 10 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: "var(--navy)", marginBottom: 6 }}>💡 Tips</p>
                <ul style={{ fontSize: 11, color: "var(--muted)", paddingLeft: 16, lineHeight: 1.8, margin: 0 }}>
                  <li>Enter your rank above to see likelihood scores</li>
                  <li>Drag cards to reorder by preference</li>
                  <li>Put "likely" choices before "reach" ones</li>
                  <li>Add 10–20 choices for safety</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .choice-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}