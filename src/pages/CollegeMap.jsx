import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Layers, ExternalLink } from "lucide-react";
import { COLLEGES } from "../data/colleges.js";
import { fmtINR } from "../utils/format.js";

const TYPE_COLOR = { IIT: "#E63946", NIT: "#2563eb", IIIT: "#7c3aed", Private: "#059669", Other: "#64748b" };

export default function CollegeMap() {
  const mapRef   = useRef(null);
  const leafRef  = useRef(null);
  const [filter, setFilter]   = useState("All");
  const [ready,  setReady]    = useState(false);
  const markersRef = useRef([]);

  /* Load Leaflet from CDN once */
  useEffect(() => {
    if (document.getElementById("leaflet-css")) { initMap(); return; }
    const css = document.createElement("link");
    css.id   = "leaflet-css";
    css.rel  = "stylesheet";
    css.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(css);

    const js  = document.createElement("script");
    js.src    = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    js.onload = () => { setReady(true); };
    document.head.appendChild(js);
    return () => {};
  }, []);

  useEffect(() => { if (ready) initMap(); }, [ready]);

  const initMap = () => {
    if (!mapRef.current || leafRef.current) return;
    const L = window.L;
    const map = L.map(mapRef.current, { center: [22.5, 80.5], zoom: 5 });
    leafRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
      maxZoom: 18,
    }).addTo(map);

    COLLEGES.forEach((college) => {
      if (!college.coords?.lat || !college.coords?.lng) return;
      const color = TYPE_COLOR[college.type] || TYPE_COLOR.Other;
      const icon = L.divIcon({
        className: "",
        html: `<div style="
          width:28px;height:28px;border-radius:50% 50% 50% 0;
          background:${color};border:2.5px solid #fff;
          box-shadow:0 2px 8px rgba(0,0,0,.3);
          transform:rotate(-45deg);
          display:flex;align-items:center;justify-content:center;
        "><span style="transform:rotate(45deg);font-size:10px;font-weight:800;color:#fff">${college.nirf || ""}</span></div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 28],
        popupAnchor: [0, -30],
      });

      const marker = L.marker([college.coords.lat, college.coords.lng], { icon })
        .addTo(map)
        .bindPopup(`
          <div style="font-family:system-ui;min-width:200px">
            <div style="font-weight:800;font-size:.95rem;color:#1e3a5f;margin-bottom:4px">${college.name}</div>
            <div style="font-size:12px;color:#64748b;margin-bottom:8px">
              📍 ${college.location} &nbsp;·&nbsp;
              <span style="background:${color}20;color:${color};padding:1px 7px;border-radius:20px;font-weight:700">${college.type}</span>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:10px">
              <div style="background:#f0f4ff;border-radius:8px;padding:6px 8px;text-align:center">
                <div style="font-size:10px;color:#94a3b8;font-weight:600">NIRF</div>
                <div style="font-weight:800;color:#1e3a5f">#${college.nirf}</div>
              </div>
              <div style="background:#f0fdf4;border-radius:8px;padding:6px 8px;text-align:center">
                <div style="font-size:10px;color:#94a3b8;font-weight:600">Avg Pkg</div>
                <div style="font-weight:800;color:#16a34a">${fmtINR(college.placements?.avg)}</div>
              </div>
            </div>
            <a href="/colleges/${college.slug}"
              style="display:block;text-align:center;padding:7px;background:#E63946;color:#fff;border-radius:8px;font-weight:700;font-size:13px;text-decoration:none">
              View Details →
            </a>
          </div>
        `, { maxWidth: 240 });

      markersRef.current.push({ marker, type: college.type });
    });
  };

  /* Filter markers */
  useEffect(() => {
    if (!leafRef.current) return;
    markersRef.current.forEach(({ marker, type }) => {
      if (filter === "All" || filter === type) {
        marker.addTo(leafRef.current);
      } else {
        marker.remove();
      }
    });
  }, [filter]);

  const types = ["All", "IIT", "NIT", "IIIT", "Private"];
  const counts = types.reduce((acc, t) => {
    acc[t] = t === "All" ? COLLEGES.length : COLLEGES.filter((c) => c.type === t).length;
    return acc;
  }, {});

  return (
    <div className="page">
      {/* Hero */}
      <section style={{ background: "linear-gradient(135deg,#0f2027,#203a43,#2c5364)", color: "#fff", padding: "36px 0 24px" }}>
        <div className="container">
          <span className="badge teal" style={{ marginBottom: 10 }}>Interactive Map</span>
          <h1 style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "clamp(1.8rem,4vw,2.4rem)", margin: "0 0 8px" }}>
            Colleges on the Map
          </h1>
          <p style={{ color: "rgba(255,255,255,.75)", maxWidth: 540 }}>
            All {COLLEGES.length} engineering colleges — IITs, NITs, IIITs and Private universities — pinned on one interactive map.
          </p>
        </div>
      </section>

      <div className="container" style={{ paddingTop: 20, paddingBottom: 48 }}>

        {/* Filter bar */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16, alignItems: "center" }}>
          <Layers size={16} color="var(--muted)" />
          {types.map((t) => (
            <button key={t} onClick={() => setFilter(t)}
              style={{
                padding: "6px 14px", borderRadius: 20, fontSize: 13, fontWeight: 700, cursor: "pointer",
                border: "1.5px solid",
                background: filter === t ? (TYPE_COLOR[t] || "var(--navy)") : "transparent",
                borderColor: filter === t ? (TYPE_COLOR[t] || "var(--navy)") : "var(--border)",
                color: filter === t ? "#fff" : "var(--navy)",
                transition: "all .2s",
              }}>
              {t} <span style={{ opacity: .65, fontSize: 11 }}>({counts[t]})</span>
            </button>
          ))}

          {/* Legend */}
          <div style={{ marginLeft: "auto", display: "flex", gap: 10, flexWrap: "wrap" }}>
            {Object.entries(TYPE_COLOR).filter(([k]) => k !== "Other").map(([type, color]) => (
              <span key={type} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 600, color: "var(--navy)" }}>
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: color, display: "inline-block" }} />
                {type}
              </span>
            ))}
          </div>
        </div>

        {/* Map */}
        <div style={{ borderRadius: 16, overflow: "hidden", border: "1.5px solid var(--border)", boxShadow: "var(--shadow-sm)" }}>
          {!ready && (
            <div style={{ height: 560, display: "grid", placeItems: "center", background: "var(--sky)", color: "var(--muted)", fontWeight: 600 }}>
              <div style={{ textAlign: "center" }}>
                <MapPin size={36} style={{ opacity: .3, marginBottom: 8 }} />
                <p>Loading map…</p>
              </div>
            </div>
          )}
          <div ref={mapRef} style={{ height: 560, display: ready ? "block" : "none" }} />
        </div>

        <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 10, textAlign: "center" }}>
          Click any pin to see college details. Scroll to zoom, drag to pan. Map data © OpenStreetMap contributors.
        </p>

        {/* College list below */}
        <h2 style={{ fontFamily: "Sora", fontWeight: 700, marginTop: 40, marginBottom: 16 }}>
          All Colleges
          <span style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--muted)", marginLeft: 10 }}>
            {filter === "All" ? COLLEGES.length : counts[filter]} shown
          </span>
        </h2>
        <div className="grid-4" style={{ gap: 12 }}>
          {COLLEGES.filter((c) => filter === "All" || c.type === filter).map((c) => (
            <Link key={c.slug} to={`/colleges/${c.slug}`}
              style={{ textDecoration: "none" }}>
              <div className="card" style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 5, height: "100%", transition: "transform .2s, box-shadow .2s" }}
                onMouseOver={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "var(--shadow-md)"; }}
                onMouseOut={(e)  => { e.currentTarget.style.transform = "none";            e.currentTarget.style.boxShadow = ""; }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: (TYPE_COLOR[c.type] || "#64748b") + "18", color: TYPE_COLOR[c.type] || "#64748b" }}>{c.type}</span>
                  <span style={{ fontSize: 11, color: "var(--muted)", fontWeight: 600 }}>#{c.nirf}</span>
                </div>
                <div style={{ fontWeight: 700, fontSize: "0.88rem", color: "var(--navy)", lineHeight: 1.3 }}>{c.short || c.name}</div>
                <div style={{ fontSize: 11, color: "var(--muted)", display: "flex", alignItems: "center", gap: 4 }}>
                  <MapPin size={10} /> {c.location}
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "var(--green)", marginTop: "auto" }}>{fmtINR(c.placements?.avg)} avg</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}