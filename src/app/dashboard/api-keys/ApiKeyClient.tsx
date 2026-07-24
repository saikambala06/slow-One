"use client";
import { useState } from "react";

export default function ApiKeyClient({ apiKey }: { apiKey: string }) {
  const [copied, setCopied] = useState(false);
  const [visible, setVisible] = useState(false);
  const shown = visible ? apiKey : apiKey.slice(0, 6) + "•".repeat(Math.max(0, apiKey.length - 10)) + apiKey.slice(-4);

  return (
    <div className="glass card">
      <div className="font-semibold">Your API key</div>
      <div className="mt-2 flex gap-2">
        <code className="input font-mono text-xs flex-1">{shown}</code>
        <button className="btn-ghost text-xs" onClick={() => setVisible((v) => !v)}>{visible ? "Hide" : "Show"}</button>
        <button
          className="btn-primary text-xs"
          onClick={async () => {
            await navigator.clipboard.writeText(apiKey);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <p className="text-xs text-slate-400 mt-3">Keep this secret. Rotate by contacting support (rotation UI ships in Team plan).</p>
    </div>
  );
}
