import { requireUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

const plans = [
  { name: "Free", price: 0, perks: ["25 autofills / month", "1 profile", "1 resume"], cta: "Current" },
  { name: "Pro", price: 14, perks: ["Unlimited autofills", "5 profiles", "AI cover letters", "ATS optimizer"], cta: "Upgrade" },
  { name: "Team", price: 29, perks: ["Everything in Pro", "Recruiter tools", "API keys", "Priority support"], cta: "Upgrade" },
];

export default async function BillingPage() {
  const user = (await requireUser())!;
  return (
    <div className="space-y-4 fade-up">
      <div>
        <h1 className="text-2xl font-bold">Billing</h1>
        <p className="text-slate-400 text-sm">Current plan: <span className="chip capitalize">{user.plan}</span></p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {plans.map((p) => {
          const current = user.plan === p.name.toLowerCase();
          return (
            <div key={p.name} className={`glass card ${current ? "ring-1 ring-violet-400/60" : ""}`}>
              <div className="text-lg font-semibold">{p.name}</div>
              <div className="text-3xl font-black mt-1">${p.price}<span className="text-sm font-normal text-slate-400">/mo</span></div>
              <ul className="mt-3 space-y-1 text-sm text-slate-300">
                {p.perks.map((x) => <li key={x}>✓ {x}</li>)}
              </ul>
              <button disabled={current} className={`mt-4 w-full ${current ? "btn-ghost" : "btn-primary"}`}>
                {current ? "Current plan" : p.cta}
              </button>
            </div>
          );
        })}
      </div>
      <div className="glass card">
        <div className="font-semibold mb-1">Payments</div>
        <p className="text-sm text-slate-400">Stripe/Razorpay integrations activate automatically when <code>STRIPE_SECRET_KEY</code> is configured in the environment.</p>
      </div>
    </div>
  );
}
