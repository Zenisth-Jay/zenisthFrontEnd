import { useMemo, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import Pagination from "../ui/Pagination";
import TranslationRowGrid from "./TranslationRow";
import { useGetHistoryBatchesQuery } from "../../api/HistoryBatch.api";
import { useParams } from "react-router-dom";

export default function TranslationHistoryGrid({ search = "", filters = {} }) {
  const { toolType } = useParams();
  const isIdp = toolType == "idp";
  const appType = toolType || "translate";
  // const appType = "translate";
  const [searchParams, setSearchParams] = useSearchParams();

  // Page information
  const page = Number(searchParams.get("page") || 1);
  const pageSize = 5; // 🔹 rows per page

  // Fetch history batches from API
  const {
    data: historyResponse,
    isLoading: isHistoryLoading,
    isError: isHistoryError,
  } = useGetHistoryBatchesQuery({
    page,
    limit: pageSize,
    appType,
  });

  // 🔹 Map API response to UI rows
  const allRows = useMemo(() => {
    if (!historyResponse?.jobs) return [];

    return historyResponse.jobs.map((job) => ({
      id: job.job_id,
      batchName: job.tag_name,
      uploadedAt: new Date(job.created_at).toLocaleString(),
      documents: job.total_documents,
      status:
        job.job_status === "FAILED"
          ? "Failed"
          : job.job_status === "COMPLETED" ||
              job.job_status === "PARTIAL_FAILURE"
            ? "Completed"
            : "Processing",
      statusVariant:
        job.job_status === "FAILED"
          ? "failed"
          : job.job_status === "COMPLETED" ||
              job.job_status === "PARTIAL_FAILURE"
            ? "completed"
            : "processing",
      sourceLanguage: isIdp ? null : job.source_lang?.toUpperCase() || "",
      targetLanguage: isIdp ? null : job.target_lang?.toUpperCase() || "",
      outputFormat: isIdp ? job.output_format : null,
      domain: job.tag_industry,
      credits: job.cost,
    }));
  }, [historyResponse]);

  const totalPages = historyResponse?.pagination?.total_pages || 1;

  // 🔹 Apply search + filters
  const filteredRows = useMemo(() => {
    return allRows.filter((row) => {
      // 🔍 Search (batch name)
      if (
        search &&
        !row.batchName.toLowerCase().includes(search.toLowerCase())
      ) {
        return false;
      }

      // 🎯 Status
      if (filters.status && row.status !== filters.status) return false;

      // 🌐 Source Language
      if (
        filters.sourceLanguage &&
        row.sourceLanguage !== filters.sourceLanguage
      )
        return false;

      // 🌍 Target Language
      if (
        filters.targetLanguage &&
        row.targetLanguage !== filters.targetLanguage
      )
        return false;

      // 🏷️ Tag
      if (filters.tag && row.domain !== filters.tag) return false;

      // 📅 Date Range
      if (filters.fromDate && row.uploadedAt < filters.fromDate) return false;
      if (filters.toDate && row.uploadedAt > filters.toDate) return false;

      return true;
    });
  }, [allRows, search, filters]);

  const filterKey = useMemo(
    () => `${search}|${JSON.stringify(filters)}`,
    [search, filters],
  );

  const prevFilterKeyRef = useRef(filterKey);

  useEffect(() => {
    // Only reset page when search/filters ACTUALLY change
    if (prevFilterKeyRef.current !== filterKey) {
      prevFilterKeyRef.current = filterKey;

      setSearchParams((prev) => {
        const params = new URLSearchParams(prev);
        params.set("page", "1");
        return params;
      });
    }
  }, [filterKey, setSearchParams]);

  // const totalPages = Math.ceil(filteredRows.length / pageSize);

  // const startIndex = (page - 1) * pageSize;
  // const currentRows = filteredRows.slice(startIndex, startIndex + pageSize);
  const currentRows = filteredRows;

  // if (isHistoryLoading) {
  //   return (
  //     <div className="bg-white border border-gray-300 shadow-md p-6 text-gray-600">
  //       Loading history...
  //     </div>
  //   );
  // }

  if (isHistoryLoading) {
    return (
      <div className="bg-white border border-gray-300 shadow-md p-10 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (isHistoryError) {
    return (
      <div className="bg-white border border-gray-300 shadow-md p-6 text-red-600">
        Failed to load history.
      </div>
    );
  }

  return (
    <div className=" bg-white border border-gray-300 shadow-md">
      {/* Table Header */}
      <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] items-center justify-center gap-4 px-6 py-4 bg-gray-100 border-b border-gray-200 text-[16px] font-semibold text-gray-800">
        <div className="text-center">Job Document</div>
        <div className="text-center">Status</div>
        <div className="text-center">
          {isIdp ? "Output Format" : "Language"}
        </div>
        <div className="text-center">Tag</div>
        <div className="text-center">Credits</div>
        <div className="text-center">Actions</div>
      </div>
      {/* TABLE ROWS */}
      <TranslationRowGrid rows={currentRows} />

      {/* Reusable Pagination */}
      <Pagination totalPages={totalPages} />
    </div>
  );
}
