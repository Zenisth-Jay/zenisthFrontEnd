import Logo from "../components/Authentication/Logo";
import RightPanel from "../components/Authentication/RightPanel";
import InputElement from "../components/Authentication/InputElement";
import AuthButton from "../components/Authentication/AuthButton";
import { KeyRound } from "lucide-react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const ChangePassword = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const passwordValue = watch("password");

  const onSubmit = async () => {
    // API integration will be added later.
    toast.info("Change password API will be connected soon.");
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left */}
      <div className="w-full lg:w-1/2 bg-[#fafafa] flex justify-center items-center p-4 sm:p-6 md:p-8 min-h-[50vh] lg:min-h-screen">
        <div className="w-full max-w-md animate-fade-in-up">
          <Logo />

          <h1 className="text-2xl sm:text-4xl font-semibold text-[#212121] mt-6">
            Reset Password <span className="inline-block">🔐</span>
          </h1>
          <p className="text-[#9E9E9E] text-base sm:text-[18px] font-normal mb-6">
            Create a new password for your account. Make it strong and secure.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
            <div className="flex flex-col gap-3 sm:gap-4 mb-2">
              <InputElement
                label="New Password"
                name="password"
                type="password"
                placeholder="Enter new password..."
                register={register}
                icon={KeyRound}
                rules={{
                  required: "New password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                }}
              />

              <InputElement
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                placeholder="Re-enter new password..."
                register={register}
                icon={KeyRound}
                rules={{
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === passwordValue || "Passwords do not match",
                }}
              />
            </div>

            <AuthButton type="submit" disabled={isSubmitting}>
              Update Password
            </AuthButton>
          </form>

          <p className="text-center text-sm sm:text-[16px] text-[#45556C] mt-2">
            Remember your password?{" "}
            <Link
              to="/login"
              className="text-indigo-500 font-medium hover:underline hover:text-indigo-700"
            >
              Back to Login
            </Link>
          </p>
        </div>
      </div>

      {/* Right */}
      <RightPanel />
    </div>
  );
};

export default ChangePassword;
