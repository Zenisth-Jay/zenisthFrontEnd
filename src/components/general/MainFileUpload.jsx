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
      className="border-2 border-dashed rounded-xl sm:rounded-2xl border-indigo-500 bg-white min-h-[280px] sm:min-h-[320px] md:h-105 p-4 sm:p-6 overflow-y-auto scroll-smooth flex justify-center items-center cursor-pointer transition-colors duration-200 hover:border-indigo-600 hover:bg-indigo-50/30"
    >
      <div className="flex flex-col items-center justify-center gap-6 sm:gap-8 md:gap-10">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-indigo-50 flex items-center justify-center drop-shadow-[0_1px_2px_rgba(0,0,0,0.30)]">
          <Upload size={24} strokeWidth={3} className="text-indigo-600 sm:w-6 sm:h-6" />
        </div>

        <div className="flex flex-col items-center gap-3 sm:gap-4 text-center">
          <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 px-2">
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

          <p className="text-gray-700 font-semibold text-base sm:text-lg md:text-xl">{supportedText}</p>

          <p className="text-gray-600 font-normal text-sm sm:text-base md:text-lg">{helperText}</p>
        </div>
      </div>
    </div>
  );
};

export default MainFileUpload;
