import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ChevronDown, Folder, MoreVertical, Trash2 } from "lucide-react";
import ConfigurableTable from "../ui/ConfigurableTable";
import { Pill } from "../ui/ConfigurableTable";
import { VARIANTS } from "../../data/variants";
import Pagination from "../ui/Pagination";
import DocumentHistoryExpandable from "./DocumentHistoryExpandable";

const FOLDER_MENU_OPTIONS = [
  // { id: "select", label: "Select Document" },
  { id: "view", label: "View Document" },
  { id: "continue", label: "Continue operation" },
  { id: "add", label: "Add More Document" },
];

function DocumentHistoryActionsCell({ row, onToggleExpand, expandOpen }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMenuAction = (optionId) => {
    setMenuOpen(false);
    // TODO: wire to real handlers (Select Document, View Document, Continue operation, Add More Document)
    console.log("Folder action:", optionId, row);
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <div className="relative" ref={menuRef}>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen((o) => !o);
          }}
          className="p-1.5 rounded-md hover:bg-gray-100 text-gray-600"
          aria-haspopup="true"
          aria-expanded={menuOpen}
        >
          <MoreVertical size={20} className="text-gray-700" />
        </button>
        {menuOpen && (
          <div className="absolute right-0 top-full mt-1 min-w-45 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1">
            {FOLDER_MENU_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleMenuAction(opt.id);
                }}
                className="w-full text-left px-4 py-2.5 text-sm text-gray-800 hover:bg-gray-50"
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggleExpand?.();
        }}
        className="flex items-center justify-center p-1 rounded-md hover:bg-gray-100 transition-transform"
        aria-expanded={expandOpen}
      >
        <ChevronDown
          size={20}
          className={`text-gray-700 transition-transform duration-200 ${expandOpen ? "rotate-180" : ""}`}
        />
      </button>
    </div>
  );
}

const FAKE_ROWS = [
  {
    id: "batch-1",
    name: "Batch_08_12_2025_1819",
    uploadedAt: "Uploaded 08/12/25 at 18:19",
    documentsCount: 47,
    operation: "Translation",
    status: "Completed",
    statusVariant: "completed",
    credits: 2500,
    size: "5 MB",
    uploadedBy: "Arjun Patel",
  },
  {
    id: "doc-1",
    name: "Marketing_Value.doc",
    uploadedAt: "Uploaded 07/12/25 at 14:30",
    documentsCount: 1,
    operation: "Translation",
    status: "Completed",
    statusVariant: "completed",
    credits: 2000,
    size: "4 MB",
    uploadedBy: "Tarun Patel",
  },
  {
    id: "doc-2",
    name: "Sales_Report_Q3.xlsx",
    uploadedAt: "Uploaded 06/12/25 at 09:15",
    documentsCount: 1,
    operation: "Extraction",
    status: "Failed",
    statusVariant: "failed",
    credits: 100,
    size: "200 KB",
    uploadedBy: "Alice Johnson",
  },
  {
    id: "batch-2",
    name: "Batch_05_12_2025_1022",
    uploadedAt: "Uploaded 05/12/25 at 10:22",
    documentsCount: 12,
    operation: "Translation",
    status: "Completed",
    statusVariant: "completed",
    credits: 800,
    size: "10 MB",
    uploadedBy: "Arjun Patel",
  },
  {
    id: "doc-3",
    name: "Contract_Draft.pdf",
    uploadedAt: "Uploaded 04/12/25 at 16:45",
    documentsCount: 1,
    operation: "Translation",
    status: "Completed",
    statusVariant: "completed",
    credits: 150,
    size: "210 KB",
    uploadedBy: "Tarun Patel",
  },
  {
    id: "batch-3",
    name: "Batch_05_12_2025_1022",
    uploadedAt: "Uploaded 05/12/25 at 10:22",
    documentsCount: 12,
    operation: "Translation",
    status: "Completed",
    statusVariant: "completed",
    credits: 800,
    size: "10 MB",
    uploadedBy: "Arjun Patel",
  },
  {
    id: "doc-5",
    name: "Contract_Draft.pdf",
    uploadedAt: "Uploaded 04/12/25 at 16:45",
    documentsCount: 1,
    operation: "Translation",
    status: "Completed",
    statusVariant: "completed",
    credits: 150,
    size: "210 KB",
    uploadedBy: "Tarun Patel",
  },
  {
    id: "batch-4",
    name: "Batch_05_12_2025_1022",
    uploadedAt: "Uploaded 05/12/25 at 10:22",
    documentsCount: 12,
    operation: "Translation",
    status: "Completed",
    statusVariant: "completed",
    credits: 800,
    size: "10 MB",
    uploadedBy: "Arjun Patel",
  },
  {
    id: "doc-8",
    name: "Contract_Draft.pdf",
    uploadedAt: "Uploaded 04/12/25 at 16:45",
    documentsCount: 1,
    operation: "Translation",
    status: "Completed",
    statusVariant: "completed",
    credits: 150,
    size: "210 KB",
    uploadedBy: "Tarun Patel",
  },
];

