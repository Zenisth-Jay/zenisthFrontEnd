import { Edit, MoreVertical, Plus, Trash2, ChevronDown } from "lucide-react";
import MainNavbar from "../../../components/dashboard/MainNavbar";
import Button from "../../../components/ui/Button";
import { useRef, useState } from "react";
import {
  useGetUsersQuery,
  useInviteUserMutation,
  useUpdateUserMutation,
} from "../../../api/access.api";
import { useGetUserProfileQuery } from "../../../api/userProfile.api";

// Component
const UserRow = ({
  id,
  name,
  email,
  role,
  openMenuId,
  setOpenMenuId,
  currentUserId,
  currentUserRole,
  onChangeRole,
}) => {
  const isOpen = openMenuId === id;

  const normalizedRole = currentUserRole?.trim().toUpperCase();

  const canEditRole =
    (normalizedRole === "OWNER" || normalizedRole === "ADMIN") &&
    currentUserId !== id;

  return (
    <div className="w-full flex items-center justify-between">
      {/* Left */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-indigo-200 bg-gray-100">
          <img
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=19"
            alt="User Avatar"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col">
          <h4 className="text-lg font-semibold text-gray-900">{name}</h4>
          <p className="text-[16px] font-medium text-gray-500">{email}</p>
        </div>
      </div>

      {/* Right */}
      <div className="relative">
        {canEditRole ? (
          <button
            onClick={() => setOpenMenuId(isOpen ? null : id)}
            className="flex items-center gap-2 px-3 py-2 rounded-full text-white font-bold bg-indigo-500 hover:bg-indigo-600"
          >
            {role}
            <ChevronDown size={16} />
          </button>
        ) : (
          <span className="px-3 py-2 rounded-full text-white font-bold bg-indigo-500">
            {role}
          </span>
        )}

        {/* Dropdown */}
        {canEditRole && isOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-20">
            {["ADMIN", "MEMBER"].map((r) => (
              <button
                key={r}
                onClick={() => {
                  setOpenMenuId(null);
                  if (r !== role) onChangeRole(r);
                }}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 text-gray-700 font-medium"
              >
                {r}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const AccessControl = () => {
  const {
    data: profile,
    isLoading: isProfileLoading,
    isError: isProfileError,
  } = useGetUserProfileQuery();

  const { data, isLoading, isError } = useGetUsersQuery();

  const [inviteUser, { isLoading: isInviting }] = useInviteUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("MEMBER");
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingChange, setPendingChange] = useState(null);
  const [inviteLink, setInviteLink] = useState("");

  if (isProfileLoading) {
    return (
      <>
        <MainNavbar />
        <main className="p-10">Loading...</main>
      </>
    );
  }

  if (isProfileError || !profile) {
    return (
      <>
        <MainNavbar />
        <main className="p-10 text-red-600">Failed to load profile</main>
      </>
    );
  }

  const currentUserId = profile.userId;
  const currentUserRole = profile.role?.trim().toUpperCase(); // 👈 normalize

  const canManageUsers =
    currentUserRole === "ADMIN" || currentUserRole === "OWNER";

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

          {canManageUsers && (
            <Button leftIcon={<Plus />} onClick={() => setIsInviteOpen(true)}>
              Invite Member
            </Button>
          )}
        </header>

        <section className="p-10 flex flex-col gap-8">
          <h3 className=" text-[28px] font-bold">Team Members</h3>

          {isLoading && <p>Loading users...</p>}
          {isError && <p>Failed to load users</p>}

          {/* Members Div */}
          {data?.map((user) => (
            <UserRow
              key={user.userId}
              id={user.userId}
              name={user.name}
              email={user.email}
              role={user.role}
              openMenuId={openMenuId}
              setOpenMenuId={setOpenMenuId}
              currentUserId={currentUserId}
              currentUserRole={currentUserRole}
              onChangeRole={(newRole) => {
                if (!canManageUsers) return;
                setPendingChange({
                  userId: user.userId,
                  newRole,
                  name: user.name,
                });
                setConfirmOpen(true);
              }}
            />
          ))}
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
            {/* <div className="p-6">
              <input
                type="email"
                placeholder="Enter an email address..."
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              />
            </div> */}

            {/* Body */}
            <div className="p-6">
              {!inviteLink ? (
                <input
                  type="email"
                  placeholder="Enter an email address..."
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                />
              ) : (
                <div className="mt-4 p-3 bg-gray-50 border rounded-lg flex items-center gap-3">
                  <input
                    type="text"
                    readOnly
                    value={inviteLink}
                    className="flex-1 bg-transparent outline-none text-sm text-gray-700"
                  />
                  <Button
                    variant="outline"
                    onClick={async () => {
                      await navigator.clipboard.writeText(inviteLink);
                      // optional: toast.success("Link copied!");
                    }}
                  >
                    Copy
                  </Button>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-between gap-4 px-6 py-4 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  setIsInviteOpen(false);
                  setInviteLink("");
                  setInviteEmail("");
                }}
              >
                Cancel
              </Button>
              <Button
                className="w-full"
                disabled={isInviting || !inviteEmail}
                onClick={async () => {
                  if (!canManageUsers) return;

                  try {
                    const result = await inviteUser({
                      email: inviteEmail,
                      role: inviteRole,
                    }).unwrap();

                    // 👇 Adjust this key based on your API response
                    const link = result.signupLink;

                    setInviteLink(link || "");

                    // keep modal open so admin can copy the link
                    setInviteEmail("");
                    setInviteRole("MEMBER");
                  } catch (err) {
                    console.error("Invite failed", err);
                  }
                }}
              >
                {isInviting ? "Inviting..." : "Add"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {confirmOpen && pendingChange && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-96 max-w-[95%] overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b">
              <h2 className="text-xl font-semibold text-gray-800">
                Confirm Role Change
              </h2>
            </div>

            {/* Body */}
            <div className="p-6 text-gray-700">
              Are you sure you want to change{" "}
              <span className="font-semibold">{pendingChange.name}</span>'s role
              to <span className="font-semibold">{pendingChange.newRole}</span>?
            </div>

            {/* Footer */}
            <div className="flex gap-4 px-6 py-4 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  setConfirmOpen(false);
                  setPendingChange(null);
                }}
              >
                Cancel
              </Button>
              <Button
                className="w-full"
                onClick={async () => {
                  if (!canManageUsers) return;

                  await updateUser({
                    userId: pendingChange.userId,
                    role: pendingChange.newRole,
                  });
                  setConfirmOpen(false);
                  setPendingChange(null);
                }}
              >
                {isUpdating ? "Updating..." : "Yes, Change Role"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AccessControl;
