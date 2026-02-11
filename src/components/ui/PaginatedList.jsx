import { useMemo, useState } from "react";
import Pagination from "./Pagination";

const PaginatedList = ({ data = [], pageSize = 10, renderItem }) => {
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(data.length / pageSize);

  const currentData = useMemo(() => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return data.slice(start, end);
  }, [data, page, pageSize]);

  // Reset page if data size changes
  if (page > totalPages && totalPages > 0) {
    setPage(1);
  }

  return (
    <div className="flex flex-col">
      {/* List */}
      <div>{currentData.map(renderItem)}</div>

      {/* Pagination */}
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
};

export default PaginatedList;
