import { Coins } from "lucide-react";

// Icons Styling
{
  /* <Coins size={27} strokeWidth={2.5} /> */
}

const AnalysisCard = ({
  icon,
  title,
  value,
  subValue,
  lastRowValue,
  lastRowText,
  positive,
  className,
}) => {
  return (
    <div className="w-full min-w-0 bg-white border border-gray-300 flex flex-col gap-2 p-4 sm:p-5 md:p-6 rounded-lg relative shadow-md transition-shadow duration-200 hover:shadow-lg">
      <div
        className={`flex place-content-center absolute top-4 right-4 sm:top-5 sm:right-5 md:top-6 md:right-6 p-2 sm:p-3 text-indigo-800 border border-[#CFD1DC] rounded-sm ${className} ${positive ? "bg-green-50" : "bg-red-50"}`}
      >
        {icon}
      </div>

      <p className="text-base sm:text-lg font-semibold text-gray-700 pr-12">{title}</p>

      <div className="flex gap-2 items-end h-fit flex-wrap">
        <span className="text-2xl sm:text-[28px] md:text-[32px] font-bold text-indigo-600">{value}</span>
        <span className="text-xs font-medium text-gray-800">
          {subValue?.subValue}
        </span>
      </div>

      {/* <p className=" text-gray-800 text-lg font-semibold">
        <span className={`${positive ? " text-red-800" : " text-green-800"}`}>
          {lastRowValue}
        </span>{" "}
        {lastRowText}
      </p> */}
    </div>
  );
};

export default AnalysisCard;
