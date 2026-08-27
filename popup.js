document.getElementById("search").onclick=()=>chrome.tabs.create({url:chrome.runtime.getURL("landing.html")});
document.getElementById("audit").onclick=()=>chrome.runtime.openOptionsPage();