import React from "react";
import MainNavbar from "../../../components/dashboard/MainNavbar";

const guides = [
  {
    title: "Getting started",
    description:
      "Learn the basics of creating tags, uploading documents, and running your first job.",
    items: [
      "Create a Translation or IDP tag",
      "Upload multiple documents",
      "Start processing and monitor status",
    ],
  },
  {
    title: "Translation guides",
    description:
      "Set language pairs, tone, and glossary preferences to control output quality.",
    items: [
      "Choose source and target languages",
      "Apply tone and glossary rules",
      "Download translated files",
    ],
  },
  {
    title: "IDP guides",
    description:
      "Extract structured data from invoices, PDFs, and images with field schemas.",
    items: [
      "Define fields to extract",
      "Pick output format (JSON/CSV/XML)",
      "Validate and export results",
    ],
  },
];

const quickLinks = [
  {
    label: "Create and manage tags",
    detail: "Standardize outputs with reusable tag presets.",
  },
  {
    label: "Credits and billing",
    detail: "Track usage, manage spend, and top up credits.",
  },
  {
    label: "Notifications",
    detail: "Get in-app alerts when jobs complete.",
  },
  {
    label: "Result downloads",
    detail: "Retrieve files, JSON, CSV, or XML outputs.",
  },
];

const faqs = [
  {
    q: "How do I rerun a job with the same settings?",
    a: "Reuse the same tag and upload new documents to repeat a workflow.",
  },
  {
    q: "Can I work on other tasks while processing?",
    a: "Yes. Jobs run asynchronously and you will be notified when they finish.",
  },
  {
    q: "Where are outputs stored?",
    a: "Outputs are saved in your workspace and available for download.",
  },
];

export default function UserGuidesPage() {
  return (
    <>
      <MainNavbar />
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto w-full max-w-6xl px-6 py-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
              User guides
            </div>
            <h1 className="mt-4 text-3xl font-semibold">
              ZenisthAI User Guides
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-600">
              Step-by-step guidance for Translation and IDP workflows, tags, and
              outputs. Use these guides to get results faster and keep your team
              consistent.
            </p>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl px-6 py-10">
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold">Featured guides</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {guides.map((guide) => (
                <div
                  key={guide.title}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                >
                  <h3 className="text-sm font-semibold text-slate-900">
                    {guide.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600">
                    {guide.description}
                  </p>
                  <ul className="mt-4 space-y-2 text-sm text-slate-600">
                    {guide.items.map((item) => (
                      <li key={item} className="flex gap-2">
                        <span className="mt-1 h-2 w-2 rounded-full bg-indigo-500" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold">Quick links</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {quickLinks.map((link) => (
                <div
                  key={link.label}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="text-sm font-semibold text-slate-900">
                    {link.label}
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{link.detail}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-8 grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="text-lg font-semibold">Recommended workflow</h2>
              <p className="mt-2 text-sm text-slate-600">
                Use tags to standardize translations and extractions across
                teams.
              </p>
              <ol className="mt-4 space-y-2 text-sm text-slate-600">
                {[
                  "Create a tag with the right rules",
                  "Upload documents in batches",
                  "Run jobs and track progress",
                  "Review outputs and download results",
                ].map((step) => (
                  <li key={step} className="flex gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-indigo-500" />
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
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
                  Contact support for onboarding, team training, or workflow
                  setup.
                </p>
              </div>
              <button
                type="button"
                disabled
                className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white opacity-50"
              >
                Contact support
              </button>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
