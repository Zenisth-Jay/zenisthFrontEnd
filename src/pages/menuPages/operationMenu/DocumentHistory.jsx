import MainNavbar from "../../../components/dashboard/MainNavbar";
import DocumentHistoryGrid from "../../../components/document-history/DocumentHistoryGrid";
import DataTable from "../../../components/table/DataTable";
import { VARIANTS } from "../../../data/variants";

// 🔹 Fake rows (replace with API later)
const FAKE_BATCHES = [
  {
    id: "b1",
    operation: "UPLOAD_FEE",
    name: "Big_Invoice_Batch_January_2026.pdf",
    uploadedAt: "2026-01-12 10:22",
    status: "Completed",
    label: "Finance",
    units: 120,
    credits: "+240",
  },
  {
    id: "b2",
    operation: "UPLOAD_FEE",
    name: "HR_Documents_February.zip",
    uploadedAt: "2026-02-02 14:11",
    status: "Processing",
    label: "HR",
    units: 80,
    credits: "-80",
  },
];

// 🔹 Fake API call (replace later)
const fetchBatchFiles = (batchId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: "f1", name: "file_1.pdf", pages: 2 },
        { id: "f2", name: "file_2.pdf", pages: 5 },
        { id: "f3", name: "file_3.pdf", pages: 1 },
      ]);
    }, 800);
  });
};

const columns = [
  {
    key: "batch",
    header: "batch",
    width: "1fr",
    headerClassName: "justify-center",
    cellClassName: " justify-center text-center text-lg font-semibold",
  },
  {
    key: "job",
    header: "Job Document",
    width: "1.8fr",
    headerClassName: "justify-center",
    cellClassName: "justify-center",
    render: (_, row) => (
      <div className="flex items-center gap-3 min-w-0">
        <FileText className="text-indigo-500 shrink-0" size={22} />
        <div className="flex flex-col min-w-0">
          <span className="font-medium text-gray-900 truncate max-w-45">
            {row.name}
          </span>
          <span className="text-xs text-gray-500">{row.uploadedAt}</span>
        </div>
      </div>
    ),
  },
];
const tableRows = [];

const DocumentHistory = () => {
  return (
    <>
      <MainNavbar />
      <main className="w-full min-h-[calc(100vh-64px)] bg-gray-50 flex flex-col gap-6 sm:gap-8 md:gap-10 px-4 sm:px-6 md:px-10 lg:px-16 py-6 sm:py-8 md:py-10">
        <header className="flex flex-col animate-fade-in-up">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
            Document Upload History
          </h1>
          <p className="text-gray-700 text-base sm:text-lg mt-1">
            Upload and manage all your uploaded document batches.
          </p>
        </header>

        <DocumentHistoryGrid />
      </main>
    </>
  );
};

export default DocumentHistory;
