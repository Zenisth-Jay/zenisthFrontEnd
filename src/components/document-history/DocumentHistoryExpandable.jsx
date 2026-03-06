import { useState, useMemo } from "react";
import { FileText, Trash2 } from "lucide-react";
import ExpandableTableSection from "../ui/ExpandableTableSection";

const CHILD_PAGE_SIZE = 5;

function rowAsChildDocument(parentRow) {
  return {
    id: `${parentRow.id}-child-0`,
    name: parentRow.name,
    uploadedAt: parentRow.uploadedAt,
    operation: parentRow.operation,
    status: parentRow.status,
    statusVariant: parentRow.statusVariant,
    credits: parentRow.credits,
    size: parentRow.size,
    uploadedBy: parentRow.uploadedBy,
  };
}

function getFakeChildDocuments(parentRow, page) {
  const count = parentRow.documentsCount ?? 12;
  const start = (page - 1) * CHILD_PAGE_SIZE;
  const names = [
    "Report_2025.pdf",
    "Summary.docx",
    "Data_Export.xlsx",
    "Notes.txt",
    "Draft_v2.pdf",
  ];
  return Array.from(
    { length: Math.min(CHILD_PAGE_SIZE, Math.max(0, count - start)) },
    (_, i) => {
      const idx = start + i;
      return {
        id: `${parentRow.id}-child-${idx}`,
        name: names[i % names.length] || `Document_${idx}.pdf`,
        uploadedAt: `Uploaded ${new Date(Date.now() - (idx + 1) * 3600000).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "2-digit" })} at ${String(10 + (idx % 12)).padStart(2, "0")}:${String((idx * 7) % 60).padStart(2, "0")}`,
        operation: parentRow.operation,
        status: idx % 4 === 0 ? "Failed" : "Successful",
        statusVariant: idx % 4 === 0 ? "failed" : "successful",
        credits: [50, 100, 200, 150][idx % 4],
        size: ["200 KB", "1.2 MB", "800 KB", "210 KB"][idx % 4],
        uploadedBy: parentRow.uploadedBy,
      };
    },
  );
}

// Same column shape as main table (width per column — grid is built from this)
const EXPANDABLE_COLUMNS = [
  {
    key: "name",
    width: "2fr",
    align: "left",
    render: (_, row) => (
      <div className="flex items-center gap-2 min-w-0 w-50">
        <FileText className="text-indigo-700 shrink-0" size={20} />
        <div className="flex flex-col justify-center min-w-0 flex-1 truncate items-start gap-0.5">
          <span
            className="text-gray-900 text-sm truncate font-medium leading-tight"
            title={row.name}
          >
            {row.name}
          </span>
          <span className="text-xs truncate text-gray-600 leading-tight">
            {row.uploadedAt}
          </span>
        </div>
      </div>
    ),
  },
  {
    key: "operation",
    width: "1fr",
    align: "center",
    type: "pill",
    variant: "neutral",
  },
  {
    key: "status",
    width: "1fr",
    align: "center",
    type: "pill",
    variantKey: "statusVariant",
  },
  {
    key: "credits",
    width: "0.8fr",
    align: "center",
    render: (val) => (
      <span className="text-gray-700 font-semibold text-lg">
        {Number(val).toLocaleString()}
      </span>
    ),
  },
  {
    key: "size",
    width: "0.8fr",
    align: "center",
    render: (val) => (
      <span className="text-gray-700 font-semibold text-lg">{val}</span>
    ),
  },
  {
    key: "uploadedBy",
    width: "1fr",
    align: "center",
    render: (val) => (
      <span className=" text-lg font-normal  text-gray-600">{val}</span>
    ),
  },
  {
    key: "actions",
    width: "1fr",
    align: "center",
    render: (_, fileRow) => (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          // TODO: wire to delete file handler
          console.log("Delete file:", fileRow.id, fileRow.name);
        }}
        className="p-1.5 rounded-md hover:bg-red-50 text-red-500 hover:text-red-600 transition-colors"
        aria-label="Delete file"
      >
        <Trash2 size={20} className="text-red-500" />
      </button>
    ),
  },
];

export default function DocumentHistoryExpandable({ row }) {
  const [childPage, setChildPage] = useState(1);
  const documentsCount = row.documentsCount ?? 0;
  const isSingleFile = documentsCount <= 1;

  const childRows = useMemo(() => {
    if (isSingleFile) return [rowAsChildDocument(row)];
    return getFakeChildDocuments(row, childPage);
  }, [row, childPage, isSingleFile]);

  const childTotalPages = isSingleFile
    ? 1
    : Math.ceil(documentsCount / CHILD_PAGE_SIZE);

  const childStart = Math.max(1, childPage - 2);
  const childEnd = Math.min(childTotalPages, childPage + 2);
  const childPages = [];
  for (let i = childStart; i <= childEnd; i++) childPages.push(i);

  const pagination =
    childTotalPages > 1 ? (
      <>
        <button
          type="button"
          disabled={childPage === 1}
          onClick={() => setChildPage((p) => p - 1)}
          className="text-sm text-gray-600 disabled:opacity-40"
        >
          ← Previous
        </button>
        <div className="flex items-center gap-2">
          {childStart > 1 && (
            <>
              <button
                type="button"
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
              type="button"
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
                type="button"
                onClick={() => setChildPage(childTotalPages)}
                className="w-8 h-8 rounded-md text-sm hover:bg-gray-100"
              >
                {childTotalPages}
              </button>
            </>
          )}
        </div>
        <button
          type="button"
          disabled={childPage === childTotalPages}
          onClick={() => setChildPage((p) => p + 1)}
          className="text-sm text-gray-600 disabled:opacity-40"
        >
          Next →
        </button>
      </>
    ) : null;

  return (
    <ExpandableTableSection
      rows={childRows}
      columns={EXPANDABLE_COLUMNS}
      getRowKey={(r) => r.id}
      pagination={pagination}
      emptyMessage="No documents in this batch."
    />
  );
}
