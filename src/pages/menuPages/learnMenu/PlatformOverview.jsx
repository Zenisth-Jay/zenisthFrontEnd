import React from "react";
import MainNavbar from "../../../components/dashboard/MainNavbar";

const pillars = [
  {
    title: "Translation",
    description:
      "Translate documents with tags for source/target language, tone, and glossary control.",
  },
  {
    title: "IDP",
    description:
      "Extract structured data from invoices, PDFs, or images into JSON, CSV, or XML.",
  },
  {
    title: "Tags + workflows",
    description:
      "Reuse tags to standardize outputs, enforce field schemas, and speed up repeat jobs.",
  },
];

const capabilities = [
  {
    title: "Multi-file uploads",
    detail: "Upload batches of documents in a single job.",
  },
  {
    title: "Async processing",
    detail: "Start jobs and keep working; we notify you when done.",
  },
  {
    title: "Credit visibility",
    detail: "Track usage per job and manage spend across teams.",
  },
  {
    title: "Output control",
    detail: "Choose formats, fields, and delivery options per tag.",
  },
  {
    title: "Quality review",
    detail: "Preview results and download outputs with confidence.",
  },
  {
    title: "Security by design",
    detail: "Encryption, access controls, and audit-friendly logs.",
  },
];

const workflows = [
  {
    title: "Translation workflow",
    steps: [
      "Upload documents and select a Translation tag.",
      "Confirm source/target languages, tone, and glossary.",
      "Start the job and track progress.",
      "Download translated files when complete.",
    ],
  },
  {
    title: "IDP workflow",
    steps: [
      "Upload invoices, PDFs, or images.",
      "Apply an IDP tag for fields and output format.",
      "Start extraction and monitor status.",
      "Download JSON, CSV, or XML outputs.",
    ],
  },
];

export default function PlatformOverviewPage() {
  return (
    <>
      <MainNavbar />

      <div className="min-h-screen bg-slate-50 text-slate-900">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto w-full max-w-6xl px-6 py-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
              Platform overview
            </div>
            <h1 className="mt-4 text-3xl font-semibold">
              ZenisthAI Platform Overview
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-600">
              ZenisthAI helps teams translate content and extract structured
              data from documents with a consistent tag-first workflow. Upload
              multiple files, apply tags for rules, and deliver results in the
              formats you need.
            </p>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl px-6 py-10">
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold">Core pillars</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {pillars.map((pillar) => (
                <div
                  key={pillar.title}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                >
                  <h3 className="text-sm font-semibold text-slate-900">
                    {pillar.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600">
                    {pillar.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold">Capabilities</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {capabilities.map((capability) => (
                <div
                  key={capability.title}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="text-sm font-semibold text-slate-900">
                    {capability.title}
                  </div>
                  <p className="mt-2 text-sm text-slate-600">
                    {capability.detail}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-8 grid gap-6 md:grid-cols-2">
            {workflows.map((workflow) => (
              <div
                key={workflow.title}
                className="rounded-2xl border border-slate-200 bg-white p-6"
              >
                <h2 className="text-lg font-semibold">{workflow.title}</h2>
                <ol className="mt-4 space-y-2 text-sm text-slate-600">
                  {workflow.steps.map((step) => (
                    <li key={step} className="flex gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-indigo-500" />
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </section>

          <section className="mt-8 rounded-2xl border border-indigo-200 bg-indigo-50 p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-indigo-900">
                  Ready to explore?
                </h2>
                <p className="mt-1 text-sm text-indigo-700">
                  Create tags, upload documents, and start your first jobs in
                  minutes.
                </p>
              </div>
              <button
                type="button"
                disabled
                className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white opacity-50"
              >
                Get started
              </button>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
