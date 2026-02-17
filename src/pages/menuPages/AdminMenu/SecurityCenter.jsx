import React from "react";
import MainNavbar from "../../../components/dashboard/MainNavbar";

const highlights = [
  {
    title: "Encryption",
    description:
      "Data is encrypted in transit and at rest using industry standards.",
  },
  {
    title: "Access controls",
    description: "Role-based access and audit logs keep activity transparent.",
  },
  {
    title: "Compliance-ready",
    description: "Security practices built for enterprise and regulated teams.",
  },
];

const practices = [
  "Secure file uploads with scoped access",
  "Background processing with isolated jobs",
  "Monitoring and alerting for critical events",
  "Regular security reviews and testing",
  "Team-based permissions and activity logs",
];

const faqs = [
  {
    q: "How long do you keep uploaded documents?",
    a: "The standard retention period for uploaded documents is 7 days.",
  },
  {
    q: "Can we request shorter or longer retention?",
    a: "Yes. Retention settings can be adjusted for enterprise plans.",
  },
  {
    q: "Where is data stored?",
    a: "Data is stored with trusted cloud providers in secure regions.",
  },
];

export default function SecurityCenter() {
  return (
    <>
      <MainNavbar />
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto w-full max-w-6xl px-6 py-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
              Security center
            </div>
            <h1 className="mt-4 text-3xl font-semibold">
              ZenisthAI Security Center
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-600">
              Learn how ZenisthAI protects your data across Translation and IDP
              workflows, including uploads, tags, and outputs.
            </p>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl px-6 py-10">
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold">Security highlights</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {highlights.map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="text-sm font-semibold text-slate-900">
                    {item.title}
                  </div>
                  <p className="mt-2 text-sm text-slate-600">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-8 grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="text-lg font-semibold">Data retention</h2>
              <p className="mt-2 text-sm text-slate-600">
                The standard retention period for uploaded documents is{" "}
                <span className="font-semibold text-slate-900">7 days</span>.
                You can request customized retention settings for enterprise
                plans.
              </p>
              <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-semibold text-amber-700">
                Default retention: 7 days
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="text-lg font-semibold">Security practices</h2>
              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                {practices.map((practice) => (
                  <li key={practice} className="flex gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-indigo-500" />
                    <span>{practice}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold">FAQ</h2>
            <div className="mt-4 space-y-4 text-sm text-slate-600">
              {faqs.map((item) => (
                <div key={item.q}>
                  <div className="font-semibold text-slate-900">{item.q}</div>
                  <p className="mt-1">{item.a}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-8 rounded-2xl border border-indigo-200 bg-indigo-50 p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-indigo-900">
                  Security questions?
                </h2>
                <p className="mt-1 text-sm text-indigo-700">
                  Contact our security team for questionnaires or audits.
                </p>
              </div>
              <button
                type="button"
                disabled
                className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white opacity-50"
              >
                Contact security
              </button>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
