import { Search } from "lucide-react";

const SearchBar = ({
  value,
  onChange,
  placeholder = "Search...",
  rightIcon = null,
}) => {
  return (
    <div className=" w-full relative">
      {/* left Icon */}
      <Search
        size={22}
        className=" absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
      />

      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-300 rounded-lg pl-12 pr-10 py-3 bg-white text-lg text-gray-800 
        outline-none focus:ring-1 focus:ring-indigo-400
        "
      />

      {/* Optional Right Icon */}
      {rightIcon && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer">
          {rightIcon}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
