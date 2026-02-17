import { ChevronDown } from "lucide-react";

const SortBySelect = ({
  value,
  onChange,
  options = [],
  placeholder = "Sort by",
  className = "",
}) => {
  return (
    <div className={`relative ${className}`}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
          w-full appearance-none border border-gray-300 rounded-lg px-4 py-3 bg-white text-lg text-gray-400
          outline-none focus:ring-1 focus:ring-indigo-400
        "
      >
        <option className="" value="" disabled>
          {placeholder}
        </option>

        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* Right Chevron Icon */}
      <ChevronDown
        size={20}
        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
      />
    </div>
  );
};

export default SortBySelect;
