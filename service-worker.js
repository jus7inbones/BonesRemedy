chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(["metaTruthProfiles"], (data) => {
    if (data.metaTruthProfiles) return;
    chrome.storage.local.set({
      metaTruthProfiles: [{
        id: "bones-default",
        name: "Bones",
        role: "detective",
        targets: ["Bones"],
        protectedFacts: []
      }],
      remedyConfig: {
        identity: "Remedy",
        role: "judge-and-report",
        autoPublish: false
      },
      naughtyList: []
    });
  });
});