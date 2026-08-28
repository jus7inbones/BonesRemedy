
const ClaimComparison = (() => {
  const stop = new Set(["the","a","an","and","or","of","to","in","on","for","with","is","was","are","were","be","been","by","as","at","from"]);
  const tokens = s => (s || "").toLowerCase().replace(/[^a-z0-9@._-]+/g," ").split(/\s+/).filter(x => x && !stop.has(x));

  function overlap(a, b) {
    const A = new Set(tokens(a)), B = new Set(tokens(b));
    if (!A.size || !B.size) return 0;
    let hit = 0;
    A.forEach(x => { if (B.has(x)) hit++; });
    return hit / Math.max(A.size, B.size);
  }

  function assess(claim, evidence) {
    const rel = overlap(claim, `${evidence?.source?.title || ""} ${evidence?.excerpt || ""}`);
    let label = "LOW_RELEVANCE";
    if (rel >= 0.55) label = "HIGH_RELEVANCE";
    else if (rel >= 0.28) label = "MEDIUM_RELEVANCE";
    return {relevance: Math.round(rel * 100), label};
  }

  return {assess};
})();
