import { useSelector, useDispatch } from "react-redux";
import { useState, useRef } from "react";
import { clearUploads, closeOverlay } from "../../redux/features/uploadSlice";
import { CloudSync, CircleCheckBig, CircleAlert } from "lucide-react";

const UploadOverlay = () => {
  const dispatch = useDispatch();
  const { isOpen, files } = useSelector((state) => state.upload);

  const [minimized, setMinimized] = useState(false);
  const [position, setPosition] = useState({ right: 16, bottom: 16 });

  const dragData = useRef({ x: 0, y: 0, startRight: 16, startBottom: 16 });

  if (!isOpen) return null;

  const allDone =
    files.length > 0 &&
    files.every((f) => f.status === "success" || f.status === "error");

  const onMouseDownDrag = (e) => {
    dragData.current = {
      x: e.clientX,
      y: e.clientY,
      startRight: position.right,
      startBottom: position.bottom,
    };

    const onMove = (ev) => {
      const dx = ev.clientX - dragData.current.x;
      const dy = ev.clientY - dragData.current.y;

      setPosition({
        right: dragData.current.startRight - dx,
        bottom: dragData.current.startBottom - dy,
      });
    };

    const onUp = () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  };

  const getStatusText = (f) => {
    if (f.status === "success") return "Uploaded";
    if (f.status === "error") return f.error || "Upload failed";
    return "Uploading...";
  };

  return (
    <div
      className="fixed bg-white border border-gray-300 rounded-xl shadow-sm z-9999 resize overflow-hidden"
      onMouseDown={onMouseDownDrag}
      style={{
        width: "360px",
        height: minimized ? "48px" : "360px",
        right: position.right,
        bottom: position.bottom,
      }}
    >
      {/* Header */}
      <div
        className="h-12 px-3 flex justify-between items-center cursor-move bg-indigo-50"
        onMouseDown={onMouseDownDrag}
      >
        <h3 className="font-semibold text-sm text-gray-800">Uploading files</h3>

        <div className="flex gap-4 items-center">
          <button
            className="text-sm text-gray-700"
            onClick={(e) => {
              e.stopPropagation();
              setMinimized((p) => !p);
            }}
            title={minimized ? "Restore" : "Minimize"}
          >
            {minimized ? "▢" : "—"}
          </button>

          {allDone && (
            <button
              className="text-sm text-red-600"
              onClick={(e) => {
                e.stopPropagation();
                dispatch(clearUploads());
                dispatch(closeOverlay());
              }}
            >
              Close
            </button>
          )}
        </div>
      </div>

      {/* Body */}
      {!minimized && (
        <div
          className="overflow-y-auto px-3 pb-3"
          style={{ height: "calc(100% - 56px)" }}
        >
          {files.map((f) => (
            <div
              key={f.id}
              className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
            >
              {/* Filename + Status Icon */}
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-800 truncate">
                  {f.name}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-2 rounded-full transition-all ${
                    f.status === "success"
                      ? "bg-green-600"
                      : f.status === "error"
                        ? "bg-red-500"
                        : "bg-indigo-600"
                  }`}
                  style={{ width: `${f.progress}%` }}
                />
              </div>

              {/* Status Text */}
              <div className="mt-2 text-xs">
                {f.status === "error" ? (
                  <div className="flex gap-1 items-center">
                    <CircleAlert size={12} className=" text-red-600" />
                    <span className="text-red-600">{getStatusText(f)}</span>
                  </div>
                ) : f.status === "success" ? (
                  <div className="flex gap-1 items-center">
                    <CircleCheckBig size={12} className=" text-green-700" />
                    <span className="text-green-700">Uploaded</span>
                  </div>
                ) : (
                  <div className="flex gap-1 items-center">
                    <CloudSync size={12} className=" text-gray-600" />
                    <span className="text-gray-600">Uploading...</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UploadOverlay;
