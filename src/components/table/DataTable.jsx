const DataTable = ({
  columns = [],
  rows = [],
  headerClassName = "",
  rowClassName = "",
  containerClassName = "",
  onRowClick,
  emptyText = "No records found.",
}) => {
  return (
    <div
      className={`bg-white border border-gray-300 rounded-t-2xl overflow-hidden ${containerClassName}`}
    >
      {/* Header */}
      <div
        className={`grid items-center  gap-4 px-6 py-4 bg-gray-100 text-lg font-semibold text-gray-800 ${headerClassName}`}
        style={{
          gridTemplateColumns: columns.map((c) => c.width || "1fr").join(" "),
        }}
      >
        {columns.map((col) => (
          <div
            key={col.key}
            className={`flex items-center ${
              col.headerClassName || " justify-start"
            }`}
          >
            {col.header}
          </div>
        ))}
      </div>

      {/* Body */}
      {rows.length === 0 && (
        <div className="px-6 py-4 text-sm text-gray-500">{emptyText}</div>
      )}

      {rows.map((row, rowIndex) => (
        <div
          key={row.id || rowIndex}
          className={`grid items-center gap-4 px-6 py-4 border-t border-gray-400 text-sm ${
            typeof rowClassName === "function"
              ? rowClassName(row, rowIndex)
              : rowClassName
          } ${onRowClick ? "cursor-pointer hover:bg-gray-50" : ""}`}
          style={{
            gridTemplateColumns: columns.map((c) => c.width || "1fr").join(" "),
          }}
          onClick={() => onRowClick?.(row)}
        >
          {columns.map((col) => (
            <div
              key={col.key}
              className={`${col.cellClassName || "text-left"} flex items-center`}
            >
              {col.render ? col.render(row[col.key], row) : row[col.key]}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default DataTable;
