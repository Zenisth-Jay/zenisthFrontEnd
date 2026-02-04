import { useRef, useState } from "react";
import MainNavbar from "../../../components/dashboard/MainNavbar";
import Button from "../../../components/ui/Button";
import { History, Upload, FileText, Plus, ArrowRight, X } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { createDocumentAPI, uploadToS3 } from "../../../api/documents.api";

// ✅ Allowed file types
const ALLOWED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
];

const TranslateDoc = () => {
  const navigate = useNavigate();

  const fileInputRef = useRef(null);
  const [files, setFiles] = useState([]);

  // Handle Duplicate + File Type Validation
  const handleFiles = (selectedFiles) => {
    const incoming = Array.from(selectedFiles);

    // Invalid files
    const invalidFiles = incoming.filter(
      (file) => !ALLOWED_TYPES.includes(file.type),
    );

    if (invalidFiles.length > 0) {
      toast.error("Only PDF, DOCX, and TXT files are allowed", {
        autoClose: 3000,
      });
    }

    // ✅ Valid files only
    const validFiles = incoming.filter((file) =>
      ALLOWED_TYPES.includes(file.type),
    );

    setFiles((prev) => {
      const existingKeys = new Set(
        prev.map((f) => `${f.file.name}-${f.file.size}`),
      );

      const newFiles = validFiles
        .filter((file) => !existingKeys.has(`${file.name}-${file.size}`))
        .map((file) => ({
          file,
          progress: 0,
        }));

      // simulate progress ONLY for newly added files
      newFiles.forEach((f) => simulateProgress(f.file));

      return [...prev, ...newFiles];
    });
  };

  // Progress Bar
  const simulateProgress = (file) => {
    let progress = 0;

    const interval = setInterval(() => {
      progress += 10;

      setFiles((prev) =>
        prev.map((f) =>
          f.file.name === file.name && f.file.size === file.size
            ? { ...f, progress: Math.min(progress, 100) }
            : f,
        ),
      );

      if (progress >= 100) clearInterval(interval);
    }, 200);
  };

  // Drag and Drop
  const handleDrop = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  // Remove Files
  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <>
      <MainNavbar />
      <section className="min-h-[calc(100vh-64px)] bg-gray-50 flex items-center justify-center">
        <div className=" w-full max-w-7xl mx-auto px-16 py-3 flex flex-col gap-10">
          {/* Top Heading */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className=" text-4xl font-semibold">Upload your document</h2>
              <p className=" text-lg font-medium text-gray-800">
                Upload the documents you want to translate. We’ll prepare it for
                the next step.
              </p>
            </div>
            <div>
              <Button
                variant="outline"
                leftIcon={
                  <History
                    size={22}
                    strokeWidth={2}
                    className=" text-gray-800"
                  />
                }
              >
                View History
              </Button>
            </div>
          </div>

          {/* Upload Section */}
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => fileInputRef.current?.click()}
            className=" border-2 border-dashed rounded-2xl border-indigo-500 bg-white h-105 p-6 
            overflow-y-auto scroll-smooth flex justify-center items-center
            "
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.docx,.txt"
              hidden
              onChange={(e) => {
                handleFiles(e.target.files);
                e.target.value = "";
              }}
            />

            {files.length == 0 ? (
              <div className="flex flex-col items-center justify-center gap-10">
                <div
                  className=" w-20 h-20 rounded-full bg-indigo-50 flex items-center justify-center text-3xl 
                filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.30)]"
                >
                  <Upload
                    size={26}
                    strokeWidth={3}
                    className=" text-indigo-600"
                  />
                </div>

                <div className="flex flex-col items-center gap-4">
                  <p className=" text-2xl font-bold text-gray-800">
                    Drag and drop your documents here, or click to browse
                  </p>

                  <Button
                    size="lg"
                    leftIcon={<FileText size={20} className=" text-white" />}
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                  >
                    Select Files
                  </Button>

                  <p className=" text-gray-700 font-semibold text-xl">
                    Supported formats: PDF, DOCX, TXT
                  </p>

                  <p className=" text-gray-600 font-normal text-lg">
                    Max file size: 2 GB, Max pages: 2500
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                <div className="sticky top-0 z-20 bg-white flex items-center justify-between px-2 py-3">
                  <h3 className="text-xl font-semibold">Uploaded Files</h3>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      leftIcon={<Plus size={18} />}
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                    >
                      Add More Files
                    </Button>

                    <Button
                      rightIcon={<ArrowRight size={18} />}
                      disabled={files.some((f) => f.progress < 100)}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate("/operations/translate/select-tag");
                      }}
                    >
                      Next Step
                    </Button>
                  </div>
                </div>

                <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {files.map((item, index) => (
                    <div
                      key={index}
                      className="border rounded-xl p-4 flex flex-col gap-3 hover:shadow-md transition"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-between">
                        <FileText className="text-indigo-600" />
                        <button
                          onClick={() => removeFile(index)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <X size={18} />
                        </button>
                      </div>

                      <p className="font-medium truncate">{item.file.name}</p>

                      <p className="text-sm text-gray-500">
                        {(item.file.size / 1024 / 1024).toFixed(2)} MB
                      </p>

                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-indigo-600 h-2 rounded-full transition-all"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div
            className=" bg-indigo-50 border-indigo-200 rounded-lg text-black p-4 text-xl 
        shadow-[0_1px_2px_0_rgba(0,0,0,0.30),0_2px_6px_2px_rgba(0,0,0,0.15)]
        "
          >
            💡 No tokens are used during upload. Token estimation will be shown
            before translation starts.
          </div>
        </div>
      </section>
    </>
  );
};

export default TranslateDoc;
