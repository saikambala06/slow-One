/* eslint-disable */
/**
 * JobTrail AI content script.
 *
 * Detects form fields on any page (LinkedIn, Greenhouse, Lever, Workday, Ashby,
 * iCIMS, Taleo, custom portals) and can autofill them by asking the AI backend.
 *
 * Supports:
 *   - <input type=text|email|tel|url|number|date>
 *   - <textarea>
 *   - <select> and searchable selects (via label lookup)
 *   - Radio & checkbox groups
 *   - React/Vue/Angular controlled inputs (dispatches input+change events)
 */

(function () {
  const SELECTORS = [
    'input:not([type="hidden"]):not([type="submit"]):not([type="button"]):not([type="file"])',
    "textarea",
    "select",
  ].join(",");

  function labelFor(el) {
    // Try aria-label, placeholder, associated <label>, nearest label text.
    const aria = el.getAttribute("aria-label") || el.getAttribute("aria-labelledby");
    if (aria && aria.trim()) return aria.trim();
    if (el.id) {
      const l = document.querySelector(`label[for="${CSS.escape(el.id)}"]`);
      if (l?.textContent) return l.textContent.trim();
    }
    const parentLabel = el.closest("label");
    if (parentLabel?.textContent) return parentLabel.textContent.trim();
    // Look for a preceding sibling with text (common in Workday/Greenhouse)
    let sib = el.parentElement;
    for (let i = 0; sib && i < 3; i++) {
      const t = sib.querySelector("label, legend, .label, [class*='label']");
      if (t?.textContent?.trim()) return t.textContent.trim();
      sib = sib.parentElement;
    }
    if (el.placeholder) return el.placeholder;
    if (el.name) return el.name.replace(/[_-]+/g, " ");
    return "";
  }

  function collectFields() {
    const nodes = Array.from(document.querySelectorAll(SELECTORS));
    const seen = new Set();
    const fields = [];
    for (const n of nodes) {
      if (n.offsetParent === null && n.type !== "hidden") continue;
      const q = labelFor(n);
      if (!q) continue;
      const key = q.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      fields.push({ el: n, question: q, type: n.tagName.toLowerCase(), inputType: n.type || "" });
    }
    return fields;
  }

  function fillInput(el, value) {
    const proto = Object.getPrototypeOf(el);
    const setter = Object.getOwnPropertyDescriptor(proto, "value")?.set;
    setter ? setter.call(el, value) : (el.value = value);
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
    el.dispatchEvent(new Event("blur", { bubbles: true }));
  }

  function fillSelect(el, value) {
    const v = String(value).toLowerCase();
    const opt = Array.from(el.options).find(
      (o) => o.value.toLowerCase() === v || o.text.toLowerCase().includes(v),
    );
    if (opt) {
      el.value = opt.value;
      el.dispatchEvent(new Event("change", { bubbles: true }));
      return true;
    }
    return false;
  }

  function fillOne(field, answer) {
    if (!answer) return false;
    try {
      if (field.type === "select") return fillSelect(field.el, answer);
      if (field.inputType === "checkbox") {
        const truthy = /^(yes|true|1|on)$/i.test(String(answer));
        if (field.el.checked !== truthy) field.el.click();
        return true;
      }
      if (field.inputType === "radio") {
        const name = field.el.name;
        const group = document.querySelectorAll(`input[type="radio"][name="${CSS.escape(name)}"]`);
        const match = Array.from(group).find((r) => {
          const l = labelFor(r);
          return l && l.toLowerCase().includes(String(answer).toLowerCase());
        });
        if (match) {
          match.click();
          return true;
        }
        return false;
      }
      fillInput(field.el, answer);
      return true;
    } catch (e) {
      console.warn("JT fill error", e);
      return false;
    }
  }

  function highlight(field, ok) {
    field.el.style.transition = "box-shadow 0.3s";
    field.el.style.boxShadow = ok
      ? "0 0 0 3px rgba(52,211,153,0.55)"
      : "0 0 0 3px rgba(251,113,133,0.55)";
    setTimeout(() => (field.el.style.boxShadow = ""), 1400);
  }

  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg?.type === "JT_SCAN") {
      const fields = collectFields();
      sendResponse({ count: fields.length, questions: fields.map((f) => f.question) });
      return true;
    }
    if (msg?.type === "JT_AUTOFILL") {
      (async () => {
        const fields = collectFields();
        if (!fields.length) return sendResponse({ filled: 0, total: 0 });
        const resp = await chrome.runtime.sendMessage({
          type: "JT_API",
          path: "/api/ai/autofill",
          body: { questions: fields.map((f) => f.question), domain: location.hostname },
        });
        if (!resp?.ok) return sendResponse({ filled: 0, total: fields.length, error: resp?.error || "API error" });
        const suggestions = resp.data?.suggestions || [];
        let filled = 0;
        suggestions.forEach((s, i) => {
          const f = fields[i];
          if (!f || !s.answer || s.confidence < 60) return;
          const ok = fillOne(f, s.answer);
          if (ok) filled++;
          highlight(f, ok);
        });
        sendResponse({ filled, total: fields.length });
      })();
      return true;
    }
  });
})();
