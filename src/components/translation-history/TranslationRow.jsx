import {
  ArrowRight,
  ChevronDownIcon,
  Eye,
  LibrarySquare,
  FileText,
} from "lucide-react";
import { useState } from "react";

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
  const [loading, setLoading] = useState(false);
  const [children, setChildren] = useState([]); // fetched data

  // 🔹 Mock API call (replace with real API later)
  const fetchChildren = async () => {
    setLoading(true);

    // simulate API delay
    await new Promise((res) => setTimeout(res, 800));

    // mock response (this will come from backend)
    const response = [
      {
        id: "c1",
        name: "Marketing_Value.doc",
        uploadedAt: "Uploaded 08/12/25 at 18:19",
        status: "Failed",
        statusVariant: "failed",
        sourceLanguage: "Hi",
        targetLanguage: "En",
        domain: "Finance",
        credits: "2,100",
      },
      {
        id: "c2",
        name: "Sales_Report_Q3.xlsx",
        uploadedAt: "Uploaded 07/12/25 at 09:30",
        status: "Completed",
        statusVariant: "completed",
        sourceLanguage: "An",
        targetLanguage: "En",
        domain: "Sales",
        credits: "3,500",
      },
    ];

    setChildren(response);
    setLoading(false);
  };

  const handleToggle = async () => {
    setOpen((prev) => !prev);

    // Fetch only first time
    if (!open && children.length === 0) {
      await fetchChildren();
    }
  };

  return (
    <div className="border-b border-gray-300">
      {/* Header Row */}
      <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] items-center text-center gap-4 px-6 py-4 text-sm">
        {/* Job Document */}
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2">
            <LibrarySquare className="text-gray-800" />
            <div className="flex flex-col items-start">
              <h1 className="text-gray-900 text-[16px] font-semibold">
                {row.batchName}
              </h1>
              <span className="text-xs text-gray-700 font-normal">
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
          <div className="flex items-center gap-2">
            <span className="uppercase text-sm font-medium">
              {row.sourceLanguage}
            </span>
            <ArrowRight size={20} strokeWidth={1.5} />
            <span className="uppercase text-sm font-medium">
              {row.targetLanguage}
            </span>
          </div>
        </CircleContainer>

        <CircleContainer variant="tag">{row.domain}</CircleContainer>

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
          {loading && (
            <div className="px-6 py-4 text-sm text-gray-500">Loading...</div>
          )}

          {!loading && children.length === 0 && (
            <div className="px-6 py-4 text-sm text-gray-500">
              No documents found.
            </div>
          )}

          {!loading &&
            children.map((child) => (
              <div
                key={child.id}
                className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] items-center text-center gap-4 px-6 py-4 text-sm border-t border-gray-300"
              >
                <div className="flex items-center gap-2">
                  <FileText className="text-indigo-700" />
                  <div className="flex flex-col items-start">
                    <h1 className="text-gray-900 text-[15px] font-medium">
                      {child.name}
                    </h1>
                    <span className="text-xs text-gray-600">
                      {child.uploadedAt}
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

                <CircleContainer variant="tag">{child.domain}</CircleContainer>

                <p className="text-gray-700 font-semibold text-lg">
                  {child.credits}
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
