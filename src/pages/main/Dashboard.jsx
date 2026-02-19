import { Search } from "lucide-react";
import MainNavbar from "../../components/dashboard/MainNavbar";
import ToolTabs from "../../components/dashboard/ToolTabs";
import { useMemo, useState } from "react";
import ToolGrid from "../../components/dashboard/ToolGrid";
import { useGetCardsQuery } from "../../api/cards.api";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");

  const { data, isLoading } = useGetCardsQuery();
  const tools = data ?? [];

  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      // Tab filter
      const matchesTab = activeTab == "all" || tool.category == activeTab;

      // search filter
      const matchsSearch = tool.title
        .toLowerCase()
        .includes(search.toLowerCase());

      return matchesTab && matchsSearch;
    });
  }, [tools, activeTab, search]);

  return (
    <>
      <MainNavbar />

      <main className="w-full px-4 sm:px-6 md:px-10 lg:px-16 py-6 sm:py-8 md:py-10 flex flex-col gap-6 md:gap-8">
        {/* Header + Search */}
        <section className="animate-fade-in-up">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <header>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black">
                Tool Dashboard
              </h1>
              <p className="text-gray-800 text-base sm:text-lg md:text-xl mt-1">
                Select a tool to get started with your workflow
              </p>
            </header>

            <div className="relative w-full lg:w-1/2 lg:max-w-xl shrink-0">
              <Search
                size={22}
                strokeWidth={2.5}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
              />
              <input
                value={search}
                type="text"
                placeholder="Search tools......."
                onChange={(e) => {
                  e.preventDefault();
                  setSearch(e.target.value);
                }}
                className="border border-gray-300 rounded-lg w-full pl-10 pr-4 py-2.5 shadow-[0_2px_6px_2px_rgba(0,0,0,0.15)] focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition-shadow duration-200"
              />
            </div>
          </div>
        </section>

        {/* Tool Tabs */}
        <section className="animate-fade-in-up" style={{ animationDelay: "0.05s" }}>
          <ToolTabs activeTab={activeTab} onChange={setActiveTab} />
        </section>

        {/* Tool cards */}
        <section>
          {isLoading ? (
            <div className="text-center py-16 md:py-20 text-gray-400 text-lg md:text-xl animate-fade-in">
              Loading tools...
            </div>
          ) : filteredTools.length > 0 ? (
            <ToolGrid tools={filteredTools} />
          ) : (
            <div className="text-center py-16 md:py-20 text-gray-500 text-xl md:text-2xl animate-fade-in">
              No tools found
            </div>
          )}
        </section>
      </main>
    </>
  );
};

export default Dashboard;
