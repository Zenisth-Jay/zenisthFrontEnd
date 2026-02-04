const Tabs = ({ tabs = [], activeTab, onChange }) => {
  return (
    <div className=" inline-flex w-fit px-1 py-1 items-center gap-2 bg-white rounded-xl shadow-sm">
      {tabs.map((tab) => {
        const isActive = tab.id == activeTab;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`
              relative flex items-center gap-2
              px-5 py-3 bg-gray-50 rounded-xl
              text-sm font-medium
              transition
              
            `}
          >
            {Icon && (
              <Icon
                size={18}
                className={tab.iconClassName}
                fill={tab.iconFill ? "currentColor" : "none"}
              />
            )}

            {tab.label}

            {isActive && (
              <span
                className="
                  absolute left-0 right-0 -bottom-px
                  h-0.5 bg-indigo-600
                  rounded-full
                "
              />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default Tabs;
