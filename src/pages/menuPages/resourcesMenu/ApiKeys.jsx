import React from "react";
import MainNavbar from "../../../components/dashboard/MainNavbar";

const featureCards = [
  {
    title: "Generate and manage keys",
    description:
      "Create multiple keys for teams, environments, and integrations. Revoke or rotate keys anytime.",
  },
  {
    title: "Set scopes per tool",
    description:
      "Limit access to Translation or IDP only. Choose output formats, field sets, and tag rules.",
  },
  {
    title: "Track usage and credits",
    description:
      "See per-key usage, remaining credits, and async job statuses for audits.",
  },
];

const steps = [
  {
    title: "Create a key",
    detail:
      "Generate a key and name it for the app or environment (e.g., staging, prod).",
  },
  {
    title: "Attach tags + scopes",
    detail:
      "Assign translation tags (source/target language, tone) or IDP tags (fields, formats).",
  },
  {
    title: "Send requests",
    detail:
      "Submit files, continue working, and receive webhooks when jobs are done.",
  },
  {
    title: "Download results",
    detail:
      "Fetch translated documents or structured outputs (JSON, CSV, XML).",
  },
];

const faqs = [
  {
    q: "When will API keys be available?",
    a: "We are finishing key management and usage reporting. Early access will open soon.",
  },
  {
    q: "Will keys share credits with the web app?",
    a: "Yes. API usage will draw from the same credit balance shown in your workspace.",
  },
  {
    q: "How do async jobs work?",
    a: "Large files process in the background. We will send webhooks and in-app alerts.",
  },
];

export default function ApiKeysPage() {
  return (
    <>
      <MainNavbar />
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-8 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                Coming soon
              </div>
              <h1 className="mt-3 text-3xl font-semibold">
                API Keys and Integrations
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-600">
                Integrate ZenisthAI into your own products with secure API keys,
                granular scopes, and usage controls. This page previews what
                will be available shortly.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                disabled
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-400"
              >
                Create API Key
              </button>
              <button
                type="button"
                disabled
                className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white opacity-40"
              >
                View Docs
              </button>
            </div>
          </div>
        </header>

        <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-10">
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-lg font-semibold">What you can expect</h2>
                <p className="mt-1 text-sm text-slate-600">
                  The API will mirror the workflow in the web app, including
                  tags, credits, and async notifications.
                </p>
              </div>
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-semibold text-amber-700">
                API access is not enabled yet
              </div>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {featureCards.map((card) => (
                <div
                  key={card.title}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                >
                  <h3 className="text-sm font-semibold text-slate-900">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600">
                    {card.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="grid gap-6 md:grid-cols-[1.3fr_0.7fr]">
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="text-lg font-semibold">How it works</h2>
              <p className="mt-1 text-sm text-slate-600">
                Keep the same tag-first flow you use today, now in your own
                apps.
              </p>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {steps.map((step, index) => (
                  <div
                    key={step.title}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="text-xs font-semibold uppercase tracking-wide text-indigo-500">
                      Step {index + 1}
                    </div>
                    <div className="mt-2 text-sm font-semibold text-slate-900">
                      {step.title}
                    </div>
                    <p className="mt-2 text-sm text-slate-600">{step.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="text-lg font-semibold">Planned limits</h2>
              <p className="mt-1 text-sm text-slate-600">
                We will publish final limits before launch.
              </p>
              <div className="mt-5 space-y-3 text-sm text-slate-700">
                <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <span>Max file size</span>
                  <span className="font-semibold">100 MB</span>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <span>Parallel jobs</span>
                  <span className="font-semibold">Up to 10</span>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <span>Webhook retries</span>
                  <span className="font-semibold">3 attempts</span>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <span>Key rotation</span>
                  <span className="font-semibold">Self-serve</span>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-lg font-semibold">Keys preview</h2>
                <p className="mt-1 text-sm text-slate-600">
                  Your keys will appear here with status, scopes, and usage.
                </p>
              </div>
              <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-1 text-xs font-semibold text-slate-500">
                0 active keys
              </div>
            </div>
            <div className="mt-5 space-y-3">
              {["Production", "Staging"].map((label) => (
                <div
                  key={label}
                  className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <div className="text-sm font-semibold text-slate-900">
                      {label} key
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      zk_live_••••••••••••••••••••••••••
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-600">
                    <span className="rounded-full border border-slate-200 bg-white px-3 py-1">
                      Translation
                    </span>
                    <span className="rounded-full border border-slate-200 bg-white px-3 py-1">
                      IDP
                    </span>
                    <span className="rounded-full border border-slate-200 bg-white px-3 py-1">
                      Read-only
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-slate-400">
                    Usage: -- credits
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="text-lg font-semibold">
                Security recommendations
              </h2>
              <ul className="mt-4 space-y-3 text-sm text-slate-600">
                <li>Store keys in a secrets manager, not in code.</li>
                <li>Rotate keys after team changes or credential exposure.</li>
                <li>Use separate keys for each environment.</li>
                <li>Restrict scopes based on tool and output format.</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="text-lg font-semibold">FAQ</h2>
              <div className="mt-4 space-y-4 text-sm text-slate-600">
                {faqs.map((item) => (
                  <div key={item.q}>
                    <div className="font-semibold text-slate-900">{item.q}</div>
                    <p className="mt-1">{item.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-indigo-200 bg-indigo-50 p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-indigo-900">
                  Want early access?
                </h2>
                <p className="mt-1 text-sm text-indigo-700">
                  Tell us your use case and expected volume. We will notify you
                  when the API is ready.
                </p>
              </div>
              <button
                type="button"
                disabled
                className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white opacity-50"
              >
                Request access
              </button>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
