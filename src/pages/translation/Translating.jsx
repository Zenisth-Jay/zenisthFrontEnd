import TranslatingAnimation from "../../components/animation/TranslatingAnimation";
import MainNavbar from "../../components/dashboard/MainNavbar";
import Stepper from "../../components/general/Stepper";
import {
  Languages,
  SquarePen,
  FileText,
  Download,
  CalendarClock,
} from "lucide-react";
import Button from "../../components/ui/Button";
import { useParams, useSearchParams } from "react-router-dom";
import { useGetJobStatusQuery } from "../../api/HistoryBatch.api";
import { useNavigate } from "react-router-dom";
import { LANGUAGE_MAP } from "../../components/functions/getLanguageLabel";
import Spinner from "../../components/ui/Spinner";

const downloadJsonFile = (data, filename) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const Translating = () => {
  const getLanguageLabel = (code) => LANGUAGE_MAP[code] || code;

  const navigate = useNavigate();

  const { toolType } = useParams();
  const isIdp = toolType == "idp";

  const STEPS = [
    "Upload Document",
    "Select Tag",
    isIdp ? "Extraction" : "Translation",
    "Review & Done",
  ];

  const [searchParams] = useSearchParams();

  const jobId = searchParams.get("jobId");
  // console.log("toolType:", toolType);
  // console.log("jobId from URL:", jobId);

  // 🔹 Fetch job status from API
  const {
    data: jobResponse,
    isLoading,
    isError,
  } = useGetJobStatusQuery(
    { jobId, appType: toolType }, // 👈 pass an object
    { skip: !jobId },
  );
  console.log(jobResponse);

  if (isLoading) {
    return (
      <>
        <MainNavbar />
        <main className="px-4 sm:px-6 md:px-10 lg:px-16 py-5 w-full min-h-[calc(100vh-64px)] bg-gray-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Spinner size={56} />
            <div className="text-gray-600 text-lg font-medium">
              Checking job status...
            </div>
          </div>
        </main>
      </>
    );
  }

  if (isError || !jobResponse) {
    return (
      <>
        <MainNavbar />
        <main className="px-4 sm:px-6 md:px-10 lg:px-16 py-5 w-full min-h-[calc(100vh-64px)] bg-gray-50 flex items-center justify-center">
          <div className="text-red-600 text-lg">
            Failed to load {isIdp ? "Extraction" : "translation"} status.
          </div>
        </main>
      </>
    );
  }

  let status = jobResponse.job_status;
  const sourceLanguage = jobResponse.source_language;
  const targetLanguage = jobResponse.target_language;
  const downloadLink = jobResponse.download_link;
  const inlineOutput = jobResponse.inline_output;
  const batchId = jobResponse.files?.[0]?.batch_id;
  const hasInlineOutput = inlineOutput != null;

  const isRetentionExpired =
    jobResponse.isRetentionExpired === true ||
    jobResponse.is_retention_expired === true;

  const failedCount = jobResponse?.metrics?.failed_documents;
  const totalDocs = jobResponse?.metrics?.total_documents;

  if (status == "QUEUED") {
    status = "PROCESSING";
  }
  if (status == "PARTIAL_FAILURE") {
    status = "COMPLETED";
  }

  const isProcessing = status === "PROCESSING" || status == "QUEUED";
  const isCompleted = status === "COMPLETED" || status == "PARTIAL_FAILURE";
  const isFailed = status === "FAILED";

  const hasDownloadableContent = Boolean(downloadLink || hasInlineOutput);
  const canDownload =
    isCompleted && hasDownloadableContent && !isRetentionExpired;

  return (
    <>
      <MainNavbar />

      <main className="px-4 sm:px-6 md:px-10 lg:px-16 py-5 w-full min-h-[calc(100vh-74px)] bg-gray-50 flex flex-col">
        <Stepper steps={STEPS} activeStep={isCompleted || isFailed ? 3 : 2} />

        <section className=" bg-white shadow-md w-full h-full mt-5 px-12 py-1 flex flex-col flex-1 gap-10 items-center justify-center rounded-3xl">
          {/* <Languages size={35} /> */}

          <TranslatingAnimation status={status} idp={isIdp} />

          <div className="flex flex-col gap-2 items-center">
            <h2 className=" text-5xl font-bold text-black">
              {isProcessing
                ? isIdp
                  ? "Extracting...."
                  : "Translating...."
                : isCompleted
                  ? `${isIdp ? "IDP" : "Translation"} Job Completed`
                  : `${isIdp ? "IDP" : "Translation"} Job Failed`}
            </h2>

            <p className=" text-gray-600 text-xl font-semibold">
              {isProcessing
                ? `We are applying your custom instructions and ${isIdp ? "extracting" : "translating"} the content. Please wait...`
                : isCompleted
                  ? failedCount > 0
                    ? failedCount === totalDocs
                      ? `All document${totalDocs > 1 ? "s" : ""} failed. Please review the files and try again.`
                      : `${failedCount} out of ${totalDocs} document${totalDocs > 1 ? "s" : ""} failed. 
                        Please review the failed files and try again.`
                    : `Your documents have been successfully ${isIdp ? "extracted" : "translated"} and are ready to download.`
                  : failedCount > 0
                    ? failedCount === totalDocs
                      ? `All document${totalDocs > 1 ? "s" : ""} failed. Please review the files and try again.`
                      : `${failedCount} out of ${totalDocs} document${totalDocs > 1 ? "s" : ""} failed. 
                        Please review the failed files and try again.`
                    : `Something went wrong while ${isIdp ? "extracting" : "translating"} your documents.`}
            </p>
          </div>

          {!isIdp && (
            <div className="flex items-center gap-6">
              <span className=" text-indigo-500 text-lg font-bold">
                {/* {sourceLanguage} */}
                {getLanguageLabel(sourceLanguage)}
              </span>
              <div className="w-10 h-10 rounded-full border border-gray-300 bg-white flex items-center justify-center ">
                <Languages
                  size={22}
                  strokeWidth={1.5}
                  className=" text-indigo-600"
                />
              </div>
              <span className=" text-indigo-500 text-lg font-bold">
                {/* {targetLanguage} */}
                {getLanguageLabel(targetLanguage)}
              </span>
            </div>
          )}

          <div className="flex justify-between w-full gap-4">
            <div className="relative w-[31%] group/rent">
              <Button
                variant={canDownload ? "primary" : "disable"}
                className="relative z-0 w-full shadow-sm"
                disabled={!canDownload}
                leftIcon={<Download />}
                onClick={() => {
                  if (!canDownload) return;
                  if (downloadLink) {
                    window.open(downloadLink, "_blank");
                    return;
                  }

                  if (hasInlineOutput) {
                    downloadJsonFile(
                      inlineOutput,
                      `${jobResponse.job_id || "inline-output"}.json`,
                    );
                  }
                }}
              >
                Download
              </Button>
              {isRetentionExpired && (
                <>
                  <div
                    className="absolute inset-0 z-[1] cursor-not-allowed rounded-lg"
                    aria-hidden
                  />
                  <div
                    className="pointer-events-none absolute z-[2] left-1/2 bottom-full mb-3 w-[min(calc(100vw-2rem),22rem)] -translate-x-1/2 rounded-xl border border-amber-200 bg-white px-4 py-3 shadow-xl ring-1 ring-black/5 opacity-0 translate-y-1 transition-all duration-200 ease-out group-hover/rent:opacity-100 group-hover/rent:translate-y-0"
                    role="tooltip"
                  >
                    <div className="absolute left-1/2 top-full -mt-px h-2 w-2 -translate-x-1/2 rotate-45 border-b border-r border-amber-200 bg-white" />
                    <div className="flex gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                        <CalendarClock size={20} strokeWidth={2} />
                      </div>
                      <div className="min-w-0 text-left">
                        <p className="text-sm font-semibold text-gray-900">
                          Download no longer available
                        </p>
                        <p className="mt-1 text-sm leading-relaxed text-gray-600">
                          The retention period for this job has ended, so output
                          files can no longer be downloaded.
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
            <Button
              leftIcon={<SquarePen className="" />}
              variant={isFailed ? "primary" : "outline"}
              className="w-[31%] text-gray-600 shadow-sm"
              onClick={() => {
                navigate(
                  `/operations/${isIdp ? "idp" : "translate"}/select-tag?batchId=${batchId}`,
                );
              }}
            >
              Change Tag
            </Button>
            <Button
              leftIcon={<FileText />}
              className="w-[31%] shadow-sm"
              variant={isCompleted ? "outline" : "primary"}
              onClick={() => {
                navigate(`/operations/${isIdp ? "idp" : "translate"}`);
              }}
            >
              Upload Another Document
            </Button>
          </div>

          <div className="p-6 bg-gray-50 w-full rounded-3xl border border-indigo-200 shadow-md">
            <h2 className="text-2xl font-bold">What happens next?</h2>
            <p className=" text-lg font-normal text-gray-700">
              {isProcessing
                ? `Once completed , you’ll be able to review ${isIdp ? "Extractions" : "translations"}, compare
              with the original, and download the final document. We’ll
              highlight suggested fixes and improvements.`
                : isCompleted
                  ? `Your files were ${isIdp ? "extracted" : "translated"} using the selected tag and ${isIdp ? "uploaded file" : "glossary"}.
                  Download the ${isIdp ? "extracted" : "translated"} documents or continue with another upload.`
                  : `Retry the ${isIdp ? "extraction" : "translation"} with the same configuration, or upload the documents again to try a new batch.`}
            </p>
          </div>
        </section>
      </main>
    </>
  );
};

export default Translating;
