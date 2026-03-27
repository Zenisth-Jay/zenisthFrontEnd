import { useState, useRef, useEffect } from "react";
import {
  ArrowRight,
  MoreVertical,
  Star,
  User,
  FileMinus,
  Coins,
  Eye,
  Edit,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import CreditIcon from "../Icons/CreditIcon";

const TranslationTag = ({
  tag,
  onToggleFavorite,
  onSelect,
  isSelected,
  width,
  idp,
  queryString = "",
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

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const navigate = useNavigate();

  const tooltipMessage =
    tag.status == "PROCESSING"
      ? "Schema is generating. Please wait a few seconds..."
      : tag.status == "FAILED"
        ? "Schema generation failed. Please create another tag."
        : "";

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div
      className={` group relative ${width} h-50 p-4 bg-white rounded-xl flex flex-col justify-between  hover:shadow-md transition
        ${
          isSelected
            ? "border-2 border-indigo-600 shadow-md"
            : "border border-indigo-200 hover:shadow-md"
        }
        ${idp && tag.status == "COMPLETED" && " cursor-pointer"}
        ${idp && tag.status == "PROCESSING" && "opacity-90 cursor-not-allowed hover:shadow-none"}
        ${idp && tag.status == "FAILED" && "opacity-90 border-red-400 bg-red-200 cursor-not-allowed"}
      `}
      onClick={() => tag.status == "COMPLETED" && onSelect?.(tag)}
    >
      {(tag.status == "PROCESSING" || tag.status == "FAILED") && (
        <div className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-md whitespace-nowrap shadow-lg">
          {tooltipMessage}
        </div>
      )}

      {/* Row 1: Title + Actions */}
      <div className="flex justify-between">
        <div className="flex flex-wrap justify-between w-full text-black text-lg font-medium truncate">
          <div className="w-[70%] truncate">{tag.name}</div>

          {tag.status == "PROCESSING" && (
            <span className=" flex justify-center items-center text-xs px-3 py-2 bg-yellow-100 text-yellow-700 rounded-full">
              Processing
            </span>
          )}

          {tag.status == "FAILED" && (
            <span className=" flex items-center justify-center text-xs px-3 py-1.5 bg-red-100 text-red-700 rounded-full">
              Failed
            </span>
          )}
        </div>

        {tag.status == "COMPLETED" && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite?.(tag);
              }}
              disabled={tag.status != "COMPLETED"}
            >
              <Star
                size={20}
                strokeWidth={1.5}
                className={`${isFavorite ? "text-[#FBC02D]" : "text-[#262938]"} transform transition-all duration-200 ease-out 
             hover:scale-105 active:scale-95`}
                fill={isFavorite ? "#FBC02D" : "none"}
              />
            </button>

            {/* <MoreVertical size={22} className="text-gray-600" /> */}
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation(); // prevent card click
                  setMenuOpen((o) => !o);
                }}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <MoreVertical size={22} className="text-gray-600" />
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
                  <button
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpen(false);
                      // TODO: handle view
                      navigate(
                        `/operations/${idp ? "idp" : "translate"}/tag/view/${tag.id}${queryString}`,
                      );
                    }}
                  >
                    <Eye size={16} className="text-gray-600" />
                    View
                  </button>

                  <button
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpen(false);
                      // TODO: handle edit
                      navigate(
                        `/operations/${idp ? "idp" : "translate"}/tag/edit/${tag.id}${queryString}`,
                      );
                    }}
                  >
                    <Edit size={16} className="text-gray-600" />
                    Edit
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Row 2: Languages + Type */}
      <div className="flex items-center justify-between">
        {/* Left */}
        <div className="flex items-center gap-2">
          <div className=" h-8.5 flex items-center gap-2 border rounded-[50px] px-4 py-2 bg-gray-50 border-gray-400">
            {idp ? (
              <>{tag.outputFormat}</>
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
                {/* <Coins size={18} strokeWidth={1.5} className=" text-gray-700" /> */}
                <CreditIcon size={22} className="text-[#545A7A]" />
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
