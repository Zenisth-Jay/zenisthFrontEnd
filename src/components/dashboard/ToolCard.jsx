import { Star, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ToolCard = ({ tool }) => {
  const navigate = useNavigate();
  const isDisabled = tool.status === "disabled";
  const Icon = tool.icon;

  return (
    <div
      style={{ background: tool.gradient }}
      className={`
            relative rounded-[20px] p-6 text-white overflow-hidden
            ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}
        `}
    >
      {/* Top */}
      <div className="flex items-center justify-between">
        {/* Icon circle */}
        <div className="w-12 h-12 rounded-full bg-white/25 flex items-center justify-center">
          <Icon size={26} strokeWidth={2.2} />
        </div>

        {/* Badge */}
        <span className="px-5 py-3 rounded-full bg-white/30 text-lg font-semibold border border-[#CFD1DC]">
          {tool.badge}
        </span>
      </div>

      {/* Content */}
      <div className="mt-5">
        <h3 className="text-2xl font-semibold">{tool.title}</h3>

        <p className=" text-xl mt-1 font-medium leading-relaxed text-white/85">
          {tool.description}
        </p>
      </div>

      {/* Status */}
      <div className="mt-5 flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <Star
            size={22}
            strokeWidth={2.5}
            fill={tool.status === "active" ? "white" : "none"}
            className="text-white"
          />
          <span className="font-medium">
            {tool.status === "active" ? "Active" : "Disabled"}
          </span>
        </div>

        <span className="text-white/90">{tool.features} Features</span>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-gray-300 my-5" />

      {/* Launch */}
      <button
        disabled={isDisabled}
        onClick={() => navigate(tool.path)}
        className={`
          w-full bg-white rounded-lg py-2.5
          flex items-center justify-between px-5
          font-bold transition
          ${
            isDisabled
              ? "cursor-not-allowed opacity-70"
              : "text-indigo-600 hover:bg-gray-100 hover:cursor-pointer"
          }
        `}
      >
        <span>Launch Tool</span>
        <ArrowRight size={20} />
      </button>
    </div>
  );
};

export default ToolCard;
