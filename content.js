(() => {
  if (window.top !== window) return;
  const style = document.createElement("style");
  style.textContent = `.metatruth-hit{outline:2px dashed #f3a712!important;outline-offset:2px}`;
  document.documentElement.appendChild(style);

  chrome.storage.local.get(["metaTruthProfiles"], ({metaTruthProfiles=[]}) => {
    const aliases = metaTruthProfiles.flatMap(p => p.targets || []);
    if (!aliases.length) return;
    const wanted = aliases.map(x => x.toLowerCase());
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let n;
    while (n = walker.nextNode()) {
      const p = n.parentElement;
      if (!p || /^(SCRIPT|STYLE|NOSCRIPT|INPUT|TEXTAREA)$/.test(p.tagName)) continue;
      if (wanted.some(a => (n.nodeValue || "").toLowerCase().includes(a.toLowerCase()))) {
        p.classList.add("metatruth-hit");
      }
    }
  });
})();