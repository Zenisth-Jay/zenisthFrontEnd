import { FileText, ImageIcon, Trash2 } from "lucide-react";

const Document = ({ file, onDelete, onPreview }) => {
  if (!file) return null;

  // Support both DB files and local files
  const type = file.type || file.file?.type || "";
  const size = file.size ?? file.file?.size ?? 0;
  const name = file.name || file.file?.name || "file";

  // Detect types
  const isPdf = type === "application/pdf";
  const isDocx =
    type ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  const isImage = type === "image/jpeg" || type === "image/png";

  // Label
  const fileTypeLabel = isPdf
    ? "PDF"
    : isDocx
      ? "Word"
      : isImage
        ? type === "image/png"
          ? "PNG"
          : "JPG"
        : "File";

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 B";

    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
  };

  return (
    <div
      className="w-67 h-60 bg-white border border-gray-300 rounded-2xl p-5 flex flex-col gap-3 items-center cursor-pointer"
      onClick={() => onPreview?.(file)}
    >
      {/* Icon section */}
      <div className="w-full h-32 bg-indigo-50 rounded-sm flex justify-center items-center relative">
        <div
          className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-red-50 text-red-700 border border-red-100 flex items-center justify-center cursor-pointer hover:bg-red-200"
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.(file);
          }}
        >
          <Trash2 size={18} strokeWidth={1.5} />
        </div>

        {isImage ? (
          <ImageIcon size={35} strokeWidth={2} className="text-green-600" />
        ) : (
          <FileText
            size={35}
            strokeWidth={2}
            className={isPdf ? "text-red-600" : "text-indigo-600"}
          />
        )}
      </div>

      {/* File details */}
      <div className="w-full flex flex-col justify-start gap-1">
        <h3 className="text-[16px] font-medium text-gray-900 truncate">
          {name}
        </h3>

        <div className="flex gap-3 items-center justify-between">
          <span className="bg-gray-50 text-gray-600 w-fit px-2 py-1">
            {fileTypeLabel}
          </span>

          <span className="text-[12px] font-normal text-gray-400">
            {formatFileSize(size)}
          </span>
        </div>

        {file.uploadError && (
          <p className="text-xs text-red-600 font-medium line-clamp-2 mt-1">
            {file.uploadError}
          </p>
        )}
      </div>
    </div>
  );
};

export default Document;
