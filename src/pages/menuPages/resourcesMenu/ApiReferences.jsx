import React from "react";
import MainNavbar from "../../../components/dashboard/MainNavbar";

const endpoints = [
  {
    method: "POST",
    path: "/v1/translation/jobs",
    title: "Create translation job",
    description:
      "Submit one or more documents with tag configuration to start translation.",
  },
  {
    method: "POST",
    path: "/v1/idp/jobs",
    title: "Create IDP extraction job",
    description:
      "Upload invoices, images, or PDFs and extract structured output.",
  },
  {
    method: "GET",
    path: "/v1/jobs/{jobId}",
    title: "Get job status",
    description:
      "Check progress, credits used, and completion state for any job.",
  },
  {
    method: "GET",
    path: "/v1/jobs/{jobId}/download",
    title: "Download results",
    description: "Retrieve translated files or extracted JSON/CSV/XML outputs.",
  },
];

const quickSteps = [
  "Create an API key with Translation or IDP scope.",
  "Attach tags for language, tone, or extraction fields.",
  "Upload documents and receive a jobId.",
  "Poll status or wait for webhook callback.",
  "Download results when the job completes.",
];

const webhooks = [
  {
    event: "job.completed",
    detail:
      "Fires when translation or extraction finishes successfully and results are ready.",
  },
  {
    event: "job.failed",
    detail:
      "Fires when a job fails due to validation, parsing, or system errors.",
  },
  {
    event: "credits.low",
    detail:
      "Fires when remaining credits drop below your configured threshold.",
  },
];

export default function ApiReferences() {
  return (
    <>
      <MainNavbar />
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto w-full max-w-5xl px-6 py-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
              API Reference
            </div>
            <h1 className="mt-4 text-3xl font-semibold">
              ZenisthAI API Reference
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Explore endpoints for Translation and IDP. This is a static
              preview while we finalize public API documentation.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-xs font-semibold text-slate-600">
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1">
                Base URL: api.zenisthai.com
              </span>
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1">
                Auth: Bearer API key
              </span>
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1">
                Version: v1
              </span>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-5xl px-6 py-10">
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold">Getting started</h2>
            <p className="mt-2 text-sm text-slate-600">
              Use the same tag-first flow as the web app. Keys and tags define
              permissions, formats, and fields for each job.
            </p>
            <ol className="mt-4 space-y-2 text-sm text-slate-600">
              {quickSteps.map((step) => (
                <li key={step} className="flex gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-indigo-500" />
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </section>

          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Endpoints</h2>
              <div className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                Preview
              </div>
            </div>
            <div className="mt-4 space-y-4">
              {endpoints.map((endpoint) => (
                <div
                  key={endpoint.path}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-600">
                    <span className="rounded-full bg-indigo-600 px-2 py-1 text-white">
                      {endpoint.method}
                    </span>
                    <span className="rounded-full border border-slate-200 bg-white px-2 py-1">
                      {endpoint.path}
                    </span>
                  </div>
                  <div className="mt-3 text-sm font-semibold text-slate-900">
                    {endpoint.title}
                  </div>
                  <p className="mt-1 text-sm text-slate-600">
                    {endpoint.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="text-lg font-semibold">Sample request</h2>
              <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-700">
                <div className="font-semibold text-slate-900">
                  POST /v1/translation/jobs
                </div>
                <pre className="mt-3 whitespace-pre-wrap text-xs text-slate-600">
                  {`{
  "tagId": "tag_123",
  "sourceLanguage": "he",
  "targetLanguage": "en",
  "documents": [
    { "fileName": "contract.pdf", "fileUrl": "https://..." }
  ],
  "notify": { "webhookUrl": "https://..." }
}`}
                </pre>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="text-lg font-semibold">Webhooks</h2>
              <p className="mt-2 text-sm text-slate-600">
                Receive updates without polling.
              </p>
              <div className="mt-4 space-y-3">
                {webhooks.map((hook) => (
                  <div
                    key={hook.event}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
                  >
                    <div className="text-xs font-semibold text-indigo-600">
                      {hook.event}
                    </div>
                    <div className="mt-1 text-sm text-slate-600">
                      {hook.detail}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
