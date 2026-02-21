import {
  CalendarCheck,
  Download,
  Edit,
  Landmark,
  Mail,
  SquareUserRound,
  User,
} from "lucide-react";
import MainNavbar from "../../components/dashboard/MainNavbar";
import { useForm } from "react-hook-form";
import InputElement from "../../components/Authentication/InputElement";
import WorkspaceCard from "../../components/profile/WorkspaceCard";
import Button from "../../components/ui/Button";
import {
  useGetUserProfileQuery,
  useUpdateUserNameMutation,
} from "../../api/userProfile.api";
import { useEffect } from "react";
import { handleLogout } from "../../api/handleLogout";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const navigate = useNavigate();

  const { data: profile, isLoading, isError } = useGetUserProfileQuery();
  // const [updateUserName, { isLoading: isUpdating }] =
  //   useUpdateUserNameMutation();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isDirty },
    reset,
  } = useForm({
    defaultValues: {
      fullName: "",
    },
  });

  useEffect(() => {
    if (profile) {
      reset({
        fullName: profile.fullName || "",
        email: profile.email || "",
      });
    }
  }, [profile, reset]);

  const DEFAULT_AVATAR_URL =
    "https://api.dicebear.com/7.x/avataaars/svg?seed=19";

  // const avatar = watch("avatar");

  const onSubmit = async (data) => {
    try {
      await updateUserName(data.fullName).unwrap();
      toast.success("Name updated successfully ✅");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update name ❌");
    }
  };

  return (
    <>
      <MainNavbar />

      <main className="flex flex-col gap-6 sm:gap-10 px-4 sm:px-6 md:px-10 lg:px-16 py-6 sm:py-8 md:py-10 w-full min-h-[calc(100vh-64px)] bg-gray-50">
        <header className="flex items-center justify-between gap-4 animate-fade-in-up">
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
              Profile Information
            </h1>
            <p className="text-gray-700 text-base sm:text-lg mt-1">
              Your profile details appear across Zenisth tools and activity
              logs.
            </p>
          </div>
          <Edit className="shrink-0 text-gray-500" />
        </header>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-10"
        >
          {/* Avatar Section */}
          {/* <section className="flex justify-center">
            <AvatarPicker
              value={avatar}
              onChange={(newAvatar) => {
                setValue("avatar", newAvatar, { shouldDirty: true });
              }}
            />
          </section> */}
          {/* Avatar Section (Read-only) */}
          <section className="flex justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-indigo-200 bg-gray-100">
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=19"
                  alt="Default Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </section>

          {/* Fields */}
          <div className="flex flex-col gap-3">
            <InputElement
              label="Full Name"
              name="fullName"
              type="text"
              placeholder="Enter your full name...."
              register={register}
              icon={User}
              // rules={{ required: "Full name is required" }}
              disabled={true}
            />

            <InputElement
              label="Email"
              name="email"
              disabled
              type="text"
              placeholder="Enter your email...."
              register={register}
              icon={Mail}
            />
          </div>

          {/* Workspace Div */}
          <div className="flex flex-col gap-5">
            {/* Sub Heading */}
            <div className="flex flex-col">
              <h3 className=" text-2xl font-semibold">Workspace</h3>
              <p className=" text-lg font-normal text-gray-600">
                Workspace access is managed by your organization.
              </p>
            </div>

            {/* Workspace Cards */}
            <div className="w-full flex flex-col gap-4">
              <WorkspaceCard
                icon={<Landmark />}
                title="ORGANIZATION"
                value={profile?.organizationName ?? "..."}
              />
              <div className="w-full flex justify-between gap-6">
                <WorkspaceCard
                  icon={<SquareUserRound />}
                  title="ROLE"
                  value={profile?.role ?? "..."}
                />
                <WorkspaceCard
                  icon={<CalendarCheck />}
                  title="MEMBER SINCE"
                  value={profile?.memberSince ?? "..."}
                />
              </div>
            </div>
          </div>

          {/* Buttons Div */}
          <div className="flex justify-between">
            <Button variant="logout" onClick={() => handleLogout(navigate)}>
              <div className="flex gap-3 items-center text-lg font-bold">
                <Download />
                Log Out
              </div>
            </Button>

            <div className="flex gap-6">
              <Button variant="outline" type="button" onClick={() => reset()}>
                Cancel
              </Button>
              <Button
                type="submit"
                // disabled={!isDirty || isUpdating}
                disabled={true}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </form>
      </main>
    </>
  );
};

export default UserProfile;
