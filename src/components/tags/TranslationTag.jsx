import {
  ArrowRight,
  MoreVertical,
  Star,
  User,
  FileMinus,
  Coins,
} from "lucide-react";

const TranslationTag = ({
  tag,
  onToggleFavorite,
  onSelect,
  isSelected,
  width,
  idp,
}) => {
  const {
    name,
    sourceLanguage,
    targetLanguage,
    termCount,
    isFavorite,
    type,
    description,
  } = tag;

  return (
    <div
      className={`${width} h-50 p-4 bg-white rounded-xl flex flex-col justify-between cursor-pointer hover:shadow-md transition
        ${
          isSelected
            ? "border-2 border-indigo-600 shadow-md"
            : "border border-indigo-200 hover:shadow-md"
        }
      `}
      onClick={() => onSelect?.(tag)}
    >
      {/* Row 1: Title + Actions */}
      <div className="flex justify-between">
        <div className=" text-black text-lg font-medium truncate">
          {tag.name}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite?.(tag);
            }}
          >
            <Star
              size={20}
              strokeWidth={1.5}
              className={`${isFavorite ? "text-[#FBC02D]" : "text-[#262938]"} transform transition-all duration-200 ease-out 
             hover:scale-105 active:scale-95`}
              fill={isFavorite ? "#FBC02D" : "none"}
            />
          </button>

          <MoreVertical size={22} className="text-gray-600" />
        </div>
      </div>

      {/* Row 2: Languages + Type */}
      <div className="flex items-center justify-between">
        {/* Left */}
        <div className="flex items-center gap-2">
          <div className=" h-8.5 flex items-center gap-2 border rounded-[50px] px-4 py-2 bg-gray-50 border-gray-400">
            {idp ? (
              <>CSV</>
            ) : (
              <>
                <span className="text-sm font-medium text-[#262938]">
                  {tag.sourceLanguage?.toUpperCase()}
                </span>
                <ArrowRight size={18} className=" text-gray-900" />
                <span className="text-sm font-medium text-[#262938]">
                  {tag.targetLanguage?.toUpperCase()}
                </span>
              </>
            )}
          </div>
          <div>
            <span className="w-12.5 h-3.5 px-4 py-2 border border-indigo-200 bg-indigo-50 text-sm font-semibold text-indigo-700 rounded-[50px]">
              {tag.type}
            </span>
          </div>
        </div>
      </div>

      {/* Row 3 */}
      <div className="">
        <div className=" text-sm text-gray-600 font-normal line-clamp-2">
          {tag.description || "No description provided for this tag."}
        </div>
      </div>

      {/* Row 4 */}
      <div className="flex gap-5">
        <div className=" flex gap-5 w-fit px-3 py-2 rounded-[48px] border border-indigo-300">
          <div className="flex gap-1 items-center">
            <FileMinus size={16} className=" text-indigo-500" />
            <span className=" text-sm font-medium text-gray-800">
              {idp ? `${tag.fieldCount} Fields` : `${tag.termCount} Glossary`}
            </span>
          </div>
        </div>

        {idp && (
          <>
            <div className=" flex gap-5 w-fit px-3 py-2 rounded-[48px] border border-yellow-500">
              <div className="flex gap-2 items-center">
                <Coins size={18} strokeWidth={1.5} className=" text-gray-700" />
                <span className=" text-sm font-medium text-gray-800">
                  {tag.credits} credits
                  <span className=" text-gray-500">/doc</span>
                </span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Row last */}
      {/* <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full border flex justify-center items-center bg-gray-200 border-indigo-300">
          <User size={16} strokeWidth={1.5} className=" text-indigo-600" />
        </div>

        <span className=" text-sm text-gray-700">Sofia Kim</span>

        <span className="px-3 py-1 rounded-[50px] border text-[12px] ml-1 text-white bg-indigo-700">
          Analyst
        </span>
      </div> */}
    </div>
  );
};

export default TranslationTag;
