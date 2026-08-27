(() => {
  if (window.top !== window) return;
  const style = document.createElement("style");
  style.textContent = `.metatruth-identity-hit{outline:2px dashed #f0ad4e!important;outline-offset:2px!important;background:rgba(255,235,180,.28)!important}#metatruth-toast{position:fixed;right:18px;bottom:18px;z-index:2147483647;max-width:380px;padding:12px 14px;border-radius:12px;background:#171717;color:white;font:13px/1.35 system-ui,sans-serif;box-shadow:0 8px 30px rgba(0,0,0,.35)}`;
  document.documentElement.appendChild(style);
  const toast = msg => { document.getElementById("metatruth-toast")?.remove(); const el=document.createElement("div"); el.id="metatruth-toast"; el.textContent=msg; document.body.appendChild(el); setTimeout(()=>el.remove(),4500); };
  const norm=s=>s.toLowerCase().replace(/\s+/g," ").trim();
  const scan=()=>chrome.storage.local.get(["metaTruthProfiles"],({metaTruthProfiles=[]})=>{
    const aliases=metaTruthProfiles.flatMap(p=>p.targets||[]).filter(Boolean).map(norm); if(!aliases.length)return;
    const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT); let node,hits=0;
    while(node=walker.nextNode()){ const p=node.parentElement; if(!p||["SCRIPT","STYLE","NOSCRIPT","TEXTAREA","INPUT"].includes(p.tagName))continue; if(aliases.some(a=>norm(node.nodeValue||"").includes(a))){p.classList.add("metatruth-identity-hit");hits++;} }
    if(hits)toast(`🕵️ Bones found ${hits} identity-reference zones. Remedy deployed the Tiny Gavel™. Evidence first, chaos second.`);
  });
  scan(); const observer=new MutationObserver(()=>{clearTimeout(window.__mtTimer);window.__mtTimer=setTimeout(scan,700)}); observer.observe(document.body,{subtree:true,childList:true});
})();
