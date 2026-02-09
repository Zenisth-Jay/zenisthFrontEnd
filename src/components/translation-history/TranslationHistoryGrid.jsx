import TranslationRowGrid from "./TranslationRow";

export default function TranslationHistoryGrid() {
  return (
    <div className=" bg-white border border-gray-300 shadow-md">
      {/* Table Header */}
      <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] items-center justify-center gap-4 px-6 py-4 bg-gray-100 border-b border-gray-200 text-[16px] font-semibold text-gray-800">
        <div className="text-center">Job Document</div>
        <div className="text-center">Status</div>
        <div className="text-center">Language</div>
        <div className="text-center">Tag</div>
        <div className="text-center">Tokens</div>
        <div className="text-center">Actions</div>
      </div>
      {/* TABLE ROWS */}
      <TranslationRowGrid />
    </div>
  );
}
