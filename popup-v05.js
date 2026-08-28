
const s=document.getElementById("s")||document.getElementById("search");
const a=document.getElementById("a")||document.getElementById("admin");
if(s)s.onclick=()=>chrome.tabs.create({url:chrome.runtime.getURL("landing.html")});
if(a)a.onclick=()=>chrome.tabs.create({url:chrome.runtime.getURL("admin.html")});
