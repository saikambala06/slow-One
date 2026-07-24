/* eslint-disable */
// JobTrail AI extension popup logic.
// Reads/writes credentials in chrome.storage and talks to background/content scripts.

const $ = (id) => document.getElementById(id);

async function load() {
  const { apiUrl, apiKey } = await chrome.storage.local.get(["apiUrl", "apiKey"]);
  if (apiUrl) $("apiUrl").value = apiUrl;
  if (apiKey) $("apiKey").value = apiKey;
  toggle(!!apiUrl && !!apiKey);
  $("openApp").href = (apiUrl || "https://jobtrail.ai") + "/dashboard/api-keys";
}
function toggle(signedIn) {
  $("setup").style.display = signedIn ? "none" : "block";
  $("actions").style.display = signedIn ? "block" : "none";
}
function setMsg(el, text, cls) {
  const e = $(el);
  e.textContent = text;
  e.className = "status " + (cls || "");
}

$("save").addEventListener("click", async () => {
  const apiUrl = $("apiUrl").value.replace(/\/+$/, "");
  const apiKey = $("apiKey").value.trim();
  if (!apiUrl || !apiKey) return setMsg("msg", "Both fields required", "err");
  await chrome.storage.local.set({ apiUrl, apiKey });
  setMsg("msg", "Saved.", "ok");
  toggle(true);
});

$("test").addEventListener("click", async () => {
  const apiUrl = $("apiUrl").value.replace(/\/+$/, "");
  const apiKey = $("apiKey").value.trim();
  if (!apiUrl) return setMsg("msg", "Enter API URL", "err");
  setMsg("msg", "Testing…");
  try {
    const r = await fetch(apiUrl + "/api/ai/autofill", {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": apiKey },
      body: JSON.stringify({ questions: ["Full name"] }),
    });
    if (r.ok) setMsg("msg", "Connected ✓", "ok");
    else setMsg("msg", "Failed: " + r.status, "err");
  } catch (e) {
    setMsg("msg", "Network error", "err");
  }
});

$("logout").addEventListener("click", async () => {
  await chrome.storage.local.remove(["apiUrl", "apiKey"]);
  toggle(false);
});

$("scan").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.tabs.sendMessage(tab.id, { type: "JT_SCAN" }, (resp) => {
    if (chrome.runtime.lastError) return setMsg("log", chrome.runtime.lastError.message, "err");
    setMsg("log", `Detected ${resp?.count ?? 0} fields`, "ok");
  });
});

$("autofill").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.tabs.sendMessage(tab.id, { type: "JT_AUTOFILL" }, (resp) => {
    if (chrome.runtime.lastError) return setMsg("log", chrome.runtime.lastError.message, "err");
    setMsg("log", `Filled ${resp?.filled ?? 0} of ${resp?.total ?? 0} fields`, "ok");
  });
});

load();
