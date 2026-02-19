import React from "react";
import MainNavbar from "../../../components/dashboard/MainNavbar";

const channels = [
  {
    title: "Email support",
    description: "Get help with billing, access, or general questions.",
    detail: "support@zenisthai.com",
  },
  {
    title: "Live chat",
    description: "Chat with our team during business hours.",
    detail: "Mon–Fri, 9:00 AM–6:00 PM (UTC)",
  },
  {
    title: "Priority support",
    description: "Dedicated response for enterprise teams.",
    detail: "Available with enterprise plans",
  },
];

const topics = [
  "Translation job issues",
  "IDP extraction accuracy",
  "Tag configuration",
  "Credits and billing",
  "Account access",
  "Security and compliance",
];

export default function ContactSupport() {
  return (
    <>
      <MainNavbar />
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto w-full max-w-6xl px-6 py-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
              Contact support
            </div>
            <h1 className="mt-4 text-3xl font-semibold">
              Contact ZenisthAI Support
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-600">
              Reach our team for help with Translation, IDP, or account
              questions. We respond as quickly as possible based on your plan.
            </p>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl px-6 py-10">
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold">Support channels</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {channels.map((channel) => (
                <div
                  key={channel.title}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="text-sm font-semibold text-slate-900">
                    {channel.title}
                  </div>
                  <p className="mt-2 text-sm text-slate-600">
                    {channel.description}
                  </p>
                  <div className="mt-3 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                    {channel.detail}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-8 grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="text-lg font-semibold">Submit a request</h2>
              <p className="mt-2 text-sm text-slate-600">
                Share as much detail as possible so we can help quickly.
              </p>
              <div className="mt-4 grid gap-3 text-sm text-slate-600">
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                  Full name
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                  Work email
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                  Topic
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-6">
                  Describe your issue
                </div>
                <button
                  type="button"
                  disabled
                  className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white opacity-50"
                >
                  Submit request
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="text-lg font-semibold">Popular topics</h2>
              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                {topics.map((topic) => (
                  <li key={topic} className="flex gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-indigo-500" />
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
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
