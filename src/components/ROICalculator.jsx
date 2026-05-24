import { useState, useMemo } from "react";
import { Calculator, TrendingUp, GraduationCap, CreditCard } from "lucide-react";
import { fmtINR } from "../utils/format.js";

export default function ROICalculator({ college }) {
  const baseFee = college ? Object.values(college.fees).reduce((a, b) => a + b, 0) : 200000;
  const basePkg = college ? college.placements.avg : 1500000;

  const [years, setYears]           = useState(4);
  const [feePerYear, setFeePerYear] = useState(baseFee);
  const [pkg, setPkg]               = useState(basePkg);
  const [livingPerYear, setLiving]  = useState(120000);

  // Scholarship
  const [scholarshipType, setScholarshipType] = useState("none");
  const [scholarshipAmt, setScholarshipAmt]   = useState(0);

  // Loan
  const [loanEnabled, setLoanEnabled] = useState(false);
  const [loanAmt, setLoanAmt]         = useState(800000);
  const [loanRate, setLoanRate]       = useState(8.5);
  const [loanTenure, setLoanTenure]   = useState(10);

  const r = useMemo(() => {
    const totalCost = (feePerYear + livingPerYear) * years;

    // Scholarship savings
    let scholarshipSaving = 0;
    if (scholarshipType === "percent") scholarshipSaving = (feePerYear * (scholarshipAmt / 100)) * years;
    else if (scholarshipType === "flat")    scholarshipSaving = scholarshipAmt * years;
    else if (scholarshipType === "onetime") scholarshipSaving = scholarshipAmt;

    const netCost = Math.max(0, totalCost - scholarshipSaving);

    // EMI calculation
    const monthlyRate = loanRate / 12 / 100;
    const n = loanTenure * 12;
    const emi = loanEnabled && loanAmt > 0 && monthlyRate > 0
      ? (loanAmt * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1)
      : 0;
    const totalLoanRepay = emi * n;
    const totalInterest  = totalLoanRepay - loanAmt;

    const firstYearNet = pkg * 0.7;
    const payback = firstYearNet > 0 ? netCost / firstYearNet : 0;
    const roi10yr = firstYearNet > 0 ? (((firstYearNet * 10) - netCost) / netCost) * 100 : 0;

    return { totalCost, scholarshipSaving, netCost, payback, roi10yr, emi, totalLoanRepay, totalInterest };
  }, [years, feePerYear, pkg, livingPerYear, scholarshipType, scholarshipAmt, loanEnabled, loanAmt, loanRate, loanTenure]);

  const field = (label, value, set, step = 10000) => (
    <div className="field">
      <label>{label}</label>
      <input className="input" type="number" min="0" step={step} value={value}
        onChange={(e) => set(Number(e.target.value) || 0)} />
    </div>
  );

  const sectionHead = (icon, title, color = "var(--coral)") => (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, marginTop: 24 }}>
      <span style={{ color }}>{icon}</span>
      <h5 style={{ fontFamily: "Sora", fontWeight: 700, fontSize: "0.95rem", color: "var(--navy)" }}>{title}</h5>
    </div>
  );

  return (
    <div className="card">
      {/* ── Header ── */}
      <h4 style={{ fontFamily: "Sora", fontWeight: 700, marginBottom: 4, display: "flex", alignItems: "center", gap: 8 }}>
        <Calculator size={18} color="var(--coral)" /> Fee &amp; ROI Calculator
      </h4>
      <p style={{ fontSize: 12.5, color: "var(--muted)", marginBottom: 18 }}>
        Estimate total degree cost, loan EMI, scholarship savings, and 10-year return on investment.
      </p>

      {/* ── Basic Inputs ── */}
      {sectionHead(<Calculator size={16} />, "Basic Details")}
      <div className="grid-2" style={{ gap: 12 }}>
        {field("Tuition + hostel / year (₹)", feePerYear, setFeePerYear)}
        {field("Living cost / year (₹)", livingPerYear, setLiving)}
        {field("Expected avg package / year (₹)", pkg, setPkg, 50000)}
        <div className="field">
          <label>Course duration (years)</label>
          <select className="select" value={years} onChange={(e) => setYears(Number(e.target.value))}>
            {[4, 5].map((y) => <option key={y} value={y}>{y} years</option>)}
          </select>
        </div>
      </div>

      {/* ── Scholarship ── */}
      {sectionHead(<GraduationCap size={16} color="var(--teal)" />, "Scholarship / Fee Waiver", "var(--teal)")}
      <div className="grid-2" style={{ gap: 12 }}>
        <div className="field">
          <label>Scholarship type</label>
          <select className="select" value={scholarshipType} onChange={(e) => setScholarshipType(e.target.value)}>
            <option value="none">No scholarship</option>
            <option value="percent">% of tuition per year</option>
            <option value="flat">Flat amount per year (₹)</option>
            <option value="onetime">One-time amount (₹)</option>
          </select>
        </div>
        {scholarshipType !== "none" && (
          <div className="field">
            <label>
              {scholarshipType === "percent" ? "Scholarship %" : "Scholarship amount (₹)"}
            </label>
            <input className="input" type="number" min="0"
              step={scholarshipType === "percent" ? 5 : 10000}
              value={scholarshipAmt}
              onChange={(e) => setScholarshipAmt(Number(e.target.value) || 0)} />
          </div>
        )}
      </div>
      {r.scholarshipSaving > 0 && (
        <div style={{ background: "#e7f8f5", borderRadius: 10, padding: "10px 14px", marginTop: 10, fontSize: 13, color: "var(--green)", fontWeight: 600 }}>
          🎓 Scholarship saves you {fmtINR(r.scholarshipSaving)} over {years} years
        </div>
      )}

      {/* ── Education Loan ── */}
      {sectionHead(<CreditCard size={16} color="var(--violet)" />, "Education Loan & EMI", "var(--violet)")}
      <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, marginBottom: 12, cursor: "pointer" }}>
        <input type="checkbox" checked={loanEnabled} onChange={(e) => setLoanEnabled(e.target.checked)}
          style={{ width: 16, height: 16, accentColor: "var(--violet)" }} />
        I plan to take an education loan
      </label>
      {loanEnabled && (
        <div className="grid-2" style={{ gap: 12 }}>
          {field("Loan amount (₹)", loanAmt, setLoanAmt, 50000)}
          <div className="field">
            <label>Interest rate (% per annum)</label>
            <input className="input" type="number" min="0" max="20" step={0.5} value={loanRate}
              onChange={(e) => setLoanRate(Number(e.target.value) || 0)} />
          </div>
          <div className="field">
            <label>Repayment tenure (years)</label>
            <select className="select" value={loanTenure} onChange={(e) => setLoanTenure(Number(e.target.value))}>
              {[5, 7, 10, 12, 15].map((y) => <option key={y} value={y}>{y} years</option>)}
            </select>
          </div>
          <div style={{ background: "#f5f3ff", borderRadius: 12, padding: 14 }}>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>Monthly EMI</div>
            <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "1.4rem", color: "var(--violet)" }}>
              {fmtINR(Math.round(r.emi))}
            </div>
            <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>
              Total repayment: {fmtINR(Math.round(r.totalLoanRepay))} · Interest: {fmtINR(Math.round(r.totalInterest))}
            </div>
          </div>
        </div>
      )}

      {/* ── Results ── */}
      {sectionHead(<TrendingUp size={16} color="var(--green)" />, "Your ROI Summary", "var(--green)")}
      <div className="grid-2" style={{ gap: 12 }}>
        <div style={{ background: "var(--sky)", borderRadius: 12, padding: 16, textAlign: "center" }}>
          <div style={{ fontSize: 12, color: "var(--muted)" }}>Total cost of degree</div>
          <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "1.4rem", color: "var(--navy)" }}>{fmtINR(r.totalCost)}</div>
        </div>
        <div style={{ background: "#e7f8f5", borderRadius: 12, padding: 16, textAlign: "center" }}>
          <div style={{ fontSize: 12, color: "var(--muted)" }}>Net cost after scholarship</div>
          <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "1.4rem", color: "var(--green)" }}>{fmtINR(r.netCost)}</div>
        </div>
        <div style={{ background: "linear-gradient(135deg,#fff7ed,#fff)", borderRadius: 12, padding: 16, textAlign: "center" }}>
          <div style={{ fontSize: 12, color: "var(--muted)" }}>Payback time</div>
          <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "1.4rem", color: "var(--gold)" }}>
            {r.payback ? `${r.payback.toFixed(1)} yrs` : "—"}
          </div>
        </div>
        <div style={{ background: "linear-gradient(135deg,#f5f3ff,#fff)", borderRadius: 12, padding: 16, textAlign: "center" }}>
          <div style={{ fontSize: 12, color: "var(--muted)" }}>10-year ROI</div>
          <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "1.4rem", color: "var(--violet)" }}>
            {r.roi10yr ? `${r.roi10yr.toFixed(0)}%` : "—"}
          </div>
        </div>
      </div>

      <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 14 }}>
        Assumes ~70% take-home of average package. Adjust numbers for your situation. SC/ST/EWS fee waivers and merit scholarships can significantly reduce net cost.
      </p>
    </div>
  );
}