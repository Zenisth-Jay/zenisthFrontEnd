import TranslatingAnimation from "../../components/animation/TranslatingAnimation";
import MainNavbar from "../../components/dashboard/MainNavbar";
import Stepper from "../../components/general/Stepper";
import { Languages, Eye, SquarePen, FileText, Download } from "lucide-react";
import Button from "../../components/ui/Button";
import { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useGetJobStatusQuery } from "../../api/HistoryBatch.api";
import { useNavigate } from "react-router-dom";

const Translating = () => {
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

  // 🔹 Fetch job status from API
  const {
    data: jobResponse,
    isLoading,
    isError,
  } = useGetJobStatusQuery(jobId, {
    skip: !jobId,
    // pollingInterval: 5000, // 🔁 auto-refresh every 5s while processing
  });

  if (isLoading) {
    return (
      <>
        <MainNavbar />
        <main className="px-16 py-5 w-full min-h-[calc(100vh-64px)] bg-gray-50 flex items-center justify-center">
          <div className="text-gray-600 text-lg">Loading job status...</div>
        </main>
      </>
    );
  }

  if (isError || !jobResponse) {
    return (
      <>
        <MainNavbar />
        <main className="px-16 py-5 w-full min-h-[calc(100vh-64px)] bg-gray-50 flex items-center justify-center">
          <div className="text-red-600 text-lg">
            Failed to load {isIdp ? "Extraction" : "translation"} status.
          </div>
        </main>
      </>
    );
  }

  let status = jobResponse.job_status;
  const sourceLanguage = jobResponse.source_language?.toUpperCase();
  const targetLanguage = jobResponse.target_language?.toUpperCase();
  const downloadLink = jobResponse.download_link;

  if (status == "QUEUED" || status == "PARTIAL_FAILURE") {
    status = "PROCESSING";
  }

  const isProcessing =
    status === "PROCESSING" ||
    status == "QUEUED" ||
    status == "PARTIAL_FAILURE";
  const isCompleted = status === "COMPLETED";
  const isFailed = status === "FAILED";

  return (
    <>
      <MainNavbar />

      <main className="px-16 py-5 w-full min-h-[calc(100vh-64px)] bg-gray-50 flex flex-col">
        <Stepper steps={STEPS} activeStep={isCompleted ? 3 : 2} />

        <section className=" bg-white w-full h-full mt-5 px-12 py-1 flex flex-col flex-1 justify-between items-center rounded-3xl">
          {/* <Languages size={35} /> */}

          <TranslatingAnimation status={status} />

          <div className="flex flex-col gap-2 items-center">
            <h2 className=" text-5xl font-bold text-black">
              {isProcessing
                ? isIdp
                  ? "Extracting...."
                  : "Translating...."
                : isCompleted
                  ? `${isIdp ? "IDP" : "Translation"} Completed`
                  : `${isIdp ? "IDP" : "Translation"} Failed`}
            </h2>

            <p className=" text-gray-600 text-xl font-semibold">
              {isProcessing
                ? `We are applying your custom instructions and ${isIdp ? "extracting" : "translating"} the content. Please wait...`
                : isCompleted
                  ? `Your documents have been successfully ${isIdp ? "extracted" : "translated"} and are ready to download.`
                  : `Something went wrong while ${isIdp ? "extracting" : "translating"} your documents.`}
            </p>
          </div>

          {!isIdp && (
            <div className="flex items-center gap-6">
              <span className=" text-indigo-500 text-lg font-bold">
                {sourceLanguage}
              </span>
              <div className="w-10 h-10 rounded-full border border-gray-300 bg-white flex items-center justify-center ">
                <Languages
                  size={22}
                  strokeWidth={1.5}
                  className=" text-indigo-600"
                />
              </div>
              <span className=" text-indigo-500 text-lg font-bold">
                {targetLanguage}
              </span>
            </div>
          )}

          <div className="flex justify-between w-full">
            <Button
              variant={isCompleted && downloadLink ? "primary" : "disable"}
              className="w-[31%] shadow-sm"
              leftIcon={<Download />}
              onClick={() => {
                if (downloadLink) {
                  window.open(downloadLink, "_blank");
                }
              }}
            >
              Download
            </Button>
            <Button
              leftIcon={<SquarePen className="" />}
              variant="disable"
              className="w-[31%] text-gray-600 shadow-sm"
            >
              Change Tag
            </Button>
            <Button
              leftIcon={<FileText />}
              className="w-[31%] shadow-sm"
              variant={isCompleted ? "outline" : "primary"}
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
