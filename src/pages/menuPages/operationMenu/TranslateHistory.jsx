import { Search, SlidersHorizontal } from "lucide-react";
import MainNavbar from "../../../components/dashboard/MainNavbar";
import { useState } from "react";
import TranslationHistoryGrid from "../../../components/translation-history/TranslationHistoryGrid";

const TranslateHistory = () => {
  const [search, setSearch] = useState("");

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
          <div className="flex">
            <SlidersHorizontal size={28} className=" text-gray-400" />
          </div>
        </div>

        {/* History Grid */}
        <TranslationHistoryGrid />
      </main>
    </>
  );
};

export default TranslateHistory;
