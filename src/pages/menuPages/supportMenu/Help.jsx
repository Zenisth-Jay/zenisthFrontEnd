import React from "react";
import MainNavbar from "../../../components/dashboard/MainNavbar";

const categories = [
  {
    title: "Getting started",
    description: "Set up your workspace, tags, and first jobs.",
  },
  {
    title: "Translation",
    description: "Language pairs, tone settings, and glossary tips.",
  },
  {
    title: "IDP",
    description: "Field schemas, output formats, and validation.",
  },
  {
    title: "Credits and billing",
    description: "Usage tracking, top-ups, and invoices.",
  },
  {
    title: "Security and privacy",
    description: "Data retention, encryption, and access control.",
  },
  {
    title: "Account and teams",
    description: "Users, roles, and workspace settings.",
  },
];

const topArticles = [
  "Create and manage tags",
  "Upload multiple documents in one job",
  "Configure Translation tone and glossary",
  "Extract fields to JSON/CSV/XML",
  "Track credits and download results",
];

const faqs = [
  {
    q: "How do I know when a job is finished?",
    a: "Jobs run asynchronously. You will receive an in-app notification when complete.",
  },
  {
    q: "Can I reuse the same tag across teams?",
    a: "Yes, tags can be reused and shared to standardize workflows.",
  },
  {
    q: "Where can I download outputs?",
    a: "Outputs are available in your workspace and can be downloaded anytime.",
  },
];

export default function Help() {
  return (
    <>
      <MainNavbar />
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto w-full max-w-6xl px-6 py-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
              Help center
            </div>
            <h1 className="mt-4 text-3xl font-semibold">
              ZenisthAI Help Center
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-600">
              Find answers, explore guides, and get support for Translation and
              IDP workflows.
            </p>
            <div className="mt-6"></div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl px-6 py-10">
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold">Help</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {categories.map((category) => (
                <div
                  key={category.title}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="text-sm font-semibold text-slate-900">
                    {category.title}
                  </div>
                  <p className="mt-2 text-sm text-slate-600">
                    {category.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-8 grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="text-lg font-semibold">Top articles</h2>
              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                {topArticles.map((article) => (
                  <li key={article} className="flex gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-indigo-500" />
                    <span>{article}</span>
                  </li>
                ))}
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

          <section className="mt-8 rounded-2xl border border-indigo-200 bg-indigo-50 p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-indigo-900">
                  Need help?
                </h2>
                <p className="mt-1 text-sm text-indigo-700">
                  For any support or questions, mail us at{" "}
                  <span className="font-semibold text-indigo-900">
                    support@zesnith.ai
                  </span>
                </p>
              </div>

              <div className="text-sm font-medium text-indigo-800">
                Mail us here:{" "}
                <span className="font-semibold text-indigo-900">
                  support@zesnith.ai
                </span>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
