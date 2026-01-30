import {
  UserRoundCog,
  Bell,
  ChevronDown,
  CirclePoundSterling,
} from "lucide-react";
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

const MainNavbar = () => {
  const location = useLocation();

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
            <span className=" text-green-600 font-extrabold text-2xl">
              1200
            </span>
          </div>

          {/* Notification bell */}
          <button className="w-11 h-11 border border-[#CFD1DC] flex items-center justify-center rounded-full bg-gray-50 cursor-pointer">
            <Bell size={20} strokeWidth={2.2} className="text-[#545A7A]" />
          </button>

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

          <div className=" font-bold text-xl text-blue-600 w-12 h-12 border-3 border-indigo-100 flex items-center justify-center rounded-full bg-gray-50 cursor-pointer">
            JD
          </div>

          {/* Right div end */}
        </div>

        {/* end of flex div */}
      </div>
    </nav>
  );
};

export default MainNavbar;
