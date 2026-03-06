import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { VARIANTS } from "../../data/variants";

/**
 * Reusable configurable table (columns, expandable rows, pills, etc.).
 * Renamed from DataTable to avoid conflict with existing table/DataTable.
 *
 * @param {Object} props
 * @param {Array<ColumnDef>} props.columns - Column definitions (key, header, width, align, type, render, etc.)
 * @param {Array<Object>} props.rows - Array of row data objects
 * @param {Function} [props.expandableRender] - (row) => ReactNode for expandable row content (enables Actions column with chevron)
 * @param {ReactNode} [props.pagination] - Optional pagination component to render below table
 * @param {boolean} [props.loading] - Show loading state
 * @param {boolean} [props.error] - Show error state
 * @param {string} [props.emptyMessage] - Message when rows.length === 0
 * @param {Function} [props.getRowKey] - (row, index) => key for list key; default uses row.id ?? index
 * @param {string} [props.className] - Wrapper className
 * @param {string} [props.headerClassName] - Header row className
 * @param {string} [props.rowClassName] - Each body row className
 * @param {string} [props.cellClassName] - Default cell className
 *
 * ColumnDef:
 *   key, header, width?, align?, type?: "text"|"pill"|"number"|"link"|"actions"|"document"|"custom"
 *   variant?, variantKey?, render?, href?, onClick?, icon?, titleKey?, subtitleKey?, pillKey?, pillFormat?
 */
export default function ConfigurableTable({
  columns = [],
  rows = [],
  expandableRender,
  pagination,
  loading = false,
  error = false,
  emptyMessage = "No records found.",
  getRowKey,
  className = "",
  headerClassName = "",
  rowClassName = "",
  cellClassName = "",
}) {
  const resolveRowKey = getRowKey ?? ((row, i) => row?.id ?? i);
  const gridTemplate = columns.map((c) => c.width || "1fr").join(" ");
  const gridStyle = { gridTemplateColumns: gridTemplate };

  if (loading) {
    return (
      <div
        className={`bg-white border border-gray-300 shadow-md p-10 flex items-center justify-center ${className}`}
      >
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`bg-white border border-gray-300 shadow-md p-6 text-red-600 ${className}`}
      >
        Failed to load data.
      </div>
    );
  }

  return (
    <div className={`bg-white border border-gray-300 shadow-md ${className}`}>
      <div
        style={gridStyle}
        className={`grid items-center justify-center gap-4 px-6 py-4 bg-gray-100 border-b border-gray-200 text-[16px] font-semibold text-gray-800 ${headerClassName}`}
      >
        {columns.map((col) => (
          <div
            key={col.key}
            className={col.headerClassName || ""}
            style={{ textAlign: col.align || "center" }}
          >
            {col.header}
          </div>
        ))}
      </div>

      <div className="w-full">
        {rows.length === 0 && (
          <div className="px-6 py-4 text-sm text-gray-500">{emptyMessage}</div>
        )}

        {rows.map((row, rowIndex) => (
          <ConfigurableTableRow
            key={resolveRowKey(row, rowIndex)}
            row={row}
            columns={columns}
            gridStyle={gridStyle}
            rowClassName={rowClassName}
            cellClassName={cellClassName}
            expandableRender={expandableRender}
          />
        ))}
      </div>

      {pagination}
    </div>
  );
}

function ConfigurableTableRow({
  row,
  columns,
  gridStyle,
  rowClassName,
  cellClassName,
  expandableRender,
}) {
  const [open, setOpen] = useState(false);
  const hasExpand = Boolean(expandableRender);

  return (
    <div className="border-b border-gray-300">
      <div
        style={gridStyle}
        className={`grid items-center text-center gap-4 px-6 py-4 text-sm ${rowClassName}`}
      >
        {columns.map((col) => (
          <ConfigurableTableCell
            key={col.key}
            column={col}
            row={row}
            value={row[col.key]}
            cellClassName={cellClassName}
            onToggleExpand={
              hasExpand && col.type === "actions"
                ? () => setOpen((o) => !o)
                : undefined
            }
            expandOpen={open}
          />
        ))}
      </div>

      {hasExpand && open && (
        <div className="border-b border-gray-300">{expandableRender(row)}</div>
      )}
    </div>
  );
}

