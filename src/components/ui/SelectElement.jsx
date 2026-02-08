import { ChevronDown } from "lucide-react";

const SelectElement = ({ label, name, register, options, placeholder }) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-[#424242] text-[18px] font-medium">
        {label} <span className="text-red-500">*</span>
      </label>

      <div className="relative">
        <select
          {...register(name)}
          className="w-full border border-gray-300 px-4 py-3 pr-12 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand bg-white appearance-none"
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.code} value={opt.code}>
              {opt.label}
            </option>
          ))}
        </select>

        <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
          <ChevronDown size={20} />
        </div>
      </div>
    </div>
  );
};

export default SelectElement;
