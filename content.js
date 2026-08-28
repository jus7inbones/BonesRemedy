(() => {
  if (window.top !== window) return;
  chrome.runtime.onMessage.addListener((msg, sender, reply) => {
    if (msg?.type !== 'METATRUTH_CAPTURE_PAGE') return;
    try {
      const text=(document.body?.innerText||'').replace(/\s+/g,' ').trim().slice(0,12000);
      reply({ok:true,url:location.href,title:document.title||'',excerpt:text,capturedAt:new Date().toISOString()});
    } catch (e) { reply({ok:false,error:String(e)}); }
  });
})();