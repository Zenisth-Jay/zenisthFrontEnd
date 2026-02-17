import {
  ArrowRight,
  ChevronDownIcon,
  Eye,
  LibrarySquare,
  FileText,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const VARIANTS = {
  neutral: "border-[#787D9C] text-[#373B4F] bg-gray-50",
  completed: "bg-green-50 border-green-700 text-gray-800",
  failed: "border-red-700 text-gray-800 bg-red-50",
  processing: "border-orange-700 text-gray-800 bg-orange-50",
  language: "bg-gray-50 border-gray-500 text-[#262938]",
  tag: "border-indigo-200 text-indigo-700 bg-indigo-50 text-lg",
};

const CircleContainer = ({ children, variant = "neutral", className = "" }) => {
  return (
    <div
      className={`
        inline-flex items-center justify-center w-[95%]
        px-4 py-2 rounded-[48px] border
        font-semibold whitespace-nowrap
        ${VARIANTS[variant] || VARIANTS.neutral}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

const TranslationAccordionRow = ({
  row,
  enableAccordion = false,
  loadChildren, // (rowId) => void
  getChildren, // (rowId) => { data, isLoading, isError }
}) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const childrenState = getChildren ? getChildren(row.id) : null;
  const children = childrenState?.data || [];
  const isLoading = childrenState?.isLoading;
  const isError = childrenState?.isError;

  const handleToggle = () => {
    if (!enableAccordion) return;

    setOpen((prev) => {
      const next = !prev;

      // 🔥 Fetch only when opening first time
      if (next && loadChildren) {
        loadChildren(row.id);
      }

      return next;
    });
  };

  return (
    <div className="border-b border-gray-300">
      {/* Main Row */}
      <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] items-center text-center gap-4 px-6 py-4 text-sm">
        {/* Job Document */}
        <div className="w-full flex items-center truncate gap-5">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() =>
              navigate(`/operations/translate/translating?jobId=${row.id}`)
            }
          >
            <LibrarySquare className="text-gray-800" />
            <div className="flex flex-col w-36 truncate items-start">
              <h1 className="text-gray-900 text-[16px] truncate font-semibold">
                {row.id}
              </h1>
              <span className="text-xs truncate text-gray-700 font-normal">
                {row.uploadedAt}
              </span>
            </div>
          </div>

          <CircleContainer>{`${row.documents} Documents`}</CircleContainer>
        </div>

        {/* Status */}
        <div className="flex items-center justify-center">
          <CircleContainer variant={row.statusVariant}>
            {row.status}
          </CircleContainer>
        </div>

        {/* Language */}
        <CircleContainer variant="language">
          <div className="flex truncate items-center gap-2">
            <span className="uppercase text-sm font-medium">
              {row.sourceLanguage}
            </span>
            <ArrowRight size={20} strokeWidth={1.5} />
            <span className="uppercase text-sm font-medium">
              {row.targetLanguage}
            </span>
          </div>
        </CircleContainer>

        {/* Tag */}
        <CircleContainer variant="tag" className="truncate">
          {row.domain}
        </CircleContainer>

        {/* Tokens */}
        <p className="text-gray-700 font-semibold text-lg">{row.credits}</p>

        {/* Actions */}
        {enableAccordion ? (
          <button
            onClick={handleToggle}
            className="flex items-center justify-center transition-transform"
          >
            <ChevronDownIcon
              className={`transition-transform duration-200 ${
                open ? "rotate-180" : ""
              }`}
            />
          </button>
        ) : (
          <button className="flex items-center justify-center">
            <Eye />
          </button>
        )}
      </div>

      {/* Expanded Content */}
      {enableAccordion && open && (
        <div className="border-t border-gray-300 bg-gray-50">
          {isLoading && (
            <div className="px-6 py-4 text-sm text-gray-500">Loading...</div>
          )}

          {isError && (
            <div className="px-6 py-4 text-sm text-red-500">
              Failed to load documents.
            </div>
          )}

          {!isLoading && children.length === 0 && (
            <div className="px-6 py-4 text-sm text-gray-500">
              No documents found.
            </div>
          )}

          {!isLoading &&
            children.map((child, idx) => (
              <div
                key={idx}
                className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] items-center text-center gap-4 px-6 py-4 text-sm border-t border-gray-200 bg-white"
              >
                <div className="flex items-center gap-2">
                  <FileText className="text-indigo-700" />
                  <div className="flex flex-col truncate items-start">
                    <h1 className="text-gray-900 text-[15px] truncate font-medium">
                      {child.name}
                    </h1>
                    <span className="text-xs truncate text-gray-600">
                      {child.time}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  <CircleContainer variant={child.statusVariant}>
                    {child.status}
                  </CircleContainer>
                </div>

                <CircleContainer variant="language">
                  <div className="flex items-center gap-2">
                    <span className="uppercase text-sm font-medium">
                      {child.sourceLanguage}
                    </span>
                    <ArrowRight size={20} strokeWidth={1.5} />
                    <span className="uppercase text-sm font-medium">
                      {child.targetLanguage}
                    </span>
                  </div>
                </CircleContainer>

                <CircleContainer variant="tag">{row.domain}</CircleContainer>

                <p className="text-gray-700 font-semibold text-lg">
                  {child.tokens}
                </p>

                <button className="flex items-center justify-center">
                  <Eye />
                </button>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default TranslationAccordionRow;
