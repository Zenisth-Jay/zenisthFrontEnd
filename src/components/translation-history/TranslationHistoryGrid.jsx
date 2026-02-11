import { useMemo, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import Pagination from "../ui/Pagination";
import TranslationRowGrid from "./TranslationRow";

export default function TranslationHistoryGrid({ search = "", filters = {} }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page") || 1);
  const pageSize = 5; // 🔹 rows per page

  // 🔹 Mock 30 rows (later this will come from API)
  const allRows = useMemo(() => {
    return Array.from({ length: 30 }).map((_, i) => ({
      id: i + 1,
      batchName: `Batch_${i + 1}_12_2025_1819`,
      uploadedAt: "Uploaded 08/12/25 at 18:19",
      documents: Math.floor(Math.random() * 50) + 1,
      status: i % 3 === 0 ? "Completed" : i % 3 === 1 ? "Failed" : "Processing",
      statusVariant:
        i % 3 === 0 ? "completed" : i % 3 === 1 ? "failed" : "processing",
      sourceLanguage: "En",
      targetLanguage: "Hi",
      domain: i % 2 === 0 ? "Finance" : "Legal",
      credits: `${1000 + i * 100}`,
    }));
  }, []);

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

  const totalPages = Math.ceil(filteredRows.length / pageSize);

  const startIndex = (page - 1) * pageSize;
  const currentRows = filteredRows.slice(startIndex, startIndex + pageSize);

  return (
    <div className=" bg-white border border-gray-300 shadow-md">
      {/* Table Header */}
      <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] items-center justify-center gap-4 px-6 py-4 bg-gray-100 border-b border-gray-200 text-[16px] font-semibold text-gray-800">
        <div className="text-center">Job Document</div>
        <div className="text-center">Status</div>
        <div className="text-center">Language</div>
        <div className="text-center">Tag</div>
        <div className="text-center">Tokens</div>
        <div className="text-center">Actions</div>
      </div>
      {/* TABLE ROWS */}
      <TranslationRowGrid rows={currentRows} />

      {/* Reusable Pagination */}
      <Pagination totalPages={totalPages} />
    </div>
  );
}
