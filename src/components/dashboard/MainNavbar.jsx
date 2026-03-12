import { useState } from "react";
import { UserRoundCog, Bell, Coins, Menu, X } from "lucide-react";
import { NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
import Logo from "../Authentication/Logo";
import Dropdown from "../navigation/Dropdown";
import DropdownMenu from "../navigation/DropdownMenu";
import NavDropdown from "../navigation/NavDropdown";

import {
  operationsMenu,
  operationsMenuIDP,
} from "../navigation/menus/operations.menu";
import { learnMenu } from "../navigation/menus/learn.menu";
import { supportMenu } from "../navigation/menus/support.menu";
import { resourcesMenu } from "../navigation/menus/resources.menu";
import { adminMenu } from "../navigation/menus/admin.menu";
import { useGetTokensQuery } from "../../api/token.api";
import NotificationDropdown from "../notification/NotificationDropdown";
import { useGetNotificationsQuery } from "../../api/notificationApi";
import ProfileDropdown from "../navigation/ProfielDropdown";
import { supabase } from "../../supabase/supabaseClient"; //
import { toast } from "react-toastify"; //
import CreditIcon from "../Icons/CreditIcon";

const MainNavbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { toolType } = useParams();
  const isIdp = toolType == "idp";
  const navigate = useNavigate();

  // For enable and disable to operation dropdown
  const hasToolType = Boolean(toolType);

  const { data: notifications = [], isLoading: notificationsLoading } =
    useGetNotificationsQuery();

  const normalizedNotifications = notifications
    .map((n) => ({
      notification_id: n.notificationId,
      job_id: n.job_id,
      title: n.title,
      message: n.message,
      type: n.type,
      is_read: n.isRead,
      created_at: n.createdAt,
    }))
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  const hasUnread = normalizedNotifications.some((n) => !n.is_read);

  const { data, isLoading } = useGetTokensQuery();

  // --- Log Out Logic ---
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut(); //
      if (error) throw error;

      toast.success("Logged out successfully ✅");
      navigate("/login"); //
    } catch (err) {
      toast.error(err.message || "Logout failed");
    }
  };

  return (
    <nav className="border-b w-full h-14 min-[1300px]:h-16 bg-white border-[#CBC5EB] shadow-[0_1px_2px_0_rgba(0,0,0,0.30),0_1px_3px_1px_rgba(0,0,0,0.15)] transition-shadow duration-200">
      <div className="px-4 sm:px-6 min-[1300px]:px-16 flex justify-between items-center h-full gap-2">
        {/* Logo + Hamburger (visible only below 1300px) */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            className="min-[1300px]:hidden p-2 -ml-1 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <Logo size="md" />
        </div>

        {/* Navigation Links (visible only from 1300px – unchanged styling) */}
        <div className="hidden min-[1300px]:flex items-center gap-8">
          {/* Dashboard */}
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `text-[15px] font-medium transition ${
                isActive
                  ? "text-indigo-600"
                  : "text-gray-600 hover:text-gray-900"
              }`
            }
          >
            Dashboard
          </NavLink>

          {/* Operations */}
          <NavDropdown
            label="Operations"
            menu={isIdp ? operationsMenuIDP : operationsMenu}
            pathPrefix="/operations"
            disabled={!hasToolType}
          />

          {/* Resources */}
          <NavDropdown
            label="Resources"
            menu={resourcesMenu}
            pathPrefix="/resources"
          />

          {/* Learn */}
          <NavDropdown label="Learn" menu={learnMenu} pathPrefix="/learn" />

          {/* Support */}
          <NavDropdown
            label="Support"
            menu={supportMenu}
            pathPrefix="/support"
          />
        </div>

        {/* Right Part: below 1300px smaller icons; from 1300px unchanged */}
        <div className="flex items-center gap-2 min-[1300px]:gap-4 shrink-0">
          {/* Credits – same at all widths */}
          <div
            // className="px-5 py-2 flex items-center gap-2 border border-[#CFD1DC] rounded-full bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors duration-200"
            className="px-5 py-2 flex items-center gap-2 border border-[#CFD1DC] rounded-full 
             bg-gray-50 from-green-50 to-emerald-50 cursor-pointer 
             hover:from-green-100 hover:to-emerald-100 
             transition-all duration-300 hover:scale-101 hover:shadow-sm active:scale-99"
            onClick={(e) => {
              e.preventDefault();
              navigate("/credit-manage");
            }}
          >
            {/* <Coins size={30} strokeWidth={2.2} className="text-[#545A7A]" /> */}
            <CreditIcon size={33} className="text-[#545A7A]" />
            <span className="w-25 text-green-600 font-extrabold text-2xl text-center">
              {isLoading ? "..." : (data?.balance ?? 0)}
            </span>
          </div>

          {/* Notification bell */}
          <Dropdown
            trigger={() => (
              <button
                // className="relative w-9 h-9 min-[1300px]:w-11 min-[1300px]:h-11 border border-[#CFD1DC] flex items-center justify-center rounded-full bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                className="relative w-9 h-9 min-[1300px]:w-11 min-[1300px]:h-11 border border-[#CFD1DC] 
           flex items-center justify-center rounded-full bg-gray-50 cursor-pointer 
           transition-all duration-200 hover:bg-gray-100 hover:scale-105 active:scale-95 hover:shadow-sm"
              >
                <Bell size={20} strokeWidth={2.2} className="text-[#545A7A]" />

                {!isLoading && hasUnread && (
                  <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full " />
                )}
              </button>
            )}
          >
            <NotificationDropdown notifications={normalizedNotifications} />
          </Dropdown>

          {/* Administration Setting */}
          <Dropdown
            trigger={(open) => (
              <button className="w-9 h-9 min-[1300px]:w-11 min-[1300px]:h-11 border border-[#CFD1DC] flex items-center justify-center rounded-full bg-gray-50 hover:bg-gray-100 cursor-pointer transition-all duration-200">
                <UserRoundCog
                  size={20}
                  strokeWidth={2.2}
                  className={`text-[#545A7A] transition-colors duration-200 ${
                    open ? "text-indigo-600" : ""
                  }`}
                />
              </button>
            )}
          >
            <DropdownMenu menu={adminMenu} />
          </Dropdown>

          <Dropdown
            trigger={(open) => (
              <button
                className={`w-9 h-9 min-[1300px]:w-12 min-[1300px]:h-12 rounded-full overflow-hidden border-2 shrink-0 transition-all duration-200 ${
                  open
                    ? "border-indigo-500 ring-2 ring-indigo-200"
                    : "border-indigo-200"
                } bg-gray-100 cursor-pointer`}
              >
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=19"
                  alt="User Avatar"
                  className="w-full h-full object-cover"
                />
              </button>
            )}
          >
            <ProfileDropdown onLogout={handleLogout} />
          </Dropdown>
        </div>
      </div>

      {/* Mobile menu overlay + panel (only below 1300px) */}
      <div
        className={`fixed inset-0 z-40 min-[1300px]:hidden transition-opacity duration-300 ${
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!mobileOpen}
      >
        <div
          className="absolute inset-0 bg-black/40 transition-opacity duration-300"
          onClick={() => setMobileOpen(false)}
        />
        <div
          className={`absolute top-0 right-0 w-full max-w-sm h-full bg-white shadow-xl border-l border-gray-200 flex flex-col transition-transform duration-300 ease-out ${
            mobileOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <Logo size="nav" />
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100"
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto py-4 px-4 flex flex-col gap-1 animate-fade-in">
            <NavLink
              to="/dashboard"
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `px-4 py-3 rounded-lg text-[15px] font-medium transition-colors ${
                  isActive
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`
              }
            >
              Dashboard
            </NavLink>
            <NavDropdown
              inPanel
              label="Operations"
              menu={isIdp ? operationsMenuIDP : operationsMenu}
              pathPrefix="/operations"
            />
            <NavDropdown
              inPanel
              label="Resources"
              menu={resourcesMenu}
              pathPrefix="/resources"
            />
            <NavDropdown
              inPanel
              label="Learn"
              menu={learnMenu}
              pathPrefix="/learn"
            />
            <NavDropdown
              inPanel
              label="Support"
              menu={supportMenu}
              pathPrefix="/support"
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default MainNavbar;
