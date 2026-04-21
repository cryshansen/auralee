import { useMemo, useState } from "react";
import AuthBackground from "../components/elements/AuthBackground";
import { apiUrl } from "../../../config/api";

const endpointGroups = [
  {
    title: "Auth - UserController",
    endpoints: [
      { method: "POST", path: "/api/users/signup", auth: "Public" },
      { method: "POST", path: "/api/users/login", auth: "Public" },
      { method: "POST", path: "/api/users/login/verify-mfa", auth: "Public" },
      { method: "GET", path: "/api/users/verify-email?email=&token=", auth: "Public" },
      { method: "GET", path: "/api/users/me", auth: "USER/ADMIN/PARTNER" },
      { method: "PUT", path: "/api/users/{id}", auth: "Authenticated" },
      { method: "POST", path: "/api/users/reset-password/request", auth: "Public" },
      { method: "PUT", path: "/api/users/reset-password/confirm", auth: "Public" },
      { method: "POST", path: "/api/users/mfa/enable", auth: "Authenticated" },
      { method: "POST", path: "/api/users/mfa/disable", auth: "Authenticated" },
    ],
  },
  {
    title: "Admin Dashboard",
    endpoints: [
      { method: "GET", path: "/api/admin/tenant/branding", auth: "ADMIN/PARTNER" },
      { method: "PUT", path: "/api/admin/tenant/branding", auth: "ADMIN/PARTNER" },
      { method: "GET", path: "/api/admin/tenant/email-templates/welcome", auth: "ADMIN/PARTNER" },
      { method: "PUT", path: "/api/admin/tenant/email-templates/welcome", auth: "ADMIN/PARTNER" },
      { method: "POST", path: "/api/admin/tenant/email-templates/welcome/preview", auth: "ADMIN/PARTNER" },
      { method: "GET", path: "/api/admin/tenant/landing/draft", auth: "ADMIN/PARTNER" },
      { method: "PUT", path: "/api/admin/tenant/landing/draft", auth: "ADMIN/PARTNER" },
      { method: "POST", path: "/api/admin/tenant/landing/publish", auth: "ADMIN/PARTNER" },
      { method: "GET", path: "/api/admin/tenant/ops/backup", auth: "ADMIN/PARTNER" },
      { method: "POST", path: "/api/admin/tenant/ops/restore", auth: "ADMIN/PARTNER" },
      { method: "GET", path: "/api/admin/tenant/marketing-config", auth: "ADMIN/PARTNER" },
      { method: "PUT", path: "/api/admin/tenant/marketing-config", auth: "ADMIN/PARTNER" },
      { method: "GET", path: "/api/admin/tenant/brand-assets", auth: "ADMIN/PARTNER" },
      { method: "POST", path: "/api/admin/tenant/brand-assets", auth: "ADMIN/PARTNER" },
      { method: "DELETE", path: "/api/admin/tenant/brand-assets/{assetType}", auth: "ADMIN/PARTNER" },
      { method: "GET", path: "/api/admin/tenants/status", auth: "ADMIN/PARTNER" },
      { method: "POST", path: "/api/admin/tenants/reload", auth: "ADMIN/PARTNER" },
      { method: "GET", path: "/api/admin/tenants/features/{feature}", auth: "ADMIN/PARTNER" },
      { method: "POST", path: "/api/admin/tokens/generate-permanent", auth: "ADMIN" },
      { method: "POST", path: "/api/clients/admin/register", auth: "ADMIN" },
      { method: "POST", path: "/api/clients/token", auth: "PARTNER/ADMIN" },
    ],
  },
  {
    title: "Core Feature APIs",
    endpoints: [
      { method: "POST", path: "/api/resources", auth: "ADMIN" },
      { method: "GET", path: "/api/resources", auth: "Public" },
      { method: "GET", path: "/api/resources/types", auth: "Public" },
      { method: "PATCH", path: "/api/resources/{id}", auth: "ADMIN" },
      { method: "DELETE", path: "/api/resources/{id}", auth: "ADMIN" },
      { method: "GET", path: "/api/resources/available", auth: "Public" },
      { method: "GET", path: "/api/resources/schedule", auth: "Public" },
      { method: "GET", path: "/api/growth/risk/{appointmentId}", auth: "Role-gated" },
      { method: "GET", path: "/api/growth/leak-report", auth: "Role-gated" },
      { method: "GET", path: "/api/growth/stats", auth: "Role-gated" },
      { method: "GET", path: "/api/growth/marketing-stats", auth: "Role-gated" },
      { method: "GET", path: "/api/growth/advocate", auth: "Role-gated" },
      { method: "POST", path: "/api/discovery/submit", auth: "Public" },
      { method: "GET", path: "/api/discovery/verify/{token}", auth: "Public" },
      { method: "GET", path: "/api/discovery/admin/briefs", auth: "ADMIN" },
      { method: "PATCH", path: "/api/discovery/admin/briefs/{id}/approve", auth: "ADMIN" },
      { method: "PATCH", path: "/api/discovery/admin/briefs/{id}/reject", auth: "ADMIN" },
    ],
  },
];

const starterBodies = {
  "/api/users/signup": {
    firstname: "Demo",
    lastName: "User",
    email: "demo@example.com",
    password: "TestPass123!",
  },
  "/api/users/login": {
    email: "demo@example.com",
    password: "TestPass123!",
  },
  "/api/users/reset-password/request": {
    email: "demo@example.com",
  },
  "/api/users/reset-password/confirm": {
    email: "demo@example.com",
    password: "NewPass123!",
    token: "paste-reset-token",
  },
  "/api/discovery/submit": {
    name: "Demo Prospect",
    email: "prospect@example.com",
    interest: "Massage + discovery package",
  },
};

