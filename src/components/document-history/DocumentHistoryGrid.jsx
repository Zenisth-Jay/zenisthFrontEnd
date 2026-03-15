import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ChevronDown, Folder, MoreVertical, Trash2 } from "lucide-react";
import ConfigurableTable from "../ui/ConfigurableTable";
import { Pill } from "../ui/ConfigurableTable";
import { VARIANTS } from "../../data/variants";
import Pagination from "../ui/Pagination";
import DocumentHistoryExpandable from "./DocumentHistoryExpandable";
import { useGetDocumentHistoryBatchesQuery } from "../../api/documentHistory.api";

const FOLDER_MENU_OPTIONS = [
  // { id: "select", label: "Select Document" },
  { id: "view", label: "View Document" },
  { id: "continue", label: "Continue operation" },
  { id: "add", label: "Add More Document" },
];

function DocumentHistoryActionsCell({ row, onToggleExpand, expandOpen }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toolType = row.operation === "Translation" ? "translate" : "idp";

  const handleMenuAction = (optionId) => {
    setMenuOpen(false);

    if (optionId === "view" || optionId === "add") {
      const batchId = row.id;
      navigate(`/operations/${toolType}/preview?batch_id=${batchId}`);
      return;
    }

    if (optionId === "continue") {
      const batchId = row.id;
      navigate(`/operations/${toolType}/select-tag?batch_id=${batchId}`, {
        state: { fromContinueOperation: true },
      });
      return;
    }
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

// ########################################   Main Function   ######################
const DocumentHistoryGrid = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page") || 1);

  const PAGE_SIZE = 5;

  const {
    data: batchData,
    isLoading: batchLoading,
    isError: BatchError,
  } = useGetDocumentHistoryBatchesQuery({
    page,
    limit: PAGE_SIZE,
  });

  console.log(batchData);

  const totalPages = batchData?.pagination?.total_pages || 1;

  // const totalPages = Math.ceil(FAKE_ROWS.length / PAGE_SIZE);
  // const currentRows = useMemo(() => {
  //   const start = (page - 1) * PAGE_SIZE;
  //   return FAKE_ROWS.slice(start, start + PAGE_SIZE);
  // }, [page]);

  const rows = useMemo(() => {
    if (!batchData?.data) return [];

    return batchData.data
      .filter((batch) => (batch.document_count ?? 0) > 0)
      .map((batch) => ({
        id: batch.batch_id,
        name: batch.batch_name,

        uploadedAt: `Uploaded ${new Date(batch.created_at).toLocaleDateString()} at ${new Date(
          batch.created_at,
        ).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}`,

        documentsCount: batch.document_count,
        operation: batch.operation,

        status: batch.status,
        statusVariant:
          batch.status === "Completed"
            ? "completed"
            : batch.status === "Failed"
              ? "failed"
              : "neutral",

        credits: batch.total_credits,
        size: `${batch.total_size_mb} MB`,
        uploadedBy: batch.uploaded_by,
      }));
  }, [batchData]);

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
            <div className="flex items-center gap-2 min-w-0 w-47 shrink-0">
              <Folder className="text-gray-800 shrink-0" size={22} />
              <div className="flex flex-col justify-center min-w-0 flex-1 truncate items-start gap-0.5">
                <span className="text-gray-900 text-sm truncate font-semibold leading-tight">
                  {row.name}
                </span>
                <span className="text-[10px] truncate text-gray-700 font-normal leading-tight">
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
      rows={rows}
      loading={batchLoading}
      error={BatchError}
      expandableRender={(row) => <DocumentHistoryExpandable row={row} />}
      pagination={<Pagination totalPages={totalPages} />}
      emptyMessage="No documents found."
    />
  );
};

export default DocumentHistoryGrid;
