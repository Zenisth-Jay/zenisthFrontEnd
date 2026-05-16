import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Eye, FileJson2, AlertCircle, Copy, Check } from "lucide-react";
import MainNavbar from "../../../components/dashboard/MainNavbar";
import BackButton from "../../../components/ui/BackButton";
import Spinner from "../../../components/ui/Spinner";
import { useGetJobStatusQuery } from "../../../api/HistoryBatch.api";
import { toast } from "react-toastify";

const prettyStringify = (value) => {
  try {
    if (value === undefined) return "";
    if (typeof value === "string") {
      try {
        return JSON.stringify(JSON.parse(value), null, 2);
      } catch {
        return value;
      }
    }
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
};

const normalizeName = (s) => (s || "").trim().toLowerCase().replace(/\\/g, "/");

const basename = (s) => {
  const n = normalizeName(s);
  if (!n) return "";
  const parts = n.split("/");
  return parts[parts.length - 1] || "";
};

const filenameFromInlineEntry = (item) => {
  if (item == null || typeof item !== "object") return "";
  return (
    item.document_name ||
    item.filename ||
    item.file_name ||
    item.name ||
    item.file?.name ||
    item.metadata?.document_name ||
    item.metadata?.filename ||
    ""
  );
};

const payloadFromInlineEntry = (item) => {
  if (item == null) return item;
  if (typeof item !== "object") return item;
  if ("output" in item && item.output !== undefined) return item.output;
  if ("data" in item && item.data !== undefined) return item.data;
  if ("result" in item && item.result !== undefined) return item.result;
  if ("extraction" in item && item.extraction !== undefined)
    return item.extraction;
  const keys = Object.keys(item);
  const metaKeys = new Set([
    "document_name",
    "filename",
    "file_name",
    "name",
    "file",
    "metadata",
    "status",
    "error_message",
  ]);
  const rest = keys.filter((k) => !metaKeys.has(k));
  if (rest.length === 1) return item[rest[0]];
  return item;
};

const findInlineIndexForFile = (inlineOutput, file, fileIndex) => {
  if (!Array.isArray(inlineOutput) || inlineOutput.length === 0) return -1;

  const target = file?.document_name || file?.filename || file?.name || "";
  const normTarget = normalizeName(target);
  const baseTarget = basename(target);

  if (normTarget) {
    let idx = inlineOutput.findIndex((entry) => {
      const n = filenameFromInlineEntry(entry);
      return n && normalizeName(n) === normTarget;
    });
    if (idx >= 0) return idx;

    idx = inlineOutput.findIndex((entry) => {
      const n = filenameFromInlineEntry(entry);
      return n && basename(n) === baseTarget;
    });
    if (idx >= 0) return idx;
  }

  if (
    typeof fileIndex === "number" &&
    fileIndex >= 0 &&
    fileIndex < inlineOutput.length
  ) {
    return fileIndex;
  }

  return -1;
};

const JobJsonOutputViewer = () => {
  const { toolType, jobId } = useParams();
  const [searchParams] = useSearchParams();
  const initialFile = searchParams.get("file") || "";

  const appType = toolType || "translate";
  const isIdp = toolType === "idp";

  const {
    data: job,
    isLoading,
    isError,
    isFetching,
  } = useGetJobStatusQuery({ jobId, appType }, { skip: !jobId });

  const files = useMemo(() => job?.files || [], [job?.files]);
  const inlineOutput = job?.inline_output;

  const [selectedName, setSelectedName] = useState(initialFile);

  useEffect(() => {
    if (initialFile) setSelectedName(initialFile);
  }, [initialFile, jobId]);

  useEffect(() => {
    if (!selectedName && files.length > 0) {
      const first =
        files[0]?.document_name || files[0]?.filename || files[0]?.name || "";
      if (first) setSelectedName(first);
    }
  }, [files, selectedName]);

  const selectedIndex = useMemo(() => {
    if (!files.length) return -1;
    const norm = normalizeName(selectedName);
    return files.findIndex((f) => {
      const n = f?.document_name || f?.filename || f?.name || "";
      return normalizeName(n) === norm;
    });
  }, [files, selectedName]);

  const matchedPayload = useMemo(() => {
    if (!Array.isArray(inlineOutput) || selectedIndex < 0) return null;
    const file = files[selectedIndex];
    const idx = findInlineIndexForFile(inlineOutput, file, selectedIndex);
    if (idx < 0) return null;
    return payloadFromInlineEntry(inlineOutput[idx]);
  }, [inlineOutput, files, selectedIndex]);

  const displayJson = useMemo(
    () => prettyStringify(matchedPayload ?? ""),
    [matchedPayload],
  );

  const [copied, setCopied] = useState(false);

  const handleCopyJson = async () => {
    if (!displayJson) return;
    try {
      await navigator.clipboard.writeText(displayJson);
      setCopied(true);
      toast.success("JSON copied to clipboard");
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      toast.error("Could not copy. Try selecting the text manually.");
    }
  };

  const outputFormat =
    job?.config?.output_format || job?.config?.outputFormat || "";

  const backPath = `/operations/${toolType}/history`;

  if (!jobId) {
    return (
      <>
        <MainNavbar />
        <main className="min-h-[calc(100vh-64px)] bg-gray-50 px-4 py-8">
          <p className="text-red-600">Missing job id.</p>
        </main>
      </>
    );
  }

  if (isLoading && !job) {
    return (
      <>
        <MainNavbar />
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50">
          <div className="flex flex-col items-center gap-3 text-gray-600">
            <Spinner size={56} />
            <span>Loading job output…</span>
          </div>
        </div>
      </>
    );
  }

  if (isError || !job) {
    return (
      <>
        <MainNavbar />
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 px-4">
          <p className="text-red-600 text-center">
            Could not load this job. It may have been removed or you may not
            have access.
          </p>
        </div>
      </>
    );
  }

  const hasInline = Array.isArray(inlineOutput) && inlineOutput.length > 0;
  const isJsonJob = String(outputFormat || "").toUpperCase() === "JSON";

  return (
    <>
      <MainNavbar />
      <main className="min-h-[calc(100vh-64px)] bg-gray-50 px-4 sm:px-6 md:px-10 lg:px-12 py-6 sm:py-8 flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex gap-3 items-start">
            <BackButton size={24} pathToNavigate={backPath} />
            <div>
              <div className="flex items-center gap-2 text-indigo-700 mb-1">
                <FileJson2 size={22} />
                <span className="text-sm font-semibold uppercase tracking-wide">
                  {isIdp ? "Extraction" : "Job"} output
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                JSON result viewer
              </h1>
              <p className="text-gray-600 mt-1 max-w-2xl">
                Select a file from this batch to view its structured output.
              </p>
              {isFetching && job && (
                <p className="text-xs text-gray-500 mt-2">Refreshing…</p>
              )}
            </div>
          </div>
        </div>

        {!isJsonJob && (
          <div
            className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-900"
            role="status"
          >
            <AlertCircle className="shrink-0 mt-0.5" size={20} />
            <div>
              <p className="font-medium">This job is not JSON output format.</p>
              <p className="text-sm mt-1 text-amber-900/90">
                Config reports output format as{" "}
                <span className="font-mono">{String(outputFormat || "—")}</span>
                . Inline JSON preview is intended for JSON jobs.
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-120">
          <aside className="w-full lg:w-[320px] shrink-0 flex flex-col rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
              <h2 className="text-sm font-semibold text-gray-800">
                Files in batch
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                {files.length} file{files.length === 1 ? "" : "s"}
              </p>
            </div>
            <div className="overflow-y-auto flex-1 max-h-[50vh] lg:max-h-[calc(100vh-220px)]">
              {files.length === 0 ? (
                <div className="p-4 text-sm text-gray-500">
                  No files listed.
                </div>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {files.map((f, idx) => {
                    const name =
                      f.document_name ||
                      f.filename ||
                      f.name ||
                      `File ${idx + 1}`;
                    const active =
                      normalizeName(name) === normalizeName(selectedName);
                    return (
                      <li key={`${name}-${idx}`}>
                        <button
                          type="button"
                          onClick={() => setSelectedName(name)}
                          className={`w-full text-left px-4 py-3 flex items-start gap-2 transition-colors ${
                            active
                              ? "bg-indigo-50 border-l-4 border-l-indigo-600"
                              : "hover:bg-gray-50 border-l-4 border-l-transparent"
                          }`}
                        >
                          <Eye
                            size={18}
                            className={
                              active
                                ? "text-indigo-600 mt-0.5"
                                : "text-gray-400 mt-0.5"
                            }
                          />
                          <span className="min-w-0 flex-1">
                            <span
                              className={`text-sm font-medium block truncate ${
                                active ? "text-indigo-900" : "text-gray-900"
                              }`}
                              title={name}
                            >
                              {name}
                            </span>
                            {f.status && (
                              <span className="text-xs text-gray-500">
                                {f.status}
                              </span>
                            )}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </aside>

          <section className="flex-1 flex flex-col min-w-0 rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex flex-wrap items-center justify-between gap-2">
              <div className="min-w-0">
                <h2 className="text-sm font-semibold text-gray-800 truncate">
                  {selectedName || "Select a file"}
                </h2>
                <p className="text-xs text-gray-500">
                  Structured information extracted from the uploaded document.
                </p>
              </div>
            </div>

            <div className="flex-1 p-4 min-h-90 bg-[#0b0b0b]">
              {!hasInline && (
                <div className="h-full flex items-center justify-center text-gray-400 text-sm px-4 text-center">
                  No inline JSON output is available for this job yet. Try again
                  after the job completes, or use download if your workspace
                  provides a file link instead.
                </div>
              )}
              {hasInline && selectedIndex < 0 && (
                <div className="h-full flex items-center justify-center text-amber-300 text-sm px-4 text-center">
                  Select a file from the list to preview its output.
                </div>
              )}
              {hasInline && selectedIndex >= 0 && matchedPayload == null && (
                <div className="h-full flex flex-col items-center justify-center text-amber-200 text-sm px-4 text-center gap-2">
                  <p>
                    No inline entry matched{" "}
                    <span className="font-mono text-white">{selectedName}</span>
                    .
                  </p>
                  <p className="text-gray-400 text-xs max-w-md">
                    The API response may use a different field for file names,
                    or the order of items may not align with this file.
                  </p>
                </div>
              )}
              {hasInline && selectedIndex >= 0 && matchedPayload != null && (
                <div className="relative flex flex-col h-full max-h-[calc(100vh-280px)] rounded-xl border border-gray-700 bg-[#0a0a0a] shadow-inner overflow-hidden">
                  <div className="flex items-center justify-end gap-2 px-3 py-2.5 border-b border-gray-800/80 bg-gradient-to-r from-gray-900/90 to-gray-900/60">
                    <button
                      type="button"
                      onClick={handleCopyJson}
                      className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/35 bg-emerald-500/10 px-3.5 py-2 text-sm font-medium text-emerald-300 shadow-sm transition-all hover:bg-emerald-500/20 hover:border-emerald-400/50 hover:text-emerald-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]"
                      aria-label="Copy JSON to clipboard"
                    >
                      {copied ? (
                        <>
                          <Check
                            size={18}
                            strokeWidth={2.25}
                            className="text-emerald-400"
                          />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy
                            size={18}
                            strokeWidth={2}
                            className="text-emerald-400/95"
                          />
                          Copy JSON
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="flex-1 min-h-0 overflow-auto m-0 px-4 py-4 text-sm font-mono leading-relaxed text-green-400 bg-[#0f0f0f]">
                    {displayJson}
                  </pre>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </>
  );
};

export default JobJsonOutputViewer;
