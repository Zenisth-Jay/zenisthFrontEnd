import { X } from "lucide-react";

const FilterPopover = ({
  open,
  onClose,
  filters,
  onChange,
  onClear,
  onApply,
}) => {
  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/20" onClick={onClose} />

      {/* Panel */}
      <div className="fixed z-50 right-20 top-28 w-90 bg-white rounded-xl shadow-lg border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
          <button onClick={onClose}>
            <X className="text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {/* Status */}
          <div>
            <label className="text-sm font-medium text-gray-700">Status</label>
            <select
              className="mt-1 w-full border rounded-lg px-3 py-2"
              value={filters.status}
              onChange={(e) => onChange("status", e.target.value)}
            >
              <option value="">All</option>
              <option value="Completed">Completed</option>
              <option value="Failed">Failed</option>
              <option value="Processing">Processing</option>
            </select>
          </div>

          {/* Source Language */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Source Language
            </label>
            <select
              className="mt-1 w-full border rounded-lg px-3 py-2"
              value={filters.sourceLanguage}
              onChange={(e) => onChange("sourceLanguage", e.target.value)}
            >
              <option value="">Any</option>
              <option value="En">EN</option>
              <option value="Hi">HI</option>
            </select>
          </div>

          {/* Target Language */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Target Language
            </label>
            <select
              className="mt-1 w-full border rounded-lg px-3 py-2"
              value={filters.targetLanguage}
              onChange={(e) => onChange("targetLanguage", e.target.value)}
            >
              <option value="">Any</option>
              <option value="En">EN</option>
              <option value="Hi">HI</option>
            </select>
          </div>

          {/* Tag */}
          <div>
            <label className="text-sm font-medium text-gray-700">Tag</label>
            <select
              className="mt-1 w-full border rounded-lg px-3 py-2"
              value={filters.tag}
              onChange={(e) => onChange("tag", e.target.value)}
            >
              <option value="">Any</option>
              <option value="Finance">Finance</option>
              <option value="Legal">Legal</option>
            </select>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-700">From</label>
              <input
                type="date"
                className="mt-1 w-full border rounded-lg px-3 py-2"
                value={filters.fromDate}
                onChange={(e) => onChange("fromDate", e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">To</label>
              <input
                type="date"
                className="mt-1 w-full border rounded-lg px-3 py-2"
                value={filters.toDate}
                onChange={(e) => onChange("toDate", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-5 flex items-center justify-between">
          <button
            onClick={onClear}
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            Clear all
          </button>

          <button
            onClick={onApply}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700"
          >
            Apply
          </button>
        </div>
      </div>
    </>
  );
};

export default FilterPopover;
