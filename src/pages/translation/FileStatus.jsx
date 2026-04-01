import TranslatingAnimation from "../../components/animation/TranslatingAnimation";
import MainNavbar from "../../components/dashboard/MainNavbar";
import Stepper from "../../components/general/Stepper";
import { Languages, Eye, SquarePen, FileText, Download } from "lucide-react";
import Button from "../../components/ui/Button";
import { useParams, useSearchParams } from "react-router-dom";
import { useGetJobStatusQuery } from "../../api/HistoryBatch.api";
import { useNavigate } from "react-router-dom";
import { LANGUAGE_MAP } from "../../components/functions/getLanguageLabel";
import Spinner from "../../components/ui/Spinner";

const FileStatus = () => {
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
  const fileName = jobResponse.files[0]?.document_name || "your document";
  const downloadLink = jobResponse.download_link;
  const batchId = jobResponse.files[0]?.batch_id;
  let parsedError = null;

  try {
    parsedError = jobResponse.error_msg
      ? JSON.parse(jobResponse.error_msg)
      : null;
  } catch (e) {
    parsedError = null;
  }

  const failedCount = parsedError?.FAILED_DOCUMENTS_COUNT;
  const totalDocs = parsedError?.TOTAL_DOCUMENTS;

  if (status == "QUEUED") {
    status = "PROCESSING";
  }
  if (status == "PARTIAL_FAILURE") {
    status = "COMPLETED";
  }

  const isProcessing = status === "PROCESSING" || status == "QUEUED";
  const isCompleted = status === "COMPLETED" || status == "PARTIAL_FAILURE";
  const isFailed = status === "FAILED";

  return (
    <>
      <MainNavbar />

      <main className="px-4 sm:px-6 md:px-10 lg:px-16 py-5 w-full min-h-[calc(100vh-74px)] bg-gray-50 flex flex-col">
        <Stepper steps={STEPS} activeStep={isCompleted || isFailed ? 3 : 2} />

        <section className=" bg-white shadow-md w-full h-full mt-5 px-12 py-1 flex flex-col flex-1 gap-10 items-center justify-center rounded-3xl">
          {/* <Languages size={35} /> */}

          <TranslatingAnimation status={status} idp={isIdp} />

          <div>
            {fileName && (
              <h2 className=" text-2xl font-semibold text-gray-700">
                File name: <span className="font-bold">{fileName}</span>
              </h2>
            )}
          </div>

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
                  ? failedCount && totalDocs
                    ? `${failedCount} out of ${totalDocs} document${totalDocs > 1 ? "s" : ""} failed. 
                  Please review the failed files and try again.`
                    : `Your documents have been successfully ${isIdp ? "extracted" : "translated"} and are ready to download.`
                  : failedCount && totalDocs
                    ? `${failedCount} out of ${totalDocs} document${totalDocs > 1 ? "s" : ""} failed. 
                  Please review the failed files and try again. `
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

          {/* <div className="flex justify-between w-full">
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
          </div> */}
        </section>
      </main>
    </>
  );
};

export default FileStatus;
