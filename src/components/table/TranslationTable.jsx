import TranslationAccordionRow from "./TranslationAccordionRow";

const TranslationTable = ({
  columns = ["Job Document", "Status", "Language", "Tag", "Tokens", "Actions"],
  rows = [],
  enableAccordion = false,
  loadChildren, // (rowId) => void
  getChildren, // (rowId) => { data, isLoading, isError }
}) => {
  return (
    <div className="bg-white border border-gray-300 overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] items-center gap-4 px-6 py-4 bg-gray-100 border-b border-gray-200 text-[16px] font-semibold text-gray-800 text-center">
        {columns.map((col) => (
          <div key={col}>{col}</div>
        ))}
      </div>

      {/* Rows */}
      <div className="w-full">
        {rows.length === 0 && (
          <div className="px-6 py-4 text-sm text-gray-500">
            No records found.
          </div>
        )}

        {rows.map((row) => (
          <TranslationAccordionRow
            key={row.id}
            row={row}
            enableAccordion={enableAccordion}
            loadChildren={loadChildren}
            getChildren={getChildren}
          />
        ))}
      </div>
    </div>
  );
};

export default TranslationTable;
