"use client";
import { useState } from "react";

export default function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <div className="fade-up">
      <h1 className="text-3xl font-bold">Contact us</h1>
      <p className="text-slate-400 mt-1">We reply within 24 hours on weekdays.</p>
      {sent ? (
        <div className="glass card mt-8 text-center">
          <div className="text-3xl">📬</div>
          <div className="mt-2 font-semibold">Thanks! We&apos;ll be in touch.</div>
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
          className="glass card mt-8 space-y-4"
        >
          <div>
            <label className="label">Name</label>
            <input className="input" required />
          </div>
          <div>
            <label className="label">Email</label>
            <input className="input" type="email" required />
          </div>
          <div>
            <label className="label">Message</label>
            <textarea className="input" rows={5} required />
          </div>
          <button className="btn-primary">Send message</button>
        </form>
      )}
    </div>
  );
}
