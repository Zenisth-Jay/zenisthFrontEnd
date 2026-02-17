import { Edit, Plus } from "lucide-react";
import MainNavbar from "../../../components/dashboard/MainNavbar";
import Button from "../../../components/ui/Button";
import { useState } from "react";

// Component
const UserRow = ({ name, email, role }) => {
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
          <span className=" px-3 py-2 rounded-[50px] bg-indigo-500 border border-indigo-50">
            {role}
          </span>
          <div className="flex gap-2 items-center text-indigo-500">
            <Edit />
            <span className=" text-lg font-bold">Edit</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const AccessControl = () => {
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  return (
    <>
      <MainNavbar />
      <main className="flex flex-col gap-10 px-16 py-10 w-full min-h-[calc(100vh-64px)] bg-gray-50">
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
            <UserRow name="Jaydeep Darji" email="jay@gmail.com" role="Admin" />
            <UserRow name="Anil Patel" email="anil@gmail.com" role="User" />
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
