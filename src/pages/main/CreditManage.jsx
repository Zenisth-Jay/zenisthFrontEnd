import { Coins, Plus, SquareActivity, TrendingUp } from "lucide-react";
import MainNavbar from "../../components/dashboard/MainNavbar";
import Button from "../../components/ui/Button";
import AnalysisCard from "../../components/creditManagement/AnalysisCard";
import { useState } from "react";
import { FileText } from "lucide-react";
import DataTable from "../../components/table/DataTable";
import { useSearchParams } from "react-router-dom";
import Pagination from "../../components/ui/Pagination";
import { useGetCreditManagementQuery } from "../../api/creditManage.api";

const VARIANTS = {
  neutral: "border-[#787D9C] text-[#373B4F] bg-gray-50",
  completed: "bg-green-50 border-green-700 text-gray-800",
  failed: "border-red-700 text-gray-800 bg-red-50",
  processing: "border-orange-700 text-gray-800 bg-orange-50",
  language: "bg-gray-50 border-gray-500 text-[#262938]",
  tag: "border-indigo-200 text-indigo-700 bg-indigo-50 text-lg",
};

const CircleContainer = ({ children, variant = "neutral", className = "" }) => {
  return (
    <div
      className={`
        inline-flex items-center justify-center w-[95%] 
        px-4 py-3 rounded-[48px] border
        font-semibold whitespace-nowrap
        ${VARIANTS[variant] || VARIANTS.neutral}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

const columns = [
  {
    key: "operation",
    header: "Operation",
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
      <div className="flex items-center gap-3">
        <FileText className="text-indigo-500" size={22} />
        <div className="flex flex-col">
          <span className="font-medium text-gray-900 truncate">{row.name}</span>
          <span className="text-xs text-gray-500">{row.uploadedAt}</span>
        </div>
      </div>
    ),
  },
  {
    key: "status",
    header: "Status",
    width: "1fr",
    headerClassName: "justify-center",
    cellClassName: "justify-center",
    render: (v) => (
      <CircleContainer
        variant={
          v === "Completed"
            ? "completed"
            : v === "Failed"
              ? "failed"
              : v === "Processing"
                ? "processing"
                : "neutral"
        }
      >
        {v}
      </CircleContainer>
    ),
  },
  {
    key: "label",
    header: "Tag Name",
    width: "1fr",
    headerClassName: "justify-center",
    cellClassName: "justify-center",
    render: (v) => v && <CircleContainer variant="tag">{v}</CircleContainer>,
  },
  {
    key: "units",
    header: "Units",
    width: "1fr",
    headerClassName: "justify-center",
    cellClassName: "justify-center text-[16px]",
  },
  // {
  //   key: "credits",
  //   header: "Credits",
  //   width: "1fr",
  //   headerClassName: "justify-center",
  //   cellClassName: "justify-center text-lg",
  // },
  {
    key: "credits",
    header: "Credits",
    width: "1fr",
    headerClassName: "justify-center",
    cellClassName: "justify-center text-lg",
    render: (v) => {
      const value = Number(v);
      const isPositive = value > 0;

      return (
        <span
          className={`
          font-bold tracking-wide
          transition-all duration-300 ease-out
          ${isPositive ? "text-green-600" : "text-red-600"}
          animate-fade-in-up
          hover:scale-110
        `}
        >
          {v}
        </span>
      );
    },
  },

  {
    key: "review",
    header: "Review",
    width: "0.6fr",
    headerClassName: "justify-center",
    cellClassName: "justify-center text-lg",
    render: () => "-",
  },
];

const CreditManage = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAddCreditsModal, setShowAddCreditsModal] = useState(false);

  const limit = isExpanded ? 7 : 3;

  // For Pagination
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get("page") || 1);

  // CREDIT ROWS API FETCH
  const { data, isLoading, isError } = useGetCreditManagementQuery({
    page,
    limit,
  });

  // console.log(data);

  const stats = data?.stats;
  const rows = data?.transactions || [];

  const tableRows = rows.map((t) => ({
    id: t.transaction_id,
    operation: t.operation, // e.g. UPLOAD_FEE
    name: t.job_document || "-",
    uploadedAt: new Date(t.created_at).toLocaleString(),
    status:
      t.status === "COMPLETED"
        ? "Completed"
        : t.status === "FAILED"
          ? "Failed"
          : "Processing",
    label: t.tag_name === "-" ? "" : t.tag_name,
    units: t.units,
    credits: t.credits > 0 ? `+${t.credits}` : String(t.credits),
  }));

  const totalPages = data?.total_pages ?? 1;

  return (
    <div>
      <MainNavbar />

      {!isExpanded ? (
        <main className="flex flex-col gap-6 sm:gap-8 md:gap-10 px-4 sm:px-6 md:px-10 lg:px-16 py-6 sm:py-8 md:py-10 w-full min-h-[calc(100vh-64px)] bg-gray-50">
          <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-fade-in-up">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                Credit Management
              </h1>
              <p className="text-gray-700 text-base sm:text-lg mt-1">
                Manage your Credit and Credit Usage.
              </p>
            </div>
            <Button
              leftIcon={<Plus />}
              onClick={() => setShowAddCreditsModal(true)}
              className="w-full sm:w-auto shrink-0"
            >
              Add Credits
            </Button>
          </header>

          <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 animate-fade-in-up">
            <AnalysisCard
              icon={<Coins size={27} strokeWidth={2.5} />}
              title="Remaining Credits"
              value={stats?.remaining_credits ?? "..."}
              subValue="5000(limit)"
              lastRowValue="+62"
              lastRowText="Standard Translation"
              className="bg-yellow-50"
            />

            <AnalysisCard
              icon={<TrendingUp size={27} strokeWidth={2.5} />}
              title="Usage This Month"
              value={stats?.usage_this_month ?? "..."}
              lastRowValue="+0.8% vs"
              lastRowText="last month"
              positive={true}
            />

            <AnalysisCard
              icon={<SquareActivity size={27} strokeWidth={2.5} />}
              title="Avg Usage Per Day"
              value={stats?.avg_usage_per_day ?? "..."}
              lastRowValue="-5%"
              lastRowText="decerese"
              positive={false}
            />
          </section>

          <section className="bg-white w-full rounded-xl sm:rounded-2xl shadow-md border border-gray-300 overflow-hidden animate-fade-in-up">
            <DataTable columns={columns} rows={tableRows} />

            <div className="border-t border-gray-400 px-4 sm:px-6 py-4 text-center">
              <button
                onClick={() => setIsExpanded(true)}
                className="text-indigo-500 font-medium hover:underline cursor-pointer transition-colors"
              >
                View All
              </button>
            </div>
          </section>
        </main>
      ) : (
        <main className="px-4 sm:px-6 md:px-10 lg:px-16 py-6 sm:py-10 w-full min-h-[calc(100vh-64px)] bg-gray-50">
          <div className="flex items-center justify-start mb-6 md:mb-10">
            <h1 className="text-2xl sm:text-3xl font-bold">All Credit Usage</h1>
          </div>

          <div className="bg-white w-full rounded-xl sm:rounded-2xl border border-gray-300 overflow-hidden">
            {isLoading && <div className="p-6 animate-fade-in">Loading...</div>}
            {isError && (
              <div className="p-6 text-red-500">Failed to load data</div>
            )}
            {!isLoading && !isError && (
              <DataTable columns={columns} rows={tableRows} />
            )}

            <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 px-4 sm:px-6 py-4 border-t">
              <button
                onClick={() => setIsExpanded(false)}
                className="text-indigo-500 font-medium hover:underline cursor-pointer transition-colors"
              >
                View Less
              </button>
              <Pagination totalPages={totalPages} />
            </div>
          </div>
        </main>
      )}

      {showAddCreditsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md sm:max-w-lg md:w-105 p-6 sm:p-8 relative animate-scale-in max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowAddCreditsModal(false)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label="Close"
            >
              ✕
            </button>

            {/* Content */}
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-2xl font-bold">
                💳
              </div>

              <h2 className="text-2xl font-semibold text-gray-900">
                Need More Credits?
              </h2>

              <p className="text-gray-600 text-lg">
                To get more credits, please contact us at
              </p>

              <a
                href="mailto:credits@zenisth.ai"
                className="text-indigo-600 font-semibold text-lg hover:underline"
              >
                credits@zenisth.ai
              </a>

              <div className="mt-6 w-full">
                <Button
                  className="w-full"
                  onClick={() => setShowAddCreditsModal(false)}
                >
                  Got it
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreditManage;
