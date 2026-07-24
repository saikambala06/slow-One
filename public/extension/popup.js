/* eslint-disable */
// JobTrail AI extension popup logic.
// - API base URL is hardcoded in background.js and never shown here.
// - Once the API key is saved, the popup skips the sign-in screen forever
//   (until the user clicks Sign out).

const $ = (id) => document.getElementById(id);

let API_BASE = "";

function setMsg(el, text, cls) {
  const e = $(el);
  e.textContent = text || "";
  e.className = "status " + (cls || "");
}
function toggle(signedIn) {
  $("setup").style.display = signedIn ? "none" : "block";
  $("actions").style.display = signedIn ? "block" : "none";
  $("statusPill").style.display = signedIn ? "inline-flex" : "none";
}

async function loadConfig() {
  const cfg = await chrome.runtime.sendMessage({ type: "JT_GET_CONFIG" });
  API_BASE = cfg?.apiBaseUrl || "";
  $("openApp").href = API_BASE + "/dashboard/api-keys";
  $("openApp").addEventListener("click", (e) => {
    e.preventDefault();
    chrome.tabs.create({ url: API_BASE + "/dashboard/api-keys" });
  });
  toggle(!!cfg?.hasKey);
}

$("save").addEventListener("click", async () => {
  const apiKey = $("apiKey").value.trim();
  if (!apiKey) return setMsg("msg", "Please paste your API key", "err");
  setMsg("msg", "Verifying…");
  // Verify by hitting the sync endpoint.
  await chrome.storage.local.set({ apiKey });
  const test = await chrome.runtime.sendMessage({
    type: "JT_API",
    method: "GET",
    path: "/api/extension/sync",
  });
  if (!test?.ok) {
    setMsg("msg", "Key rejected — check and try again", "err");
    await chrome.storage.local.remove(["apiKey"]);
    return;
  }
  setMsg("msg", "Signed in ✓", "ok");
  setTimeout(() => toggle(true), 250);
});

$("apiKey")?.addEventListener("keydown", (e) => {
  if (e.key === "Enter") $("save").click();
});

$("logout").addEventListener("click", async () => {
  await chrome.storage.local.remove(["apiKey"]);
  setMsg("log", "");
  toggle(false);
});

$("dashboard").addEventListener("click", () => {
  chrome.tabs.create({ url: API_BASE + "/dashboard" });
});

async function sendToActiveTab(message) {
  const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
  if (!tab || !tab.id) {
    // Fall back to any active tab that isn't our popup window.
    const tabs = await chrome.tabs.query({ active: true });
    const other = tabs.find((t) => t.id && !(t.url || "").startsWith(chrome.runtime.getURL("")));
    if (!other) throw new Error("No active tab");
    return new Promise((resolve) => chrome.tabs.sendMessage(other.id, message, resolve));
  }
  // If the current active tab is our popup, find the last normal tab.
  if ((tab.url || "").startsWith(chrome.runtime.getURL(""))) {
    const wins = await chrome.windows.getAll({ populate: true, windowTypes: ["normal"] });
    for (const w of wins) {
      const t = (w.tabs || []).find((x) => x.active);
      if (t?.id) return new Promise((resolve) => chrome.tabs.sendMessage(t.id, message, resolve));
    }
    throw new Error("Open a job page in your browser first");
  }
  return new Promise((resolve) => chrome.tabs.sendMessage(tab.id, message, resolve));
}

$("scan").addEventListener("click", async () => {
  setMsg("log", "Scanning…");
  try {
    const resp = await sendToActiveTab({ type: "JT_SCAN" });
    if (chrome.runtime.lastError) return setMsg("log", chrome.runtime.lastError.message, "err");
    setMsg("log", `Detected ${resp?.count ?? 0} fields`, "ok");
  } catch (e) {
    setMsg("log", String(e.message || e), "err");
  }
});

$("autofill").addEventListener("click", async () => {
  setMsg("log", "Filling…");
  try {
    const resp = await sendToActiveTab({ type: "JT_AUTOFILL" });
    if (chrome.runtime.lastError) return setMsg("log", chrome.runtime.lastError.message, "err");
    if (resp?.error) return setMsg("log", resp.error, "err");
    setMsg("log", `Filled ${resp?.filled ?? 0} of ${resp?.total ?? 0} fields`, "ok");
  } catch (e) {
    setMsg("log", String(e.message || e), "err");
  }
});

loadConfig();
