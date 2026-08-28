
const SourceScoring = (() => {
  const TRUSTED_TLDS = [".gov", ".gc.ca", ".edu"];
  const LOW_SIGNAL_HOSTS = ["pinterest.", "quora.", "facebook.com", "instagram.com", "tiktok.com"];

  function hostOf(url) {
    try { return new URL(url).hostname.toLowerCase(); } catch { return ""; }
  }

  function classify(url) {
    const h = hostOf(url);
    if (!h) return "unknown";
    if (h.endsWith(".gov") || h.endsWith(".gc.ca")) return "government";
    if (h.endsWith(".edu")) return "academic";
    if (h.includes("wikipedia.org")) return "reference";
    if (LOW_SIGNAL_HOSTS.some(x => h.includes(x))) return "social";
    return "web";
  }

  function score(record) {
    const h = hostOf(record?.source?.url || "");
    const type = classify(record?.source?.url || "");
    let score = 50;
    const reasons = [];

    if (type === "government") { score += 35; reasons.push("official government domain"); }
    if (type === "academic") { score += 25; reasons.push("academic domain"); }
    if (type === "reference") { score += 10; reasons.push("reference source"); }
    if (type === "social") { score -= 20; reasons.push("social/user-generated source"); }

    if (record?.excerpt?.length > 180) { score += 8; reasons.push("substantive captured excerpt"); }
    if (record?.source?.title) { score += 3; reasons.push("source title captured"); }
    if (record?.contentHash) { score += 4; reasons.push("content hash present"); }
    if (!h) { score -= 30; reasons.push("invalid or missing URL"); }

    score = Math.max(0, Math.min(100, score));
    return {score, type, reasons};
  }

  return {score, classify, hostOf};
})();
