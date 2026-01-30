import { ChevronDown } from "lucide-react";
import { useLocation } from "react-router-dom";
import Dropdown from "./Dropdown";
import DropdownMenu from "./DropdownMenu";

const NavDropdown = ({ label, menu, pathPrefix }) => {
  const location = useLocation();

  const isActive = location.pathname.startsWith(pathPrefix);

  return (
    <Dropdown
      trigger={(open) => (
        <button
          className={`flex items-center gap-1 text-[15px] font-medium transition cursor-pointer
            ${
              isActive ? "text-indigo-600" : "text-gray-600 hover:text-gray-900"
            }`}
        >
          {label}

          <ChevronDown
            size={16}
            className={`transition ${open ? "rotate-180" : ""}`}
          />
        </button>
      )}
    >
      <DropdownMenu menu={menu} />
    </Dropdown>
  );
};

export default NavDropdown;
