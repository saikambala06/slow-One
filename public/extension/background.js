/* eslint-disable */
/**
 * JobTrail AI background service worker.
 *
 * Behavior:
 *   - Clicking the toolbar icon TOGGLES a standalone popup window (so it
 *     stays open when the user switches tabs or clicks on the page).
 *   - Proxies API requests from popup / content scripts using the saved
 *     API key. The API base URL is hardcoded to the production deployment.
 */

const API_BASE_URL = "https://slow-one.vercel.app";
const POPUP_URL = "popup.html";
const POPUP_WIDTH = 380;
const POPUP_HEIGHT = 560;

// Track the popup window ID so we can toggle it.
let popupWindowId = null;

async function findExistingPopup() {
  try {
    const wins = await chrome.windows.getAll({ populate: true });
    const popupUrl = chrome.runtime.getURL(POPUP_URL);
    for (const w of wins) {
      if (w.type === "popup" && (w.tabs || []).some((t) => t.url && t.url.startsWith(popupUrl))) {
        return w.id;
      }
    }
  } catch (e) {}
  return null;
}

async function toggleWindow() {
  // Sync the tracked ID with reality (extension may have been reloaded).
  if (popupWindowId != null) {
    try {
      const existing = await chrome.windows.get(popupWindowId);
      if (existing) {
        await chrome.windows.remove(popupWindowId);
        popupWindowId = null;
        return;
      }
    } catch (e) {
      popupWindowId = null;
    }
  }
  const found = await findExistingPopup();
  if (found != null) {
    await chrome.windows.remove(found);
    popupWindowId = null;
    return;
  }

  // Position near top-right of the primary display.
  let left = 100;
  let top = 100;
  try {
    const [current] = await chrome.windows.getAll({ windowTypes: ["normal"] });
    if (current) {
      left = Math.max(0, (current.left || 0) + (current.width || 1280) - POPUP_WIDTH - 20);
      top = Math.max(0, (current.top || 0) + 80);
    }
  } catch (e) {}

  const win = await chrome.windows.create({
    url: chrome.runtime.getURL(POPUP_URL),
    type: "popup",
    width: POPUP_WIDTH,
    height: POPUP_HEIGHT,
    focused: true,
    left,
    top,
  });
  popupWindowId = win.id;
}

chrome.action.onClicked.addListener(() => {
  toggleWindow();
});

chrome.windows.onRemoved.addListener((id) => {
  if (id === popupWindowId) popupWindowId = null;
});

chrome.runtime.onInstalled.addListener(() => {
  console.log("JobTrail AI installed. API base:", API_BASE_URL);
});

// Central API proxy — always uses the hardcoded base URL and stored key.
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg?.type === "JT_GET_CONFIG") {
    (async () => {
      const { apiKey } = await chrome.storage.local.get(["apiKey"]);
      sendResponse({ apiBaseUrl: API_BASE_URL, hasKey: !!apiKey, apiKey: apiKey || "" });
    })();
    return true;
  }
  if (msg?.type === "JT_API") {
    (async () => {
      const { apiKey } = await chrome.storage.local.get(["apiKey"]);
      if (!apiKey) return sendResponse({ ok: false, error: "Not configured" });
      try {
        const r = await fetch(API_BASE_URL + msg.path, {
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
    return true;
  }
});
