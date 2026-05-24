import { useState } from "react";
import { motion } from "framer-motion";
import { Gauge as GaugeIcon, RotateCcw, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { predictRank } from "../../utils/rankPredictor.js";
import { Gauge, CenterDonut } from "../Charts.jsx";
import { fmtRank } from "../../utils/format.js";

const CATS = ["General", "EWS", "OBC-NCL", "SC", "ST"];

export default function RankPredictorTool({ accent = "#E63946", advanced = false }) {
  const [form, setForm] = useState({ physics: "", chemistry: "", maths: "", category: "General", female: false });
  const [res, setRes] = useState(null);
  const nav = useNavigate();
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = () => setRes(predictRank(form));
  const reset = () => { setForm({ physics: "", chemistry: "", maths: "", category: "General", female: false }); setRes(null); };

  const scorePct = res ? Math.round((res.total / 300) * 100) : 0;

  return (
    <div className="grid-2" style={{ alignItems: "start", gap: 28 }}>
      {/* Form */}
      <div className="card">
        <h3 style={{ fontFamily: "Sora", fontWeight: 700, fontSize: "1.2rem", marginBottom: 4, display: "flex", alignItems: "center", gap: 8 }}>
          <GaugeIcon size={20} color={accent} /> Enter your expected marks
        </h3>
        <p style={{ color: "var(--muted)", fontSize: 13.5, marginBottom: 18 }}>Out of 100 each · total 300 marks{advanced ? " (JEE Advanced scale modelled on JEE Main)" : ""}.</p>

        <div className="grid-3" style={{ gap: 12 }}>
          {["physics", "chemistry", "maths"].map((s) => (
            <div className="field" key={s}>
              <label style={{ textTransform: "capitalize" }}>{s}</label>
              <input className="input" type="number" min="0" max="100" value={form[s]} onChange={(e) => set(s, e.target.value)} placeholder="0-100" />
            </div>
          ))}
        </div>

        <div className="grid-2" style={{ gap: 12, marginTop: 4 }}>
          <div className="field">
            <label>Category</label>
            <select className="select" value={form.category} onChange={(e) => set("category", e.target.value)}>
              {CATS.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="field" style={{ justifyContent: "flex-end" }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", marginTop: 22 }}>
              <input type="checkbox" checked={form.female} onChange={(e) => set("female", e.target.checked)} /> Female candidate
            </label>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
          <button className="btn full" style={{ background: accent, color: "#fff", justifyContent: "center" }} onClick={submit}>Predict My Rank</button>
          <button className="btn btn-ghost" onClick={reset} aria-label="Reset"><RotateCcw size={16} /></button>
        </div>
      </div>

      {/* Result */}
      <div className="card" style={{ minHeight: 320 }}>
        {!res ? (
          <div style={{ display: "grid", placeItems: "center", height: 320, color: "var(--muted)", textAlign: "center" }}>
            <div>
              <GaugeIcon size={48} color="var(--line)" />
              <p style={{ marginTop: 12 }}>Your predicted rank, percentile and category rank<br />will appear here.</p>
            </div>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
            <div className="grid-2" style={{ gap: 8, alignItems: "center" }}>
              <Gauge value={scorePct} label="Score %" color={accent} height={180} />
              <div>
                <div style={{ fontSize: 12.5, color: "var(--muted)" }}>Predicted All-India Rank</div>
                <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "2rem", color: "var(--navy)", lineHeight: 1.1 }}>{fmtRank(res.rank)}</div>
                <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 2 }}>Range {fmtRank(res.low)} – {fmtRank(res.high)}</div>
              </div>
            </div>

            <div className="grid-3" style={{ gap: 10, marginTop: 14, textAlign: "center" }}>
              {[["Total", `${res.total}/300`], ["Percentile", `${res.percentile}`], ["Gen. rank", fmtRank(res.generalRank)]].map(([l, v]) => (
                <div key={l} style={{ background: "var(--sky)", borderRadius: 12, padding: "12px 8px" }}>
                  <div style={{ fontSize: 11, color: "var(--muted)" }}>{l}</div>
                  <strong style={{ color: "var(--navy)", fontSize: 15 }}>{v}</strong>
                </div>
              ))}
            </div>

            <button className="btn full" style={{ background: "var(--navy)", color: "#fff", justifyContent: "center", marginTop: 16 }}
              onClick={() => nav(`${advanced ? "/jee-advanced" : "/jee-main"}#college`)}>
              See colleges for rank {fmtRank(res.rank)} <ArrowRight size={16} />
            </button>
            <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 10, textAlign: "center" }}>
              Illustrative model based on past marks-vs-rank trends. Actual normalised ranks vary by session & shift.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
