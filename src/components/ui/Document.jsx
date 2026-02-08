import { FileText, Trash2 } from "lucide-react";

const Document = ({ file, onDelete, onPreview }) => {
  const isPdf = file.type === "application/pdf";
  const isDocx =
    file.type ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

  const fileTypeLabel = isPdf ? "PDF" : isDocx ? "Word" : "File";

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 B";

    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
  };

  return (
    <div
      className=" w-67 h-60 bg-white border border-gray-300 rounded-2xl p-5 flex flex-col gap-3 items-center cursor-pointer"
      onClick={onPreview}
    >
      {/* First Row  */}
      <div className="w-full h-32 bg-indigo-50 rounded-sm flex justify-center items-center relative">
        {/* Delete Icon */}
        <div
          className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-red-50 text-red-700 border border-red-100 flex items-center justify-center cursor-pointer hover:bg-red-200"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <Trash2 size={18} strokeWidth={1.5} />
        </div>
        <FileText
          size={35}
          strokeWidth={2}
          className={isPdf ? "text-red-600" : "text-indigo-600"}
        />
      </div>

      {/* Second remaining section */}
      <div className="w-full flex flex-col justify-start gap-1">
        <h3 className=" text-[16px] font-medium text-gray-900">{file.name}</h3>
        <div className="flex gap-3 items-center justify-between">
          <span className=" bg-gray-50 text-gray-600 w-fit px-2 py-1">
            {fileTypeLabel}
          </span>
          {/* <span className="border border-gray-100 w-full"></span> */}
          <span className=" text-[12px] font-normal text-gray-400">
            {formatFileSize(file.size)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Document;
