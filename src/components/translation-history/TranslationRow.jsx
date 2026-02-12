import {
  ArrowRight,
  ChevronDownIcon,
  Eye,
  LibrarySquare,
  FileText,
} from "lucide-react";
import { useState } from "react";
import { useGetBatchFilesQuery } from "../../api/HistoryBatch.api";

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
        px-4 py-3 rounded-[48px] border
        font-semibold whitespace-nowrap
        ${VARIANTS[variant] || VARIANTS.neutral}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

// 🔹 Single Accordion Row
const TranslationRow = ({ row }) => {
  const [open, setOpen] = useState(false);

  // for SUB pages
  const [childPage, setChildPage] = useState(1);
  const childPageSize = 5;

  // API Fetch
  const {
    data: filesResponse,
    isLoading: isFilesLoading,
    isError: isFilesError,
  } = useGetBatchFilesQuery(
    { jobId: row.id, page: childPage, limit: childPageSize },
    { skip: !open }, // 👈 only fetch when open
  );

  const files = filesResponse?.files || [];
  const childTotalPages = filesResponse?.pagination?.total_pages || 1;

  const childStart = Math.max(1, childPage - 2);
  const childEnd = Math.min(childTotalPages, childPage + 2);

  const childPages = [];
  for (let i = childStart; i <= childEnd; i++) childPages.push(i);

  const handleToggle = () => {
    setOpen((prev) => {
      const next = !prev;
      if (next) {
        setChildPage(1); // reset when opening
      }
      return next;
    });
  };

  return (
    <div className="border-b border-gray-300">
      {/* Header Row */}
      <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] items-center text-center gap-4 px-6 py-4 text-sm">
        {/* Job Document */}
        <div className=" w-full flex items-center truncate gap-5">
          <div className="flex items-center gap-2">
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

        <div className="flex items-center justify-center">
          <CircleContainer variant={row.statusVariant}>
            {row.status}
          </CircleContainer>
        </div>

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

        <CircleContainer variant="tag" className=" truncate">
          {row.domain}
        </CircleContainer>

        <p className="text-gray-700 font-semibold text-lg">{row.credits}</p>

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
      </div>

      {/* Accordion Content */}
      {open && (
        <div className="border-b border-gray-300">
          {isFilesLoading && (
            <div className="px-6 py-4 text-sm text-gray-500">Loading...</div>
          )}

          {isFilesError && (
            <div className="px-6 py-4 text-sm text-red-500">
              Failed to load documents.
            </div>
          )}

          {!isFilesLoading && files.length === 0 && (
            <div className="px-6 py-4 text-sm text-gray-500">
              No documents found.
            </div>
          )}

          {!isFilesLoading &&
            files.map((child) => (
              <div
                key={`${child.document_name}-${child.time_stamp}`}
                className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] items-center text-center gap-4 px-6 py-4 text-sm border-t border-gray-300"
              >
                <div className="flex items-center gap-2">
                  <FileText className="text-indigo-700" />
                  <div className="flex flex-col truncate items-start">
                    <h1
                      className="text-gray-900 text-[15px] truncate font-medium"
                      title={child.document_name}
                    >
                      {child.document_name}
                    </h1>
                    <span className="text-xs truncate text-gray-600">
                      {new Date(child.time_stamp).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  <CircleContainer
                    variant={
                      child.status === "SUCCESS" ? "completed" : "failed"
                    }
                  >
                    {child.status}
                  </CircleContainer>
                </div>

                <CircleContainer variant="language">
                  <div className="flex items-center gap-2">
                    <span className="uppercase text-sm font-medium">
                      {child.source_language.toUpperCase()}
                    </span>
                    <ArrowRight size={20} strokeWidth={1.5} />
                    <span className="uppercase text-sm font-medium">
                      {child.target_language.toUpperCase()}
                    </span>
                  </div>
                </CircleContainer>

                <CircleContainer
                  variant="tag"
                  extraClassName=" hover:bg-gray-600"
                >
                  {row.domain}
                </CircleContainer>

                <p className="text-gray-700 font-semibold text-lg">
                  {child.tokens}
                </p>

                <button className="flex items-center justify-center">
                  <Eye />
                </button>
              </div>
            ))}

          {/* Child Pagination */}
          {/* Child Pagination */}
          {!isFilesLoading && childTotalPages > 1 && (
            <div className="flex items-center gap-5 px-6 py-3 border-t bg-white justify-end">
              {/* Previous */}
              <button
                disabled={childPage === 1}
                onClick={() => setChildPage((p) => p - 1)}
                className="text-sm text-gray-600 disabled:opacity-40"
              >
                ← Previous
              </button>

              {/* Page Numbers */}
              <div className="flex items-center gap-2">
                {childStart > 1 && (
                  <>
                    <button
                      onClick={() => setChildPage(1)}
                      className="w-8 h-8 rounded-md text-sm hover:bg-gray-100"
                    >
                      1
                    </button>
                    <span className="px-1">…</span>
                  </>
                )}

                {childPages.map((p) => (
                  <button
                    key={p}
                    onClick={() => setChildPage(p)}
                    className={`w-8 h-8 rounded-md text-sm font-medium ${
                      p === childPage
                        ? "bg-gray-900 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {p}
                  </button>
                ))}

                {childEnd < childTotalPages && (
                  <>
                    <span className="px-1">…</span>
                    <button
                      onClick={() => setChildPage(childTotalPages)}
                      className="w-8 h-8 rounded-md text-sm hover:bg-gray-100"
                    >
                      {childTotalPages}
                    </button>
                  </>
                )}
              </div>

              {/* Next */}
              <button
                disabled={childPage === childTotalPages}
                onClick={() => setChildPage((p) => p + 1)}
                className="text-sm text-gray-600 disabled:opacity-40"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// 🔹 Parent Grid
export default function TranslationRowGrid({ rows = [] }) {
  return (
    <div className="w-full">
      {rows.length === 0 && (
        <div className="px-6 py-4 text-sm text-gray-500">No records found.</div>
      )}

      {rows.map((row) => (
        <TranslationRow key={row.id} row={row} />
      ))}
    </div>
  );
}
