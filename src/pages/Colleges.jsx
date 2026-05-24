import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Search, MapPin, Trophy, ArrowRight, BadgeCheck, SlidersHorizontal } from "lucide-react";
import { COLLEGES, STATES } from "../data/colleges.js";
import { fmtINR } from "../utils/format.js";
import Reveal from "../components/Reveal.jsx";
import { SaveButton, CompareButton } from "../components/SaveButton.jsx";

const TYPES = ["All", "IIT", "NIT", "IIIT"];
const SORTS = [
  ["nirf", "NIRF rank"],
  ["package", "Avg package"],
  ["placed", "Placement %"],
  ["fees", "Lowest fees"],
];
const PKG_BANDS = [
  ["", "Any package"],
  ["1000000", "₹10L+"],
  ["1500000", "₹15L+"],
  ["2000000", "₹20L+"],
];
const feeTotal = (c) => Object.values(c.fees).reduce((a, b) => a + b, 0);

export default function Colleges() {
  const [sp] = useSearchParams();
  const nav = useNavigate();
  const [type, setType] = useState(sp.get("type") || "All");
  const [state, setState] = useState("");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("nirf");
  const [minPkg, setMinPkg] = useState("");

  useEffect(() => { setType(sp.get("type") || "All"); }, [sp]);

  const list = useMemo(() => {
    let arr = COLLEGES.filter((c) =>
      (type === "All" || c.type === type) &&
      (!state || c.state === state) &&
      (!minPkg || c.placements.avg >= Number(minPkg)) &&
      (!q || c.name.toLowerCase().includes(q.toLowerCase()) || c.location.toLowerCase().includes(q.toLowerCase()))
    );
    arr.sort((a, b) =>
      sort === "package" ? b.placements.avg - a.placements.avg :
      sort === "placed" ? b.placements.placedPct - a.placements.placedPct :
      sort === "fees" ? feeTotal(a) - feeTotal(b) :
      a.nirf - b.nirf
    );
    return arr;
  }, [type, state, q, sort, minPkg]);

  return (
    <div className="page">
      <section style={{ background: "linear-gradient(135deg,#0D1B3E,#1d3557)", color: "#fff", padding: "44px 0" }}>
        <div className="container">
          <span className="eyebrow" style={{ color: "var(--gold)" }}>College Explorer</span>
          <h1 style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "clamp(1.8rem,4vw,2.6rem)", margin: "8px 0 4px" }}>Discover {COLLEGES.length}+ premier institutes</h1>
          <p style={{ color: "rgba(255,255,255,.8)" }}>Filter by type, state, package and fees — save favourites or add to compare.</p>
        </div>
      </section>

      <div className="container" style={{ marginTop: 24 }}>
        <div className="card" style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <div className="tabs" style={{ marginBottom: 0 }}>
            {TYPES.map((t) => <button key={t} className={`tab ${type === t ? "active" : ""}`} onClick={() => setType(t)}>{t === "All" ? "All" : t + "s"}</button>)}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--sky)", borderRadius: 10, padding: "8px 12px", flex: 1, minWidth: 180 }}>
            <Search size={18} color="var(--muted)" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search college or city…" style={{ border: "none", background: "transparent", outline: "none", flex: 1, fontFamily: "DM Sans" }} />
          </div>
          <select className="select" style={{ width: "auto", minWidth: 140 }} value={state} onChange={(e) => setState(e.target.value)}>
            <option value="">All states</option>
            {STATES.map((s) => <option key={s}>{s}</option>)}
          </select>
          <select className="select" style={{ width: "auto", minWidth: 130 }} value={minPkg} onChange={(e) => setMinPkg(e.target.value)}>
            {PKG_BANDS.map(([v, l]) => <option key={l} value={v}>{l}</option>)}
          </select>
          <select className="select" style={{ width: "auto", minWidth: 150 }} value={sort} onChange={(e) => setSort(e.target.value)}>
            {SORTS.map(([v, l]) => <option key={v} value={v}>Sort: {l}</option>)}
          </select>
        </div>

        <div style={{ fontSize: 13, color: "var(--muted)", margin: "18px 0", display: "flex", alignItems: "center", gap: 6 }}>
          <SlidersHorizontal size={14} /> {list.length} colleges found
        </div>

        <div className="grid-3" style={{ paddingBottom: 60 }}>
          {list.map((c, i) => (
            <Reveal key={c.slug} delay={(i % 3) * 0.04}>
              <div className="card" style={{ display: "flex", flexDirection: "column", gap: 10, height: "100%", borderTop: `3px solid ${c.accent}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                  <h3 style={{ fontFamily: "Sora", fontWeight: 700, fontSize: "1.08rem", color: "var(--navy)" }}>{c.name}</h3>
                  <SaveButton slug={c.slug} size={16} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontSize: 12.5, color: "var(--muted)", display: "flex", alignItems: "center", gap: 4 }}><MapPin size={13} /> {c.location}</div>
                  <span className="badge orange" style={{ display: "inline-flex", gap: 3, alignItems: "center" }}><Trophy size={11} />#{c.nirf}</span>
                </div>
                <div style={{ display: "flex", gap: 14, padding: "10px 0", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)", fontSize: 13 }}>
                  <div><div style={{ color: "var(--muted)", fontSize: 11 }}>Avg pkg</div><strong>{fmtINR(c.placements.avg)}</strong></div>
                  <div><div style={{ color: "var(--muted)", fontSize: 11 }}>Placed</div><strong>{c.placements.placedPct}%</strong></div>
                  <div><div style={{ color: "var(--muted)", fontSize: 11 }}>Fees/yr</div><strong>{fmtINR(feeTotal(c))}</strong></div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <CompareButton slug={c.slug} />
                  <button className="btn btn-ghost" style={{ flex: 1, justifyContent: "center", fontSize: 13 }} onClick={() => nav("/jee-main#college")}><BadgeCheck size={14} /> Eligibility</button>
                </div>
                <button className="btn btn-coral" style={{ justifyContent: "center", fontSize: 13, marginTop: "auto" }} onClick={() => nav(`/colleges/${c.slug}`)}>View details <ArrowRight size={15} /></button>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
