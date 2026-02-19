const TABS = [
  { id: "all", label: "All Tools" },
  // { id: "translation", label: "Translation" },
  // { id: "ai", label: "AI & Automation" },
  // { id: "document", label: "Document Processing" },
];

const ToolTabs = ({ activeTab, onChange }) => {
  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
      {TABS.map((tab) => (
        <button
          onClick={() => onChange(tab.id)}
          key={tab.id}
          className={`
            px-4 py-2.5 sm:py-3 rounded-full text-base sm:text-lg font-semibold
            transition-all duration-200 ease-out
            ${activeTab == tab.id
              ? "bg-indigo-500 border border-indigo-500 text-white shadow-md"
              : "bg-gray-50 border border-[#787D9C] text-[#787D9C] hover:border-indigo-300 hover:text-indigo-500 hover:bg-indigo-50/50 cursor-pointer active:scale-[0.98]"
            }
          `}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default ToolTabs;
