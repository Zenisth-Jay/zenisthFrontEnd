import TranslatingAnimation from "../../components/animation/TranslatingAnimation";
import MainNavbar from "../../components/dashboard/MainNavbar";
import Stepper from "../../components/general/Stepper";
import { Languages, Eye, SquarePen, FileText, Download } from "lucide-react";
import Button from "../../components/ui/Button";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

const STEPS = ["Upload Document", "Select Tag", "Translation", "Review & Done"];

const Translating = () => {
  // const [status, setStatus] = useState("FAILED");

  const [searchParams] = useSearchParams();

  const sourceLanguage = searchParams.get("source");
  const targetLanguage = searchParams.get("target");
  const jobId = searchParams.get("jobId");
  const status = searchParams.get("status");

  const isProcessing = status === "PROCESSING" || status == "QUEUED";
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
                ? "Translating...."
                : isCompleted
                  ? "Translation Completed"
                  : "Translation Failed"}
            </h2>

            <p className=" text-gray-600 text-xl font-semibold">
              {isProcessing
                ? "We are applying your custom instructions and translating the content. Please wait..."
                : isCompleted
                  ? "Your documents have been successfully translated and are ready to download."
                  : "Something went wrong while translating your documents."}
            </p>
          </div>

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

          <div className="flex justify-between w-full">
            <Button
              variant={isCompleted ? "primary" : "disable"}
              className="w-[31%] shadow-sm"
              leftIcon={<Download />}
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
                ? `Once completed , you’ll be able to review translations, compare
              with the original, and download the final document. We’ll
              highlight suggested fixes and improvements.`
                : isCompleted
                  ? `Your files were translated using the selected tag and glossary.
                  Download the translated documents or continue with another upload.`
                  : `Retry the translation with the same configuration, or upload the documents again to try a new batch.`}
            </p>
          </div>
        </section>
      </main>
    </>
  );
};

export default Translating;
