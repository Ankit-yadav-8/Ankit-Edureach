import { Target, Users, ShieldCheck, Mail, Phone } from "lucide-react";
import { COLLEGES } from "../data/colleges.js";
import { EXAMS } from "../data/exams.js";
import useCountUp from "../utils/useCountUp.js";
import Reveal from "../components/Reveal.jsx";

function Stat({ target, suffix, label }) {
  const [ref, val] = useCountUp(target);
  return (
    <div ref={ref} className="card" style={{ textAlign: "center" }}>
      <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "2rem", color: "var(--coral)" }}>{val.toLocaleString("en-IN")}{suffix}</div>
      <div style={{ fontSize: 13, color: "var(--muted)" }}>{label}</div>
    </div>
  );
}

export default function About() {
  return (
    <div className="page">
      <section style={{ background: "linear-gradient(135deg,#0D1B3E,#0b3a4a)", color: "#fff", padding: "54px 0" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <span className="eyebrow" style={{ color: "var(--gold)" }}>About EduReach</span>
          <h1 style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "clamp(1.9rem,4vw,2.8rem)", margin: "10px 0 8px" }}>Guiding students to the right college</h1>
          <p style={{ color: "rgba(255,255,255,.82)", maxWidth: 640, margin: "0 auto" }}>EduReach brings rank prediction, college discovery and counselling tracking into a single, clean, student-first platform.</p>
        </div>
      </section>

      <div className="container section">
        <div className="grid-4" style={{ marginBottom: 40 }}>
          <Stat target={COLLEGES.length} suffix="+" label="Colleges profiled" />
          <Stat target={EXAMS.length} suffix="+" label="Exams covered" />
          <Stat target={8} suffix="" label="Counselling rounds" />
          <Stat target={50} suffix="K+" label="Students guided" />
        </div>

        <div className="grid-3">
          {[
            [Target, "Our mission", "Make engineering admissions transparent — every student should know exactly where they stand and what's within reach."],
            [Users, "Who it's for", "JEE Main & Advanced aspirants, parents and counsellors who want clear, data-backed guidance without the noise."],
            [ShieldCheck, "Our promise", "Clean tools, honest data caveats and direct links to official sources so you always verify before you decide."],
          ].map(([Icon, t, d], i) => (
            <Reveal key={t} delay={i * 0.08}>
              <div className="card" style={{ height: "100%" }}>
                <Icon size={26} color="var(--coral)" />
                <h3 style={{ fontFamily: "Sora", fontWeight: 700, margin: "12px 0 8px" }}>{t}</h3>
                <p style={{ color: "var(--muted)", lineHeight: 1.6, fontSize: 14.5 }}>{d}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <div id="contact" className="card" style={{ marginTop: 40, scrollMarginTop: 90 }}>
          <h3 style={{ fontFamily: "Sora", fontWeight: 700, marginBottom: 12 }}>Contact us</h3>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            <a href="mailto:support@edureachportal.in" className="btn btn-ghost"><Mail size={16} /> support@edureachportal.in</a>
            <a href="tel:+911140000000" className="btn btn-ghost"><Phone size={16} /> +91 11 4000 0000</a>
          </div>
        </div>

        <div id="privacy" className="card" style={{ marginTop: 20, scrollMarginTop: 90 }}>
          <h3 style={{ fontFamily: "Sora", fontWeight: 700, marginBottom: 8 }}>Privacy</h3>
          <p style={{ color: "var(--muted)", lineHeight: 1.6 }}>EduReach runs all predictions in your browser. Marks and ranks you enter are never sent to a server or stored.</p>
        </div>

        <div id="terms" className="card" style={{ marginTop: 20, scrollMarginTop: 90 }}>
          <h3 style={{ fontFamily: "Sora", fontWeight: 700, marginBottom: 8 }}>Terms & data disclaimer</h3>
          <p style={{ color: "var(--muted)", lineHeight: 1.6 }}>All cutoffs, packages and dates shown are illustrative and modelled on historical trends for demonstration. Always verify with official sources (NTA, JoSAA, CSAB and individual institutes) before making admission decisions.</p>
        </div>
      </div>
    </div>
  );
}
