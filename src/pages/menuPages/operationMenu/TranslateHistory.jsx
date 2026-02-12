import { Search, SlidersHorizontal } from "lucide-react";
import MainNavbar from "../../../components/dashboard/MainNavbar";
import { useState } from "react";
import TranslationHistoryGrid from "../../../components/translation-history/TranslationHistoryGrid";
import FilterPopover from "../../../components/translation-history/FilterPopover";

const TranslateHistory = () => {
  // Search bar
  const [search, setSearch] = useState("");

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
      <main className="w-full bg-gray-50 min-h-[calc(100vh-64px)] px-16 py-10 flex flex-col gap-8">
        {/* Heading */}
        <div>
          <h1 className=" text-[40px] font-bold">Translation History</h1>
          <p className=" text-gray-700 text-lg">
            View and manage all your translation jobs
          </p>
        </div>

        {/* !FILTER */}
        <div className="flex items-center gap-4">
          <div className=" relative w-full ">
            <Search
              size={22}
              strokeWidth={1.5}
              className=" absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            />
            <input
              value={search}
              type="text"
              placeholder="Search jobs...."
              onChange={(e) => {
                e.preventDefault();
                setSearch(e.target.value);
              }}
              className="border border-gray-300 rounded-lg w-full pl-10 pr-4 py-2.5 
                      focus:outline-none focus:ring-1 focus:ring-indigo-200 bg-white
                      "
            />
          </div>
          <button
            onClick={() => setShowFilters(true)}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100"
          >
            <SlidersHorizontal size={24} className="text-gray-600" />
          </button>
        </div>

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
