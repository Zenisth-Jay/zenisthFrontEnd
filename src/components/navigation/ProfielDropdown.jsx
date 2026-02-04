import { User, LogOut } from "lucide-react";
import { Link } from "react-router-dom";

const ProfileDropdown = ({ onLogout }) => {
  return (
    <div className="w-54 bg-white rounded-xl shadow-xl border border-[#CBC5EB] overflow-hidden">
      {/* Account */}
      <Link
        to="/user-profile"
        className="flex items-center gap-3 px-5 py-4 text-gray-800 hover:bg-gray-50 transition"
      >
        <User size={22} className=" text-gray-700" />
        <span className="text-lg font-medium">Account</span>
      </Link>

      <div className="h-px bg-gray-200 mx-5" />

      {/* Logout */}
      <button
        // onClick={onLogout}
        className="w-full flex items-center gap-3 px-5 py-4 text-red-500 hover:bg-red-50 transition"
      >
        <LogOut size={22} />
        <span className="text-lg font-semibold">Logout</span>
      </button>
    </div>
  );
};

export default ProfileDropdown;
