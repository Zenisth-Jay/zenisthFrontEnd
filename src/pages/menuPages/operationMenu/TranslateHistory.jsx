import { Search, SlidersHorizontal } from "lucide-react";
import MainNavbar from "../../../components/dashboard/MainNavbar";
import { useState } from "react";
import TranslationHistoryGrid from "../../../components/translation-history/TranslationHistoryGrid";
import FilterPopover from "../../../components/translation-history/FilterPopover";
import { useParams } from "react-router-dom";

const TranslateHistory = () => {
  // Search bar
  const [search, setSearch] = useState("");

  // Tool Type
  const { toolType } = useParams();
  const isIdp = toolType == "idp";

  console.log("toolType", toolType);

  // Filters
  const [draftFilters, setDraftFilters] = useState({
    status: "",
    sourceLanguage: "",
    targetLanguage: "",
    tag: "",
    fromDate: "",
    toDate: "",
  });
  const [appliedFilters, setAppliedFilters] = useState(draftFilters);
  const [showFilters, setShowFilters] = useState(false);

  // On filter change
  const handleDraftFilterChange = (key, value) => {
    setDraftFilters((prev) => ({ ...prev, [key]: value }));
  };

  // ApPly Filters
  const handleApplyFilters = () => {
    setAppliedFilters(draftFilters);
    setShowFilters(false);
  };

  // Clear Filters
  const handleClearFilters = () => {
    const empty = {
      status: "",
      sourceLanguage: "",
      targetLanguage: "",
      tag: "",
      fromDate: "",
      toDate: "",
    };
    setDraftFilters(empty);
    setAppliedFilters(empty);
  };

  return (
    <>
      <MainNavbar />
      <main className="w-full bg-gray-50 min-h-[calc(100vh-64px)] px-4 sm:px-6 md:px-10 lg:px-16 py-6 sm:py-8 md:py-10 flex flex-col gap-6 md:gap-8">
        <div className="animate-fade-in-up">
          <h1 className="text-2xl sm:text-3xl md:text-[40px] font-bold">
            {isIdp ? "Extraction" : "Translation"} History
          </h1>
          <p className="text-gray-700 text-base sm:text-lg mt-1">
            View and manage all your{" "}
            {isIdp ? "document extraction" : "translation"} jobs
          </p>
        </div>

        {/* <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
          <div className="relative flex-1 min-w-0">
            <Search
              size={22}
              strokeWidth={1.5}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
            />
            <input
              value={search}
              type="text"
              placeholder="Search jobs...."
              onChange={(e) => {
                e.preventDefault();
                setSearch(e.target.value);
              }}
              className="border border-gray-300 rounded-lg w-full pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 bg-white transition-shadow"
            />
          </div>
          <button
            onClick={() => setShowFilters(true)}
            className="p-2.5 sm:p-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors shrink-0"
          >
            <SlidersHorizontal size={24} className="text-gray-600" />
          </button>
        </div> */}

        {/* History Grid */}
        <TranslationHistoryGrid search={search} filters={appliedFilters} />
      </main>
      <FilterPopover
        open={showFilters}
        onClose={() => setShowFilters(false)}
        filters={draftFilters}
        onChange={handleDraftFilterChange}
        onClear={handleClearFilters}
        onApply={handleApplyFilters}
      />
    </>
  );
};

export default TranslateHistory;