const PAGE_SIZE = 5;

// ########################################   Main Function   ######################
const DocumentHistoryGrid = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page") || 1);

  const totalPages = Math.ceil(FAKE_ROWS.length / PAGE_SIZE);
  const currentRows = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return FAKE_ROWS.slice(start, start + PAGE_SIZE);
  }, [page]);

  const columns = useMemo(
    () => [
      {
        key: "name",
        header: "Uploaded Document",
        width: "2fr",
        align: "center",
        type: "custom",
        render: (_, row) => (
          <div className="w-full flex items-center gap-4 self-stretch">
            <div className="flex items-center gap-2 min-w-0 w-45 shrink-0">
              <Folder className="text-gray-800 shrink-0" size={22} />
              <div className="flex flex-col justify-center min-w-0 flex-1 truncate items-start gap-0.5">
                <span className="text-gray-900 text-sm truncate font-semibold leading-tight">
                  {row.name}
                </span>
                <span className="text-xs truncate text-gray-700 font-normal leading-tight">
                  {row.uploadedAt}
                </span>
              </div>
            </div>
            <div className="flex items-center shrink-0 w-32 justify-center">
              <Pill className={`${VARIANTS.neutral} w-full justify-center`}>
                {row.documentsCount} Document
                {row.documentsCount !== 1 ? "s" : ""}
              </Pill>
            </div>
          </div>
        ),
      },
      {
        key: "operation",
        header: "Operation",
        width: "1fr",
        align: "center",
        type: "pill",
        variant: "neutral",
      },
      {
        key: "status",
        header: "Status",
        width: "1fr",
        align: "center",
        type: "pill",
        variantKey: "statusVariant",
      },
      {
        key: "credits",
        header: "Credits",
        width: "0.8fr",
        align: "center",
        type: "custom",
        render: (val) => (
          <span className="text-gray-700 font-semibold text-lg">
            {Number(val).toLocaleString()}
          </span>
        ),
      },
      {
        key: "size",
        header: "Size",
        width: "0.8fr",
        align: "center",
        type: "custom",
        render: (val) => (
          <span className="text-gray-700 font-semibold text-lg">{val}</span>
        ),
      },
      {
        key: "uploadedBy",
        header: "Uploaded By",
        width: "1fr",
        align: "center",
        type: "custom",
        render: (val) => (
          <span className=" text-lg font-normal  text-gray-600">{val}</span>
        ),
      },
      // {
      //   key: "actions",
      //   header: "Actions",
      //   width: "1fr",
      //   align: "center",
      //   type: "actions",
      // },
      {
        key: "actions",
        header: "Actions",
        width: "1fr",
        align: "center",
        type: "actions",
        render: (_, row, onToggleExpand, expandOpen) => (
          <DocumentHistoryActionsCell
            row={row}
            onToggleExpand={onToggleExpand}
            expandOpen={expandOpen}
          />
        ),
      },
    ],
    [],
  );

  return (
    <ConfigurableTable
      columns={columns}
      rows={currentRows}
      expandableRender={(row) => <DocumentHistoryExpandable row={row} />}
      pagination={<Pagination totalPages={totalPages} />}
      emptyMessage="No documents found."
    />
  );
};

export default DocumentHistoryGrid;
