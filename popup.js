chrome.storage.local.get(["naughtyList","metaTruthProfiles"], (d) => {
  document.getElementById("stats").textContent =
    `Profiles: ${(d.metaTruthProfiles || []).length} • Flagged items: ${(d.naughtyList || []).length}`;
});
document.getElementById("openOptions").onclick = () => chrome.runtime.openOptionsPage();
document.getElementById("export").onclick = () => {
  chrome.storage.local.get(null, (data) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {type:"application/json"});
    const url = URL.createObjectURL(blob);
    chrome.tabs.create({url});
  });
};