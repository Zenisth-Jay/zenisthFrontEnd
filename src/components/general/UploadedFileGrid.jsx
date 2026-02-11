import { Plus } from "lucide-react";
import Button from "../ui/Button";
import Document from "../ui/Document";

const UploadedFilesGrid = ({
  files = [],
  onFilesSelected, // when user clicks "Upload more"
  onRemoveFile, // (item) => void
  onPreviewFile, // (item) => void
  emptyText = 'Forgot a file? You can add it using the "Upload more" button above.',
  showHeader = true,
}) => {
  if (!files.length) return null;

  const handleAddMore = () => {
    onFilesSelected?.();
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header */}
      {showHeader && (
        <div className="flex items-center justify-between py-3">
          <Button leftIcon={<Plus size={18} />} onClick={handleAddMore}>
            Upload more documents
          </Button>

          <span className="text-gray-800 font-medium text-lg">
            {files.length} Documents
          </span>
        </div>
      )}

      {/* Grid */}
      <div className="grid gap-3 grid-cols-[repeat(auto-fill,minmax(260px,1fr))]">
        {files.map((item) => (
          <Document
            key={item.id}
            file={item.file}
            onDelete={() => onRemoveFile?.(item)}
            onPreview={() => onPreviewFile?.(item)}
          />
        ))}
      </div>

      {/* Footer helper */}
      <p className="m-3 w-full text-center text-xl text-gray-800 font-medium">
        {emptyText}
      </p>

      <hr className=" text-gray-300" />
    </div>
  );
};

export default UploadedFilesGrid;
