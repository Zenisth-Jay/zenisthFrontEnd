import { UserRoundCog, Bell, CirclePoundSterling } from "lucide-react";
import { Link, NavLink, useLocation } from "react-router-dom";
import Logo from "../Authentication/Logo";
import Dropdown from "../navigation/Dropdown";
import DropdownMenu from "../navigation/DropdownMenu";
import NavDropdown from "../navigation/NavDropdown";

import { operationsMenu } from "../navigation/menus/operations.menu";
import { learnMenu } from "../navigation/menus/learn.menu";
import { supportMenu } from "../navigation/menus/support.menu";
import { resourcesMenu } from "../navigation/menus/resources.menu";
import { adminMenu } from "../navigation/menus/admin.menu";
import { useGetTokensQuery } from "../../api/token.api";
import NotificationDropdown from "../notification/NotificationDropdown";
import { useGetNotificationsQuery } from "../../api/notificationApi";
import ProfileDropdown from "../navigation/ProfielDropdown";

const MainNavbar = () => {
  const { data: notifications = [], isLoading: notificationsLoading } =
    useGetNotificationsQuery();

  const normalizedNotifications = notifications.map((n) => ({
    notification_id: n.notificationId,
    job_id: n.job_id,
    title: n.title,
    message: n.message,
    type: n.type,
    is_read: n.isRead,
    created_at: n.createdAt,
  }));

  const hasUnread = normalizedNotifications.some((n) => !n.is_read);

  const { data, isLoading } = useGetTokensQuery();

  return (
    <nav className=" border-b w-full h-16 bg-white border-[#CBC5EB] shadow-[0_1px_2px_0_rgba(0,0,0,0.30),0_1px_3px_1px_rgba(0,0,0,0.15)]">
      <div className="px-16 flex justify-between items-center h-full">
        {/* ###############################     Logo     ########################################*/}
        <Logo size="md" />

        {/* ############################     Navigation Links      #############################*/}
        <div className="hidden md:flex items-center gap-8">
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
            menu={operationsMenu}
            pathPrefix="/operations"
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

        {/*##############################    Right Part   #####################################*/}
        <div className=" flex items-center gap-4">
          {/* Credits */}
          <div className="px-5 py-2 flex items-center gap-2 border border-[#CFD1DC] rounded-full bg-gray-50">
            <CirclePoundSterling
              size={25}
              strokeWidth={2.2}
              className="text-[#545A7A]"
            />
            <span className=" w-25 text-green-600 font-extrabold text-2xl text-center">
              {/* {loading ? "..." : balance} */}
              {isLoading ? "..." : (data?.balance ?? 0)}
            </span>
          </div>

          {/* Notification bell */}

          <Dropdown
            trigger={() => (
              <button className="relative w-11 h-11 border border-[#CFD1DC] flex items-center justify-center rounded-full bg-gray-50 cursor-pointer">
                <Bell size={20} strokeWidth={2.2} className="text-[#545A7A]" />

                {!isLoading && hasUnread && (
                  <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full" />
                )}
              </button>
            )}
          >
            <NotificationDropdown notifications={normalizedNotifications} />
          </Dropdown>

          {/* Administration Setting */}
          <Dropdown
            trigger={(open) => (
              <button className="w-11 h-11 border border-[#CFD1DC] flex items-center justify-center rounded-full bg-gray-50 hover:bg-gray-100 cursor-pointer transition">
                <UserRoundCog
                  size={20}
                  strokeWidth={2.2}
                  className={`text-[#545A7A] transition ${
                    open ? "text-indigo-600" : ""
                  }`}
                />
              </button>
            )}
          >
            <DropdownMenu menu={adminMenu} />
          </Dropdown>

          {/* <div className=" font-bold text-xl text-blue-600 w-12 h-12 border-3 border-indigo-100 flex items-center justify-center rounded-full bg-gray-50 cursor-pointer">
            JD
          </div> */}

          <Dropdown
            trigger={(open) => (
              <button className="w-12 h-12 font-bold text-xl text-blue-600 border-2 border-indigo-200 flex items-center justify-center rounded-full bg-gray-50 hover:bg-gray-100 transition cursor-pointer">
                JD
              </button>
            )}
          >
            <ProfileDropdown />
          </Dropdown>

          {/* Right div end */}
        </div>

        {/* end of flex div */}
      </div>
    </nav>
  );
};

export default MainNavbar;
