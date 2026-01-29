import { Link } from "react-router-dom";

const DropdownMenu = ({ menu }) => {
  // MEGA MENU (Learn, Resources)
  if (menu.type === "mega") {
    return (
      <div className="absolute top-full left-0 mt-4 w-160 bg-white border border-indigo-200 rounded-xl shadow-lg p-6 grid grid-cols-2 gap-6 z-50">
        {menu.sections.map((section) => (
          <div key={section.title}>
            <p className="text-xs font-semibold text-gray-500 mb-3 uppercase">
              {section.title}
            </p>

            {section.items.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition"
              >
                <div className="w-9 h-9 flex items-center justify-center rounded-lg border">
                  <item.icon size={18} className="text-indigo-600" />
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {item.label}
                  </p>
                  <p className="text-xs text-gray-500">{item.description}</p>
                </div>
              </Link>
            ))}
          </div>
        ))}
      </div>
    );
  }

  // SIMPLE MENU (Operations, Support)
  return (
    <div className="absolute top-full left-0 mt-4 w-80 bg-white border border-indigo-200 rounded-xl shadow-lg p-4 z-50">
      <p className="text-xs font-semibold text-gray-500 mb-3 uppercase">
        {menu.title}
      </p>

      {menu.items.map((item) => (
        <Link
          key={item.label}
          to={item.path}
          className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition"
        >
          <div className="w-9 h-9 flex items-center justify-center rounded-lg border">
            <item.icon size={18} className="text-indigo-600" />
          </div>

          <div>
            <p className="text-sm font-medium text-gray-900">{item.label}</p>
            <p className="text-xs text-gray-500">{item.description}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default DropdownMenu;
