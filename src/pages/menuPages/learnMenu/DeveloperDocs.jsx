import React from "react";
import MainNavbar from "../../../components/dashboard/MainNavbar";

const sections = [
  {
    title: "Quick start",
    body:
      "The ZenisthAI API will launch shortly. You will be able to authenticate " +
      "with an API key, create tags, and submit documents for processing.",
  },
  {
    title: "Authentication",
    body:
      "When available, use Bearer authentication with your API key in the " +
      "Authorization header. Keys will be scoped to Translation, IDP, or both.",
  },
  {
    title: "Tags and schemas",
    body:
      "Tags define language pairs, tone, glossaries, output formats, and extraction fields. " +
      "They standardize repeated workflows and help teams collaborate.",
  },
  {
    title: "Async jobs",
    body:
      "Jobs will run in the background. You will be able to poll job endpoints " +
      "or subscribe to webhooks for completion events.",
  },
];

const resources = [
  {
    title: "API reference (coming soon)",
    detail: "Endpoints for Translation, IDP, jobs, and downloads.",
  },
  {
    title: "Webhooks (coming soon)",
    detail: "Receive job status and credit alerts in real time.",
  },
  {
    title: "SDKs (coming soon)",
    detail: "TypeScript and Python SDKs with helpers and retries.",
  },
  {
    title: "Changelog (coming soon)",
    detail: "Track API updates and new features.",
  },
];

const samples = [
  {
    label: "Translation request",
    code: `POST /v1/translation/jobs
Authorization: Bearer <API_KEY>

{
  "tagId": "tag_123",
  "documents": [
    { "fileName": "brochure.pdf", "fileUrl": "https://..." }
  ],
  "notify": { "webhookUrl": "https://..." }
}`,
  },
  {
    label: "IDP extraction request",
    code: `POST /v1/idp/jobs
Authorization: Bearer <API_KEY>

{
  "tagId": "tag_456",
  "documents": [
    { "fileName": "invoice.png", "fileUrl": "https://..." }
  ],
  "outputFormat": "json"
}`,
  },
];

export default function DeveloperDocs() {
  return (
    <>
      <MainNavbar />
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto w-full max-w-6xl px-6 py-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
              Developer docs
            </div>
            <h1 className="mt-4 text-3xl font-semibold">
              ZenisthAI Developer Docs
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-600">
              The ZenisthAI API has not launched yet. This page is a static
              preview, and the full documentation will be available shortly.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
              API launching shortly
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl px-6 py-10">
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold">Overview</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {sections.map((section) => (
                <div
                  key={section.title}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                >
                  <h3 className="text-sm font-semibold text-slate-900">
                    {section.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600">{section.body}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold">Resources</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {resources.map((resource) => (
                <div
                  key={resource.title}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="text-sm font-semibold text-slate-900">
                    {resource.title}
                  </div>
                  <p className="mt-2 text-sm text-slate-600">
                    {resource.detail}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-8 grid gap-6 md:grid-cols-2">
            {samples.map((sample) => (
              <div
                key={sample.label}
                className="rounded-2xl border border-slate-200 bg-white p-6"
              >
                <h2 className="text-lg font-semibold">
                  {sample.label} (preview)
                </h2>
                <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-700">
                  <pre className="whitespace-pre-wrap">{sample.code}</pre>
                </div>
              </div>
            ))}
          </section>
        </main>
      </div>
    </>
  );
}
