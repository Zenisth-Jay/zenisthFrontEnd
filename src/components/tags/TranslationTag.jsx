import { ArrowRight, MoreVertical, Star, User } from "lucide-react";

const TranslationTag = () => {
  return (
    <div className=" w-100 h-38 p-4 bg-white border border-indigo-200 rounded-xl flex flex-col justify-between">
      {/* Row 1 */}
      <div className="flex items-center justify-between">
        {/* Left */}
        <div className="flex items-center gap-2">
          <div>
            <span className="w-12.5 h-3.5 px-4 py-2 border border-indigo-200 bg-indigo-50 text-sm font-semibold text-indigo-700 rounded-[50px]">
              Finance
            </span>
          </div>

          <div className=" h-8.5 flex items-center gap-2 border rounded-[50px] px-4 py-2 bg-gray-50 border-gray-400">
            <span className="text-sm font-medium text-[#262938]">HB</span>
            <ArrowRight size={18} className=" text-gray-900" />
            <span className="text-sm font-medium text-[#262938]">EN</span>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          <button type="button">
            <Star size={20} strokeWidth={1.5} className=" text-[#262938]" />
          </button>

          <MoreVertical size={22} />
        </div>
      </div>

      {/* Row 2 */}
      <div className=" mt-1 mb-2">
        <div className=" text-black text-lg font-medium">
          Professional Style
        </div>
        <div className=" text-sm text-gray-600 font-normal">
          Concise, Analytical language
        </div>
      </div>

      {/* Row last */}
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full border flex justify-center items-center bg-gray-200 border-indigo-300">
          <User size={16} strokeWidth={1.5} className=" text-indigo-600" />
        </div>

        <span className=" text-sm text-gray-700">Sofia Kim</span>

        <span className="px-3 py-1 rounded-[50px] border text-[12px] ml-1 text-white bg-indigo-700">
          Analyst
        </span>
      </div>
    </div>
  );
};

export default TranslationTag;
