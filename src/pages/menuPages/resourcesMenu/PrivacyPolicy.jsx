import React from "react";
import MainNavbar from "../../../components/dashboard/MainNavbar";

const sections = [
  {
    title: "Overview",
    body:
      "ZenisthAI provides AI tools for Translation and Intelligent Document Processing (IDP). " +
      "This Privacy Policy explains how we collect, use, share, and protect your information " +
      "when you use our web app, APIs, and related services.",
  },
  {
    title: "Information we collect",
    body:
      "We collect account details (name, email, organization), billing information, " +
      "usage data (features used, credits consumed, job status), and uploaded content " +
      "(documents, images, PDFs) needed to perform Translation or IDP.",
  },
  {
    title: "How we use information",
    body:
      "We use your information to provide and improve services, process translations " +
      "and document extractions, manage credits and subscriptions, troubleshoot issues, " +
      "and communicate product updates and security notices.",
  },
  {
    title: "Uploaded files and outputs",
    body:
      "Files you upload are processed to generate outputs such as translated documents, " +
      "JSON, CSV, or XML. We store files and outputs only as long as necessary to provide " +
      "the service or as configured by your retention settings.",
  },
  {
    title: "Tags and metadata",
    body:
      "Tags may include language pairs, tone, glossary selections, output formats, " +
      "field definitions, and extraction rules. We use these tags to execute your jobs " +
      "and improve workflow organization.",
  },
  {
    title: "AI model usage",
    body:
      "We use AI models to perform Translation and IDP tasks. We do not use your uploaded " +
      "content to train public models without your explicit permission.",
  },
  {
    title: "Sharing and disclosure",
    body:
      "We may share information with trusted service providers (e.g., hosting, storage, " +
      "payment processing) under strict confidentiality agreements. We do not sell your " +
      "personal information.",
  },
  {
    title: "Security",
    body:
      "We use industry-standard safeguards, including encryption in transit and at rest, " +
      "access controls, and audit logging to protect your data.",
  },
  {
    title: "Your choices",
    body:
      "You can access, update, or delete your account information, manage retention settings, " +
      "and request data export. Contact support for assistance.",
  },
  {
    title: "International transfers",
    body:
      "If you access ZenisthAI from outside your region, your information may be processed " +
      "in regions where we or our service providers operate.",
  },
  {
    title: "Changes to this policy",
    body:
      "We may update this policy as our services evolve. We will post updates here and " +
      "notify you of material changes.",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <MainNavbar />
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto w-full max-w-4xl px-6 py-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
              Privacy Policy
            </div>
            <h1 className="mt-4 text-3xl font-semibold">
              ZenisthAI Privacy Policy
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Effective date: Feb 15, 2026
            </p>
            <p className="mt-4 text-sm text-slate-600">
              This policy describes how ZenisthAI handles information when you
              use our Translation and IDP tools, including file uploads, tags,
              and outputs.
            </p>
          </div>
        </header>

        <main className="mx-auto w-full max-w-4xl px-6 py-10">
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="grid gap-6">
              {sections.map((section) => (
                <div key={section.title}>
                  <h2 className="text-lg font-semibold text-slate-900">
                    {section.title}
                  </h2>
                  <p className="mt-2 text-sm text-slate-600">{section.body}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-8 rounded-2xl border border-indigo-200 bg-indigo-50 p-6">
            <h2 className="text-lg font-semibold text-indigo-900">
              Contact us
            </h2>
            <p className="mt-2 text-sm text-indigo-700">
              If you have questions about this policy or your data, email us at
              <span className="font-semibold"> privacy@zenisthai.com</span>.
            </p>
          </section>
        </main>
      </div>
    </>
  );
}
