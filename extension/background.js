/* eslint-disable */
// Service worker: proxies requests to the JobTrail API using saved credentials.
chrome.runtime.onInstalled.addListener(() => {
  console.log("JobTrail AI installed");
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg?.type === "JT_API") {
    (async () => {
      const { apiUrl, apiKey } = await chrome.storage.local.get(["apiUrl", "apiKey"]);
      if (!apiUrl || !apiKey) return sendResponse({ ok: false, error: "Not configured" });
      try {
        const r = await fetch(apiUrl + msg.path, {
          method: msg.method || "POST",
          headers: { "content-type": "application/json", "x-api-key": apiKey },
          body: msg.body ? JSON.stringify(msg.body) : undefined,
        });
        const data = await r.json().catch(() => ({}));
        sendResponse({ ok: r.ok, status: r.status, data });
      } catch (e) {
        sendResponse({ ok: false, error: String(e) });
      }
    })();
    return true; // async
  }
});
