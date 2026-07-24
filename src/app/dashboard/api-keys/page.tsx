import { requireUser } from "@/lib/auth";
import ApiKeyClient from "./ApiKeyClient";

export const dynamic = "force-dynamic";

export default async function Page() {
  const user = (await requireUser())!;
  return (
    <div className="space-y-4 fade-up">
      <div>
        <h1 className="text-2xl font-bold">API keys</h1>
        <p className="text-slate-400 text-sm">Use your API key to authenticate the browser extension and third-party integrations.</p>
      </div>
      <ApiKeyClient apiKey={user.apiKey ?? ""} />
      <div className="glass card">
        <div className="font-semibold mb-2">Example: call the autofill endpoint</div>
        <pre className="text-xs overflow-auto">{`curl -X POST ${"$"}HOST/api/ai/autofill \\
  -H "x-api-key: ${user.apiKey}" \\
  -H "content-type: application/json" \\
  -d '{"questions":["Full name","Are you authorized to work?"]}'`}</pre>
      </div>
    </div>
  );
}