export default function ApiReviewPage({ darkMode }) {
  const [method, setMethod] = useState("GET");
  const [path, setPath] = useState("/api/users/me");
  const [bodyText, setBodyText] = useState("{}");
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(null);

  const endpointCount = useMemo(
    () => endpointGroups.reduce((sum, group) => sum + group.endpoints.length, 0),
    []
  );

  const chooseEndpoint = (nextMethod, nextPath) => {
    const cleanPath = nextPath.includes("{") ? nextPath : nextPath;
    setMethod(nextMethod);
    setPath(cleanPath);

    const starter = starterBodies[nextPath];
    if (starter) {
      setBodyText(JSON.stringify(starter, null, 2));
    } else if (nextMethod === "GET") {
      setBodyText("{}");
    }
  };

  const runRequest = async () => {
    setRunning(true);
    setResult(null);

    try {
      const jwtToken = localStorage.getItem("bookit_jwt");
      const url = apiUrl(path);
      const headers = {
        "Content-Type": "application/json",
      };

      if (jwtToken) {
        headers.Authorization = `Bearer ${jwtToken}`;
      }

      const init = {
        method,
        headers,
      };

      if (method !== "GET" && method !== "HEAD") {
        init.body = bodyText || "{}";
      }

      const response = await fetch(url, init);
      const raw = await response.text();
      let parsed = raw;

      try {
        parsed = raw ? JSON.parse(raw) : {};
      } catch {
        // Keep plain text if response body is not JSON.
      }

      setResult({
        ok: response.ok,
        status: response.status,
        statusText: response.statusText,
        data: parsed,
      });

      const loginToken = parsed?.token || parsed?.jwt || parsed?.accessToken;
      if (loginToken && path === "/api/users/login") {
        localStorage.setItem("bookit_jwt", loginToken);
      }
    } catch (error) {
      setResult({
        ok: false,
        status: 0,
        statusText: "Request Failed",
        data: String(error?.message || error),
      });
    } finally {
      setRunning(false);
    }
  };

  return (
    <AuthBackground darkMode={darkMode}>
      <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8">
        <div className="rounded-lg border border-slate-300 bg-white/90 p-6">
          <h1 className="text-2xl font-bold text-slate-800">API Review Console</h1>
          <p className="mt-2 text-sm text-slate-600">
            Validate Java endpoints from the SPA via Vite proxy and optional JWT bearer auth.
          </p>
          <p className="mt-1 text-xs text-slate-500">Loaded endpoints: {endpointCount}</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4 rounded-lg border border-slate-300 bg-white/90 p-4">
            {endpointGroups.map((group) => (
              <div key={group.title}>
                <h2 className="mb-2 text-sm font-semibold text-slate-800">{group.title}</h2>
                <div className="space-y-2">
                  {group.endpoints.map((ep) => (
                    <button
                      key={`${ep.method}-${ep.path}`}
                      type="button"
                      onClick={() => chooseEndpoint(ep.method, ep.path)}
                      className="flex w-full items-center justify-between rounded border border-slate-200 px-3 py-2 text-left text-xs hover:bg-slate-50"
                    >
                      <span className="font-mono text-slate-800">{ep.method} {ep.path}</span>
                      <span className="text-slate-500">{ep.auth}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4 rounded-lg border border-slate-300 bg-white/90 p-4">
            <div className="grid grid-cols-4 gap-2">
              <select
                className="col-span-1 rounded border border-slate-300 px-2 py-2 text-sm"
                value={method}
                onChange={(e) => setMethod(e.target.value)}
              >
                <option>GET</option>
                <option>POST</option>
                <option>PUT</option>
                <option>PATCH</option>
                <option>DELETE</option>
              </select>
              <input
                className="col-span-3 rounded border border-slate-300 px-2 py-2 font-mono text-sm"
                value={path}
                onChange={(e) => setPath(e.target.value)}
                placeholder="/api/users/me"
              />
            </div>

            <textarea
              className="h-52 w-full rounded border border-slate-300 p-3 font-mono text-xs"
              value={bodyText}
              onChange={(e) => setBodyText(e.target.value)}
              placeholder='{"key":"value"}'
            />

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={runRequest}
                disabled={running}
                className="rounded bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-600 disabled:opacity-60"
              >
                {running ? "Running..." : "Send Request"}
              </button>
              <button
                type="button"
                onClick={() => {
                  localStorage.removeItem("bookit_jwt");
                }}
                className="rounded border border-slate-400 px-4 py-2 text-sm text-slate-700"
              >
                Clear JWT
              </button>
            </div>

            <div className="rounded border border-slate-200 bg-slate-50 p-3">
              <div className="text-xs text-slate-600">Response</div>
              {result ? (
                <>
                  <div className={`mt-1 text-sm font-semibold ${result.ok ? "text-green-700" : "text-red-700"}`}>
                    {result.status} {result.statusText}
                  </div>
                  <pre className="mt-2 max-h-64 overflow-auto rounded bg-white p-2 text-xs text-slate-800">
                    {typeof result.data === "string" ? result.data : JSON.stringify(result.data, null, 2)}
                  </pre>
                </>
              ) : (
                <div className="mt-1 text-sm text-slate-500">No request sent yet.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AuthBackground>
  );
}
