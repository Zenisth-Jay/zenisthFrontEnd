import { Pill } from "./ConfigurableTable";
import { VARIANTS } from "../../data/variants";

/**
 * Reusable expandable table section (nested rows under a parent row).
 * Same column shape as ConfigurableTable: pass columns with width (e.g. "2fr", "1fr")
 * and the grid is built from them — no separate grid template needed.
 *
 * @param {Object} props
 * @param {Array<Object>} props.rows - Data for each child row
 * @param {Array<Object>} props.columns - Same as main table: { key, width?, align?, type?, variant?, variantKey?, render?(value, row) }
 * @param {Function} [props.getRowKey] - (row, index) => key for list; default row.id ?? index
 * @param {ReactNode} [props.pagination] - Optional pagination UI below the rows
 * @param {string} [props.emptyMessage] - Shown when rows.length === 0
 * @param {string} [props.className] - Wrapper outer className
 * @param {string} [props.rowClassName] - Each row className
 */
export default function ExpandableTableSection({
  rows = [],
  columns = [],
  getRowKey = (row, i) => row?.id ?? i,
  pagination,
  emptyMessage = "No items.",
  className = "",
  rowClassName = "",
}) {
  const gridTemplate = columns.map((c) => c.width || "1fr").join(" ");
  const gridStyle = { gridTemplateColumns: gridTemplate };
  const baseRowClass =
    "grid items-center text-center gap-4 px-6 py-3 text-sm border-t border-gray-200 bg-gray-50/80 " +
    rowClassName;

  return (
    <div
      className={`border-b border-gray-300 bg-gray-50/50 ${className}`.trim()}
    >
      {rows.length === 0 && (
        <div className="px-6 py-4 text-sm text-gray-500">{emptyMessage}</div>
      )}

      {rows.map((row, index) => (
        <div
          key={getRowKey(row, index)}
          className={baseRowClass}
          style={gridStyle}
        >
          {columns.map((col) => (
            <ExpandableCell
              key={col.key}
              column={col}
              row={row}
              value={row[col.key]}
            />
          ))}
        </div>
      ))}

      {pagination && (
        <div className="flex items-center gap-5 px-6 py-3 border-t border-gray-200 bg-gray-50/80 justify-end">
          {pagination}
        </div>
      )}
    </div>
  );
}

function ExpandableCell({ column, row, value }) {
  const align = column.align || "center";
  const alignClass =
    align === "left"
      ? "text-left justify-start"
      : align === "right"
        ? "text-right justify-end"
        : "text-center justify-center";
  const cellClass = `flex items-center ${alignClass}`;

  if (column.render) {
    return <div className={cellClass}>{column.render(value, row)}</div>;
  }

  switch (column.type) {
    case "pill": {
      const variant =
        column.variantKey && row[column.variantKey]
          ? row[column.variantKey]
          : column.variant || "neutral";
      const pillClass = VARIANTS[variant] || VARIANTS.neutral;
      return (
        <div className={cellClass}>
          <Pill className={pillClass}>{value}</Pill>
        </div>
      );
    }
    case "number":
      return (
        <div className={cellClass}>
          <span className="text-gray-700 font-semibold text-base">
            {typeof value === "number" ? value.toLocaleString() : value}
          </span>
        </div>
      );
    case "custom":
      return <div className={cellClass}>{value}</div>;
    default:
      return (
        <div className={cellClass}>
          <span className="text-gray-700 text-sm">{value}</span>
        </div>
      );
  }
}
