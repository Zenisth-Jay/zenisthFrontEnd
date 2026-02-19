import React from "react";
import MainNavbar from "../../../components/dashboard/MainNavbar";

const sections = [
  {
    title: "Acceptance of terms",
    body:
      "By accessing or using ZenisthAI services, you agree to these Terms of Service. " +
      "If you do not agree, do not use the services.",
  },
  {
    title: "Services overview",
    body:
      "ZenisthAI provides AI tools for Translation and Intelligent Document Processing (IDP), " +
      "including file uploads, tagging, and output generation in formats such as JSON, CSV, or XML.",
  },
  {
    title: "Account responsibilities",
    body:
      "You are responsible for safeguarding your account credentials and all activity under your account. " +
      "Notify us immediately of any unauthorized use.",
  },
  {
    title: "Use of credits",
    body:
      "Credits are required to process jobs. Credits are consumed based on file size, complexity, " +
      "and selected options. Unused credits and pricing are subject to your plan.",
  },
  {
    title: "Uploads and content",
    body:
      "You retain ownership of your content. You grant ZenisthAI a limited license to process, store, " +
      "and transmit your content solely to provide the services.",
  },
  {
    title: "Prohibited use",
    body:
      "Do not use the services to violate laws, upload harmful content, or attempt to access " +
      "accounts or data you do not own. Automated abuse and security testing are not allowed " +
      "without written approval.",
  },
  {
    title: "Service availability",
    body:
      "We aim to provide reliable access, but service interruptions may occur. We may modify " +
      "or discontinue features with reasonable notice.",
  },
  {
    title: "Third-party services",
    body:
      "Some features may rely on third-party services. ZenisthAI is not responsible for " +
      "third-party outages or policies.",
  },
  {
    title: "Limitation of liability",
    body:
      "To the maximum extent permitted by law, ZenisthAI is not liable for indirect, incidental, " +
      "or consequential damages arising from use of the services.",
  },
  {
    title: "Termination",
    body:
      "We may suspend or terminate access if you violate these terms. You may stop using the " +
      "services at any time.",
  },
  {
    title: "Changes to terms",
    body:
      "We may update these terms as our services evolve. We will post updates here and notify " +
      "you of material changes.",
  },
];

export default function TermsAndService() {
  return (
    <>
      <MainNavbar />
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto w-full max-w-4xl px-6 py-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
              Terms of Service
            </div>
            <h1 className="mt-4 text-3xl font-semibold">
              ZenisthAI Terms of Service
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Effective date: Feb 15, 2026
            </p>
            <p className="mt-4 text-sm text-slate-600">
              These terms govern access to ZenisthAI Translation and IDP
              services, including uploads, tagging, and output delivery.
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
              Questions about these terms? Email us at
              <span className="font-semibold"> support@zesnith.ai</span>.
            </p>
          </section>
        </main>
      </div>
    </>
  );
}
