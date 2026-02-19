import { Edit, MoreVertical, Plus, Trash2 } from "lucide-react";
import MainNavbar from "../../../components/dashboard/MainNavbar";
import Button from "../../../components/ui/Button";
import { useRef, useState } from "react";

// Component
const UserRow = ({
  id,
  name,
  email,
  role,
  openMenuId,
  setOpenMenuId,
  onEdit,
  onDelete,
}) => {
  const isOpen = openMenuId === id;
  return (
    <div>
      <div className=" w-full flex items-center justify-between">
        {/* Left Div */}
        <div className="flex items-center gap-4">
          {/* Avtar */}
          <div
            className={`w-12 h-12 rounded-full overflow-hidden border-2 border-indigo-200
                 bg-gray-100 `}
          >
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=19"
              alt="User Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <h4 className=" text-lg font-semibold text-gray-900">{name}</h4>
            <p className=" text-[16px] font-medium text-gray-500">{email}</p>
          </div>
        </div>

        {/* Right Div */}
        <div className="flex gap-8 items-center cursor-pointer">
          <span className=" px-3 py-2 rounded-[50px] text-white font-bold bg-indigo-500 border border-indigo-50">
            {role}
          </span>

          <div className="relative">
            <button
              onClick={() => setOpenMenuId(isOpen ? null : id)}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-600"
            >
              <MoreVertical />
            </button>

            {isOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-20">
                <button
                  onClick={() => {
                    setOpenMenuId(null);
                    onEdit?.();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-indigo-600 hover:bg-gray-50"
                >
                  <Edit size={18} />
                  <span className="font-medium">Edit</span>
                </button>

                <button
                  onClick={() => {
                    setOpenMenuId(null);
                    onDelete?.();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-gray-50"
                >
                  <Trash2 size={18} />
                  <span className="font-medium">Delete User</span>
                </button>
              </div>
            )}
          </div>

          {/* <div className="flex gap-2 items-center text-indigo-200">
            <MoreVertical />
          </div> */}
        </div>
      </div>
    </div>
  );
};

const AccessControl = () => {
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);

  return (
    <>
      <MainNavbar />
      <main className="flex flex-col gap-6 sm:gap-10 px-4 sm:px-6 md:px-10 lg:px-16 py-6 sm:py-8 md:py-10 w-full min-h-[calc(100vh-64px)] bg-gray-50">
        {/* Header Section */}
        <header className="flex items-center justify-between">
          <div>
            <h1 className=" text-4xl font-bold">Access Control</h1>
            <p className=" text-gray-700 text-lg">Manage your team and roles</p>
          </div>
          <Button leftIcon={<Plus />} onClick={() => setIsInviteOpen(true)}>
            Invite Member
          </Button>
        </header>

        <section className="p-10 flex flex-col gap-8">
          <h3 className=" text-[28px] font-bold">Team Members</h3>

          {/* Members Div */}
          <div className="flex flex-col gap-6">
            <UserRow
              id="1"
              name="Jaydeep Darji"
              email="jay@gmail.com"
              role="Admin"
              openMenuId={openMenuId}
              setOpenMenuId={setOpenMenuId}
              onEdit={() => alert("Edit Jaydeep")}
              onDelete={() => alert("Delete Jaydeep")}
            />
            <UserRow
              id="2"
              name="Anil Patel"
              email="anil@gmail.com"
              role="User"
              openMenuId={openMenuId}
              setOpenMenuId={setOpenMenuId}
              onEdit={() => alert("Edit Anil")}
              onDelete={() => alert("Delete Anil")}
            />
          </div>
        </section>
      </main>

      {isInviteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-105 max-w-[95%] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-xl font-semibold text-gray-800">
                Invite Member
              </h2>
              <button
                onClick={() => setIsInviteOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              <input
                type="text"
                placeholder="Enter a email address..."
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              />
            </div>

            {/* Footer */}
            <div className="flex justify-between gap-4 px-6 py-4 border-t">
              <Button variant="outline" onClick={() => setIsInviteOpen(false)}>
                Cancel
              </Button>
              <Button className=" w-full">Add</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AccessControl;
