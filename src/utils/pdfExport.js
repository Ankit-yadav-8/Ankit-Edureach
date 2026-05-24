/**
 * pdfExport.js — print-based PDF export + Web Share
 * No external dependencies. Uses window.print() with injected print styles.
 */

/**
 * Export any DOM element as a printable PDF.
 * @param {string} elementId  - id of the DOM element to print
 * @param {string} title      - document title shown in print dialog
 */
export function exportToPDF(elementId, title = "EduReach Export") {
  const el = document.getElementById(elementId);
  if (!el) { console.warn("exportToPDF: element not found:", elementId); return; }

  const originalTitle = document.title;
  document.title = title;

  // Inject a temporary print stylesheet that shows only this element
  const style = document.createElement("style");
  style.id = "__edu_print_style";
  style.innerHTML = `
    @media print {
      body > *:not(#${elementId}) { display: none !important; }
      #${elementId} { display: block !important; }
      nav, footer, .no-print, button, .CompareTray, .Chatbot { display: none !important; }
      body { background: #fff !important; }
      * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  `;
  document.head.appendChild(style);

  window.print();

  // Cleanup after dialog closes
  setTimeout(() => {
    document.head.removeChild(style);
    document.title = originalTitle;
  }, 1000);
}

/**
 * Share data using Web Share API, falls back to clipboard copy.
 * @param {Object} opts - { title, text, url }
 */
export async function shareContent({ title = "EduReach", text = "", url = window.location.href }) {
  if (navigator.share) {
    try {
      await navigator.share({ title, text, url });
      return { method: "share", success: true };
    } catch (e) {
      if (e.name !== "AbortError") {
        // Fall through to clipboard
      } else {
        return { method: "share", success: false };
      }
    }
  }
  // Fallback: copy to clipboard
  const content = `${title}\n\n${text}\n\n${url}`;
  try {
    await navigator.clipboard.writeText(content);
    return { method: "clipboard", success: true };
  } catch {
    return { method: "none", success: false };
  }
}

/**
 * Generate a shareable URL with state encoded in the hash.
 * Example: /shortlist#slugs=iit-bombay,iit-delhi
 */
export function buildShareURL(path, params = {}) {
  const base = `${window.location.origin}${path}`;
  const query = new URLSearchParams(params).toString();
  return query ? `${base}?${query}` : base;
}

/**
 * Export a list of colleges as plain text (for clipboard).
 */
export function formatCollegesAsText(colleges, rank = "", cat = "") {
  const header = rank
    ? `My College Shortlist (Rank ${rank}, ${cat}) — EduReach.in\n${"─".repeat(48)}\n`
    : `My College Shortlist — EduReach.in\n${"─".repeat(48)}\n`;

  const body = colleges.map((c, i) =>
    `${i + 1}. ${c.name}\n   ${c.location} · NIRF #${c.nirf} · Avg pkg ${c.placements?.avg ? (c.placements.avg / 100000).toFixed(1) + "L" : "—"}`
  ).join("\n\n");

  return header + body + `\n\n${window.location.origin}`;
}