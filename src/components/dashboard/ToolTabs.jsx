const TABS = [
  { id: "all", label: "All Tools" },
  // { id: "translation", label: "Translation" },
  // { id: "ai", label: "AI & Automation" },
  // { id: "document", label: "Document Processing" },
];

const ToolTabs = ({ activeTab, onChange }) => {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {TABS.map((tab) => (
        <button
          onClick={() => onChange(tab.id)}
          key={tab.id}
          className={`
          px-4 py-3 rounded-full text-lg font-semibold transition-all
          ${
            activeTab == tab.id
              ? " bg-indigo-500 border-gray-50 text-white shadow-md"
              : " bg-gray-50 border border-[#787D9C] text-[#787D9C] hover:border-indigo-300 hover:text-indigo-500 cursor-pointer"
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
