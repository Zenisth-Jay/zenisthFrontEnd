import { SlidersHorizontal } from "lucide-react";

const FilterBar = ({
  value = "",
  onClick,
  placeholder = "Set Filter...",
  className = "",
}) => {
  return (
    <div onClick={onClick} className={`relative cursor-pointer ${className}`}>
      {/* Right Icon */}
      <SlidersHorizontal
        size={22}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
      />

      <div
        className="
          w-full border border-gray-300 rounded-lg px-4 py-3 bg-white text-lg text-gray-800
          outline-none focus-within:ring-1 focus-within:ring-indigo-400
          flex items-center
        "
      >
        {value ? (
          <span className="text-gray-800">{value}</span>
        ) : (
          <span className="text-gray-400">{placeholder}</span>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