function ConfigurableTableCell({
  column,
  row,
  value,
  cellClassName,
  onToggleExpand,
  expandOpen,
}) {
  const align = column.align || "center";
  const alignClass =
    align === "left"
      ? "text-left justify-start"
      : align === "right"
        ? "text-right justify-end"
        : "text-center justify-center";

  const baseCellClass =
    `flex items-center ${alignClass} ${column.cellClassName || ""} ${cellClassName}`.trim();

  // Actions column with custom render needs onToggleExpand/expandOpen for chevron
  if (column.type === "actions" && column.render) {
    return (
      <div className={baseCellClass}>
        {column.render(value, row, onToggleExpand, expandOpen)}
      </div>
    );
  }

  if (column.render) {
    return <div className={baseCellClass}>{column.render(value, row)}</div>;
  }

  switch (column.type) {
    case "actions":
      return (
        <div className={`${baseCellClass}`}>
          <button
            type="button"
            onClick={onToggleExpand}
            className="flex items-center justify-center transition-transform"
            aria-expanded={expandOpen}
          >
            <ChevronDown
              className={`transition-transform duration-200 ${expandOpen ? "rotate-180" : ""}`}
            />
          </button>
        </div>
      );

    case "number":
      return (
        <div className={baseCellClass}>
          <span className="text-gray-700 font-semibold text-lg">{value}</span>
        </div>
      );

    case "pill": {
      const variant =
        column.variantKey && row[column.variantKey]
          ? row[column.variantKey]
          : column.variant || "neutral";
      const pillClass = VARIANTS[variant] || VARIANTS.neutral;
      return (
        <div className={baseCellClass}>
          <Pill className={pillClass}>{value}</Pill>
        </div>
      );
    }

    case "link": {
      const href =
        typeof column.href === "function" ? column.href(row) : column.href;
      return (
        <div className={baseCellClass}>
          <a
            href={href}
            onClick={(e) => {
              if (column.onClick) {
                e.preventDefault();
                column.onClick(row);
              }
            }}
            className="text-indigo-600 hover:underline font-medium"
          >
            {value}
          </a>
        </div>
      );
    }

    case "document": {
      const title = column.titleKey ? row[column.titleKey] : value;
      const subtitle = column.subtitleKey ? row[column.subtitleKey] : null;
      const rawPill = column.pillKey != null ? row[column.pillKey] : null;
      const pillText =
        rawPill != null && column.pillFormat
          ? column.pillFormat(rawPill)
          : rawPill;
      const Icon = column.icon;
      return (
        <div
          className={`${baseCellClass} w-full flex items-center truncate gap-5`}
        >
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => column.onClick?.(row)}
            onKeyDown={(e) => e.key === "Enter" && column.onClick?.(row)}
            role={column.onClick ? "button" : undefined}
            tabIndex={column.onClick ? 0 : undefined}
          >
            {Icon && <span className="shrink-0">{Icon}</span>}
            <div className="flex flex-col w-36 truncate items-start">
              <span className="text-gray-900 text-[16px] truncate font-semibold">
                {title}
              </span>
              {subtitle != null && (
                <span className="text-xs truncate text-gray-700 font-normal">
                  {subtitle}
                </span>
              )}
            </div>
          </div>
          {pillText != null && (
            <Pill className={VARIANTS.neutral}>{pillText}</Pill>
          )}
        </div>
      );
    }

    case "custom":
      return <div className={baseCellClass}>{value}</div>;

    default:
      return (
        <div className={baseCellClass}>
          <span className="text-gray-900">{value}</span>
        </div>
      );
  }
}

function Pill({ children, className = "" }) {
  return (
    <div
      className={`
        inline-flex items-center justify-center w-[95%]
        px-4 py-3 rounded-[48px] border
        font-semibold whitespace-nowrap
        ${className}
      `}
    >
      {children}
    </div>
  );
}

export { Pill };
