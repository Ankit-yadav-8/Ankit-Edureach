/* ============================================================
   cutoffEngine.js
   Expands a college's base (Round-1-ish) opening/closing ranks
   into the full counselling picture:
     • JoSAA Rounds 1–6
     • CSAB Special Rounds 1–2
   ------------------------------------------------------------
   HOW IT WORKS (and how to replace with real data):
   Across JoSAA rounds, closing ranks typically LOOSEN (go higher)
   as seats fill from the top, then CSAB special rounds loosen
   further. We model this with small, deterministic per-round
   multipliers so every branch/category shows a believable
   6+2 round progression.

   ➜ To use OFFICIAL data instead: replace `expandRounds()` with a
     lookup into a real JSON keyed by
     [collegeSlug][branch][category][round] = { opening, closing }.
   ============================================================ */

import { BRANCHES } from "../data/colleges.js";

// Round-on-round closing-rank growth factors (cumulative feel)
const JOSAA_FACTORS = [1.0, 1.06, 1.11, 1.15, 1.18, 1.2]; // R1..R6
const CSAB_FACTORS = [1.28, 1.4]; // CSAB special R1..R2 (loosen more)

function jitter(seed) {
  // deterministic pseudo-random in [0.97, 1.03] based on a string seed
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) % 9973;
  return 0.97 + (h % 60) / 1000;
}

/**
 * Returns an array of round objects for one branch+category.
 * [{ round:"R1", stage:"JoSAA", opening, closing }, ...]
 */
export function expandRounds(college, branchCode, category) {
  const base = college.baseCutoff?.[branchCode]?.[category];
  if (!base) return [];
  const [openBase, closeBase] = base;
  const rounds = [];

  JOSAA_FACTORS.forEach((f, i) => {
    const j = jitter(`${college.slug}${branchCode}${category}j${i}`);
    rounds.push({
      round: `R${i + 1}`,
      stage: "JoSAA",
      opening: Math.round(openBase * (1 + i * 0.015) * j),
      closing: Math.round(closeBase * f * j),
    });
  });

  // CSAB Special rounds apply ONLY to the NIT+ system (NITs, IIITs, GFTIs).
  // IIT seats are filled exclusively through JoSAA — there is NO CSAB for IITs.
  const hasCSAB = college.type !== "IIT";
  if (hasCSAB) {
    CSAB_FACTORS.forEach((f, i) => {
      const j = jitter(`${college.slug}${branchCode}${category}c${i}`);
      rounds.push({
        round: `CSAB ${i + 1}`,
        stage: "CSAB",
        opening: Math.round(openBase * (1 + (JOSAA_FACTORS.length + i) * 0.015) * j),
        closing: Math.round(closeBase * f * j),
      });
    });
  }

  return rounds;
}

/** True if this college participates in CSAB special rounds (NIT/IIIT/GFTI). */
export function hasCSABRounds(college) {
  return college?.type !== "IIT";
}

/** All branches available for a college (only those with base data). */
export function collegeBranches(college) {
  return BRANCHES.filter((b) => college.baseCutoff?.[b.code]);
}

/** Final (last-round / CSAB-2) closing rank for matching in predictor. */
export function finalClosing(college, branchCode, category) {
  const rounds = expandRounds(college, branchCode, category);
  return rounds.length ? rounds[rounds.length - 1].closing : null;
}

/** Round-1 opening rank. */
export function firstOpening(college, branchCode, category) {
  const base = college.baseCutoff?.[branchCode]?.[category];
  return base ? base[0] : null;
}

/* ============================================================
   5-year cutoff HISTORY (2021–2025) for one branch+category.
   Derived from the base (latest-year) opening/closing with small
   deterministic year-on-year variation so each year differs.
   ➜ Replace with official year-wise JoSAA/CSAB closing ranks.
   ============================================================ */
const HISTORY_YEARS = [2021, 2022, 2023, 2024, 2025];
// relative factors vs the base year (2025 = 1.0); earlier years differ a bit
const YEAR_FACTORS = { 2021: 0.86, 2022: 0.94, 2023: 1.05, 2024: 0.97, 2025: 1.0 };

export function cutoffHistory(college, branchCode, category) {
  const base = college?.baseCutoff?.[branchCode]?.[category];
  if (!base) return [];
  const [openBase, closeBase] = base;
  return HISTORY_YEARS.map((year) => {
    const yf = YEAR_FACTORS[year];
    const j = jitter(`${college.slug}${branchCode}${category}${year}`);
    return {
      year: String(year),
      opening: Math.max(1, Math.round(openBase * yf * j)),
      closing: Math.round(closeBase * yf * j),
    };
  });
}
