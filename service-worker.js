chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(["metatruthAuditLog"], d => {
    if (!d.metatruthAuditLog) chrome.storage.local.set({metatruthAuditLog: []});
  });
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg?.type !== "CREATE_AUDIT_DRAFT") return;
  chrome.storage.local.get(["metatruthAuditLog"], d => {
    const entry = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      sourceUrl: msg.sourceUrl || "",
      claim: msg.claim || "",
      status: "REVIEW_REQUIRED",
      evidence: msg.evidence || [],
      submittedBy: "user-confirmed",
      publicPublication: false
    };
    const log = d.metatruthAuditLog || [];
    chrome.storage.local.set({metatruthAuditLog: [...log, entry]}, () => sendResponse(entry));
  });
  return true;
});