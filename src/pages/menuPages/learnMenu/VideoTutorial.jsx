import React from "react";
import MainNavbar from "../../../components/dashboard/MainNavbar";

const tutorials = [
  {
    title: "Platform walkthrough",
    description:
      "A guided tour of ZenisthAI, showing navigation, tags, and credit usage.",
    status: "Uploading shortly",
  },
  {
    title: "Translation deep dive",
    description:
      "How to configure language pairs, tone, and glossaries for best results.",
    status: "Uploading shortly",
  },
  {
    title: "IDP extraction setup",
    description:
      "Create field schemas, choose output formats, and validate extracted data.",
    status: "Uploading shortly",
  },
];

export default function VideoTutorial() {
  return (
    <>
      <MainNavbar />
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto w-full max-w-6xl px-6 py-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
              Video tutorials
            </div>
            <h1 className="mt-4 text-3xl font-semibold">
              ZenisthAI Video Tutorials
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-600">
              Short, practical videos to help you master Translation and IDP.
              Videos will be uploaded shortly.
            </p>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl px-6 py-10">
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Upcoming tutorials</h2>
              <div className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                Coming soon
              </div>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {tutorials.map((tutorial) => (
                <div
                  key={tutorial.title}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="text-xs font-semibold uppercase tracking-wide text-indigo-500">
                    Video
                  </div>
                  <h3 className="mt-2 text-sm font-semibold text-slate-900">
                    {tutorial.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600">
                    {tutorial.description}
                  </p>
                  <div className="mt-4 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-500">
                    {tutorial.status}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
