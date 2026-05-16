import { useState, useMemo, useCallback } from "react";
import { Ban, FileText, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import ExpandableTableSection from "../ui/ExpandableTableSection";
import {
  useGetDocumentHistoryFilesQuery,
  useDeleteDocumentMutation,
} from "../../api/documentHistory.api";
import { Pill } from "../ui/ConfigurableTable";
import { VARIANTS } from "../../data/variants";

const isDeletedStatus = (status) =>
  String(status ?? "")
    .trim()
    .toUpperCase() === "DELETED";

const getBaseColumns = (onDelete) => [
  {
    key: "name",
    width: "2fr",
    align: "left",
    render: (_, row) => {
      const deleted = isDeletedStatus(row.status);
      return (
        <div className="flex items-center gap-2 w-full">
          <FileText
            className={
              deleted ? "text-gray-400 shrink-0" : "text-indigo-700 shrink-0"
            }
            size={20}
          />
          <div className="flex flex-col justify-center flex-1 truncate items-start gap-0.5">
            <span
              className={[
                "text-gray-900 text-sm truncate font-medium leading-tight",
                deleted ? "line-through text-gray-400" : "",
              ].join(" ")}
              title={row.name}
            >
              {row.name}
            </span>
            <span
              className={[
                "text-xs truncate text-gray-600 leading-tight",
                deleted ? "line-through text-gray-400" : "",
              ].join(" ")}
            >
              {row.uploadedAt}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    key: "operation",
    width: "1fr",
    align: "center",
    render: (val, row) => {
      const deleted = isDeletedStatus(row.status);
      return (
        <Pill
          className={[
            VARIANTS.neutral,
            deleted ? "opacity-60 line-through" : "",
          ].join(" ")}
        >
          {val}
        </Pill>
      );
    },
  },
  {
    key: "status",
    width: "1fr",
    align: "center",
    render: (val, row) => {
      const deleted = isDeletedStatus(row.status);
      const variant = row.statusVariant || "neutral";
      return (
        <Pill
          className={[
            VARIANTS[variant] || VARIANTS.neutral,
            deleted ? "opacity-60 line-through" : "",
          ].join(" ")}
        >
          {val}
        </Pill>
      );
    },
  },
  {
    key: "size",
    width: "0.8fr",
    align: "center",
    render: (val, row) => {
      const deleted = isDeletedStatus(row.status);
      return (
        <span
          className={[
            "text-gray-700 font-semibold text-lg",
            deleted ? "line-through text-gray-400" : "",
          ].join(" ")}
        >
          {val}
        </span>
      );
    },
  },
  {
    key: "uploadedBy",
    width: "1fr",
    align: "center",
    render: (val, row) => {
      const deleted = isDeletedStatus(row.status);
      return (
        <span
          className={[
            "text-lg font-normal text-gray-600",
            deleted ? "line-through text-gray-400" : "",
          ].join(" ")}
        >
          {val}
        </span>
      );
    },
  },
  {
    key: "actions",
    width: "1fr",
    align: "center",
    render: (_, fileRow) => (
      <button
        type="button"
        disabled={isDeletedStatus(fileRow.status)}
        onClick={(e) => {
          e.stopPropagation();
          if (isDeletedStatus(fileRow.status)) return;
          onDelete?.(fileRow);
        }}
        className="p-1.5 rounded-md hover:bg-red-50 transition-colors disabled:opacity-50 disabled:pointer-events-none"
        aria-label={
          isDeletedStatus(fileRow.status) ? "File deleted" : "Delete file"
        }
      >
        {isDeletedStatus(fileRow.status) ? (
          <Ban size={20} className="text-gray-400" />
        ) : (
          <Trash2 size={20} className="text-red-500" />
        )}
      </button>
    ),
  },
];

const CHILD_PAGE_SIZE = 5;

export default function DocumentHistoryExpandable({ row }) {
  const [childPage, setChildPage] = useState(1);
  const [optimisticallyDeletedIds, setOptimisticallyDeletedIds] = useState(
    () => new Set(),
  );

  const [deleteDocument] = useDeleteDocumentMutation();

  const {
    data: filesData,
    isLoading: filesLoading,
    isError: filesError,
  } = useGetDocumentHistoryFilesQuery({
    batch_id: row.id,
    page: childPage,
    limit: CHILD_PAGE_SIZE,
  });

  const handleDeleteFile = useCallback(
    (fileRow) => {
      if (isDeletedStatus(fileRow.status)) return;
      // Keep the row visible, but disable it immediately (optimistic UI).
      setOptimisticallyDeletedIds((prev) => new Set(prev).add(fileRow.id));
      deleteDocument({
        doc_id: fileRow.id,
        batch_id: row.id,
      })
        .unwrap()
        .catch((err) => {
          setOptimisticallyDeletedIds((prev) => {
            const next = new Set(prev);
            next.delete(fileRow.id);
            return next;
          });
          const message =
            err?.status === 409
              ? "Cannot delete the last document in the batch."
              : "Failed to delete document.";
          toast.error(message);
        });
    },
    [deleteDocument, row.id],
  );

  const columns = getBaseColumns(handleDeleteFile);

  const childRows = useMemo(() => {
    if (!filesData?.data) return [];

    return filesData.data.map((file) => ({
      id: file.id,
      name: file.filename,

      uploadedAt: `Uploaded ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString(
        [],
        {
          hour: "2-digit",
          minute: "2-digit",
        },
      )}`,

      operation: file.operation,

      status: optimisticallyDeletedIds.has(file.id) ? "DELETED" : file.status,
      statusVariant: (() => {
        const derivedStatus = optimisticallyDeletedIds.has(file.id)
          ? "DELETED"
          : file.status;

        return derivedStatus === "UPLOADED" || derivedStatus === "COMPLETED"
          ? "successful"
          : derivedStatus === "FAILED"
            ? "failed"
            : "neutral";
      })(),

      credits: file.credits,

      size: `${file.size ?? 0}`,

      uploadedBy: row.uploadedBy,
    }));
  }, [filesData, row, optimisticallyDeletedIds]);

  const childTotalPages = filesData?.pagination?.total_pages || 1;

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

  if (filesLoading) {
    return (
      <ExpandableTableSection
        rows={[]}
        columns={columns}
        emptyMessage="Loading files..."
      />
    );
  }

  if (filesError) {
    return (
      <ExpandableTableSection
        rows={[]}
        columns={columns}
        emptyMessage="Failed to load files."
      />
    );
  }

  return (
    <ExpandableTableSection
      rows={childRows}
      columns={columns}
      getRowKey={(r) => r.id}
      pagination={pagination}
      emptyMessage="No documents in this batch."
    />
  );
}
