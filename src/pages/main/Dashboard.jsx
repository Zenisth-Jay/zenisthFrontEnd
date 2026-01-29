import { Search } from "lucide-react";
import MainNavbar from "../../components/dashboard/MainNavbar";
import ToolTabs from "../../components/dashboard/ToolTabs";
import { useMemo, useState } from "react";
import ToolCard from "../../components/dashboard/ToolCard";
import { tools } from "../../data/tools.data";
import ToolGrid from "../../components/dashboard/ToolGrid";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");

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
  }, [activeTab, search]);

  return (
    <>
      <MainNavbar />

      <main className="w-full px-16 py-10 flex flex-col gap-8">
        {/* Header + Search */}
        <section>
          {/* Tool Dashboard Div */}
          <div className="flex items-center justify-between">
            {/* Left content */}
            <header>
              <h1 className=" text-4xl font-bold text-black">Tool Dashboard</h1>
              <p className=" text-gray-800 text-xl">
                Select a tool to get started with your workflow
              </p>
            </header>

            {/* Search bar */}
            <div className=" relative w-1/2 ">
              <Search
                size={22}
                strokeWidth={2.5}
                className=" absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              />
              <input
                value={search}
                type="text"
                placeholder="Search tools......."
                onChange={(e) => {
                  e.preventDefault();
                  setSearch(e.target.value);
                }}
                className="border border-gray-300 rounded-lg w-full pl-10 pr-4 py-2.5 shadow-[0_2px_6px_2px_rgba(0,0,0,0.15)]
                focus:outline-none focus:ring-1 focus:ring-indigo-200
                "
              />
            </div>
          </div>
        </section>

        {/* Tool Tabs */}
        <section>
          <ToolTabs activeTab={activeTab} onChange={setActiveTab} />
        </section>

        {/* Tool cards */}
        <section>
          {/* <ToolGrid tools={tools} /> */}
          {filteredTools.length > 0 ? (
            <ToolGrid tools={filteredTools} />
          ) : (
            <div className="text-center py-20 text-gray-500 text-2xl">
              No tools found
            </div>
          )}
        </section>
      </main>
    </>
  );
};

export default Dashboard;
