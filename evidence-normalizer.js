
const EvidenceNormalizer = (() => {
  const cleanText = s => (s || "").replace(/\s+/g, " ").trim();

  function canonicalUrl(url) {
    try {
      const u = new URL(url);
      ["utm_source","utm_medium","utm_campaign","utm_term","utm_content","fbclid","gclid"].forEach(k => u.searchParams.delete(k));
      u.hash = "";
      return u.toString();
    } catch { return url || ""; }
  }

  function normalize(record) {
    return {
      ...record,
      claim: cleanText(record.claim),
      excerpt: cleanText(record.excerpt),
      source: {
        ...(record.source || {}),
        url: canonicalUrl(record?.source?.url || ""),
        title: cleanText(record?.source?.title || "")
      }
    };
  }

  function fingerprint(record) {
    const n = normalize(record);
    return `${n.claim.toLowerCase()}|${n.source.url.toLowerCase()}|${n.excerpt.slice(0,220).toLowerCase()}`;
  }

  function dedupe(records) {
    const seen = new Set();
    const out = [];
    for (const r of records || []) {
      const f = fingerprint(r);
      if (seen.has(f)) continue;
      seen.add(f);
      out.push(normalize(r));
    }
    return out;
  }

  return {normalize, dedupe, canonicalUrl, fingerprint};
})();
