import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const Breadcrumbs = ({ items }) => {
  return (
    <div className="flex items-center gap-2 text-xl">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div key={index} className="flex items-center gap-2">
            {!isLast ? (
              <Link
                to={item.href}
                className="px-3 py-1 rounded-md text-indigo-600 hover:bg-indigo-50 transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="px-3 py-1 rounded-md text-gray-900 font-medium bg-white">
                {item.label}
              </span>
            )}

            {!isLast && <ChevronRight className="w-4 h-4 text-gray-400" />}
          </div>
        );
      })}
    </div>
  );
};

export default Breadcrumbs;
