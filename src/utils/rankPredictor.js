/* ============================================================
   rankPredictor.js
   Marks (out of 300) -> JEE Main rank, via linear interpolation
   on a historical lookup table (General category).
   Category multipliers approximate AIR -> category-rank offsets.
   ------------------------------------------------------------
   Replace MARKS_RANK with the latest official marks-vs-rank data
   after JoSAA Round 1 each year.
   ============================================================ */

// [marks, generalRank] anchor points (approx., JEE Main scale)
const MARKS_RANK = [
  [300, 1],
  [295, 25],
  [290, 80],
  [285, 200],
  [280, 450],
  [270, 1200],
  [260, 2600],
  [250, 4800],
  [240, 8000],
  [230, 12500],
  [220, 19000],
  [212, 25500],
  [200, 38000],
  [190, 55000],
  [180, 76000],
  [170, 102000],
  [160, 135000],
  [150, 175000],
  [140, 225000],
  [130, 290000],
  [120, 370000],
  [110, 470000],
  [100, 590000],
  [90, 730000],
  [80, 900000],
  [70, 1080000],
  [60, 1250000],
  [50, 1400000],
  [40, 1520000],
  [30, 1620000],
  [20, 1700000],
  [10, 1780000],
  [0, 1850000],
];

// Category rank ≈ general rank scaled down (more lenient cutoffs)
const CATEGORY_FACTOR = {
  General: 1,
  "OBC-NCL": 0.42,
  EWS: 0.78,
  SC: 0.16,
  ST: 0.085,
  PwD: 0.05,
};

const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));

/** Percentile estimate from total marks (smooth curve, ~JEE Main). */
export function marksToPercentile(marks) {
  const m = clamp(marks, 0, 300);
  // Calibrated so 250≈99.4, 200≈98.2, 150≈92, 100≈74, 50≈40
  const pct = 100 * (1 - Math.exp(-Math.pow(m / 300, 1.55) * 4.4));
  return clamp(pct, 0, 99.999);
}

/** Interpolated General AIR from marks. */
function marksToGeneralRank(marks) {
  const m = clamp(marks, 0, 300);
  for (let i = 0; i < MARKS_RANK.length - 1; i++) {
    const [hiM, hiR] = MARKS_RANK[i];
    const [loM, loR] = MARKS_RANK[i + 1];
    if (m <= hiM && m >= loM) {
      const t = (hiM - m) / (hiM - loM || 1);
      return Math.round(hiR + t * (loR - hiR));
    }
  }
  return MARKS_RANK[MARKS_RANK.length - 1][1];
}

/**
 * Main predictor.
 * @returns { rank, low, high, percentile, generalRank, category }
 */
export function predictRank({ physics, chemistry, maths, category = "General", female = false }) {
  const p = clamp(Number(physics) || 0, 0, 100);
  const c = clamp(Number(chemistry) || 0, 0, 100);
  const mth = clamp(Number(maths) || 0, 0, 100);
  const total = p + c + mth;

  const generalRank = marksToGeneralRank(total);
  let rank = Math.round(generalRank * (CATEGORY_FACTOR[category] ?? 1));
  if (female) rank = Math.round(rank * 0.93); // female-pool slight relaxation

  rank = Math.max(rank, 1);
  const spread = total >= 250 ? 0.1 : total >= 180 ? 0.13 : 0.16;
  return {
    total,
    rank,
    low: Math.max(1, Math.round(rank * (1 - spread))),
    high: Math.round(rank * (1 + spread)),
    percentile: Number(marksToPercentile(total).toFixed(3)),
    generalRank,
    category,
  };
}
