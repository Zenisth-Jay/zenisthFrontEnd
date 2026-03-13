import { Star, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { iconMap } from "../../constants/iconmap";

const ToolCard = ({ tool }) => {
  const navigate = useNavigate();
  const isDisabled = tool.status === "disabled";
  const Icon = iconMap[tool.icon];

  return (
    <div
      style={{ background: tool.gradient }}
      className={`
        relative rounded-2xl sm:rounded-[20px] p-4 sm:p-5 md:p-6 text-white overflow-hidden
        transition-transform duration-300 ease-out
        ${isDisabled ? "opacity-50 cursor-not-allowed" : "hover:scale-[1.02] hover:shadow-xl active:scale-[0.99]"}
      `}
    >
      {/* Top */}
      <div className="flex items-center justify-between gap-2">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/25 flex items-center justify-center shrink-0">
          <Icon size={22} strokeWidth={2.2} className="sm:w-6 sm:h-6" />
        </div>

        <span className="px-3 py-2 sm:px-4 sm:py-2.5 md:px-5 md:py-3 rounded-full bg-white/30 text-sm sm:text-base md:text-lg font-semibold border border-white/40 truncate max-w-[50%]">
          {tool.badge}
        </span>
      </div>

      {/* Content */}
      <div className="mt-4 md:mt-5">
        <h3 className="text-xl sm:text-2xl font-semibold">{tool.title}</h3>

        <p className="text-base sm:text-lg md:text-xl mt-1 font-medium leading-relaxed text-white/85 min-h-10 sm:min-h-18 line-clamp-2">
          {tool.description}
        </p>
      </div>

      {/* Status */}
      <div className="mt-4 md:mt-5 flex items-center justify-between text-sm gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <Star
            size={20}
            strokeWidth={2.5}
            fill={tool.status === "active" ? "white" : "none"}
            className="text-white shrink-0"
          />
          <span className="font-medium truncate">
            {tool.status === "active" ? "Active" : "Disabled"}
          </span>
        </div>

        <span className="text-white/90 shrink-0">{tool.features} Features</span>
      </div>

      <div className="w-full h-px bg-white/30 my-4 md:my-5" />

      <button
        disabled={isDisabled}
        onClick={() => navigate(tool.path)}
        className={`
          w-full bg-white rounded-lg py-2.5
          flex items-center justify-between px-4 sm:px-5
          font-bold transition-all duration-200
          ${
            isDisabled
              ? "cursor-not-allowed opacity-70"
              : "text-indigo-600 hover:bg-gray-100 hover:shadow-md active:scale-[0.98] cursor-pointer"
          }
        `}
      >
        <span>Launch Product</span>
        <ArrowRight size={20} />
      </button>
    </div>
  );
};

export default ToolCard;
