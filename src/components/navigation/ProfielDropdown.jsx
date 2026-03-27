import { User, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import CreditIcon from "../Icons/CreditIcon";

const ProfileDropdown = ({ onLogout }) => {
  return (
    <div className="w-60 rounded-2xl border border-[#DAD4F2] bg-white/95 backdrop-blur-sm shadow-[0_20px_45px_-20px_rgba(84,90,122,0.45)] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      {/* Account */}
      <Link
        to="/user-profile"
        className="group flex items-center gap-3 px-5 py-4 text-gray-800 hover:bg-[#F7F5FF] transition-all duration-200"
      >
        <User
          size={20}
          className="text-gray-700 transition-transform duration-200 group-hover:scale-110 group-hover:-translate-y-px"
        />
        <span className="text-[16px] font-medium tracking-[0.01em] transition-colors duration-200 group-hover:text-[#4B3FA8]">
          Account
        </span>
      </Link>

      <Link
        to="/credit-manage"
        className="group flex items-center gap-2.5 px-5 py-4 text-gray-800 hover:bg-[#F7F5FF] transition-all duration-200"
      >
        <CreditIcon
          size={24}
          className="text-[#545A7A] transition-transform duration-200 group-hover:scale-110 group-hover:-translate-y-px"
        />
        <span className="text-[16px] font-medium tracking-[0.01em] transition-colors duration-200 group-hover:text-[#4B3FA8]">
          Credits
        </span>
      </Link>

      <div className="h-px bg-linear-to-r from-transparent via-[#D6D0EE] to-transparent mx-4" />

      {/* Logout */}
      <button
        onClick={onLogout}
        className="group w-full flex items-center gap-3 px-5 py-4 text-red-500 hover:bg-red-50 transition-all duration-200 cursor-pointer"
      >
        <LogOut
          size={20}
          className="transition-transform duration-200 group-hover:translate-x-0.5"
        />
        <span className="text-[16px] font-semibold tracking-[0.01em]">
          Logout
        </span>
      </button>
    </div>
  );
};

export default ProfileDropdown;
