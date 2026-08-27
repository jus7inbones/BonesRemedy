(() => {
  if (window.top !== window) return;
  const FLAG_CLASS = "metatruth-flag";
  const style = document.createElement("style");
  style.textContent = `
    .${FLAG_CLASS} {
      outline: 3px dashed #e63946 !important;
      outline-offset: 2px !important;
      background: rgba(255, 230, 230, .45) !important;
      cursor: help !important;
    }
    #metatruth-toast {
      position: fixed; right: 18px; bottom: 18px; z-index: 2147483647;
      max-width: 360px; padding: 12px 14px; border-radius: 12px;
      background: #171717; color: white; font: 13px/1.35 system-ui, sans-serif;
      box-shadow: 0 8px 30px rgba(0,0,0,.35);
    }`;
  document.documentElement.appendChild(style);

  const showToast = (msg) => {
    const old = document.getElementById("metatruth-toast");
    if (old) old.remove();
    const el = document.createElement("div");
    el.id = "metatruth-toast";
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 4200);
  };

  const scan = () => {
    chrome.storage.local.get(["metaTruthProfiles"], ({metaTruthProfiles = []}) => {
      const targets = metaTruthProfiles.flatMap(p => p.targets || []).filter(Boolean);
      if (!targets.length) return;

      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      let node, hits = 0;
      while ((node = walker.nextNode())) {
        const parent = node.parentElement;
        if (!parent || ["SCRIPT","STYLE","NOSCRIPT","TEXTAREA","INPUT"].includes(parent.tagName)) continue;
        const text = node.nodeValue || "";
        if (targets.some(t => text.toLowerCase().includes(t.toLowerCase()))) {
          parent.classList.add(FLAG_CLASS);
          hits++;
        }
      }
      if (hits) showToast(`🕵️ Bones detected ${hits} possible evidence zones. Remedy has been notified. The tiny gavel is warming up.`);
    });
  };

  scan();
  const observer = new MutationObserver(() => {
    clearTimeout(window.__mtTimer);
    window.__mtTimer = setTimeout(scan, 700);
  });
  observer.observe(document.body, {subtree: true, childList: true});
})();