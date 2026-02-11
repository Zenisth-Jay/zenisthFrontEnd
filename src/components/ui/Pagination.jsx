import { useSearchParams } from "react-router-dom";

const Pagination = ({
  totalPages,
  paramName = "page", // allows reuse with different params
  className = "",
}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get(paramName) || 1);

  const setPage = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set(paramName, newPage);
    setSearchParams(params);
  };

  if (totalPages <= 1) return null;

  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, page + 2);

  const pages = [];
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div
      className={`flex items-center gap-5 px-6 py-4 border-t bg-white ${className}`}
    >
      {/* Previous */}
      <button
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
        className="text-lg text-gray-600 disabled:opacity-40"
      >
        ← Previous
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-2">
        {start > 1 && (
          <>
            <button
              onClick={() => setPage(1)}
              className="w-8 h-8 rounded-md text-sm hover:bg-gray-100"
            >
              1
            </button>
            <span className="px-1">…</span>
          </>
        )}

        {pages.map((p) => (
          <button
            key={p}
            onClick={() => setPage(p)}
            className={`w-8 h-8 rounded-md text-sm font-medium ${
              p === page
                ? "bg-gray-900 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            {p}
          </button>
        ))}

        {end < totalPages && (
          <>
            <span className="px-1">…</span>
            <button
              onClick={() => setPage(totalPages)}
              className="w-8 h-8 rounded-md text-sm hover:bg-gray-100"
            >
              {totalPages}
            </button>
          </>
        )}
      </div>

      {/* Next */}
      <button
        disabled={page === totalPages}
        onClick={() => setPage(page + 1)}
        className="text-sm text-gray-600 disabled:opacity-40"
      >
        Next →
      </button>
    </div>
  );
};

export default Pagination;
