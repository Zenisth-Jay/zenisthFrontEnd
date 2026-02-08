import { Upload, FileText } from "lucide-react";
import Button from "../ui/Button";

const MainFileUpload = ({
  onFilesSelected, // <-- page passes handleFiles
  onBrowseClick, // <-- optional (to open input)
  title = "Drag and drop your documents here, or click to browse",
  supportedText = "Supported formats: PDF, DOCX, TXT",
  helperText = "Max file size: 2 GB, Max pages: 2500",
}) => {
  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      onFilesSelected?.(files);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleClick = () => {
    onBrowseClick?.();
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={handleClick}
      className="
        border-2 border-dashed rounded-2xl border-indigo-500 bg-white h-105 p-6
        overflow-y-auto scroll-smooth flex justify-center items-center
        cursor-pointer
      "
    >
      <div className="flex flex-col items-center justify-center gap-10">
        <div
          className="
            w-20 h-20 rounded-full bg-indigo-50 flex items-center justify-center
            filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.30)]
          "
        >
          <Upload size={26} strokeWidth={3} className="text-indigo-600" />
        </div>

        <div className="flex flex-col items-center gap-4">
          <p className="text-2xl font-bold text-gray-800 text-center">
            {title}
          </p>

          <Button
            size="lg"
            leftIcon={<FileText size={20} className="text-white" />}
            onClick={(e) => {
              e.stopPropagation();
              onBrowseClick?.();
            }}
          >
            Select Files
          </Button>

          <p className="text-gray-700 font-semibold text-xl">{supportedText}</p>

          <p className="text-gray-600 font-normal text-lg">{helperText}</p>
        </div>
      </div>
    </div>
  );
};

export default MainFileUpload;
